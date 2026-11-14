import { useState, useEffect } from 'react';
import { Maximize2, X, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from 'lucide-react';
import { NasaImage } from './NasaImage';

interface ZoomableNasaImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  caption?: string;
  credit?: string;
  sourceUrl?: string;
  nasaId?: string;
  isAiGenerated?: boolean;
  aspectClassName?: string;
  className?: string;
}

export function ZoomableNasaImage({
  src,
  fallbackSrc,
  alt,
  caption,
  credit,
  sourceUrl,
  nasaId,
  isAiGenerated = false,
  aspectClassName = 'aspect-[4/3] w-full',
  className = '',
}: ZoomableNasaImageProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!open) return;
    setScale(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className={`group relative overflow-hidden ${className}`}>
        <NasaImage
          src={src}
          fallbackSrc={fallbackSrc}
          alt={alt}
          aspectClassName={aspectClassName}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Zoom photograph: ${alt}`}
          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md border border-slate-700/90 bg-[#07090E]/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-100 opacity-90 hover:opacity-100 hover:border-amber-400 transition-opacity cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Zoom Photo</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed view: ${alt}`}
          onClick={() => setOpen(false)}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <div className="text-xs font-mono text-amber-400">
                {isAiGenerated
                  ? 'Environment Visualization (AI-Generated — Not a Real NASA Photo)'
                  : `Authentic NASA Photograph${nasaId ? ` · ID: ${nasaId}` : ''}`}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
                {caption || alt}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(1, Number((s - 0.35).toFixed(2))))}
                aria-label="Zoom out"
                className="rounded-md border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-slate-500 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-xs text-slate-300 tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, Number((s + 0.35).toFixed(2))))}
                aria-label="Zoom in"
                className="rounded-md border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-slate-500 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale(1)}
                aria-label="Reset zoom"
                className="rounded-md border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-slate-500 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close zoomed image"
                className="ml-2 rounded-md border border-slate-700 bg-[#0B0F18] p-2 text-slate-200 hover:border-amber-400 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto flex items-center justify-center py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              style={{ transform: `scale(${scale})` }}
              className="max-h-[75vh] max-w-full object-contain transition-transform duration-200"
            />
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400"
            onClick={(e) => e.stopPropagation()}
          >
            <span>{credit ? `Credit: ${credit}` : alt}</span>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:underline"
              >
                <span>View Original NASA Archive Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
