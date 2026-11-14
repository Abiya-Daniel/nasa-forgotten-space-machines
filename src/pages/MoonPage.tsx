import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentCategory, EquipmentItem } from '../types/equipment';
import { EquipmentCard } from '../components/EquipmentCard';

interface MoonPageProps {
  onSelectItem: (item: EquipmentItem) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

const MOON_FILTERS: { id: 'all' | EquipmentCategory; label: string }[] = [
  { id: 'all', label: 'All Lunar Hardware' },
  { id: 'descent-stage', label: 'LM Descent Stages' },
  { id: 'rover', label: 'Lunar Roving Vehicles' },
  { id: 'lander', label: 'Surveyor Landers' },
  { id: 'science-package', label: 'ALSEP & Retroreflectors' },
  { id: 'impactor', label: 'Impact Probes' },
];

export function MoonPage({ onSelectItem, onLocateOnMap }: MoonPageProps) {
  const [category, setCategory] = useState<'all' | EquipmentCategory>('all');
  const [search, setSearch] = useState('');

  const moonItems = useMemo(() => {
    return EQUIPMENT_DATA.filter((item) => {
      if (item.body !== 'moon') return false;
      if (category !== 'all' && item.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.mission.toLowerCase().includes(q) ||
          item.coordinates.region.toLowerCase().includes(q) ||
          item.nssdcaId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, search]);

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Lunar Archaeological Archive · NSSDCA &amp; LRO Verified Sites
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
          Explore the Moon
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          From the robotic Surveyor scouts of 1966–1968 to the six crewed Apollo
          Lunar Module descent stages, three electric Lunar Roving Vehicles, and
          deep-shadow impactors like LCROSS, human machinery remains preserved in
          the airless lunar vacuum.
        </p>
      </div>

      {/* Interactive Filter Toolbar */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Lunar hardware categories">
          {MOON_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCategory(f.id)}
              className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                category === f.id
                  ? 'bg-slate-100 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by mission, region, ID..."
            aria-label="Search lunar equipment"
            className="w-full rounded-md border border-slate-800 bg-[#0B0F18] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Results Grid */}
      {moonItems.length === 0 ? (
        <div className="mt-10 rounded-lg border border-slate-800 bg-[#0B0F18] p-10 text-center text-sm text-slate-400">
          No lunar equipment matched your filter. Try clearing the search box or
          selecting &ldquo;All Lunar Hardware&rdquo;.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {moonItems.map((item) => (
            <EquipmentCard
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onLocateOnMap={onLocateOnMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
