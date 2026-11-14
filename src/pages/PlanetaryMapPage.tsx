import { useState, useMemo, useEffect } from 'react';
import { Globe, Map as MapIcon, Compass, ExternalLink, BookOpen } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import {
  EquipmentCategory,
  EquipmentItem,
} from '../types/equipment';
import { TrekLayerKey } from '../services/nasaApi';
import { PlanetaryGlobe3D } from '../components/PlanetaryGlobe3D';
import { PlanetaryMap2D } from '../components/PlanetaryMap2D';
import { DeepSpaceTrajectoryMap } from '../components/DeepSpaceTrajectoryMap';
import { NasaImage } from '../components/NasaImage';
import { StatusIndicator } from '../components/StatusIndicator';
import { formatCoord } from '../components/EquipmentDetailModal';

interface PlanetaryMapPageProps {
  initialItem: EquipmentItem | null;
  onOpenStoryModal: (item: EquipmentItem) => void;
}

const CATEGORY_OPTIONS: { id: 'all' | EquipmentCategory; label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'descent-stage', label: 'Descent Stages' },
  { id: 'rover', label: 'Rovers' },
  { id: 'lander', label: 'Landers' },
  { id: 'science-package', label: 'Science Stations' },
  { id: 'impactor', label: 'Impactors' },
  { id: 'aircraft', label: 'Aircraft' },
];

export function PlanetaryMapPage({
  initialItem,
  onOpenStoryModal,
}: PlanetaryMapPageProps) {
  const initialSurfaceBody: 'moon' | 'mars' =
    initialItem && (initialItem.body === 'moon' || initialItem.body === 'mars')
      ? initialItem.body
      : 'moon';

  const [body, setBody] = useState<'moon' | 'mars'>(initialSurfaceBody);
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'routes'>(
    initialItem?.body === 'deep-space' ? 'routes' : '3d'
  );
  const [marsLayer, setMarsLayer] = useState<'mars-viking' | 'mars-mola'>('mars-viking');
  const [categoryFilter, setCategoryFilter] = useState<'all' | EquipmentCategory>('all');
  const [missionFilter, setMissionFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(
    (initialItem && (initialItem.body === 'moon' || initialItem.body === 'mars')
      ? initialItem
      : EQUIPMENT_DATA.find((i) => i.body === 'moon')) || null
  );

  useEffect(() => {
    if (initialItem) {
      if (initialItem.body === 'deep-space') {
        setViewMode('routes');
      } else if (initialItem.body === 'moon' || initialItem.body === 'mars') {
        setBody(initialItem.body);
        setSelectedItem(initialItem);
        setViewMode((prev) => (prev === 'routes' ? '3d' : prev));
        setCategoryFilter('all');
        setMissionFilter('all');
      }
    }
  }, [initialItem]);

  const bodyItems = useMemo(
    () => EQUIPMENT_DATA.filter((item) => item.body === body),
    [body]
  );

  const missionOptions = useMemo(() => {
    return Array.from(new Set(bodyItems.map((i) => i.mission)));
  }, [bodyItems]);

  const filteredItems = useMemo(() => {
    return bodyItems.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (missionFilter !== 'all' && item.mission !== missionFilter) return false;
      return true;
    });
  }, [bodyItems, categoryFilter, missionFilter]);

  const activeLayerKey: TrekLayerKey =
    body === 'moon' ? 'moon-lro' : marsLayer;

  const handleSwitchBody = (nextBody: 'moon' | 'mars') => {
    setBody(nextBody);
    if (viewMode === 'routes') setViewMode('3d');
    setCategoryFilter('all');
    setMissionFilter('all');
    const first = EQUIPMENT_DATA.find((i) => i.body === nextBody) || null;
    setSelectedItem(first);
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header & Global Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between pb-6 border-b border-slate-800">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Interactive Planetary Atlas · NASA Trek WMTS + NSSDCA Coordinates
          </p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-100">
            Interactive Moon, Mars &amp; Deep Space Atlas
          </h1>
        </div>

        {/* Body Switcher + 3D/2D/Routes Toggle + Mars Base Layer */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex rounded-md border border-slate-800 bg-[#0B0F18] p-1"
            role="group"
            aria-label="Select planetary body"
          >
            <button
              type="button"
              onClick={() => handleSwitchBody('moon')}
              className={`rounded px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode !== 'routes' && body === 'moon'
                  ? 'bg-slate-100 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              The Moon ({EQUIPMENT_DATA.filter((i) => i.body === 'moon').length})
            </button>
            <button
              type="button"
              onClick={() => handleSwitchBody('mars')}
              className={`rounded px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode !== 'routes' && body === 'mars'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mars ({EQUIPMENT_DATA.filter((i) => i.body === 'mars').length})
            </button>
          </div>

          <div
            className="inline-flex rounded-md border border-slate-800 bg-[#0B0F18] p-1"
            role="group"
            aria-label="Select map projection"
          >
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('2d')}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>2D Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('routes')}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === 'routes'
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Deep Space Routes</span>
            </button>
          </div>

          {viewMode !== 'routes' && body === 'mars' && (
            <select
              aria-label="Mars orbital base layer"
              value={marsLayer}
              onChange={(e) =>
                setMarsLayer(e.target.value as 'mars-viking' | 'mars-mola')
              }
              className="rounded-md border border-slate-800 bg-[#0B0F18] px-3 py-2 text-xs font-medium text-slate-200 focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="mars-viking">Layer: Viking Color Mosaic</option>
              <option value="mars-mola">Layer: MGS MOLA Elevation</option>
            </select>
          )}
        </div>
      </div>

      {viewMode === 'routes' ? (
        <div className="mt-6 space-y-6">
          <DeepSpaceTrajectoryMap />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EQUIPMENT_DATA.filter((i) => i.body === 'deep-space').map((probe) => (
              <div
                key={probe.id}
                className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-sky-400">{probe.mission}</span>
                    <StatusIndicator status={probe.status} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100">{probe.name}</h3>
                  <p className="font-mono text-xs text-amber-300">
                    {probe.distanceTravelledOrFromEarth}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenStoryModal(probe)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs font-semibold text-slate-200 hover:border-amber-400 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open Probe Story</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter map markers by equipment type">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategoryFilter(opt.id)}
                  className={`rounded px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === opt.id
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'border border-slate-800/90 bg-[#0B0F18] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="mission-select" className="text-xs text-slate-400">
                Mission:
              </label>
              <select
                id="mission-select"
                value={missionFilter}
                onChange={(e) => setMissionFilter(e.target.value)}
                className="rounded-md border border-slate-800 bg-[#0B0F18] px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="all">All Missions ({bodyItems.length})</option>
                {missionOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Asymmetric Split Console: Viewport + Inspector/List */}
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-8 transition-opacity duration-300">
              {viewMode === '3d' ? (
                <PlanetaryGlobe3D
                  body={body}
                  layerKey={activeLayerKey}
                  items={filteredItems}
                  selectedItem={selectedItem}
                  onSelectItem={setSelectedItem}
                />
              ) : (
                <PlanetaryMap2D
                  layerKey={activeLayerKey}
                  items={filteredItems}
                  selectedItem={selectedItem}
                  onSelectItem={setSelectedItem}
                />
              )}
            </div>

            <aside
              key={body}
              className="lg:col-span-4 flex flex-col gap-4 animate-[fadeIn_240ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none"
            >
              {selectedItem ? (
                <div className="rounded-lg border border-slate-800 bg-[#0B0F18] overflow-hidden">
                  <NasaImage
                    src={selectedItem.photo.imageUrl}
                    fallbackSrc={selectedItem.photo.fallbackUrl}
                    alt={selectedItem.photo.title}
                    aspectClassName="aspect-[16/9] w-full"
                  />
                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-slate-300">
                        {selectedItem.mission}
                      </span>
                      <StatusIndicator status={selectedItem.status} />
                    </div>

                    <h2 className="text-base font-bold text-slate-100 leading-snug">
                      {selectedItem.name}
                    </h2>

                    <div className="rounded-md border border-slate-800 bg-[#07090E] p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Region</span>
                        <span className="text-slate-200 font-medium text-right">
                          {selectedItem.coordinates.region}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Coordinates</span>
                        <span className="font-mono tabular-nums text-slate-100">
                          {formatCoord(selectedItem)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Precision</span>
                        <span
                          className={
                            selectedItem.coordinates.precision === 'verified'
                              ? 'text-emerald-400'
                              : 'text-amber-300'
                          }
                        >
                          {selectedItem.coordinates.precision === 'verified'
                            ? 'Verified Orbital / Catalog'
                            : 'Approximate Target Zone'}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                        Source: {selectedItem.coordinates.source}
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300 line-clamp-3">
                      {selectedItem.whyLeftBehind}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onOpenStoryModal(selectedItem)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Full Mission Story</span>
                      </button>
                      <a
                        href={selectedItem.nssdcaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-2 text-xs font-mono text-slate-300 hover:border-slate-500 hover:text-white"
                      >
                        <span>NSSDCA</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-5 text-xs text-slate-400">
                  Select a marker on the map or choose a site below.
                </div>
              )}

              <div className="flex-1 rounded-lg border border-slate-800 bg-[#0B0F18] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Documented Sites ({filteredItems.length})
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    Click to fly
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                  {filteredItems.map((item) => {
                    const active = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          active
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="truncate font-medium">{item.mission}</span>
                        <span className="font-mono text-[11px] text-slate-400 shrink-0 tabular-nums">
                          {formatCoord(item)}
                        </span>
                      </button>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      No sites match these filters.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
