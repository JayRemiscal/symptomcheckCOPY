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
  emergency?: string; // 'yes' | 'no'
  distanceKm?: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Haversine distance in km */
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
  /** Convert a text address to lat/lng using OpenStreetMap Nominatim. */
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
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } catch {
      return null;
    }
  }

  /**
   * Find hospitals/clinics near the given coordinates using the Overpass API.
   * Default radius: 10 km.
   */
  static async findNearbyHospitals(
    lat: number,
    lng: number,
    radiusM = 10000
  ): Promise<NearbyHospital[]> {
    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="hospital"](around:${radiusM},${lat},${lng});
        way["amenity"="hospital"](around:${radiusM},${lat},${lng});
        node["amenity"="clinic"](around:${radiusM},${lat},${lng});
        node["healthcare"="hospital"](around:${radiusM},${lat},${lng});
      );
      out center;
    `.trim();

    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (!res.ok) return [];
      const json = await res.json();

      const hospitals: NearbyHospital[] = (json.elements ?? [])
        .filter((el: Record<string, unknown>) => el.tags)
        .map((el: Record<string, unknown>) => {
          const tags = el.tags as Record<string, string>;
          const elLat =
            (el.lat as number) ??
            ((el.center as Record<string, number>)?.lat ?? 0);
          const elLng =
            (el.lon as number) ??
            ((el.center as Record<string, number>)?.lon ?? 0);

          const addressParts = [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:city'] ?? tags['addr:town'],
          ].filter(Boolean);

          return {
            id: String(el.id),
            name: tags.name ?? tags['name:en'] ?? 'Unnamed Hospital',
            lat: elLat,
            lng: elLng,
            address: addressParts.join(' ') || tags['addr:full'] || 'Address not available',
            phone: tags.phone ?? tags['contact:phone'],
            website: tags.website ?? tags['contact:website'],
            emergency: tags.emergency,
            distanceKm: haversine(lat, lng, elLat, elLng),
          } as NearbyHospital;
        })
        .filter((h: NearbyHospital) => h.name !== 'Unnamed Hospital' || h.phone)
        .sort((a: NearbyHospital, b: NearbyHospital) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
        .slice(0, 20);

      return hospitals;
    } catch {
      return [];
    }
  }
}
