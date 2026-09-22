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

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export class GeoService {
  /** Geocode a text address → {lat, lng} via Nominatim. */
  static async geocodeAddress(address: string): Promise<GeoCoordinate | null> {
    try {
      const params = new URLSearchParams({
        q: address,
        format: 'json',
        limit: '1',
      });
      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
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

  /** Get browser geolocation (fallback when address geocoding fails). */
  static getBrowserLocation(): Promise<GeoCoordinate | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 8000 }
      );
    });
  }

  /** Find hospitals/clinics near coordinates using Overpass API. */
  static async findNearbyHospitals(
    lat: number,
    lng: number,
    radiusM = 15000
  ): Promise<NearbyHospital[]> {
    // Broad query — catches hospitals, clinics, and health centres
    const query = `
[out:json][timeout:30];
(
  node["amenity"="hospital"](around:${radiusM},${lat},${lng});
  way["amenity"="hospital"](around:${radiusM},${lat},${lng});
  relation["amenity"="hospital"](around:${radiusM},${lat},${lng});
  node["amenity"="clinic"](around:${radiusM},${lat},${lng});
  way["amenity"="clinic"](around:${radiusM},${lat},${lng});
  node["amenity"="health_centre"](around:${radiusM},${lat},${lng});
  node["healthcare"="hospital"](around:${radiusM},${lat},${lng});
  node["healthcare"="clinic"](around:${radiusM},${lat},${lng});
);
out center tags;
`.trim();

    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (!res.ok) return [];
      const json = await res.json();
      const elements: Record<string, unknown>[] = json.elements ?? [];

      const hospitals: NearbyHospital[] = elements
        .map((el) => {
          const tags = (el.tags ?? {}) as Record<string, string>;

          // Resolve coordinates — nodes have lat/lon directly, ways/relations have center
          const center = el.center as Record<string, number> | undefined;
          const elLat = typeof el.lat === 'number' ? (el.lat as number) : (center?.lat ?? 0);
          const elLng = typeof el.lon === 'number' ? (el.lon as number) : (center?.lon ?? 0);

          // Skip elements with invalid coordinates
          if (!elLat || !elLng) return null;

          // Build a readable name — many PH hospitals only have english names
          const name =
            tags['name:en'] ??
            tags.name ??
            tags['name:fil'] ??
            tags['name:tl'] ??
            tags['operator'] ??
            `${tags.amenity ?? 'Hospital'} (unnamed)`;

          // Build address from parts available
          const addrParts = [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:barangay'],
            tags['addr:city'] ?? tags['addr:town'] ?? tags['addr:municipality'],
            tags['addr:province'],
          ].filter(Boolean);
          const address =
            addrParts.length > 0
              ? addrParts.join(', ')
              : tags['addr:full'] ?? 'Address not available';

          return {
            id: String(el.id),
            name,
            lat: elLat,
            lng: elLng,
            address,
            phone: tags.phone ?? tags['contact:phone'] ?? tags['phone:PH'],
            website: tags.website ?? tags['contact:website'],
            emergency: tags.emergency,
            distanceKm: haversine(lat, lng, elLat, elLng),
          } as NearbyHospital;
        })
        .filter((h): h is NearbyHospital => h !== null)
        // Remove exact duplicates by lat/lng
        .filter(
          (h, idx, arr) =>
            arr.findIndex((x) => x.lat === h.lat && x.lng === h.lng) === idx
        )
        // Sort nearest first
        .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
        .slice(0, 25);

      return hospitals;
    } catch (e) {
      console.error('GeoService.findNearbyHospitals error:', e);
      return [];
    }
  }
}
