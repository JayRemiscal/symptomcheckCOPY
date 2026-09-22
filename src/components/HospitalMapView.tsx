import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
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

// Fix Leaflet default icon paths in Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom hospital marker icon
const hospitalIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:32px; height:32px; border-radius:50%;
    background:linear-gradient(135deg,#ef4444,#b91c1c);
    border:3px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; color:#fff; font-weight:bold;
  ">🏥</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -36],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:28px; height:28px; border-radius:50%;
    background:linear-gradient(135deg,#0d9488,#0f766e);
    border:3px solid #fff; box-shadow:0 2px 8px rgba(0,0,0,0.35);
    display:flex; align-items:center; justify-content:center;
    font-size:13px;
  ">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -32],
});

// ── Emergency Contacts (Philippine context) ───────────────────
const EMERGENCY_CONTACTS = [
  { label: 'National Emergency Hotline', number: '911', icon: '🚨', color: 'rose' },
  { label: 'Philippine Red Cross', number: '143', icon: '🩸', color: 'rose' },
  { label: 'PNP (Police)', number: '117', icon: '👮', color: 'blue' },
  { label: 'BFP (Fire)', number: '160', icon: '🚒', color: 'orange' },
  { label: 'NDRRMC', number: '1-800-1000-5990', icon: '⚠️', color: 'amber' },
  { label: 'DOH Hotline', number: '1555', icon: '🏥', color: 'teal' },
];

interface HospitalMapViewProps {
  profile: UserProfile | null;
  onOpenLogin: () => void;
  onStartAssessment: () => void;
}

export const HospitalMapView: React.FC<HospitalMapViewProps> = ({
  profile,
  onOpenLogin,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<GeoCoordinate | null>(null);
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'geocoding' | 'searching' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const markersRef = useRef<Record<string, L.Marker>>({});

  const buildMap = useCallback((center: GeoCoordinate) => {
    if (!mapContainerRef.current) return;

    // Destroy existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // User marker
    L.marker([center.lat, center.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>📍 Your Location</b>')
      .openPopup();
  }, []);

  const addHospitalMarkers = useCallback(
    (hospitalList: NearbyHospital[]) => {
      if (!mapRef.current) return;
      // Remove old markers
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      hospitalList.forEach((h) => {
        const popup = `
          <div style="min-width:180px; font-family:sans-serif">
            <b style="font-size:13px;color:#0f172a">${h.name}</b><br/>
            <span style="font-size:11px;color:#64748b">${h.address}</span>
            ${h.phone ? `<br/><a href="tel:${h.phone}" style="font-size:12px;color:#0d9488;font-weight:bold">📞 ${h.phone}</a>` : ''}
            ${h.distanceKm !== undefined ? `<br/><span style="font-size:10px;color:#94a3b8">${h.distanceKm.toFixed(2)} km away</span>` : ''}
            <br/><a href="https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}" target="_blank"
              style="font-size:11px;color:#0d9488;font-weight:bold;">🗺 Get Directions</a>
          </div>`;
        const marker = L.marker([h.lat, h.lng], { icon: hospitalIcon })
          .addTo(mapRef.current!)
          .bindPopup(popup);
        markersRef.current[h.id] = marker;
      });
    },
    []
  );

  const search = useCallback(
    async (address: string) => {
      setStatus('geocoding');
      setErrorMsg('');
      const geo = await GeoService.geocodeAddress(address);
      if (!geo) {
        setStatus('error');
        setErrorMsg(`Could not find location for "${address}". Try a more specific address.`);
        return;
      }
      setCoords(geo);
      buildMap(geo);

      setStatus('searching');
      const list = await GeoService.findNearbyHospitals(geo.lat, geo.lng);
      setHospitals(list);
      addHospitalMarkers(list);

      if (list.length === 0) {
        setStatus('error');
        setErrorMsg('No hospitals found within 10 km. Try a different address.');
      } else {
        setStatus('done');
        // Fit map to show all markers
        if (mapRef.current) {
          const bounds = L.latLngBounds([
            [geo.lat, geo.lng],
            ...list.slice(0, 10).map((h) => [h.lat, h.lng] as [number, number]),
          ]);
          mapRef.current.fitBounds(bounds, { padding: [40, 40] });
        }
      }
    },
    [buildMap, addHospitalMarkers]
  );

  // Auto-search on mount if profile has address
  useEffect(() => {
    if (profile?.address) {
      search(profile.address);
    }
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flyToHospital = (h: NearbyHospital) => {
    setSelectedId(h.id);
    if (mapRef.current && markersRef.current[h.id]) {
      mapRef.current.flyTo([h.lat, h.lng], 16, { duration: 0.8 });
      markersRef.current[h.id].openPopup();
    }
  };

  const isLoading = status === 'geocoding' || status === 'searching';

  return (
    <div className="flex flex-col min-h-[calc(100vh-60px)] bg-[#F4F7F9]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200/70 px-4 sm:px-6 py-4 sticky top-[60px] z-20 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.05)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Hospital className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">Nearest Hospitals</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {profile?.address ? `Searching near: ${profile.address}` : 'Enter your address to find nearby hospitals'}
              </p>
            </div>
          </div>

          {/* Address search bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && manualAddress.trim() && search(manualAddress)}
              placeholder={profile?.address ?? 'Enter address or city…'}
              className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
            <button
              onClick={() => search(manualAddress || profile?.address || '')}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Navigation className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* Status text */}
          {isLoading && (
            <p className="text-xs text-teal-600 font-medium mt-2 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {status === 'geocoding' ? 'Locating your address…' : 'Finding nearby hospitals…'}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4 space-y-4">
        {/* ── Guest prompt ── */}
        {!profile && status === 'idle' && (
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 rounded-2xl p-4 text-white flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-500/30 text-teal-300 border border-teal-500/40">
                Guest Mode
              </span>
              <h2 className="font-bold text-sm mt-1">Sign in to auto-fill your address</h2>
              <p className="text-xs text-slate-300 mt-0.5">Or type any address above to search.</p>
            </div>
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <SearchX className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-800">{errorMsg}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1 cursor-pointer hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Try again
              </button>
            </div>
          </div>
        )}

        {/* ── Map ── */}
        {(status === 'searching' || status === 'done') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
            <div
              ref={mapContainerRef}
              style={{ height: 280, zIndex: 1 }}
              className="w-full"
            />
          </div>
        )}

        {/* ── Hospital list ── */}
        {hospitals.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {hospitals.length} Hospitals / Clinics Found
            </h2>
            {hospitals.map((h) => (
              <div
                key={h.id}
                onClick={() => flyToHospital(h)}
                className={`bg-white rounded-2xl border shadow-[0_2px_8px_-3px_rgba(15,23,42,0.06)] p-4 cursor-pointer transition-all ${
                  selectedId === h.id
                    ? 'border-teal-400 ring-2 ring-teal-500/20'
                    : 'border-slate-200/80 hover:border-teal-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-lg">
                      🏥
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{h.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {h.address}
                      </p>
                      {h.phone && (
                        <a
                          href={`tel:${h.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-teal-600 font-bold mt-0.5 flex items-center gap-1 hover:underline"
                        >
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
                    {h.distanceKm !== undefined && (
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                        {h.distanceKm < 1
                          ? `${(h.distanceKm * 1000).toFixed(0)} m`
                          : `${h.distanceKm.toFixed(1)} km`}
                      </span>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3 h-3" /> Directions
                    </a>
                    {h.website && (
                      <a
                        href={h.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-slate-400 hover:text-teal-600 flex items-center gap-0.5"
                      >
                        <Globe className="w-2.5 h-2.5" /> Website
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Emergency Contacts ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Emergency Contacts</h2>
              <p className="text-[11px] text-slate-500">Philippine Emergency & Rescue Hotlines</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number}`}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition-colors">
                    {c.label}
                  </span>
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
              <span>Hospital data sourced from OpenStreetMap contributors. Contact details may not be current. Always verify before an emergency.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
