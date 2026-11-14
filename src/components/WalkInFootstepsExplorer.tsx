import { useState } from 'react';
import { Footprints, MapPin, Mountain } from 'lucide-react';
import { FOOTSTEPS_TRAVERSES } from '../data/phase2InteractiveData';
import { useExperience } from '../context/ExperienceContext';

export function WalkInFootstepsExplorer() {
  const [routeId, setRouteId] = useState(FOOTSTEPS_TRAVERSES[0].id);
  const [selectedWpId, setSelectedWpId] = useState(FOOTSTEPS_TRAVERSES[0].waypoints[0].id);
  const { unlockBadge } = useExperience();

  const route =
    FOOTSTEPS_TRAVERSES.find((r) => r.id === routeId) || FOOTSTEPS_TRAVERSES[0];
  const activeWp =
    route.waypoints.find((w) => w.id === selectedWpId) || route.waypoints[0];

  const handleSelectRoute = (id: string) => {
    setRouteId(id);
    const nextRoute = FOOTSTEPS_TRAVERSES.find((r) => r.id === id);
    if (nextRoute && nextRoute.waypoints[0]) {
      setSelectedWpId(nextRoute.waypoints[0].id);
    }
    if (id === 'fs-apollo15' || id === 'fs-lunokhod1') {
      unlockBadge('badge-moon-explorer');
    } else {
      unlockBadge('badge-mars-pioneer');
    }
  };

  const polyPoints = route.waypoints
    .map((w) => `${w.xPct * 6},${w.yPct * 3.4}`)
    .join(' ');

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Footprints className="w-4 h-4" />
          <span>Walk in Its Footsteps · Documented Off-World Traverses</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Follow Exact Rover Tracks &amp; Lunar Driving Routes
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Inspect historical surface paths across lunar mare plains and Martian craters. Click any numbered waypoint along the traverse path to review terrain elevation and scientific discoveries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FOOTSTEPS_TRAVERSES.map((r) => {
          const isSel = r.id === route.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelectRoute(r.id)}
              className={`rounded-lg border p-3.5 text-left cursor-pointer transition-colors space-y-1 ${
                isSel
                  ? 'border-amber-400 bg-[#121A2C] text-white'
                  : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-mono text-[11px] text-sky-400">
                {r.world} · {r.totalDistance}
              </div>
              <div className="text-sm font-bold">{r.machineName}</div>
              <div className="text-xs text-slate-400">{r.siteName}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Schematic Traverse Plot */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#080B13] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-amber-400">{route.title}</span>
            <span className="text-slate-400">Interactive Waypoint Schematic</span>
          </div>

          <div
            className={`relative rounded-lg border border-slate-800 overflow-hidden ${
              route.world === 'Mars'
                ? 'bg-gradient-to-br from-[#23110C] via-[#170C09] to-[#0B080A]'
                : 'bg-gradient-to-br from-[#131720] via-[#0D1017] to-[#06080E]'
            }`}
          >
            <svg viewBox="0 0 600 340" className="w-full h-auto block">
              {/* Topographic contour hints */}
              <ellipse
                cx="300"
                cy="170"
                rx="240"
                ry="120"
                fill="none"
                stroke={route.world === 'Mars' ? 'rgba(249,115,22,0.12)' : 'rgba(148,163,184,0.12)'}
                strokeDasharray="4 4"
              />
              <ellipse
                cx="310"
                cy="175"
                rx="165"
                ry="80"
                fill="none"
                stroke={route.world === 'Mars' ? 'rgba(249,115,22,0.16)' : 'rgba(148,163,184,0.16)'}
              />
              {/* Crater markers */}
              <circle
                cx="190"
                cy="145"
                r="38"
                fill="rgba(0,0,0,0.22)"
                stroke="rgba(255,255,255,0.08)"
              />
              <circle
                cx="450"
                cy="210"
                r="52"
                fill="rgba(0,0,0,0.25)"
                stroke="rgba(255,255,255,0.09)"
              />

              {/* Documented Traverse Path */}
              <polyline
                points={polyPoints}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray="7 5"
                strokeLinecap="round"
              />

              {/* Clickable Waypoints */}
              {route.waypoints.map((wp, idx) => {
                const cx = wp.xPct * 6;
                const cy = wp.yPct * 3.4;
                const isSelected = wp.id === activeWp.id;
                return (
                  <g
                    key={wp.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedWpId(wp.id)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 15 : 11}
                      fill={isSelected ? '#F59E0B' : '#0B0F18'}
                      stroke={isSelected ? '#FEF3C7' : '#38BDF8'}
                      strokeWidth="2.5"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill={isSelected ? '#05070D' : '#F8FAFC'}
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-sky-400" />
              <span>{route.terrainSummary}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Source: {route.sourceCredit}</p>
        </div>

        {/* Selected Waypoint Discovery Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Waypoint Details · {route.machineName}</span>
          </div>

          <div className="space-y-2">
            {route.waypoints.map((wp, idx) => {
              const isSelected = wp.id === activeWp.id;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => setSelectedWpId(wp.id)}
                  className={`w-full rounded-md border p-3.5 text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-amber-400 bg-[#121A2C] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="text-amber-400">Stop 0{idx + 1}</span>
                    <span className="text-sky-400">{wp.elevationNote}</span>
                  </div>
                  <div className="mt-1 text-sm font-bold">{wp.name}</div>
                  {isSelected && (
                    <p className="mt-2 text-xs text-slate-200 leading-relaxed border-t border-slate-700/70 pt-2">
                      {wp.discovery}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
