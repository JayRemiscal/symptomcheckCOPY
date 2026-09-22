import React from 'react';

interface AmbulanceLoaderProps {
  message?: string;
}

export const AmbulanceLoader: React.FC<AmbulanceLoaderProps> = ({
  message = 'Analyzing your symptoms…',
}) => {
  return (
    <div
      id="ambulance-loader"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      aria-label="Loading"
      role="status"
    >
      <style>{`
        /* Road slide */
        @keyframes road-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        /* Ambulance drive-in then loop */
        @keyframes amb-drive {
          0%   { transform: translateX(-120px); }
          15%  { transform: translateX(0px); }
          85%  { transform: translateX(0px); }
          100% { transform: translateX(120px); }
        }
        /* Wheel spin */
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Siren flash red/blue */
        @keyframes siren-red {
          0%, 45%, 55%, 100% { opacity: 0; }
          50%                 { opacity: 1; }
        }
        @keyframes siren-blue {
          0%, 20%, 30%, 100% { opacity: 0; }
          25%                { opacity: 1; }
        }
        /* Body bob */
        @keyframes body-bob {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-2px);  }
        }
        /* Dot pulse */
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }

        .road-stripe {
          animation: road-slide 0.5s linear infinite;
        }
        .amb-body {
          animation: body-bob 0.35s ease-in-out infinite;
        }
        .amb-scene {
          animation: amb-drive 2.4s ease-in-out infinite;
        }
        .wheel {
          transform-origin: center;
          animation: wheel-spin 0.45s linear infinite;
        }
        .siren-red  { animation: siren-red  0.8s ease-in-out infinite; }
        .siren-blue { animation: siren-blue 0.8s ease-in-out infinite 0.4s; }

        .dot:nth-child(1) { animation: dot-pulse 1.2s ease-in-out infinite 0s; }
        .dot:nth-child(2) { animation: dot-pulse 1.2s ease-in-out infinite 0.2s; }
        .dot:nth-child(3) { animation: dot-pulse 1.2s ease-in-out infinite 0.4s; }
      `}</style>

      {/* ── Scene wrapper ── */}
      <div className="relative flex flex-col items-center select-none" style={{ width: 280 }}>

        {/* Siren glow halos (behind ambulance) */}
        <div className="relative" style={{ height: 110 }}>

          {/* Ambulance scene */}
          <div className="amb-scene" style={{ width: 160 }}>
            <div className="amb-body">
              <svg
                width="160"
                height="80"
                viewBox="0 0 160 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* === AMBULANCE BODY === */}

                {/* Main body */}
                <rect x="10" y="20" width="130" height="46" rx="6" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />

                {/* Cab (front) */}
                <rect x="110" y="12" width="30" height="54" rx="6" fill="#e2e8f0" stroke="#CBD5E1" strokeWidth="2" />

                {/* Cab windshield */}
                <rect x="114" y="16" width="22" height="20" rx="3" fill="#BAE6FD" opacity="0.85" />

                {/* Red cross box */}
                <rect x="28" y="28" width="50" height="30" rx="4" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1.5" />
                {/* Red cross horizontal */}
                <rect x="33" y="38" width="40" height="10" rx="2" fill="#EF4444" />
                {/* Red cross vertical */}
                <rect x="48" y="29" width="10" height="28" rx="2" fill="#EF4444" />

                {/* Side stripe */}
                <rect x="10" y="42" width="100" height="6" fill="#EF4444" opacity="0.8" />

                {/* "AMBULANCE" text (mirrored on real ambulances) */}
                <text
                  x="60"
                  y="40"
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="bold"
                  fill="#1e40af"
                  letterSpacing="1"
                  transform="scale(-1,1) translate(-120, 0)"
                >
                  AMBULANCE
                </text>

                {/* === SIREN ON ROOF === */}
                {/* Base */}
                <rect x="30" y="12" width="50" height="10" rx="3" fill="#f1f5f9" stroke="#CBD5E1" strokeWidth="1.2" />
                {/* Red light */}
                <ellipse cx="44" cy="13" rx="8" ry="5" className="siren-red" fill="#EF4444" />
                {/* Blue light */}
                <ellipse cx="66" cy="13" rx="8" ry="5" className="siren-blue" fill="#3B82F6" />
                {/* Siren base (always visible) */}
                <ellipse cx="44" cy="13" rx="8" ry="5" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                <ellipse cx="66" cy="13" rx="8" ry="5" fill="none" stroke="#CBD5E1" strokeWidth="1" />

                {/* === WHEELS === */}
                {/* Front wheel */}
                <g transform="translate(124, 66)">
                  <circle r="13" fill="#334155" className="wheel" />
                  <circle r="8" fill="#94A3B8" className="wheel" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#334155" strokeWidth="2" className="wheel" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#334155" strokeWidth="2" className="wheel" />
                  <circle r="3" fill="#475569" />
                </g>
                {/* Rear wheel */}
                <g transform="translate(36, 66)">
                  <circle r="13" fill="#334155" className="wheel" />
                  <circle r="8" fill="#94A3B8" className="wheel" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#334155" strokeWidth="2" className="wheel" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#334155" strokeWidth="2" className="wheel" />
                  <circle r="3" fill="#475569" />
                </g>

                {/* === HEADLIGHT === */}
                <ellipse cx="141" cy="45" rx="5" ry="4" fill="#FEF08A" opacity="0.9" />
                <ellipse cx="141" cy="45" rx="3" ry="2.5" fill="#FBBF24" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Road ── */}
        <div
          className="relative overflow-hidden rounded-lg"
          style={{ width: 280, height: 20, background: '#334155', marginTop: -6 }}
        >
          {/* Road dashes */}
          <div
            className="road-stripe absolute top-1/2 flex gap-6"
            style={{ transform: 'translateY(-50%)', width: '200%' }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: 28, height: 4, background: '#FCD34D', borderRadius: 2, flexShrink: 0 }} />
            ))}
          </div>
        </div>

        {/* ── Shadow ── */}
        <div style={{ width: 120, height: 6, background: 'radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)', marginTop: 2 }} />

        {/* ── Text & dots ── */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-slate-700 tracking-wide">{message}</p>
          <div className="flex gap-1.5">
            <div className="dot w-2 h-2 rounded-full bg-teal-500" />
            <div className="dot w-2 h-2 rounded-full bg-teal-500" />
            <div className="dot w-2 h-2 rounded-full bg-teal-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
