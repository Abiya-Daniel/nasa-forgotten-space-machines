import { useState, useEffect } from 'react';
import { FEATURED_DOSSIERS } from '../data/featuredDossiers';
import { FeaturedMachineId } from '../types/equipment';
import { Layers, Box } from 'lucide-react';
import { SpacecraftModel3D } from './SpacecraftModel3D';

interface MachineAnatomyDiagramProps {
  machineId: FeaturedMachineId;
}

function BlueprintSvg({ machineId }: { machineId: FeaturedMachineId }) {
  if (machineId === 'apollo-15-lrv1') {
    return (
      <svg viewBox="0 0 800 420" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="grid-lrv" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="url(#grid-lrv)" />
        {/* Ground line */}
        <line x1="60" y1="340" x2="740" y2="340" stroke="rgba(148,163,184,0.35)" strokeDasharray="6 4" />
        {/* Chassis frame */}
        <rect x="200" y="220" width="380" height="34" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
        {/* Seats */}
        <path d="M 430 220 L 430 165 L 485 165 L 495 220 Z" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M 505 220 L 505 165 L 555 165 L 565 220 Z" fill="#0F172A" stroke="#CBD5E1" strokeWidth="1.5" />
        {/* Battery bay */}
        <rect x="220" y="188" width="110" height="32" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
        {/* High-gain dish mast & umbrella mesh */}
        <line x1="320" y1="220" x2="320" y2="120" stroke="#CBD5E1" strokeWidth="3" />
        <path d="M 275 105 Q 320 65 365 105" fill="none" stroke="#FBBF24" strokeWidth="3" />
        <line x1="320" y1="84" x2="320" y2="120" stroke="#FBBF24" strokeWidth="2" />
        {/* TV Camera */}
        <line x1="382" y1="220" x2="382" y2="145" stroke="#94A3B8" strokeWidth="2.5" />
        <rect x="368" y="130" width="34" height="20" rx="2" fill="#334155" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Hand controller console */}
        <line x1="590" y1="220" x2="590" y2="178" stroke="#CBD5E1" strokeWidth="2.5" />
        <circle cx="590" cy="174" r="7" fill="#38BDF8" />
        {/* Rear cargo rack */}
        <rect x="160" y="195" width="52" height="25" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Wire-mesh wheels */}
        <g>
          <circle cx="190" cy="304" r="38" fill="#0F172A" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="190" cy="304" r="22" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="190" cy="304" r="8" fill="#F59E0B" />
          <line x1="210" y1="254" x2="190" y2="304" stroke="#94A3B8" strokeWidth="3" />
        </g>
        <g>
          <circle cx="570" cy="304" r="38" fill="#0F172A" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="570" cy="304" r="22" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="570" cy="304" r="8" fill="#F59E0B" />
          <line x1="550" y1="254" x2="570" y2="304" stroke="#94A3B8" strokeWidth="3" />
        </g>
        <text x="24" y="34" fill="rgba(148,163,184,0.75)" fontSize="11" fontFamily="monospace">
          APOLLO 15 LRV-1 · SIDE PROFILE SCHEMATIC · 3.10M LENGTH
        </text>
      </svg>
    );
  }

  if (machineId === 'opportunity-mer-b') {
    return (
      <svg viewBox="0 0 800 420" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="grid-opp" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(251,146,60,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="url(#grid-opp)" />
        <line x1="60" y1="348" x2="740" y2="348" stroke="rgba(148,163,184,0.35)" strokeDasharray="6 4" />
        {/* Solar Array Wings */}
        <polygon points="150,185 330,175 340,210 140,210" fill="#172554" stroke="#38BDF8" strokeWidth="2" />
        <polygon points="440,175 615,185 625,210 435,210" fill="#172554" stroke="#38BDF8" strokeWidth="2" />
        {/* Warm Electronics Box */}
        <rect x="315" y="198" width="165" height="62" rx="4" fill="#1E293B" stroke="#FBBF24" strokeWidth="2" />
        {/* Pancam Mast */}
        <line x1="392" y1="198" x2="392" y2="90" stroke="#CBD5E1" strokeWidth="5" />
        <rect x="355" y="72" width="76" height="26" rx="3" fill="#0F172A" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="372" cy="85" r="5" fill="#38BDF8" />
        <circle cx="414" cy="85" r="5" fill="#38BDF8" />
        {/* HGA Dish */}
        <line x1="515" y1="198" x2="538" y2="145" stroke="#94A3B8" strokeWidth="3" />
        <ellipse cx="545" cy="136" rx="34" ry="12" transform="rotate(-22 545 136)" fill="#E2E8F0" stroke="#F59E0B" strokeWidth="2" />
        {/* Robotic Arm IDD */}
        <polyline points="480,225 565,215 615,255 640,275" fill="none" stroke="#CBD5E1" strokeWidth="4" />
        <circle cx="645" cy="278" r="14" fill="#334155" stroke="#F59E0B" strokeWidth="2" />
        {/* Rocker-Bogie & 6 Wheels */}
        <polyline points="265,315 320,255 405,260 515,315" fill="none" stroke="#94A3B8" strokeWidth="4" />
        <polyline points="320,255 390,315" fill="none" stroke="#94A3B8" strokeWidth="3.5" />
        {[265, 390, 515].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="315" r="30" fill="#0F172A" stroke="#E2E8F0" strokeWidth="3" />
            <circle cx={cx} cy="315" r="10" fill="#F97316" />
          </g>
        ))}
        <text x="24" y="34" fill="rgba(148,163,184,0.75)" fontSize="11" fontFamily="monospace">
          OPPORTUNITY (MER-B) · 6-WHEEL ROCKER-BOGIE &amp; SOLAR DECK · 185 KG
        </text>
      </svg>
    );
  }

  if (machineId === 'insight-lander') {
    return (
      <svg viewBox="0 0 800 420" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="grid-ins" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="420" fill="url(#grid-ins)" />
        <line x1="60" y1="340" x2="740" y2="340" stroke="rgba(148,163,184,0.35)" strokeDasharray="6 4" />
        {/* Circular solar wings */}
        <ellipse cx="185" cy="205" rx="95" ry="26" fill="#172554" stroke="#38BDF8" strokeWidth="2" />
        <ellipse cx="605" cy="205" rx="95" ry="26" fill="#172554" stroke="#38BDF8" strokeWidth="2" />
        {/* Lander body & 3 legs */}
        <rect x="325" y="198" width="145" height="44" rx="4" fill="#1E293B" stroke="#E2E8F0" strokeWidth="2" />
        <line x1="345" y1="242" x2="295" y2="338" stroke="#CBD5E1" strokeWidth="4" />
        <line x1="398" y1="242" x2="398" y2="338" stroke="#CBD5E1" strokeWidth="4" />
        <line x1="450" y1="242" x2="500" y2="338" stroke="#CBD5E1" strokeWidth="4" />
        <ellipse cx="295" cy="340" rx="18" ry="5" fill="#94A3B8" />
        <ellipse cx="398" cy="340" rx="18" ry="5" fill="#94A3B8" />
        <ellipse cx="500" cy="340" rx="18" ry="5" fill="#94A3B8" />
        {/* RISE antennas */}
        <polygon points="355,198 345,168 370,168" fill="#FBBF24" />
        <polygon points="392,198 382,168 407,168" fill="#FBBF24" />
        {/* Robotic Arm */}
        <polyline points="420,198 440,122 520,148 560,210" fill="none" stroke="#CBD5E1" strokeWidth="4" />
        {/* Deployed SEIS Copper Dome on ground */}
        <path d="M 555 340 L 570 288 L 635 288 L 650 340 Z" fill="#9A3412" stroke="#FBBF24" strokeWidth="2" />
        <path d="M 460 242 Q 515 330 562 328" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 2" />
        {/* HP3 Mole probe */}
        <rect x="195" y="308" width="26" height="32" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="208" y1="340" x2="208" y2="375" stroke="#F59E0B" strokeWidth="3" />
        <text x="24" y="34" fill="rgba(148,163,184,0.75)" fontSize="11" fontFamily="monospace">
          INSIGHT LANDER &amp; GROUND-DEPLOYED SEIS · ELYSIUM PLANITIA
        </text>
      </svg>
    );
  }

  // Voyager 1
  return (
    <svg viewBox="0 0 800 420" className="w-full h-full" aria-hidden="true">
      <defs>
        <pattern id="grid-voy" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="420" fill="url(#grid-voy)" />
      {/* 3.7m High-Gain Parabolic Dish */}
      <ellipse cx="400" cy="145" rx="130" ry="44" fill="#E2E8F0" fillOpacity="0.14" stroke="#E2E8F0" strokeWidth="2.5" />
      <line x1="330" y1="145" x2="400" y2="85" stroke="#94A3B8" strokeWidth="2" />
      <line x1="470" y1="145" x2="400" y2="85" stroke="#94A3B8" strokeWidth="2" />
      <circle cx="400" cy="85" r="8" fill="#38BDF8" />
      {/* 10-sided Bus */}
      <rect x="335" y="190" width="130" height="68" rx="6" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
      {/* Golden Record */}
      <circle cx="445" cy="224" r="20" fill="#D97706" stroke="#FDE68A" strokeWidth="2" />
      <circle cx="445" cy="224" r="5" fill="#0F172A" />
      {/* RTG Boom (left) */}
      <line x1="335" y1="226" x2="175" y2="288" stroke="#94A3B8" strokeWidth="3.5" />
      <rect x="135" y="274" width="60" height="22" rx="3" transform="rotate(-20 165 285)" fill="#1E293B" stroke="#F59E0B" strokeWidth="2" />
      {/* Magnetometer Boom (top left) */}
      <line x1="350" y1="198" x2="175" y2="88" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 3" />
      {/* Plasma Wave V-antennas */}
      <line x1="370" y1="258" x2="290" y2="375" stroke="#64748B" strokeWidth="1.5" />
      <line x1="430" y1="258" x2="510" y2="375" stroke="#64748B" strokeWidth="1.5" />
      {/* Science Scan Platform (right) */}
      <line x1="465" y1="215" x2="610" y2="188" stroke="#94A3B8" strokeWidth="3" />
      <rect x="605" y="166" width="48" height="38" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
      <text x="24" y="34" fill="rgba(148,163,184,0.75)" fontSize="11" fontFamily="monospace">
        VOYAGER 1 · 3.7M HGA DISH, 3×RTG BOOM &amp; GOLDEN RECORD
      </text>
    </svg>
  );
}

export function MachineAnatomyDiagram({ machineId }: MachineAnatomyDiagramProps) {
  const dossier = FEATURED_DOSSIERS[machineId];
  const [selectedPartId, setSelectedPartId] = useState<string>(
    dossier.anatomyComponents[0].id
  );
  const [viewMode, setViewMode] = useState<'blueprint' | '3d'>('blueprint');

  useEffect(() => {
    setSelectedPartId(FEATURED_DOSSIERS[machineId].anatomyComponents[0].id);
  }, [machineId]);

  const activePart =
    dossier.anatomyComponents.find((c) => c.id === selectedPartId) ||
    dossier.anatomyComponents[0];

  return (
    <div className="rounded-lg border border-slate-800 bg-[#080C14] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">{dossier.anatomyTitle}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{dossier.anatomySubtitle}</p>
        </div>

        <div className="inline-flex rounded-md border border-slate-800 bg-[#05070C] p-1">
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'blueprint'
                ? 'bg-sky-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Diagram</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === '3d'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Model View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Diagram or 3D Stage */}
        <div className="lg:col-span-7 relative bg-[#05080F] border-b lg:border-b-0 lg:border-r border-slate-800 min-h-[320px]">
          {viewMode === 'blueprint' ? (
            <div className="relative w-full h-[320px] sm:h-[360px]">
              <BlueprintSvg machineId={machineId} />
              {dossier.anatomyComponents.map((part, idx) => {
                const isSelected = part.id === activePart.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedPartId(part.id)}
                    style={{ left: `${part.xPct}%`, top: `${part.yPct}%` }}
                    aria-label={`Inspect ${part.label}`}
                    aria-pressed={isSelected}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-transform cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-white scale-115 shadow-lg z-20'
                        : 'bg-[#0F172A]/95 text-sky-300 border-sky-400 hover:scale-110 z-10'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          ) : (
            <SpacecraftModel3D machineId={machineId} />
          )}
        </div>

        {/* Component Selector + Inspector */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Subsystems ({dossier.anatomyComponents.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
              {dossier.anatomyComponents.map((part) => {
                const active = part.id === activePart.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedPartId(part.id)}
                    className={`w-full text-left rounded-md border px-3 py-2 text-xs transition-colors cursor-pointer ${
                      active
                        ? 'border-amber-400/80 bg-[#131B2E] text-white font-semibold'
                        : 'border-slate-800/80 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {part.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#06080E] p-4 space-y-2.5 text-xs">
            <div className="font-mono text-sky-400">{activePart.subsystem}</div>
            <h4 className="text-sm font-bold text-slate-100">{activePart.label}</h4>
            <div>
              <span className="text-slate-400 font-medium">Materials: </span>
              <span className="text-slate-200">{activePart.material}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Engineering Role: </span>
              <span className="text-slate-300 leading-relaxed">{activePart.role}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-amber-400 font-medium">Current Condition: </span>
              <span className="text-slate-300">{activePart.currentState}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
