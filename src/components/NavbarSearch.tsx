import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, BookOpen, X } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem } from '../types/equipment';
import { StatusIndicator } from './StatusIndicator';

interface NavbarSearchProps {
  onSelectDetails: (item: EquipmentItem) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
  autoFocus?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export function NavbarSearch({
  onSelectDetails,
  onLocateOnMap,
  autoFocus = false,
  onCloseMobile,
  className = '',
}: NavbarSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return EQUIPMENT_DATA.filter((item) => {
      const planetKeywords =
        item.body === 'moon' ? 'moon lunar' : 'mars martian red planet';
      return (
        item.name.toLowerCase().includes(q) ||
        item.mission.toLowerCase().includes(q) ||
        planetKeywords.includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.coordinates.region.toLowerCase().includes(q) ||
        item.nssdcaId.toLowerCase().includes(q)
      );
    }).slice(0, 7);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [matches.length, query]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // '/' keyboard shortcut on desktop when not typing in another field
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (inputRef.current && inputRef.current.offsetParent !== null) {
        e.preventDefault();
        inputRef.current.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const chooseDetails = (item: EquipmentItem) => {
    setOpen(false);
    setQuery('');
    onCloseMobile?.();
    onSelectDetails(item);
  };

  const chooseMap = (item: EquipmentItem) => {
    setOpen(false);
    setQuery('');
    onCloseMobile?.();
    onLocateOnMap(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!matches.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = matches[activeIndex] || matches[0];
      if (target) chooseDetails(target);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-2.5 w-3.5 h-3.5 text-slate-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="navbar-hardware-search-listbox"
          aria-autocomplete="list"
          aria-label="Search hardware by name, mission, or planet"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search hardware, mission, planet..."
          className="w-full rounded-md border border-slate-800 bg-[#0D111A] py-1.5 pl-8 pr-7 text-xs text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          id="navbar-hardware-search-listbox"
          role="listbox"
          aria-label="Matching space hardware"
          className="absolute right-0 left-0 lg:left-auto lg:w-[400px] mt-2 z-50 rounded-lg border border-slate-700 bg-[#0B0F18] shadow-2xl overflow-hidden"
        >
          {matches.length === 0 ? (
            <div className="px-4 py-4 text-xs text-slate-400">
              No hardware found for &ldquo;{query}&rdquo;. Try &ldquo;Apollo 11&rdquo;,
              &ldquo;Opportunity&rdquo;, &ldquo;Surveyor&rdquo;, &ldquo;Moon&rdquo;, or
              &ldquo;Mars&rdquo;.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
              {matches.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={isActive}
                    className={`px-3.5 py-2.5 transition-colors ${
                      isActive ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => chooseDetails(item)}
                        className="min-w-0 flex-1 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-500 rounded-sm"
                      >
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="font-mono text-slate-300 uppercase">
                            {item.body}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{item.mission}</span>
                          <span aria-hidden="true">·</span>
                          <StatusIndicator status={item.status} />
                        </div>
                        <div className="mt-0.5 text-xs font-semibold text-slate-100 truncate">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400 truncate">
                          {item.coordinates.region}
                        </div>
                      </button>

                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => chooseDetails(item)}
                          title="Open hardware story and specifications"
                          className="inline-flex items-center gap-1 rounded border border-slate-700 bg-[#07090E] px-2 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:text-white cursor-pointer whitespace-nowrap"
                        >
                          <BookOpen className="w-3 h-3 text-slate-400" />
                          <span>Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => chooseMap(item)}
                          title="Fly to location on Planetary Map"
                          className="inline-flex items-center gap-1 rounded bg-orange-600/90 px-2 py-1 text-[11px] font-medium text-white hover:bg-orange-500 cursor-pointer whitespace-nowrap"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Map</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
