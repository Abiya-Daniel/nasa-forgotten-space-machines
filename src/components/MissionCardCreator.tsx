import { useState } from 'react';
import { Download, CreditCard, Sparkles } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { formatCoord } from './EquipmentDetailModal';

type CardThemeId = 'amber' | 'sky' | 'mars' | 'obsidian';

const CARD_THEMES: Record<
  CardThemeId,
  { label: string; bg: string; accent: string; border: string; hexBg: string; hexAccent: string }
> = {
  amber: {
    label: 'Solar Amber Gold',
    bg: 'from-[#161209] via-[#0B0F18] to-[#07090E]',
    accent: 'text-amber-400',
    border: 'border-amber-400/60',
    hexBg: '#12100B',
    hexAccent: '#F59E0B',
  },
  sky: {
    label: 'Deep Telemetry Blue',
    bg: 'from-[#091526] via-[#0B0F18] to-[#07090E]',
    accent: 'text-sky-400',
    border: 'border-sky-400/60',
    hexBg: '#091322',
    hexAccent: '#38BDF8',
  },
  mars: {
    label: 'Martian Rust Horizon',
    bg: 'from-[#220E0B] via-[#110C12] to-[#07090E]',
    accent: 'text-orange-400',
    border: 'border-orange-400/60',
    hexBg: '#1E0E0B',
    hexAccent: '#FB923C',
  },
  obsidian: {
    label: 'Interstellar Obsidian',
    bg: 'from-[#0E131E] via-[#080B12] to-[#05070B]',
    accent: 'text-emerald-400',
    border: 'border-emerald-400/50',
    hexBg: '#090D16',
    hexAccent: '#34D399',
  },
};

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;
  let count = 0;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
      count += 1;
      if (count >= maxLines) return;
    } else {
      line = testLine;
    }
  }
  if (line && count < maxLines) {
    ctx.fillText(line, x, currentY);
  }
}

export function MissionCardCreator() {
  const [machineId, setMachineId] = useState(EQUIPMENT_DATA[0].id);
  const [callsign, setCallsign] = useState('Explorer Team Alpha');
  const [customNote, setCustomNote] = useState(
    'Every machine left on another world carries human curiosity forward.'
  );
  const [themeId, setThemeId] = useState<CardThemeId>('amber');
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const machine =
    EQUIPMENT_DATA.find((e) => e.id === machineId) || EQUIPMENT_DATA[0];
  const theme = CARD_THEMES[themeId];

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 1200, 720);
    grad.addColorStop(0, theme.hexBg);
    grad.addColorStop(1, '#05070C');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 720);

    // Outer technical frame
    ctx.strokeStyle = theme.hexAccent;
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 1136, 656);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, 1104, 624);

    // Header metadata
    ctx.fillStyle = theme.hexAccent;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(
      `NASA'S FORGOTTEN SPACE MACHINES · COLLECTOR CARD · NSSDCA ${machine.nssdcaId}`,
      76,
      102
    );

    // Main title
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 46px sans-serif';
    ctx.fillText(machine.name.slice(0, 38), 76, 174);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px monospace';
    ctx.fillText(`${machine.mission} · ${machine.agency}`, 76, 218);

    // Divider
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.beginPath();
    ctx.moveTo(76, 246);
    ctx.lineTo(1124, 246);
    ctx.stroke();

    // Stats block
    const stats = [
      ['DESTINATION', machine.coordinates.region],
      ['COORDINATES / PATH', formatCoord(machine)],
      ['LAUNCH DATE', machine.launchDate],
      ['POWER SOURCE', machine.powerSource || 'Mission Battery / Solar / RTG'],
    ];

    stats.forEach(([k, v], idx) => {
      const col = idx % 2 === 0 ? 76 : 620;
      const row = idx < 2 ? 296 : 382;
      ctx.fillStyle = theme.hexAccent;
      ctx.font = 'bold 16px monospace';
      ctx.fillText(k, col, row);
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '22px sans-serif';
      ctx.fillText(v.slice(0, 42), col, row + 30);
    });

    // Legacy summary
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('SCIENTIFIC DISCOVERY & LEGACY', 76, 468);
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '21px sans-serif';
    wrapCanvasText(ctx, machine.scientificValue, 76, 502, 1040, 30, 3);

    // Explorer Reflection Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(76, 594, 1048, 66);
    ctx.fillStyle = theme.hexAccent;
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`EXPLORER CALLSIGN: ${(callsign || 'EXPLORER').toUpperCase()}`, 94, 622);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'italic 19px sans-serif';
    ctx.fillText(`"${(customNote || '').slice(0, 92)}"`, 94, 648);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mission-card-${machine.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadStatus(`Downloaded mission-card-${machine.id}.png`);
    }, 'image/png');
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <CreditCard className="w-4 h-4" />
          <span>Create Your Own Mission Card · PNG Collectible Generator</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Design &amp; Download a Custom Spacecraft Collector Card
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Pick any documented spacecraft, add your Explorer Callsign and personal reflection, select a museum palette, and export a high-resolution PNG card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="card-machine-select"
              className="block text-xs font-mono text-sky-400"
            >
              Spacecraft Subject
            </label>
            <select
              id="card-machine-select"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs sm:text-sm text-slate-100 cursor-pointer"
            >
              {EQUIPMENT_DATA.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.mission})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="card-callsign-input"
              className="block text-xs font-mono text-sky-400"
            >
              Explorer Callsign / Name
            </label>
            <input
              id="card-callsign-input"
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              maxLength={42}
              className="w-full rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs sm:text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="card-note-input"
              className="block text-xs font-mono text-sky-400"
            >
              Mission Reflection / Motto
            </label>
            <textarea
              id="card-note-input"
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              maxLength={120}
              className="w-full rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs sm:text-sm text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-mono text-sky-400">Card Palette</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CARD_THEMES) as CardThemeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setThemeId(id)}
                  className={`rounded-md border px-3 py-2 text-xs font-medium cursor-pointer text-left ${
                    themeId === id
                      ? 'border-amber-400 bg-[#141D30] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-400 hover:text-white'
                  }`}
                >
                  {CARD_THEMES[id].label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadPng}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Mission Card (PNG)</span>
          </button>

          {downloadStatus && (
            <p className="text-xs font-mono text-emerald-400">{downloadStatus}</p>
          )}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-7">
          <div
            className={`rounded-xl border-2 ${theme.border} bg-gradient-to-br ${theme.bg} p-6 sm:p-8 shadow-2xl space-y-5`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <span className={theme.accent}>
                NASA&apos;S FORGOTTEN SPACE MACHINES · COLLECTOR CARD
              </span>
              <span className="text-slate-400">NSSDCA {machine.nssdcaId}</span>
            </div>

            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {machine.name}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {machine.mission} · {machine.agency}
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <dt className={`font-mono text-[10px] uppercase ${theme.accent}`}>
                  Destination / Site
                </dt>
                <dd className="text-slate-100 font-medium mt-0.5">
                  {machine.coordinates.region}
                </dd>
              </div>
              <div>
                <dt className={`font-mono text-[10px] uppercase ${theme.accent}`}>
                  Coordinates / Path
                </dt>
                <dd className="text-slate-100 font-mono mt-0.5">
                  {formatCoord(machine)}
                </dd>
              </div>
              <div>
                <dt className={`font-mono text-[10px] uppercase ${theme.accent}`}>
                  Launch Date
                </dt>
                <dd className="text-slate-100 font-mono mt-0.5">
                  {machine.launchDate}
                </dd>
              </div>
              <div>
                <dt className={`font-mono text-[10px] uppercase ${theme.accent}`}>
                  Power System
                </dt>
                <dd className="text-slate-100 mt-0.5">
                  {machine.powerSource || 'Batteries / Solar / RTG'}
                </dd>
              </div>
            </dl>

            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase text-sky-400">
                Scientific Discovery &amp; Legacy
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {machine.scientificValue}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#07090E]/90 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explorer Callsign: {callsign || 'Explorer'}</span>
              </div>
              <p className="text-xs italic text-slate-200">
                &ldquo;{customNote || 'Exploring the forgotten frontier.'}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
