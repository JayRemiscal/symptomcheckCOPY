/**
 * Curated list of major Philippine hospitals with verified coordinates.
 * Used as offline fallback when Overpass / Nominatim APIs are unreachable.
 */
export interface StaticHospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  region: string;
}

export const STATIC_PH_HOSPITALS: StaticHospital[] = [


];
