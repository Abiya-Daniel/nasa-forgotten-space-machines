import { useState, useMemo } from 'react';
import { Search, BookOpen, Shuffle, Heart, History } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import {
  EquipmentCategory,
  EquipmentItem,
  EquipmentStatus,
  FeaturedMachineId,
  PlanetaryBody,
} from '../types/equipment';
import { EquipmentCard } from '../components/EquipmentCard';
import { MachineAnatomyDiagram } from '../components/MachineAnatomyDiagram';
import { MachineComparisonPanel } from '../components/MachineComparisonPanel';
import { SpaceScaleComparison } from '../components/SpaceScaleComparison';
import { useExperience } from '../context/ExperienceContext';

interface MachinesPageProps {
  onSelectItem: (item: EquipmentItem) => void;
  onOpenFeaturedDossier: (id: FeaturedMachineId) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

const BODY_FILTERS: { id: 'all' | PlanetaryBody; label: string }[] = [
  { id: 'all', label: 'All Worlds' },
  { id: 'moon', label: 'The Moon' },
  { id: 'mars', label: 'Mars' },
  { id: 'deep-space', label: 'Deep Space' },
  { id: 'orbital', label: 'Orbital & Planetary' },
];

const STATUS_FILTERS: { id: 'all' | EquipmentStatus; label: string }[] = [
  { id: 'all', label: 'All Statuses' },
  { id: 'active', label: '● Active' },
  { id: 'travelling', label: '➤ Still Travelling' },
  { id: 'silent', label: '◈ Silent & Travelling' },
  { id: 'retired', label: '■ Retired' },
  { id: 'abandoned', label: '◆ Left Behind' },
  { id: 'inactive', label: '○ Inactive' },
  { id: 'crashed', label: '✕ Impacted / Lost' },
];

const AGENCY_FILTERS = [
  { id: 'all', label: 'All Agencies' },
  { id: 'NASA', label: 'NASA' },
  { id: 'ESA', label: 'ESA / Joint' },
  { id: 'Soviet', label: 'Soviet Program' },
];

const ERA_FILTERS = [
  { id: 'all', label: 'All Eras' },
  { id: 'early', label: '1960s–1970s' },
  { id: 'mid', label: '1980s–1990s' },
  { id: 'modern', label: '2000s–Present' },
];

const CATEGORY_FILTERS: { id: 'all' | EquipmentCategory; label: string }[] = [
  { id: 'all', label: 'All Types' },
  { id: 'rover', label: 'Rovers' },
  { id: 'lander', label: 'Landers' },
  { id: 'probe', label: 'Deep Space Probes' },
  { id: 'orbiter', label: 'Orbiters & Telescopes' },
  { id: 'descent-stage', label: 'Descent Stages' },
  { id: 'science-package', label: 'Science Stations' },
  { id: 'aircraft', label: 'Aircraft' },
  { id: 'impactor', label: 'Impactors' },
];

const ANATOMY_TABS: { id: FeaturedMachineId; label: string }[] = [
  { id: 'apollo-15-lrv1', label: 'Apollo 15 LRV-1' },
  { id: 'opportunity-mer-b', label: 'Opportunity Rover' },
  { id: 'insight-lander', label: 'InSight Lander' },
  { id: 'voyager-1', label: 'Voyager 1' },
];

function extractLaunchYear(dateStr: string): number {
  const match = dateStr.match(/\b(19\d\d|20\d\d)\b/);
  return match ? Number(match[1]) : 2000;
}

export function MachinesPage({
  onSelectItem,
  onOpenFeaturedDossier,
  onLocateOnMap,
}: MachinesPageProps) {
  const [bodyFilter, setBodyFilter] = useState<'all' | PlanetaryBody>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | EquipmentStatus>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [eraFilter, setEraFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | EquipmentCategory>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [anatomyMachine, setAnatomyMachine] =
    useState<FeaturedMachineId>('apollo-15-lrv1');

  const { favorites, exploredMachines } = useExperience();

  const recentItems = useMemo(
    () =>
      exploredMachines
        .map((id) => EQUIPMENT_DATA.find((e) => e.id === id))
        .filter((e): e is EquipmentItem => Boolean(e))
        .slice(0, 6),
    [exploredMachines]
  );

  const filteredItems = useMemo(() => {
    return EQUIPMENT_DATA.filter((item) => {
      if (bodyFilter !== 'all' && item.body !== bodyFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (favoritesOnly && !favorites.includes(item.id)) return false;

      if (categoryFilter !== 'all') {
        if (categoryFilter === 'orbiter') {
          if (item.category !== 'orbiter' && item.category !== 'telescope') return false;
        } else if (item.category !== categoryFilter) {
          return false;
        }
      }

      if (agencyFilter !== 'all') {
        if (agencyFilter === 'NASA' && item.agency !== 'NASA') return false;
        if (agencyFilter === 'ESA' && !item.agency.includes('ESA')) return false;
        if (agencyFilter === 'Soviet' && !item.agency.includes('Soviet')) return false;
      }

      if (eraFilter !== 'all') {
        const year = extractLaunchYear(item.launchDate);
        if (eraFilter === 'early' && year >= 1980) return false;
        if (eraFilter === 'mid' && (year < 1980 || year >= 2000)) return false;
        if (eraFilter === 'modern' && year < 2000) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.mission.toLowerCase().includes(q) ||
          item.coordinates.region.toLowerCase().includes(q) ||
          item.nssdcaId.toLowerCase().includes(q) ||
          item.missionPurpose.toLowerCase().includes(q) ||
          item.agency.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    bodyFilter,
    statusFilter,
    agencyFilter,
    eraFilter,
    categoryFilter,
    favoritesOnly,
    favorites,
    search,
  ]);

  const handleRandomMachine = () => {
    const pool = filteredItems.length > 0 ? filteredItems : EQUIPMENT_DATA;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (picked) {
      onSelectItem(picked);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-14">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Curated NASA &amp; International Hardware Catalog · {EQUIPMENT_DATA.length} Documented Spacecraft
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
            Space Machines, Engineering Anatomy &amp; Comparison
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
            Search lunar, Martian, orbital, and deep-space hardware, inspect interactive
            engineering diagrams and 3D models, bookmark favorites, or compare spacecraft side by side.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomMachine}
          className="inline-flex items-center gap-2 rounded-md border border-amber-400/60 bg-[#121826] px-4 py-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer shrink-0 self-start lg:self-auto"
        >
          <Shuffle className="w-4 h-4" />
          <span>Discover a Random Machine</span>
        </button>
      </div>

      {/* Recently Explored Strip */}
      {recentItems.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-[#0B0F18] px-4 py-3 flex flex-wrap items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-sky-400 shrink-0">
            <History className="w-3.5 h-3.5" />
            <span>Recently Explored:</span>
          </span>
          {recentItems.map((recent) => (
            <button
              key={recent.id}
              type="button"
              onClick={() => onSelectItem(recent)}
              className="rounded border border-slate-800 bg-[#07090E] px-2.5 py-1 text-slate-300 hover:border-amber-400 hover:text-white transition-colors cursor-pointer"
            >
              {recent.mission}
            </button>
          ))}
        </div>
      )}

      {/* Interactive Featured Anatomy Explorer */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-sky-400">
              Interactive Engineering Schematics &amp; 3D Models
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              Featured Machine Anatomy Explorer
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ANATOMY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAnatomyMachine(tab.id)}
                className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  anatomyMachine === tab.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onOpenFeaturedDossier(anatomyMachine)}
              className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/60 bg-[#0B1324] px-3 py-2 text-xs font-semibold text-sky-300 hover:border-sky-400 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open 12-Chapter Story</span>
            </button>
          </div>
        </div>

        <MachineAnatomyDiagram machineId={anatomyMachine} />
      </section>

      {/* Searchable Hardware Collection */}
      <section className="space-y-6">
        <div className="space-y-4 border-b border-slate-800 pb-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by planetary body">
              {BODY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setBodyFilter(f.id)}
                  className={`rounded-md px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    bodyFilter === f.id
                      ? 'bg-slate-100 text-slate-950'
                      : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFavoritesOnly((prev) => !prev)}
                aria-pressed={favoritesOnly}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  favoritesOnly
                    ? 'border-rose-400 bg-rose-950/50 text-rose-200'
                    : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
                }`}
              >
                <Heart className="w-3.5 h-3.5" fill={favoritesOnly ? 'currentColor' : 'none'} />
                <span>Favorites ({favorites.length})</span>
              </button>

              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mission, machine, NSSDCA ID..."
                  aria-label="Search space hardware collection"
                  className="w-full rounded-md border border-slate-800 bg-[#0B0F18] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Secondary Filter Row: Status + Agency + Era + Type */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by operational status">
              {STATUS_FILTERS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`rounded px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-sky-600 text-white'
                      : 'border border-slate-800/90 bg-[#0B0F18] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                aria-label="Filter by mission type"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'all' | EquipmentCategory)}
                className="rounded-md border border-slate-800 bg-[#0B0F18] px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {CATEGORY_FILTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by space agency"
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="rounded-md border border-slate-800 bg-[#0B0F18] px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {AGENCY_FILTERS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by launch era"
                value={eraFilter}
                onChange={(e) => setEraFilter(e.target.value)}
                className="rounded-md border border-slate-800 bg-[#0B0F18] px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {ERA_FILTERS.map((er) => (
                  <option key={er.id} value={er.id}>
                    {er.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>
            Showing {filteredItems.length} of {EQUIPMENT_DATA.length} documented spacecraft
          </span>
          {(bodyFilter !== 'all' ||
            statusFilter !== 'all' ||
            agencyFilter !== 'all' ||
            eraFilter !== 'all' ||
            categoryFilter !== 'all' ||
            favoritesOnly ||
            search.trim() !== '') && (
            <button
              type="button"
              onClick={() => {
                setBodyFilter('all');
                setStatusFilter('all');
                setAgencyFilter('all');
                setEraFilter('all');
                setCategoryFilter('all');
                setFavoritesOnly(false);
                setSearch('');
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-10 text-center text-sm text-slate-400">
            No spacecraft matched your active filters. Try clearing filters or toggling off Favorites Only.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onLocateOnMap={onLocateOnMap}
              />
            ))}
          </div>
        )}
      </section>

      {/* Side-by-Side Comparison Matrix */}
      <MachineComparisonPanel />

      {/* Engineering Scale & Distance Visualizer */}
      <SpaceScaleComparison />
    </div>
  );
}
