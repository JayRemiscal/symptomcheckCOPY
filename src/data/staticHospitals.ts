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
  // ── Metro Manila ───────────────────────────────────────────────
  { id: 'ph-s01', name: 'Philippine General Hospital',         lat: 14.5790, lng: 120.9830, address: 'Taft Ave, Ermita, Manila',                    phone: '(02) 8554-8400', region: 'Metro Manila' },
  { id: 'ph-s02', name: "St. Luke's Medical Center – BGC",    lat: 14.5458, lng: 121.0516, address: '32nd St. cor. 5th Ave, BGC, Taguig',         phone: '(02) 7789-7700', region: 'Metro Manila' },
  { id: 'ph-s03', name: "St. Luke's Medical Center – QC",     lat: 14.6383, lng: 121.0269, address: '279 E Rodriguez Sr. Ave, Quezon City',       phone: '(02) 7723-0101', region: 'Metro Manila' },
  { id: 'ph-s04', name: 'Makati Medical Center',               lat: 14.5597, lng: 121.0144, address: '2 Amorsolo St, Legaspi Village, Makati',     phone: '(02) 8888-8999', region: 'Metro Manila' },
  { id: 'ph-s05', name: 'The Medical City',                    lat: 14.5848, lng: 121.0742, address: 'Ortigas Ave, Pasig City',                    phone: '(02) 8988-1000', region: 'Metro Manila' },
  { id: 'ph-s06', name: 'Ospital ng Maynila',                  lat: 14.5537, lng: 120.9875, address: 'Quirino Ave cor. Roxas Blvd, Malate, Manila', phone: '(02) 8521-8450', region: 'Metro Manila' },
  { id: 'ph-s07', name: 'National Children\'s Hospital',       lat: 14.6016, lng: 120.9889, address: '8 Quezon Ave, Quezon City',                  phone: '(02) 8920-2701', region: 'Metro Manila' },
  { id: 'ph-s08', name: 'Philippine Heart Center',             lat: 14.6488, lng: 121.0460, address: 'East Ave, Diliman, Quezon City',             phone: '(02) 8925-2401', region: 'Metro Manila' },
  { id: 'ph-s09', name: 'Philippine Children\'s Medical Center', lat: 14.6490, lng: 121.0470, address: 'Quezon Ave, Quezon City',                phone: '(02) 8588-8000', region: 'Metro Manila' },
  { id: 'ph-s10', name: 'Lung Center of the Philippines',      lat: 14.6502, lng: 121.0447, address: 'Quezon Ave, Quezon City',                    phone: '(02) 8924-6101', region: 'Metro Manila' },
  { id: 'ph-s11', name: 'Veterans Memorial Medical Center',    lat: 14.6475, lng: 121.0400, address: 'North Ave, Diliman, Quezon City',            phone: '(02) 8928-3751', region: 'Metro Manila' },
  { id: 'ph-s12', name: 'Capitol Medical Center',              lat: 14.6378, lng: 121.0144, address: '1 Gardenway, Quezon City',                   phone: '(02) 7372-7777', region: 'Metro Manila' },
  { id: 'ph-s13', name: 'Jose Reyes Memorial Medical Center',  lat: 14.6071, lng: 120.9915, address: 'Rizal Ave, Sta Cruz, Manila',                phone: '(02) 8711-9491', region: 'Metro Manila' },
  { id: 'ph-s14', name: 'Chinese General Hospital',            lat: 14.5986, lng: 120.9786, address: '286 Blumentritt Rd, Sta Cruz, Manila',       phone: '(02) 8711-4141', region: 'Metro Manila' },
  { id: 'ph-s15', name: 'San Juan de Dios Hospital',           lat: 14.5436, lng: 121.0125, address: '2772 Roxas Blvd, Pasay City',               phone: '(02) 8833-7271', region: 'Metro Manila' },
  // ── Cebu ──────────────────────────────────────────────────────
  { id: 'ph-s16', name: 'Vicente Sotto Memorial Medical Center', lat: 10.3157, lng: 123.8855, address: 'B. Rodriguez St, Cebu City',              phone: '(032) 253-9891', region: 'Cebu' },
  { id: 'ph-s17', name: 'Chong Hua Hospital',                  lat: 10.3133, lng: 123.8958, address: 'Don Mariano Cui St, Fuente Osmeña, Cebu',  phone: '(032) 255-8000', region: 'Cebu' },
  { id: 'ph-s18', name: 'Cebu Doctors University Hospital',    lat: 10.3176, lng: 123.9024, address: 'Osmeña Blvd, Cebu City',                    phone: '(032) 255-5500', region: 'Cebu' },
  // ── Davao ─────────────────────────────────────────────────────
  { id: 'ph-s19', name: 'Southern Philippines Medical Center', lat:  7.0682, lng: 125.6083, address: 'J.P. Laurel Ave, Bajada, Davao City',      phone: '(082) 227-2731', region: 'Davao' },
  { id: 'ph-s20', name: 'Davao Medical School Foundation',     lat:  7.1074, lng: 125.6220, address: 'Gov. Duterte St, Davao City',              phone: '(082) 221-4100', region: 'Davao' },
  // ── Other Regions ─────────────────────────────────────────────
  { id: 'ph-s21', name: 'Western Visayas Medical Center',      lat: 10.7105, lng: 122.5640, address: 'Q. Abeto St, Mandurriao, Iloilo City',    phone: '(033) 321-2441', region: 'Iloilo' },
  { id: 'ph-s22', name: 'Baguio General Hospital',             lat: 16.4118, lng: 120.5989, address: 'Gov. Pack Road, Baguio City',              phone: '(074) 442-3218', region: 'Baguio' },
  { id: 'ph-s23', name: 'Northern Mindanao Medical Center',    lat:  8.4800, lng: 124.6483, address: 'A. Velez St, Cagayan de Oro City',         phone: '(088) 857-3232', region: 'Cagayan de Oro' },
  { id: 'ph-s24', name: 'Zamboanga City Medical Center',       lat:  6.9214, lng: 122.0790, address: 'Dr. Evangelista St, Zamboanga City',       phone: '(062) 991-0117', region: 'Zamboanga' },
  { id: 'ph-s25', name: 'Corazon Locsin Montelibano Memorial', lat: 10.6770, lng: 122.9290, address: 'Lacson St, Bacolod City',                  phone: '(034) 434-8735', region: 'Bacolod' },
];
