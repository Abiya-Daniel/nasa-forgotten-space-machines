import { useState, useRef } from 'react';
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { PANORAMA_SCENES } from '../data/museumExperiencesData';

export function PanoramaViewer() {
  const [sceneId, setSceneId] = useState<string>(PANORAMA_SCENES[0].id);
  const [zoom, setZoom] = useState<number>(1.35);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(
    PANORAMA_SCENES[0].hotspots[0].id
  );
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; scrollLeft: number }>({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  const scene =
    PANORAMA_SCENES.find((s) => s.id === sceneId) || PANORAMA_SCENES[0];
  const activeHotspot =
    scene.hotspots.find((h) => h.id === selectedHotspotId) || scene.hotspots[0];

  const handleSelectScene = (id: string) => {
    const next = PANORAMA_SCENES.find((s) => s.id === id) || PANORAMA_SCENES[0];
    setSceneId(next.id);
    setSelectedHotspotId(next.hotspots[0].id);
    setZoom(1.35);
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
    }
  };

  const panBy = (deltaPx: number) => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollBy({ left: deltaPx, behavior: 'smooth' });
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Eye className="w-4 h-4" />
            <span>Interactive Wide-Field Surface Explorer · Authentic NASA Imagery</span>
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-100">
            Lunar &amp; Martian Surface Panorama Viewer
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Drag horizontally, pan with arrows, or zoom inside authentic NASA Apollo,
            Opportunity, and Perseverance surface views. Click numbered landmarks to
            inspect geological formations and resting hardware.
          </p>
        </div>
      </div>

      {/* Scene Picker */}
      <div className="flex flex-wrap gap-2">
        {PANORAMA_SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelectScene(s.id)}
            className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              s.id === scene.id
                ? 'bg-amber-500 text-slate-950'
                : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
            }`}
          >
            {s.world}: {s.title}
          </button>
        ))}
      </div>

      {/* Panorama Stage + Landmark Inspector */}
      <div className="rounded-lg border border-slate-800 bg-[#0B0F18] overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#07090E] px-4 py-3 text-xs">
          <div>
            <span className="font-mono text-sky-400">
              Authentic NASA Surface Photograph · ID: {scene.nasaId}
            </span>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5">{scene.title}</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => panBy(-220)}
              aria-label="Pan left across surface"
              className="rounded border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-amber-400 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => panBy(220)}
              aria-label="Pan right across surface"
              className="rounded border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-amber-400 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(2))))}
              aria-label="Zoom out panorama"
              className="rounded border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-amber-400 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 px-1.5 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.2, Number((z + 0.2).toFixed(2))))}
              aria-label="Zoom in panorama"
              className="rounded border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-amber-400 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSelectScene(scene.id)}
              aria-label="Reset panorama view"
              className="rounded border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-amber-400 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Pan Viewport */}
        <div
          ref={viewportRef}
          onMouseDown={(e) => {
            if (!viewportRef.current) return;
            dragRef.current = {
              active: true,
              startX: e.pageX - viewportRef.current.offsetLeft,
              scrollLeft: viewportRef.current.scrollLeft,
            };
          }}
          onMouseMove={(e) => {
            if (!dragRef.current.active || !viewportRef.current) return;
            e.preventDefault();
            const x = e.pageX - viewportRef.current.offsetLeft;
            const walk = (x - dragRef.current.startX) * 1.4;
            viewportRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
          }}
          onMouseUp={() => {
            dragRef.current.active = false;
          }}
          onMouseLeave={() => {
            dragRef.current.active = false;
          }}
          className="relative w-full overflow-x-auto bg-black select-none cursor-grab active:cursor-grabbing"
        >
          <div
            className="relative h-[340px] sm:h-[420px] transition-[width] duration-200"
            style={{ width: `${Math.round(zoom * 100)}%`, minWidth: '100%' }}
          >
            <img
              src={scene.imageUrl}
              alt={scene.title}
              referrerPolicy="no-referrer"
              draggable={false}
              className="h-full w-full object-cover"
            />

            {scene.hotspots.map((hs, index) => {
              const isSelected = hs.id === activeHotspot.id;
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspotId(hs.id);
                  }}
                  style={{ left: `${hs.xPct}%`, top: `${hs.yPct}%` }}
                  aria-label={`Inspect landmark ${hs.label}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-bold shadow-lg transition-transform cursor-pointer ${
                    isSelected
                      ? 'scale-110 border-white bg-amber-500 text-slate-950'
                      : 'border-amber-400 bg-[#07090E]/90 text-amber-300 hover:scale-105'
                  }`}
                >
                  <span>0{index + 1}</span>
                  <span className="hidden sm:inline font-sans font-semibold">
                    {hs.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Landmark Details & Credits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 border-t border-slate-800">
          <div className="lg:col-span-7 space-y-2">
            <div className="text-xs font-mono text-sky-400">
              {scene.mission} · {scene.dateLabel}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{scene.description}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
              <span>Credit: {scene.credit}</span>
              <a
                href={scene.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:underline"
              >
                <span>Open Full NASA Record</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeHotspot.featureType}</span>
            </div>
            <h4 className="text-base font-bold text-slate-100">
              {activeHotspot.label}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeHotspot.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
