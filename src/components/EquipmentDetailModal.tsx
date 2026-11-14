import { useState, useEffect } from 'react';
import { X, ExternalLink, MapPin, Compass, BookOpen, Volume2, Heart } from 'lucide-react';
import { EquipmentItem, FeaturedMachineId } from '../types/equipment';
import { ZoomableNasaImage } from './ZoomableNasaImage';
import { StatusIndicator } from './StatusIndicator';
import { useExperience } from '../context/ExperienceContext';
import { AskThisMachinePanel } from './AskThisMachinePanel';

interface EquipmentDetailModalProps {
  item: EquipmentItem | null;
  onClose: () => void;
  onViewOnMap?: (item: EquipmentItem) => void;
  onOpenFeaturedDossier?: (id: FeaturedMachineId) => void;
}

type StoryTab = 'purpose' | 'why' | 'science' | 'future' | 'engineering';

export function formatCoord(item: EquipmentItem): string {
  if (item.body === 'deep-space') {
    return item.distanceTravelledOrFromEarth || 'Interstellar Trajectory';
  }
  if (item.body === 'orbital') {
    return item.coordinates.region || 'Orbital / Planetary System';
  }
  const { lat, lonEast, precision } = item.coordinates;
  if (lat === null || lonEast === null) return 'Unknown location';
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${lonEast.toFixed(2)}° E`;
  const prefix = precision === 'approximate' ? '~' : '';
  return `${prefix}${latStr}, ${prefix}${lonStr}`;
}

export function EquipmentDetailModal({
  item,
  onClose,
  onViewOnMap,
  onOpenFeaturedDossier,
}: EquipmentDetailModalProps) {
  const [tab, setTab] = useState<StoryTab>('purpose');
  const {
    startMachineNarration,
    favorites,
    toggleFavorite,
    recordExploredMachine,
  } = useExperience();

  useEffect(() => {
    setTab('purpose');
    if (item?.id) {
      recordExploredMachine(item.id);
    }
  }, [item?.id, recordExploredMachine]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;

  const isFavorite = favorites.includes(item.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-equipment-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-800 bg-[#0B0F18] text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-[#0B0F18]/95 px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono">{item.mission}</span>
              <span aria-hidden="true">·</span>
              <span>{item.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <StatusIndicator status={item.status} />
            </div>
            <h2
              id="modal-equipment-title"
              className="mt-1 text-lg sm:text-xl font-bold text-slate-100"
            >
              {item.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleFavorite(item.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-pressed={isFavorite}
              className={`rounded-md border p-2 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer transition-colors ${
                isFavorite
                  ? 'border-rose-400/70 bg-rose-950/60 text-rose-300'
                  : 'border-slate-800 bg-[#111827] text-slate-300 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close detail view"
              className="rounded-md border border-slate-800 bg-[#111827] p-2 text-slate-300 hover:text-white hover:border-slate-700 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {item.featuredStoryId && onOpenFeaturedDossier && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-500/40 bg-[#111728] px-4 py-3 text-xs">
              <div>
                <span className="font-mono text-amber-400 font-semibold">
                  Featured Spacecraft
                </span>
                <p className="text-slate-300 mt-0.5">
                  Includes a full 12-chapter documentary, audio narration, 3D model, and interactive engineering diagram.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startMachineNarration(item.featuredStoryId!, 0)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs font-medium text-sky-300 hover:border-sky-500 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const storyId = item.featuredStoryId!;
                    onClose();
                    onOpenFeaturedDossier(storyId);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open 12-Chapter Dossier</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-md overflow-hidden border border-slate-800 bg-[#07090E] flex flex-col">
              <ZoomableNasaImage
                src={item.photo.imageUrl}
                fallbackSrc={item.photo.fallbackUrl}
                alt={item.photo.title}
                caption={item.photo.title}
                credit={item.photo.credit}
                sourceUrl={item.photo.sourceUrl}
                nasaId={item.photo.nasaId}
                aspectClassName="aspect-[4/3] w-full"
              />
              <div className="p-3 text-xs text-slate-400 border-t border-slate-800/80 space-y-1">
                <div className="font-mono text-[11px] text-sky-400">
                  Authentic NASA Photograph · ID: {item.photo.nasaId}
                </div>
                <p className="text-slate-200 font-medium">{item.photo.title}</p>
                <p>Credit: {item.photo.credit}</p>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs border border-slate-800 rounded-md p-4 bg-[#0D1320]">
                <div>
                  <dt className="text-slate-400">Launch Date</dt>
                  <dd className="mt-0.5 font-mono tabular-nums text-slate-100">
                    {item.launchDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">
                    {item.body === 'deep-space' || item.body === 'orbital'
                      ? 'Arrival / Encounter'
                      : 'Landing / Arrival'}
                  </dt>
                  <dd className="mt-0.5 font-mono tabular-nums text-slate-100">
                    {item.landingDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">NSSDCA ID</dt>
                  <dd className="mt-0.5 font-mono tabular-nums text-amber-400">
                    <a
                      href={item.nssdcaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {item.nssdcaId}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Agency</dt>
                  <dd className="mt-0.5 text-slate-100">{item.agency}</dd>
                </div>

                {item.massKg && (
                  <div>
                    <dt className="text-slate-400">Mass</dt>
                    <dd className="mt-0.5 font-mono tabular-nums text-slate-200">
                      {item.massKg}
                    </dd>
                  </div>
                )}

                {(item.missionDuration || item.endDate) && (
                  <div>
                    <dt className="text-slate-400">Duration / End</dt>
                    <dd className="mt-0.5 font-mono tabular-nums text-slate-200">
                      {item.missionDuration || item.endDate}
                    </dd>
                  </div>
                )}

                {item.powerSource && (
                  <div className="col-span-2">
                    <dt className="text-slate-400">Power Source</dt>
                    <dd className="mt-0.5 text-slate-200">{item.powerSource}</dd>
                  </div>
                )}

                {item.distanceTravelledOrFromEarth && (
                  <div className="col-span-2">
                    <dt className="text-slate-400">
                      Distance / Traverse
                      {item.lastCheckedDate ? ` (Checked ${item.lastCheckedDate})` : ''}
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums text-sky-300">
                      {item.distanceTravelledOrFromEarth}
                    </dd>
                  </div>
                )}

                <div className="col-span-2 pt-2 border-t border-slate-800/80">
                  <dt className="text-slate-400">
                    {item.body === 'deep-space' || item.body === 'orbital'
                      ? 'Orbital / Trajectory Region'
                      : `Location (${item.coordinates.precision === 'verified' ? 'Verified' : 'Approximate'})`}
                  </dt>
                  <dd className="mt-0.5 text-slate-100 font-medium">
                    {item.coordinates.region}
                  </dd>
                  {item.body !== 'deep-space' && item.body !== 'orbital' && (
                    <dd className="mt-0.5 font-mono tabular-nums text-slate-300">
                      {formatCoord(item)}
                    </dd>
                  )}
                  <dd className="mt-1 text-[11px] text-slate-400">
                    Source: {item.coordinates.source}
                  </dd>
                </div>
              </dl>

              {onViewOnMap && item.body !== 'orbital' && (
                <button
                  type="button"
                  onClick={() => onViewOnMap(item)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  {item.body === 'deep-space' ? (
                    <Compass className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span>
                    {item.body === 'deep-space'
                      ? 'View Deep Space Trajectory'
                      : 'Locate on Planetary Map'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Story Tabs */}
          <div>
            <div
              className="flex flex-wrap gap-1 border-b border-slate-800 pb-2"
              role="tablist"
              aria-label="Mission narrative sections"
            >
              {(
                [
                  { id: 'purpose', label: 'Purpose & Achievements' },
                  { id: 'why', label: 'Mission End / Why Left' },
                  { id: 'science', label: 'Scientific Value' },
                  { id: 'future', label: 'Future Encounters' },
                  { id: 'engineering', label: 'Instruments & Challenges' },
                ] as { id: StoryTab; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    tab === t.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm leading-relaxed text-slate-300 space-y-3">
              {tab === 'purpose' && (
                <>
                  <p>{item.missionPurpose}</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    {item.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </>
              )}
              {tab === 'why' && <p>{item.whyLeftBehind}</p>}
              {tab === 'science' && <p>{item.scientificValue}</p>}
              {tab === 'future' && <p>{item.futureEncounters}</p>}
              {tab === 'engineering' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded border border-slate-800 bg-[#07090E] p-3">
                      <span className="font-mono text-sky-400 block">Design Lifetime</span>
                      <span className="text-slate-200 mt-1 block">
                        {item.designLifetime || 'Mission-specific design profile'}
                      </span>
                    </div>
                    <div className="rounded border border-slate-800 bg-[#07090E] p-3">
                      <span className="font-mono text-sky-400 block">Communication System</span>
                      <span className="text-slate-200 mt-1 block">
                        {item.communicationSystem || 'Deep Space Network S/X-Band Telemetry'}
                      </span>
                    </div>
                  </div>
                  {item.scientificInstruments && item.scientificInstruments.length > 0 && (
                    <div className="rounded border border-slate-800 bg-[#07090E] p-3 text-xs">
                      <span className="font-mono text-amber-400 block mb-1.5">
                        Key Scientific Instruments
                      </span>
                      <p className="text-slate-200">
                        {item.scientificInstruments.join(' · ')}
                      </p>
                    </div>
                  )}
                  {item.missionChallenges && (
                    <div className="rounded border border-slate-800 bg-[#07090E] p-3 text-xs">
                      <span className="font-mono text-amber-400 block mb-1">
                        Engineering &amp; Environmental Challenges
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {item.missionChallenges}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ask This Machine & Explain Level */}
          <AskThisMachinePanel item={item} />

          {/* Official References */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verified Sources &amp; Catalog Links
            </h3>
            <div className="mt-2 flex flex-wrap gap-4">
              {item.references.map((ref) => (
                <a
                  key={ref.url}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:underline"
                >
                  <span>{ref.label}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
