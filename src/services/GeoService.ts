export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface NearbyHospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  website?: string;
  emergency?: string;
  distanceKm?: number;
}

const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search';

// Multiple Overpass mirrors — tried in order
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Convert raw Overpass elements to NearbyHospital objects. */
function parseOverpassElements(
  elements: Record<string, unknown>[],
  userLat: number,
  userLng: number
): NearbyHospital[] {
  return elements
    .map((el) => {
      const tags = (el.tags ?? {}) as Record<string, string>;

      // Nodes have lat/lon directly; ways/relations have a center object
      const center = el.center as { lat?: number; lon?: number } | undefined;
      const elLat = (typeof el.lat === 'number' ? el.lat : center?.lat) ?? 0;
      const elLng = (typeof el.lon === 'number' ? el.lon : center?.lon) ?? 0;

      if (elLat === 0 && elLng === 0) return null; // skip invalid

      const name =
        tags['name:en'] ?? tags.name ?? tags['name:fil'] ?? tags['name:tl'] ??
        tags.operator ?? `${tags.amenity ?? 'Hospital'} (unnamed)`;

      const addrParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:barangay'],
        tags['addr:city'] ?? tags['addr:town'] ?? tags['addr:municipality'],
        tags['addr:province'],
      ].filter(Boolean);

      return {
        id: String(el.id),
        name,
        lat: elLat,
        lng: elLng,
        address: addrParts.length > 0
          ? addrParts.join(', ')
          : tags['addr:full'] ?? 'Address not available',
        phone: tags.phone ?? tags['contact:phone'],
        website: tags.website ?? tags['contact:website'],
        emergency: tags.emergency,
        distanceKm: haversine(userLat, userLng, elLat, elLng),
      } as NearbyHospital;
    })
    .filter((h): h is NearbyHospital => h !== null)
    .filter((h, i, arr) =>                              // deduplicate
      arr.findIndex(x => x.lat === h.lat && x.lng === h.lng) === i
    )
    .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
    .slice(0, 25);
}

/** Fallback: use Nominatim to search for hospitals near a coordinate. */
async function nominatimFallback(
  lat: number,
  lng: number,
  radiusM: number
): Promise<NearbyHospital[]> {
  try {
    const deg = (radiusM / 1000) / 111;            // rough degree delta
    const viewbox = `${lng - deg},${lat + deg},${lng + deg},${lat - deg}`; // W,N,E,S
    const params = new URLSearchParams({
      q: 'hospital',
      format: 'json',
      limit: '20',
      viewbox,
      bounded: '1',
    });
    const res = await fetch(`${NOMINATIM_SEARCH}?${params}`, {
      headers: { Accept: 'application/json', 'Accept-Language': 'en' },
    });
    if (!res.ok) return [];
    const data: Record<string, unknown>[] = await res.json();
    return data
      .map((item, idx) => {
        const elLat = parseFloat(item.lat as string);
        const elLng = parseFloat(item.lon as string);
        if (isNaN(elLat) || isNaN(elLng)) return null;
        return {
          id: `nom-${idx}`,
          name: (item.display_name as string).split(',')[0],
          lat: elLat,
          lng: elLng,
          address: (item.display_name as string).split(',').slice(1, 4).join(',').trim(),
          distanceKm: haversine(lat, lng, elLat, elLng),
        } as NearbyHospital;
      })
      .filter((h): h is NearbyHospital => h !== null)
      .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  } catch {
    return [];
  }
}

export class GeoService {
  /** Geocode a text address → {lat, lng} via Nominatim. */
  static async geocodeAddress(address: string): Promise<GeoCoordinate | null> {
    try {
      const params = new URLSearchParams({ q: address, format: 'json', limit: '1' });
      const res = await fetch(`${NOMINATIM_SEARCH}?${params}`, {
        headers: { Accept: 'application/json', 'Accept-Language': 'en' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      if (isNaN(lat) || isNaN(lng)) return null;
      return { lat, lng };
    } catch {
      return null;
    }
  }

  /** Get device GPS position. */
  static getBrowserLocation(): Promise<GeoCoordinate | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        ()  => resolve(null),
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  /**
   * Find hospitals near the given coordinates.
   * Tries three Overpass mirrors via GET, then falls back to Nominatim.
   */
  static async findNearbyHospitals(
    lat: number,
    lng: number,
    radiusM = 15000
  ): Promise<NearbyHospital[]> {
    // Compact Overpass QL query (GET-friendly, no extra whitespace)
    const query = [
      '[out:json][timeout:25];',
      '(',
      `node["amenity"="hospital"](around:${radiusM},${lat},${lng});`,
      `way["amenity"="hospital"](around:${radiusM},${lat},${lng});`,
      `node["amenity"="clinic"](around:${radiusM},${lat},${lng});`,
      `node["healthcare"="hospital"](around:${radiusM},${lat},${lng});`,
      `node["healthcare"="clinic"](around:${radiusM},${lat},${lng});`,
      ');',
      'out center tags;',
    ].join('');

    // Try each Overpass mirror via GET
    for (const base of OVERPASS_ENDPOINTS) {
      try {
        const url = `${base}?data=${encodeURIComponent(query)}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000); // 12 s timeout
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);

        if (!res.ok) continue;
        const json = await res.json();
        const elements: Record<string, unknown>[] = json.elements ?? [];

        if (elements.length > 0) {
          const results = parseOverpassElements(elements, lat, lng);
          if (results.length > 0) return results;
        }
      } catch {
        // Try next mirror
      }
    }

    // All Overpass mirrors failed or returned nothing → use Nominatim
    return nominatimFallback(lat, lng, radiusM);
  }
}
