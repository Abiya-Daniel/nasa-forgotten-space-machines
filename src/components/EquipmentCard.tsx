import { MapPin, Compass, ArrowUpRight, BookOpen, Heart } from 'lucide-react';
import { EquipmentItem } from '../types/equipment';
import { NasaImage } from './NasaImage';
import { StatusIndicator } from './StatusIndicator';
import { formatCoord } from './EquipmentDetailModal';
import { useExperience } from '../context/ExperienceContext';

interface EquipmentCardProps {
  item: EquipmentItem;
  onSelect: (item: EquipmentItem) => void;
  onLocateOnMap?: (item: EquipmentItem) => void;
}

export function EquipmentCard({
  item,
  onSelect,
  onLocateOnMap,
}: EquipmentCardProps) {
  const { favorites, toggleFavorite } = useExperience();
  const isFavorite = favorites.includes(item.id);
  const isNonSurface = item.body === 'deep-space' || item.body === 'orbital';

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-800/90 bg-[#0B0F18] transition-colors hover:border-slate-700">
      <div className="relative">
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="block w-full text-left focus-visible:outline-2 focus-visible:outline-amber-400 cursor-pointer"
        >
          <NasaImage
            src={item.photo.imageUrl}
            fallbackSrc={item.photo.fallbackUrl}
            alt={item.photo.title}
            aspectClassName="aspect-[16/10] w-full"
          />
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(item.id)}
          aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Save ${item.name} to favorites`}
          aria-pressed={isFavorite}
          className={`absolute top-2.5 right-2.5 rounded-md border p-1.5 backdrop-blur transition-colors cursor-pointer ${
            isFavorite
              ? 'border-rose-400/70 bg-rose-950/80 text-rose-300'
              : 'border-slate-700/80 bg-black/70 text-slate-300 hover:border-slate-500 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
            <span className="font-mono text-slate-300">{item.mission}</span>
            <span aria-hidden="true">·</span>
            <span>{item.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <StatusIndicator status={item.status} />
          </div>

          <h3 className="mt-2 text-base font-bold text-slate-100 leading-snug">
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="text-left hover:text-amber-400 transition-colors cursor-pointer"
            >
              {item.name}
            </button>
          </h3>

          <p className="mt-2 text-sm text-slate-400 line-clamp-3 leading-relaxed">
            {item.missionPurpose}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 truncate max-w-[55%]">
              {item.coordinates.region}
            </span>
            <span className="font-mono tabular-nums text-sky-300 truncate max-w-[42%]">
              {formatCoord(item)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              {item.featuredStoryId ? (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read 12-Chapter Story</span>
                </>
              ) : (
                <>
                  <span>Read Mission Story</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {onLocateOnMap && !isNonSurface && (
              <button
                type="button"
                onClick={() => onLocateOnMap(item)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>View on Map</span>
              </button>
            )}

            {onLocateOnMap && item.body === 'deep-space' && (
              <button
                type="button"
                onClick={() => onLocateOnMap(item)}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>View Route</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
