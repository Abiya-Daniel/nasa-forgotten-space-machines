import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem, EquipmentStatus } from '../types/equipment';
import { EquipmentCard } from '../components/EquipmentCard';

interface MarsPageProps {
  onSelectItem: (item: EquipmentItem) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

const STATUS_FILTERS: { id: 'all' | EquipmentStatus; label: string }[] = [
  { id: 'all', label: 'All Hardware' },
  { id: 'active', label: '● Active' },
  { id: 'retired', label: '■ Retired' },
  { id: 'inactive', label: '○ Inactive' },
  { id: 'crashed', label: '✕ Crashed' },
];

export function MarsPage({ onSelectItem, onLocateOnMap }: MarsPageProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | EquipmentStatus>('all');
  const [search, setSearch] = useState('');

  const marsItems = useMemo(() => {
    return EQUIPMENT_DATA.filter((item) => {
      if (item.body !== 'mars') return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
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
  }, [statusFilter, search]);

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-orange-400">
          Martian Surface Catalog · NSSDCA &amp; MRO HiRISE Verified
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
          Explore Mars
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          Mars hosts a diverse lineage of human machines—some still actively
          exploring (Curiosity and Perseverance, alongside their discarded entry
          hardware), retired legends (Viking, Sojourner, Spirit, Opportunity,
          Phoenix, InSight, Ingenuity), and lost or crashed probes.
        </p>
      </div>

      {/* Status Distinction Guide */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4 border border-slate-800/90 rounded-lg bg-[#0B0F18] p-4 text-xs">
        <div>
          <span className="font-mono font-semibold text-emerald-400">● Active</span>
          <p className="mt-1 text-slate-400">
            Rover operating today (accompanied by abandoned sky crane/heat shield hardware).
          </p>
        </div>
        <div>
          <span className="font-mono font-semibold text-slate-300">■ Retired</span>
          <p className="mt-1 text-slate-400">
            Completed primary or extended missions before power or rotor end-of-life.
          </p>
        </div>
        <div>
          <span className="font-mono font-semibold text-amber-300">○ Inactive</span>
          <p className="mt-1 text-slate-400">
            Landed intact on the surface without establishing post-landing communication.
          </p>
        </div>
        <div>
          <span className="font-mono font-semibold text-rose-400">✕ Crashed</span>
          <p className="mt-1 text-slate-400">
            Impacted at high speed due to entry, descent, or landing anomalies.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter Mars hardware by status">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-orange-600 text-white'
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
            placeholder="Filter by rover, crater, ID..."
            aria-label="Search Mars equipment"
            className="w-full rounded-md border border-slate-800 bg-[#0B0F18] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Results Grid */}
      {marsItems.length === 0 ? (
        <div className="mt-10 rounded-lg border border-slate-800 bg-[#0B0F18] p-10 text-center text-sm text-slate-400">
          No Mars equipment matched your filter.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {marsItems.map((item) => (
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
