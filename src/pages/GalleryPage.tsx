import { useState, useEffect } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { searchNasaImages } from '../services/nasaApi';
import { NasaImageSearchItem } from '../types/equipment';
import { NasaImage } from '../components/NasaImage';

const PRESET_QUERIES = [
  { label: 'Apollo Lunar Module', query: 'Apollo lunar module surface' },
  { label: 'Lunar Roving Vehicle', query: 'Apollo Lunar Roving Vehicle' },
  { label: 'Surveyor Lander', query: 'Surveyor moon lander' },
  { label: 'Mars Pathfinder & Sojourner', query: 'Mars Pathfinder Sojourner' },
  { label: 'Spirit & Opportunity', query: 'Mars Exploration Rover Spirit Opportunity' },
  { label: 'InSight & Phoenix', query: 'InSight Phoenix Mars lander' },
  { label: 'Ingenuity Helicopter', query: 'Ingenuity Mars helicopter' },
];

export function GalleryPage() {
  const [activeQuery, setActiveQuery] = useState(PRESET_QUERIES[0].query);
  const [inputValue, setInputValue] = useState(PRESET_QUERIES[0].query);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NasaImageSearchItem[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    searchNasaImages(activeQuery, page)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotalHits(res.totalHits);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to reach NASA Image and Video Library.'
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeQuery, page]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveQuery(inputValue);
  };

  const selectPreset = (q: string) => {
    setInputValue(q);
    setPage(1);
    setActiveQuery(q);
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-orange-400">
          Live Integration · NASA Image and Video Library API (images-api.nasa.gov)
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
          NASA Image Gallery
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          Every photograph below is retrieved live from NASA&apos;s official
          Image and Video Library with its NASA ID, center credit, and original
          source URL. No synthetic or AI-generated historical imagery is used.
        </p>
      </div>

      {/* Search & Preset Collections */}
      <div className="mt-8 space-y-4 border-b border-slate-800 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search NASA archive (e.g., Apollo 15, Viking 1, Opportunity)..."
              aria-label="Search NASA Image Library"
              className="w-full rounded-md border border-slate-800 bg-[#0B0F18] py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            Search NASA Archive
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Curated mission searches">
          {PRESET_QUERIES.map((p) => (
            <button
              key={p.query}
              type="button"
              onClick={() => selectPreset(p.query)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeQuery === p.query
                  ? 'bg-slate-100 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span>
          Query: <strong className="text-slate-200">{activeQuery}</strong> ·{' '}
          <span className="font-mono tabular-nums">
            {totalHits.toLocaleString()}
          </span>{' '}
          total matches in NASA archive
        </span>
        <span>
          Usage: NASA Public Domain / Media Usage Guidelines (Non-commercial education)
        </span>
      </div>

      {/* Loading / Error / Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 rounded-lg border border-slate-800 bg-[#0B0F18] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-lg border border-rose-900/60 bg-[#0B0F18] p-6 text-sm text-rose-300">
          Could not load live NASA photographs ({error}). Please check network
          connectivity and retry.
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-slate-800 bg-[#0B0F18] p-8 text-center text-sm text-slate-400">
          No NASA photographs matched &ldquo;{activeQuery}&rdquo;. Try another
          mission keyword.
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((img) => (
              <article
                key={img.nasaId}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#0B0F18]"
              >
                <NasaImage
                  src={img.previewUrl}
                  alt={img.title}
                  aspectClassName="aspect-[4/3] w-full"
                />
                <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                      <span>ID: {img.nasaId}</span>
                      <span>
                        {img.center} {img.dateCreated ? `· ${img.dateCreated}` : ''}
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-sm font-bold text-slate-100 line-clamp-2">
                      {img.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {img.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Credit: NASA / {img.center}
                    </span>
                    <a
                      href={img.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-orange-400 hover:text-orange-300"
                    >
                      <span>Original Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="rounded-md border border-slate-800 bg-[#0B0F18] px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 disabled:opacity-40 cursor-pointer"
            >
              Previous Page
            </button>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              Page {page}
            </span>
            <button
              type="button"
              disabled={items.length < 18}
              onClick={() => {
                setPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="rounded-md border border-slate-800 bg-[#0B0F18] px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-600 disabled:opacity-40 cursor-pointer"
            >
              Next Page
            </button>
          </div>
        </>
      )}
    </div>
  );
}
