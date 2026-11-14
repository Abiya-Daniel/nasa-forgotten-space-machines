import { useState } from 'react';
import { Telescope } from 'lucide-react';

interface NasaImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
}

export function NasaImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  aspectClassName = 'aspect-[4/3]',
}: NasaImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#0F141F] border border-slate-800/80 text-slate-400 px-4 text-center ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Telescope className="w-7 h-7 text-slate-500 mb-2" />
        <span className="text-xs font-medium text-slate-300 line-clamp-2 max-w-[22ch]">
          {alt}
        </span>
        <span className="text-[11px] font-mono text-slate-500 mt-1">
          NASA Archive Reference
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#0D111A] ${aspectClassName} ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={handleError}
        className="h-full w-full object-cover transition-transform duration-500"
      />
    </div>
  );
}
