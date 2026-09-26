import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
  Crosshair,
  ExternalLink,
  Globe,
  Hospital,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  SearchX,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile } from '../types';
import { GeoCoordinate, GeoService, NearbyHospital } from '../services/GeoService';
import { SupportedLanguage } from '../data/translations';
import { LanguageService } from '../services/LanguageService';

// Fix Leaflet marker icon paths broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const hospitalIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#ef4444,#b91c1c);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:15px">🏥</div>`,
  iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -36],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#0d9488,#0f766e);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:14px">📍</div>`,
  iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -32],
});

const EMERGENCY_CONTACTS = [
  { label: 'National Emergency Hotline', number: '911', icon: '🚨' },
  { label: 'Philippine Red Cross', number: '143', icon: '🩸' },
  { label: 'PNP (Police)', number: '117', icon: '👮' },
  { label: 'BFP (Fire)', number: '160', icon: '🚒' },
  { label: 'NDRRMC', number: '1-800-1000-5990', icon: '⚠️' },
  { label: 'DOH Hotline', number: '1555', icon: '🏥' },
  { label: 'Ivan Graciano', number: '09399279166', icon: '👨' },
];

interface HospitalMapViewProps {
  profile: UserProfile | null;
  onOpenLogin: () => void;
  onStartAssessment: () => void;
  currentLanguage?: SupportedLanguage;
}

type Status = 'idle' | 'locating' | 'geocoding' | 'searching' | 'done' | 'error';

export const HospitalMapView: React.FC<HospitalMapViewProps> = ({ profile, onOpenLogin, currentLanguage }) => {
  const t = (key: string) => LanguageService.t(key, currentLanguage);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // ── State ──────────────────────────────────────────────────
  const [currentGeo, setCurrentGeo] = useState<GeoCoordinate | null>(null);
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [manualAddr, setManualAddr] = useState('');
  const [locationSrc, setLocationSrc] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dataSource, setDataSource] = useState<'live' | 'cache' | 'static' | null>(null);

  // Track online/offline
  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  // ── Initialize / re-center map whenever currentGeo changes ──
  // This runs AFTER React re-renders, so the div ref is always valid.
  useEffect(() => {
    if (!currentGeo || !mapContainerRef.current) return;

    // Destroy old map instance
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = L.map(mapContainerRef.current, {
      center: [currentGeo.lat, currentGeo.lng],
      zoom: 14,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([currentGeo.lat, currentGeo.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>📍 Your Location</b>')
      .openPopup();
  }, [currentGeo]);

  // ── Add markers whenever hospitals list changes ──────────────
  useEffect(() => {
    if (!mapRef.current || hospitals.length === 0) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    hospitals.forEach(h => {
      const dist = h.distanceKm !== undefined
        ? (h.distanceKm < 1 ? `${(h.distanceKm * 1000).toFixed(0)} m` : `${h.distanceKm.toFixed(1)} km`)
        : '';
      const popup = `
        <div style="min-width:175px;font-family:sans-serif;line-height:1.5">
          <b style="font-size:13px;color:#0f172a">${h.name}</b><br/>
          <span style="font-size:11px;color:#64748b">${h.address}</span>
          ${h.phone ? `<br/><a href="tel:${h.phone}" style="font-size:12px;color:#0d9488;font-weight:bold">📞 ${h.phone}</a>` : ''}
          ${dist ? `<br/><span style="font-size:10px;color:#94a3b8">${dist} away</span>` : ''}
          <br/><a href="https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${h.lat},${h.lng}&travelmode=driving"
            target="_blank" style="font-size:11px;color:#0d9488;font-weight:bold">🗺 Get Directions</a>
        </div>`;
      const marker = L.marker([h.lat, h.lng], { icon: hospitalIcon })
        .addTo(mapRef.current!)
        .bindPopup(popup);
      markersRef.current[h.id] = marker;
    });

    // Fit bounds
    if (currentGeo) {
      const bounds = L.latLngBounds([
        [currentGeo.lat, currentGeo.lng],
        ...hospitals.slice(0, 10).map(h => [h.lat, h.lng] as [number, number]),
      ]);
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [hospitals, currentGeo]);

  // ── Cleanup on unmount ───────────────────────────────────────
  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; }, []);

  // ── Core: fetch hospitals → cascade live → cache → static ────────────
  const fetchHospitals = useCallback(async (geo: GeoCoordinate, label: string) => {
    setCurrentGeo(geo);
    setLocationSrc(label);
    setStatus('searching');
    setErrorMsg('');
    setHospitals([]);

    // 1️⃣ Try live Overpass/Nominatim search
    const live = await GeoService.findNearbyHospitals(geo.lat, geo.lng);
    if (live.length > 0) {
      GeoService.saveToCache(geo.lat, geo.lng, live, label);
      setHospitals(live);
      setDataSource('live');
      setStatus('done');
      return;
    }

    // 2️⃣ Live failed — try localStorage cache
    const cached = GeoService.getFromCache(geo.lat, geo.lng);
    if (cached && cached.hospitals.length > 0) {
      setHospitals(cached.hospitals);
      setLocationSrc(cached.locationSrc + ' (cached)');
      setDataSource('cache');
      setStatus('done');
      return;
    }

    // 3️⃣ No cache — show built-in static list sorted by distance
    const statics = GeoService.getStaticHospitals(geo.lat, geo.lng);
    setHospitals(statics);
    setLocationSrc('Nearby hospitals (offline list)');
    setDataSource('static');
    setStatus('done');
  }, []);

  // ── Search by address text ───────────────────────────────────
  const searchByAddress = useCallback(async (address: string) => {
    if (!address.trim()) return;
    setStatus('geocoding');
    setErrorMsg('');
    const geo = await GeoService.geocodeAddress(address);
    if (!geo) {
      // Geocoding failed (offline or bad address) — cascade to GPS → static
      const gps = await GeoService.getBrowserLocation();
      if (gps) {
        await fetchHospitals(gps, 'Your GPS Location');
      } else {
        const statics = GeoService.getStaticHospitals(14.5995, 120.9842);
        setHospitals(statics);
        setLocationSrc('Philippine Hospitals (offline list)');
        setDataSource('static');
        setStatus('done');
      }
      return;
    }
    await fetchHospitals(geo, address);
  }, [fetchHospitals]);

  // ── GPS location ─────────────────────────────────────────────
  const useGPS = useCallback(async () => {
    setStatus('locating');
    setErrorMsg('');
    const geo = await GeoService.getBrowserLocation();
    if (!geo) {
      // GPS failed — fall back to static list
      const statics = GeoService.getStaticHospitals(14.5995, 120.9842);
      setHospitals(statics);
      setLocationSrc('Philippine Hospitals (offline list)');
      setDataSource('static');
      setStatus('done');
      return;
    }
    await fetchHospitals(geo, 'Your GPS Location');
  }, [fetchHospitals]);

  // ── Auto-show hospitals on mount (always shows something) ──────────
  useEffect(() => {
    const addr = profile?.address;
    if (addr) {
      // searchByAddress already cascades to GPS → static on failure
      searchByAddress(addr);
    } else {
      // No address — try GPS, then show static list
      (async () => {
        const gps = await GeoService.getBrowserLocation();
        if (gps) {
          await fetchHospitals(gps, 'Your GPS Location');
        } else {
          const statics = GeoService.getStaticHospitals(14.5995, 120.9842);
          setHospitals(statics);
          setLocationSrc('Philippine Hospitals (offline list)');
          setDataSource('static');
          setStatus('done');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyTo = (h: NearbyHospital) => {
    setSelectedId(h.id);
    if (mapRef.current && markersRef.current[h.id]) {
      mapRef.current.flyTo([h.lat, h.lng], 16, { duration: 0.8 });
      markersRef.current[h.id].openPopup();
    }
  };

  // ── Open directions using live GPS as origin ─────────────────
  const [directionLoadingId, setDirectionLoadingId] = useState<string | null>(null);

  const getDirections = useCallback(async (h: NearbyHospital, e: React.MouseEvent) => {
    e.stopPropagation();
    setDirectionLoadingId(h.id);
    const gps = await GeoService.getBrowserLocation();
    setDirectionLoadingId(null);

    const dest = `${h.lat},${h.lng}`;
    const origin = gps ? `${gps.lat},${gps.lng}` : 'My+Location';
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const isLoading = ['locating', 'geocoding', 'searching'].includes(status);
  // Hide the Leaflet map when offline — tiles need internet
  const showMap = ['searching', 'done', 'error'].includes(status) && currentGeo !== null && isOnline;

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] bg-[#F4F7F9]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/70 px-4 sm:px-6 py-4 sticky top-[60px] z-20 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.05)]">
        <div className="max-w-3xl mx-auto space-y-3">

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Hospital className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">{t('nearestHospitals')}</h1>
              {locationSrc && status === 'done' && (
                <p className="text-[11px] text-teal-600 mt-0.5 font-medium">📍 Near: {locationSrc}</p>
              )}
            </div>
          </div>

          {/* Search row */}
          <div className="flex gap-2">
            <input
              type="text"
              value={manualAddr}
              onChange={e => setManualAddr(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchByAddress(manualAddr || profile?.address || '')}
              placeholder={profile?.address ?? 'City, barangay, or full address…'}
              className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
            <button
              onClick={() => searchByAddress(manualAddr || profile?.address || '')}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span className="hidden sm:inline">{t('searchBtn')}</span>
            </button>
            <button
              onClick={useGPS}
              disabled={isLoading}
              title={t('gpsBtn')}
              className="px-3 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 border border-indigo-200 text-indigo-700 font-bold text-sm transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Crosshair className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{t('gpsBtn')}</span>
            </button>
          </div>

          {/* Status pill */}
          {isLoading && (
            <p className="text-xs text-teal-600 font-medium flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {status === 'locating' && t('gettingGps')}
              {status === 'geocoding' && t('locatingAddress')}
              {status === 'searching' && t('searchingHospitals')}
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4 space-y-4">

        {/* Guest prompt */}
        {!profile && status === 'idle' && (
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-2xl p-4 text-white flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-500/30 text-teal-300 border border-teal-500/40">
                Guest Mode
              </span>
              <h2 className="font-bold text-sm mt-1.5">{t('signInAutoFill')}</h2>
              <p className="text-xs text-slate-300 mt-0.5">{t('orTypeAddress')}</p>
            </div>
            <button onClick={onOpenLogin}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer">
              {t('signIn')}
            </button>
          </div>
        )}

        {/* Offline banner */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl shrink-0">📡</span>
            <div>
              <p className="text-sm font-bold text-amber-800">{t('youreOffline')}</p>
              <p className="text-[11px] text-amber-600 mt-0.5">
                {dataSource === 'cache'
                  ? t('offlineCached')
                  : dataSource === 'static'
                    ? t('offlineStatic')
                    : t('offlineNoData')}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <SearchX className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-800">{errorMsg}</p>
              <div className="flex flex-wrap gap-3 mt-2">
                <button onClick={() => setStatus('idle')}
                  className="text-xs font-bold text-rose-600 flex items-center gap-1 cursor-pointer hover:underline">
                  <RefreshCw className="w-3 h-3" /> {t('tryAgain')}
                </button>
                <button onClick={useGPS}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 cursor-pointer hover:underline">
                  <Crosshair className="w-3 h-3" /> {t('useGpsInstead')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map — ALWAYS mounted in DOM so ref is valid; shown/hidden via CSS */}
        <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden transition-all ${showMap ? 'block' : 'hidden'}`}>
          <div ref={mapContainerRef} style={{ height: 300, zIndex: 1 }} className="w-full" />
        </div>

        {/* Hospital list */}
        {hospitals.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {hospitals.length} {t('hospitalsFound')}
            </h2>

            {hospitals.map(h => {
              const dist = h.distanceKm !== undefined
                ? (h.distanceKm < 1
                  ? `${(h.distanceKm * 1000).toFixed(0)} m`
                  : `${h.distanceKm.toFixed(1)} km`)
                : null;
              return (
                <div key={h.id} onClick={() => flyTo(h)}
                  className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all shadow-[0_2px_8px_-3px_rgba(15,23,42,0.06)] ${selectedId === h.id
                    ? 'border-teal-400 ring-2 ring-teal-500/20'
                    : 'border-slate-200/80 hover:border-teal-200'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-lg">🏥</div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm leading-snug">{h.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{h.address}</span>
                        </p>
                        {h.phone && (
                          <a href={`tel:${h.phone}`} onClick={e => e.stopPropagation()}
                            className="text-[11px] text-teal-600 font-bold mt-0.5 flex items-center gap-1 hover:underline">
                            <Phone className="w-3 h-3" /> {h.phone}
                          </a>
                        )}
                        {h.emergency === 'yes' && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200">
                            <ShieldAlert className="w-2.5 h-2.5" /> Emergency
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {dist && <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{dist}</span>}
                      <button
                        onClick={e => getDirections(h, e)}
                        disabled={directionLoadingId === h.id}
                        className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 active:bg-teal-200 border border-teal-200 text-teal-700 font-bold text-[11px] flex items-center gap-1 transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        {directionLoadingId === h.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Navigation className="w-3 h-3" />}
                        {directionLoadingId === h.id ? t('locating') : t('directions')}
                      </button>
                      {h.website && (
                        <a href={h.website} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-[10px] text-slate-400 hover:text-teal-600 flex items-center gap-0.5">
                          <Globe className="w-2.5 h-2.5" /> Website <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">{t('emergencyContacts')}</h2>
              <p className="text-[11px] text-slate-500">{t('emergencyContactsSub')}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {EMERGENCY_CONTACTS.map(c => (
              <a key={c.number} href={`tel:${c.number}`}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition-colors">{c.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-rose-600">{c.number}</span>
                  <div className="w-7 h-7 rounded-full bg-rose-50 group-hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-colors">
                    <Phone className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{t('hospitalDataNote')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
