import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { EquipmentItem } from '../types/equipment';
import { getTrekTileUrl, TrekLayerKey, TREK_LAYERS } from '../services/nasaApi';

interface PlanetaryMap2DProps {
  layerKey: TrekLayerKey;
  items: EquipmentItem[];
  selectedItem: EquipmentItem | null;
  onSelectItem: (item: EquipmentItem) => void;
}

export function PlanetaryMap2D({
  layerKey,
  items,
  selectedItem,
  onSelectItem,
}: PlanetaryMap2DProps) {
  const [zoom, setZoom] = useState<number>(1); // z=1 (4x2 tiles) or z=2 (8x4 tiles)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setFading(true);
    const id = window.setTimeout(() => setFading(false), 180);
    return () => window.clearTimeout(id);
  }, [layerKey]);
  const draggingRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const cols = 2 * Math.pow(2, zoom);
  const rows = 1 * Math.pow(2, zoom);
  const mapWidth = zoom === 1 ? 880 : 1440;
  const mapHeight = mapWidth / 2;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    draggingRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current.active) return;
    const dx = e.clientX - draggingRef.current.startX;
    const dy = e.clientY - draggingRef.current.startY;
    setPan({
      x: Math.max(-600, Math.min(600, draggingRef.current.origX + dx)),
      y: Math.max(-320, Math.min(320, draggingRef.current.origY + dy)),
    });
  };

  const handlePointerUp = () => {
    draggingRef.current.active = false;
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-full w-full min-h-[460px] lg:min-h-[600px] overflow-hidden rounded-lg border border-slate-800 bg-[#05070C] select-none">
      {/* Top-Left Layer Credit */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 rounded-md border border-slate-800/90 bg-[#07090E]/90 px-3 py-2 text-xs">
        <div className="font-medium text-slate-200">
          2D Equirectangular · {TREK_LAYERS[layerKey].label}
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-slate-400">
          NASA Trek WMTS · Zoom Level {zoom} ({cols}×{rows} tiles)
        </div>
      </div>

      {/* Top-Right Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-md border border-slate-800 bg-[#0B0F18]/95 p-1">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2, z + 1))}
          disabled={zoom >= 2}
          aria-label="Zoom in map"
          className="rounded p-2 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(1, z - 1))}
          disabled={zoom <= 1}
          aria-label="Zoom out map"
          className="rounded p-2 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset map view"
          className="rounded p-2 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Draggable Equirectangular Canvas */}
      <div
        className="flex h-full w-full items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className={`relative shrink-0 transition-[transform,opacity] duration-200 ease-out border border-slate-800/80 shadow-2xl ${
            fading ? 'opacity-20' : 'opacity-100'
          }`}
          style={{
            width: `${mapWidth}px`,
            height: `${mapHeight}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* NASA Trek WMTS Tile Grid */}
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: rows }).map((_, y) =>
              Array.from({ length: cols }).map((__, x) => (
                <img
                  key={`${layerKey}-${zoom}-${x}-${y}`}
                  src={getTrekTileUrl(layerKey, zoom, x, y)}
                  alt=""
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover bg-[#111827]"
                />
              ))
            )}
          </div>

          {/* Equator & Prime Meridian Reference Lines */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-white/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-dashed border-white/20"
            aria-hidden="true"
          />

          {/* Hardware Markers projected via Equirectangular formulas */}
          {items.map((item) => {
            if (item.coordinates.lat === null || item.coordinates.lonSigned === null) {
              return null;
            }
            const leftPct = ((item.coordinates.lonSigned + 180) / 360) * 100;
            const topPct = ((90 - item.coordinates.lat) / 180) * 100;
            const isSelected = selectedItem?.id === item.id;

            const dotColor =
              item.status === 'active'
                ? 'bg-emerald-400 border-emerald-950'
                : item.status === 'crashed'
                  ? 'bg-rose-400 border-rose-950'
                  : item.status === 'inactive'
                    ? 'bg-amber-300 border-amber-950'
                    : 'bg-orange-400 border-orange-950';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item)}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                aria-label={`${item.name} (${item.mission})`}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-white rounded-full p-1`}
              >
                <span
                  className={`block rounded-full border-2 transition-transform ${dotColor} ${
                    isSelected ? 'h-4 w-4 scale-125 ring-2 ring-white' : 'h-3 w-3 group-hover:scale-125'
                  }`}
                />
                <span
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-[#07090E]/95 border border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-100 shadow ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity`}
                >
                  {item.mission}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded border border-slate-800/80 bg-[#07090E]/85 px-2.5 py-1 text-[11px] text-slate-400">
        Drag map to pan · Click any marker to inspect landing site &amp; coordinates
      </div>
    </div>
  );
}
