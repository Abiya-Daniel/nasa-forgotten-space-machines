import { useState, useMemo } from 'react';
import { ExternalLink, MapPin, Compass, BookOpen } from 'lucide-react';
import { EQUIPMENT_DATA, TIMELINE_EVENTS } from '../data/equipmentData';
import { EquipmentItem, PlanetaryBody } from '../types/equipment';
import { ZoomableNasaImage } from '../components/ZoomableNasaImage';
import { StatusIndicator } from '../components/StatusIndicator';

interface TimelinePageProps {
  onOpenStoryModal: (item: EquipmentItem) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

export function TimelinePage({
  onOpenStoryModal,
  onLocateOnMap,
}: TimelinePageProps) {
  const [bodyFilter, setBodyFilter] = useState<'all' | PlanetaryBody>('all');
  const [activeId, setActiveId] = useState<string>(TIMELINE_EVENTS[3].id);

  const events = useMemo(() => {
    return TIMELINE_EVENTS.filter(
      (ev) => bodyFilter === 'all' || ev.body === bodyFilter
    );
  }, [bodyFilter]);

  const activeEvent = useMemo(
    () => events.find((e) => e.id === activeId) || events[0],
    [events, activeId]
  );

  const linkedEquipment = useMemo(
    () => EQUIPMENT_DATA.find((eq) => eq.id === activeEvent?.equipmentId) || null,
    [activeEvent]
  );

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-6">
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            1964 – Present · Six Decades of Space Exploration Hardware
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
            Interactive Mission Timeline
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Select any milestone along the chronological rail to read its objectives, breakthroughs, and what hardware remained on the Moon, Mars, or deep space.
          </p>
        </div>

        <div
          className="inline-flex flex-wrap rounded-md border border-slate-800 bg-[#0B0F18] p-1 self-start"
          role="group"
          aria-label="Filter timeline by destination"
        >
          {(
            [
              { id: 'all', label: 'All Missions' },
              { id: 'moon', label: 'Moon' },
              { id: 'mars', label: 'Mars' },
              { id: 'deep-space', label: 'Deep Space' },
              { id: 'orbital', label: 'Orbital & Planetary' },
            ] as { id: 'all' | PlanetaryBody; label: string }[]
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setBodyFilter(f.id)}
              className={`rounded px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                bodyFilter === f.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Chronological Rail */}
        <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-2">
          {events.map((ev) => {
            const isSelected = activeEvent?.id === ev.id;
            return (
              <button
                key={ev.id}
                type="button"
                onClick={() => setActiveId(ev.id)}
                className={`w-full text-left rounded-lg border p-4 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-[#111726]'
                    : 'border-slate-800/90 bg-[#0B0F18] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono tabular-nums font-semibold text-amber-400">
                    {ev.dateLabel}
                  </span>
                  <span className="font-mono text-sky-400 uppercase">
                    {ev.body}
                  </span>
                </div>
                <div className="mt-1 text-sm font-bold text-slate-100">
                  {ev.mission} — {ev.title}
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {ev.equipmentLeft}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Active Story Panel */}
        <div className="lg:col-span-7">
          {activeEvent && linkedEquipment && (
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] overflow-hidden">
              <ZoomableNasaImage
                src={linkedEquipment.photo.imageUrl}
                fallbackSrc={linkedEquipment.photo.fallbackUrl}
                alt={linkedEquipment.photo.title}
                caption={linkedEquipment.photo.title}
                credit={linkedEquipment.photo.credit}
                sourceUrl={linkedEquipment.photo.sourceUrl}
                nasaId={linkedEquipment.photo.nasaId}
                aspectClassName="aspect-[16/9] w-full"
              />
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-mono text-amber-400 font-semibold">
                      {activeEvent.dateLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeEvent.mission}</span>
                    <span aria-hidden="true">·</span>
                    <StatusIndicator status={linkedEquipment.status} />
                  </div>
                  <a
                    href={linkedEquipment.nssdcaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-slate-300 hover:text-amber-400"
                  >
                    <span>NSSDCA {activeEvent.nssdcaId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h2 className="text-2xl font-bold text-slate-100">
                  {activeEvent.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-800/80 py-4 text-sm">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Mission Objective
                    </h3>
                    <p className="mt-1.5 text-slate-200 leading-relaxed">
                      {activeEvent.objective}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Major Achievement
                    </h3>
                    <p className="mt-1.5 text-slate-200 leading-relaxed">
                      {activeEvent.achievement}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Spacecraft / Hardware Legacy
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                    {activeEvent.equipmentLeft}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenStoryModal(linkedEquipment)}
                    className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {linkedEquipment.featuredStoryId
                        ? 'Open 12-Chapter Story'
                        : 'Read Hardware Dossier'}
                    </span>
                  </button>
                  {linkedEquipment.body !== 'orbital' && (
                    <button
                      type="button"
                      onClick={() => onLocateOnMap(linkedEquipment)}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#0D111A] px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {linkedEquipment.body === 'deep-space' ? (
                        <Compass className="w-4 h-4 text-sky-400" />
                      ) : (
                        <MapPin className="w-4 h-4 text-amber-400" />
                      )}
                      <span>
                        {linkedEquipment.body === 'deep-space'
                          ? 'View Deep Space Trajectory'
                          : 'Locate on Planetary Map'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
