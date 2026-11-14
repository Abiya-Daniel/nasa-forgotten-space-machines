import { useState, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Film,
  Volume2,
  Play,
  Pause,
  Square,
  RotateCcw,
  SkipForward,
  SkipBack,
  FileText,
  Music,
  Image as ImageIcon,
} from 'lucide-react';
import {
  searchNasaImages,
  searchNasaMedia,
  fetchNasaMediaAssetUrl,
} from '../services/nasaApi';
import { CURATED_NASA_VIDEOS, AUDIO_EFFECT_PRESETS } from '../data/mediaData';
import { FEATURED_DOSSIERS } from '../data/featuredDossiers';
import { FeaturedMachineId, NasaImageSearchItem } from '../types/equipment';
import { useExperience } from '../context/ExperienceContext';
import { ZoomableNasaImage } from '../components/ZoomableNasaImage';

type MediaTab = 'images' | 'videos' | 'audio';

const IMAGE_PRESETS = [
  { label: 'Apollo Lunar Module', query: 'Apollo lunar module surface' },
  { label: 'Lunar Roving Vehicle', query: 'Apollo Lunar Roving Vehicle' },
  { label: 'Opportunity & Spirit', query: 'Mars Exploration Rover Opportunity' },
  { label: 'InSight Lander', query: 'InSight Mars lander' },
  { label: 'Voyager 1 & 2', query: 'Voyager spacecraft Pale Blue Dot' },
  { label: 'Ingenuity Helicopter', query: 'Ingenuity Mars helicopter' },
];

const FEATURED_STORY_TRACKS: { id: FeaturedMachineId; title: string; subtitle: string }[] = [
  {
    id: 'apollo-15-lrv1',
    title: 'Apollo 15 Lunar Roving Vehicle (LRV-1)',
    subtitle: '12 Chapters · Hadley–Apennine Valley (1971)',
  },
  {
    id: 'opportunity-mer-b',
    title: 'Opportunity Rover (MER-B)',
    subtitle: '12 Chapters · Meridiani Planum Marathon (2004–2018)',
  },
  {
    id: 'insight-lander',
    title: 'InSight Lander & SEIS Seismometer',
    subtitle: '12 Chapters · Elysium Planitia (2018–2022)',
  },
  {
    id: 'voyager-1',
    title: 'Voyager 1 Interstellar Probe',
    subtitle: '12 Chapters · Interstellar Space (1977–Present)',
  },
];

export function MediaCenterPage({ defaultTab = 'images' }: { defaultTab?: MediaTab }) {
  const [tab, setTab] = useState<MediaTab>(defaultTab);

  // Image Library State
  const [activeQuery, setActiveQuery] = useState(IMAGE_PRESETS[0].query);
  const [inputValue, setInputValue] = useState(IMAGE_PRESETS[0].query);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NasaImageSearchItem[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  // Video Gallery State
  const [videoSearchInput, setVideoSearchInput] = useState('Apollo 15 Mars Rover Voyager');
  const [videoStreams, setVideoStreams] = useState<Record<string, string | null>>({});
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);
  const [openCaptions, setOpenCaptions] = useState<Record<string, boolean>>({});
  const [liveVideos, setLiveVideos] = useState<NasaImageSearchItem[]>([]);
  const [loadingLiveVideos, setLoadingLiveVideos] = useState(false);

  // Live NASA Audio Search State
  const [audioSearchInput, setAudioSearchInput] = useState('Apollo 15 Voyager');
  const [liveAudios, setLiveAudios] = useState<NasaImageSearchItem[]>([]);
  const [loadingAudios, setLoadingAudios] = useState(false);
  const [audioStreamUrls, setAudioStreamUrls] = useState<Record<string, string | null>>({});

  const {
    activeTrack,
    chapterIndex,
    isPlaying,
    isPaused,
    progressPct,
    narrationVolume,
    readingSpeed,
    startMachineNarration,
    startIntroNarration,
    togglePlayPause,
    stopNarration,
    nextChapter,
    prevChapter,
    replayChapter,
    jumpToChapter,
    setNarrationVolume,
    setReadingSpeed,
    ambienceEnabled,
    ambienceVolume,
    toggleAmbience,
    setAmbienceVolume,
    playEffect,
  } = useExperience();

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  // Fetch NASA Images
  useEffect(() => {
    let cancelled = false;
    setLoadingImages(true);
    setImageError(null);

    searchNasaImages(activeQuery, page)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotalHits(res.totalHits);
        setLoadingImages(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setImageError(
          err instanceof Error
            ? err.message
            : 'Unable to reach NASA Image and Video Library.'
        );
        setLoadingImages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeQuery, page]);

  const handleLoadVideoStream = async (nasaId: string) => {
    setLoadingVideoId(nasaId);
    const url = await fetchNasaMediaAssetUrl(nasaId, 'video');
    setVideoStreams((prev) => ({ ...prev, [nasaId]: url }));
    setLoadingVideoId(null);
  };

  const handleSearchLiveVideos = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLiveVideos(true);
    try {
      const res = await searchNasaMedia(videoSearchInput, 'video', 1, 6);
      setLiveVideos(res.items);
    } catch {
      setLiveVideos([]);
    }
    setLoadingLiveVideos(false);
  };

  const handleSearchLiveAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAudios(true);
    try {
      const res = await searchNasaMedia(audioSearchInput, 'audio', 1, 6);
      setLiveAudios(res.items);
    } catch {
      setLiveAudios([]);
    }
    setLoadingAudios(false);
  };

  const handleLoadAudioStream = async (nasaId: string) => {
    const url = await fetchNasaMediaAssetUrl(nasaId, 'audio');
    setAudioStreamUrls((prev) => ({ ...prev, [nasaId]: url }));
  };

  const activeChapterObj = activeTrack?.chapters[chapterIndex] || null;

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
          Authentic NASA Media Library &amp; Documentary Studio
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
          NASA Gallery, Videos &amp; Audio Centre
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          Inspect zoomable NASA mission photographs, stream official NASA videos with captions, and listen to full 12-chapter audio stories alongside optional space ambience and labeled sound effects.
        </p>
      </div>

      {/* Mode Switcher */}
      <div
        className="inline-flex flex-wrap rounded-md border border-slate-800 bg-[#0B0F18] p-1"
        role="tablist"
        aria-label="Media sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'images'}
          onClick={() => setTab('images')}
          className={`inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'images' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Real NASA Image Gallery</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'videos'}
          onClick={() => setTab('videos')}
          className={`inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'videos' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Video &amp; Animation Gallery</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'audio'}
          onClick={() => setTab('audio')}
          className={`inline-flex items-center gap-2 rounded px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'audio' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Audio &amp; Narration Centre</span>
        </button>
      </div>

      {/* TAB 1: REAL NASA IMAGE GALLERY */}
      {tab === 'images' && (
        <section className="space-y-6">
          <div className="space-y-4 border-b border-slate-800 pb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setActiveQuery(inputValue);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search NASA archive (e.g., Apollo 15, Opportunity, Voyager 1)..."
                  aria-label="Search NASA Image Library"
                  className="w-full rounded-md border border-slate-800 bg-[#0B0F18] py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                Search NASA Archive
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5">
              {IMAGE_PRESETS.map((p) => (
                <button
                  key={p.query}
                  type="button"
                  onClick={() => {
                    setInputValue(p.query);
                    setPage(1);
                    setActiveQuery(p.query);
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    activeQuery === p.query
                      ? 'bg-slate-100 text-slate-950'
                      : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>
              Query: <strong className="text-slate-200">{activeQuery}</strong> ·{' '}
              <span className="font-mono tabular-nums">{totalHits.toLocaleString()}</span> matches
            </span>
            <span>Authentic NASA Photographs · Click &ldquo;Zoom Photo&rdquo; on any frame</span>
          </div>

          {loadingImages ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-72 rounded-lg border border-slate-800 bg-[#0B0F18] animate-pulse"
                />
              ))}
            </div>
          ) : imageError ? (
            <div className="rounded-lg border border-rose-900/60 bg-[#0B0F18] p-6 text-sm text-rose-300">
              Could not load live NASA photographs ({imageError}).
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((img) => (
                  <article
                    key={img.nasaId}
                    className="flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#0B0F18]"
                  >
                    <ZoomableNasaImage
                      src={img.previewUrl}
                      alt={img.title}
                      caption={img.title}
                      credit={`NASA / ${img.center}`}
                      sourceUrl={img.detailsUrl}
                      nasaId={img.nasaId}
                      aspectClassName="aspect-[4/3] w-full"
                    />
                    <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-sky-400">
                          <span className="truncate">ID: {img.nasaId}</span>
                          <span>{img.center}</span>
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
                          Authentic NASA Photo
                        </span>
                        <a
                          href={img.detailsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-amber-400 hover:underline"
                        >
                          <span>Original Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-slate-800 bg-[#0B0F18] px-4 py-2 text-xs font-medium text-slate-200 disabled:opacity-40 cursor-pointer"
                >
                  Previous Page
                </button>
                <span className="font-mono text-xs text-slate-400">Page {page}</span>
                <button
                  type="button"
                  disabled={items.length < 18}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-slate-800 bg-[#0B0F18] px-4 py-2 text-xs font-medium text-slate-200 disabled:opacity-40 cursor-pointer"
                >
                  Next Page
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* TAB 2: VIDEO & ANIMATION GALLERY */}
      {tab === 'videos' && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CURATED_NASA_VIDEOS.map((vid) => {
              const streamUrl = videoStreams[vid.nasaId];
              const isFetching = loadingVideoId === vid.nasaId;
              const captionsVisible = openCaptions[vid.id];
              return (
                <article
                  key={vid.id}
                  className="rounded-lg border border-slate-800 bg-[#0B0F18] overflow-hidden flex flex-col justify-between"
                >
                  <div className="bg-black aspect-video relative flex items-center justify-center">
                    {streamUrl ? (
                      <video
                        controls
                        poster={vid.posterUrl}
                        src={streamUrl}
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support embedded video playback.
                      </video>
                    ) : (
                      <>
                        <img
                          src={vid.posterUrl}
                          alt={vid.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 p-4 text-center">
                          <button
                            type="button"
                            disabled={isFetching}
                            onClick={() => handleLoadVideoStream(vid.nasaId)}
                            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                          >
                            <Play className="w-4 h-4" />
                            <span>
                              {isFetching ? 'Loading NASA Stream...' : 'Load NASA Video Stream'}
                            </span>
                          </button>
                          {streamUrl === null && (
                            <span className="text-[11px] text-amber-300">
                              Direct embed unavailable for this item — use Official NASA Link below.
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="font-mono text-sky-400">{vid.category}</span>
                      <span>{vid.durationLabel}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-100">{vid.title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">{vid.description}</p>

                    {captionsVisible && (
                      <div className="rounded-md border border-slate-800 bg-[#07090E] p-3 text-xs text-slate-300 leading-relaxed">
                        {vid.captionTranscript}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCaptions((prev) => ({
                            ...prev,
                            [vid.id]: !prev[vid.id],
                          }))
                        }
                        className="inline-flex items-center gap-1 text-sky-400 hover:underline cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{captionsVisible ? 'Hide Captions' : 'Read Captions / Transcript'}</span>
                      </button>

                      <a
                        href={vid.detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                      >
                        <span>Official NASA Video Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Live NASA Video Search */}
          <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                Search Official NASA Video Archive
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Queries NASA&apos;s live Video Library API for additional launches, animations, and rover clips.
              </p>
            </div>
            <form onSubmit={handleSearchLiveVideos} className="flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                value={videoSearchInput}
                onChange={(e) => setVideoSearchInput(e.target.value)}
                aria-label="Search NASA video archive"
                className="flex-1 rounded-md border border-slate-800 bg-[#07090E] px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-sky-600 px-5 py-2 text-xs font-semibold text-white hover:bg-sky-500 cursor-pointer"
              >
                {loadingLiveVideos ? 'Searching...' : 'Search NASA Videos'}
              </button>
            </form>

            {liveVideos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveVideos.map((v) => (
                  <div
                    key={v.nasaId}
                    className="rounded-md border border-slate-800 bg-[#07090E] p-3 space-y-2 text-xs"
                  >
                    {videoStreams[v.nasaId] ? (
                      <video
                        controls
                        src={videoStreams[v.nasaId] || undefined}
                        poster={v.previewUrl}
                        className="w-full aspect-video rounded bg-black"
                      />
                    ) : (
                      <img
                        src={v.previewUrl}
                        alt={v.title}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-video object-cover rounded"
                      />
                    )}
                    <div className="font-semibold text-slate-100 line-clamp-2">{v.title}</div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleLoadVideoStream(v.nasaId)}
                        className="text-sky-400 hover:underline cursor-pointer"
                      >
                        Play MP4
                      </button>
                      <a
                        href={v.detailsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>NASA Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: AUDIO & NARRATION CENTRE */}
      {tab === 'audio' && (
        <section className="space-y-8">
          {/* Studio Narration Deck */}
          <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Story Narration Studio · Spoken &amp; Full Transcript Modes
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-100">
                  Featured Machine Audio Stories
                </h2>
              </div>
              <button
                type="button"
                onClick={startIntroNarration}
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#07090E] px-3.5 py-2 text-xs font-semibold text-sky-300 hover:border-sky-400 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play Challenge Intro</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {FEATURED_STORY_TRACKS.map((trk) => {
                const isSelected = activeTrack?.id === trk.id;
                return (
                  <button
                    key={trk.id}
                    type="button"
                    onClick={() => startMachineNarration(trk.id, 0)}
                    className={`text-left rounded-md border p-4 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-[#131C30]'
                        : 'border-slate-800 bg-[#07090E] hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-mono text-sky-400">12 Chapters</div>
                    <div className="mt-1 text-sm font-bold text-slate-100">{trk.title}</div>
                    <div className="mt-1 text-[11px] text-slate-400">{trk.subtitle}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Player Bar */}
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-amber-400">
                    {activeTrack ? activeTrack.label : 'Select any featured machine above'}
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-0.5">
                    {activeChapterObj ? activeChapterObj.title : 'Ready to narrate'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="inline-flex items-center gap-1.5 rounded bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                  >
                    {isPlaying && !isPaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying && !isPaused ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={prevChapter}
                    disabled={!activeTrack || chapterIndex <= 0}
                    aria-label="Previous chapter"
                    className="rounded border border-slate-700 p-2 text-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={replayChapter}
                    disabled={!activeTrack}
                    aria-label="Replay chapter"
                    className="rounded border border-slate-700 p-2 text-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextChapter}
                    disabled={!activeTrack || chapterIndex >= (activeTrack?.chapters.length || 1) - 1}
                    aria-label="Next chapter"
                    className="rounded border border-slate-700 p-2 text-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={stopNarration}
                    aria-label="Stop"
                    className="rounded border border-slate-700 p-2 text-slate-200 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-[width] duration-200"
                  style={{ width: `${Math.round(progressPct)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
                <label className="flex items-center gap-2">
                  <span>Narration Volume:</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={narrationVolume}
                    onChange={(e) => setNarrationVolume(Number(e.target.value))}
                    className="accent-amber-400 cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span>Reading Speed:</span>
                  <select
                    value={readingSpeed}
                    onChange={(e) => setReadingSpeed(Number(e.target.value))}
                    className="rounded border border-slate-700 bg-[#0B0F18] px-2 py-1 text-xs text-slate-100 cursor-pointer"
                  >
                    <option value={0.85}>0.85x (Slow)</option>
                    <option value={1}>1.0x (Standard)</option>
                    <option value={1.25}>1.25x (Fast)</option>
                    <option value={1.5}>1.5x (Rapid)</option>
                  </select>
                </label>
              </div>

              {activeTrack && activeTrack.chapters.length > 1 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                  {activeTrack.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => jumpToChapter(idx)}
                      className={`rounded px-2.5 py-1 text-[11px] font-mono cursor-pointer ${
                        idx === chapterIndex
                          ? 'bg-sky-600 text-white'
                          : 'border border-slate-800 bg-[#0B0F18] text-slate-400 hover:text-white'
                      }`}
                    >
                      Ch {idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {activeChapterObj && (
                <div className="rounded border border-slate-800 bg-[#0B0F18] p-4 text-xs text-slate-300 leading-relaxed">
                  <div className="font-mono text-sky-400 mb-1">Written Transcript</div>
                  {activeChapterObj.text}
                </div>
              )}
            </div>
          </div>

          {/* Ambience + Synthesized Mission Sound Effects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
                <Music className="w-4 h-4" />
                <span>Gentle Space Ambience</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Optional low-frequency synthesized cosmic drone (Web Audio API). Never autoplays and respects your separate volume setting.
              </p>
              <button
                type="button"
                onClick={toggleAmbience}
                className={`w-full rounded-md px-4 py-2.5 text-xs font-semibold cursor-pointer ${
                  ambienceEnabled
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-700 bg-[#07090E] text-slate-200 hover:border-sky-400'
                }`}
              >
                {ambienceEnabled ? 'Turn Space Ambience Off' : 'Turn Space Ambience On'}
              </button>
              <label className="block text-xs text-slate-400 space-y-1.5">
                <span>Ambience Volume ({Math.round(ambienceVolume * 100)}%)</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={ambienceVolume}
                  onChange={(e) => setAmbienceVolume(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="lg:col-span-8 rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-4">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Synthesized Educational Sound Effects (Web Audio API)
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Transparent Disclosure: These sound effects are synthesized live in your browser for educational illustration—they are not authentic NASA mission recordings.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AUDIO_EFFECT_PRESETS.map((fx) => (
                  <button
                    key={fx.id}
                    type="button"
                    onClick={() => playEffect(fx.id)}
                    className="text-left rounded-md border border-slate-800 bg-[#07090E] p-3.5 hover:border-amber-400 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-100">{fx.title}</span>
                      <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {fx.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Authentic NASA Audio Search */}
          <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Authentic NASA Archival Audio Search
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Retrieve genuine NASA historical mission recordings directly from <code className="font-mono text-sky-400">images-api.nasa.gov</code>.
              </p>
            </div>
            <form onSubmit={handleSearchLiveAudio} className="flex flex-col sm:flex-row gap-3">
              <input
                type="search"
                value={audioSearchInput}
                onChange={(e) => setAudioSearchInput(e.target.value)}
                aria-label="Search authentic NASA audio recordings"
                className="flex-1 rounded-md border border-slate-800 bg-[#07090E] px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-amber-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                {loadingAudios ? 'Searching...' : 'Search NASA Audio'}
              </button>
            </form>

            {liveAudios.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {liveAudios.map((aud) => (
                  <div
                    key={aud.nasaId}
                    className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-2 text-xs"
                  >
                    <div className="font-mono text-sky-400">
                      Authentic NASA Recording · ID: {aud.nasaId}
                    </div>
                    <div className="font-semibold text-slate-100">{aud.title}</div>
                    {audioStreamUrls[aud.nasaId] ? (
                      <audio controls src={audioStreamUrls[aud.nasaId] || undefined} className="w-full h-9" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleLoadAudioStream(aud.nasaId)}
                        className="rounded border border-slate-700 px-3 py-1.5 text-amber-400 hover:border-amber-400 cursor-pointer"
                      >
                        Load NASA Audio File
                      </button>
                    )}
                    <a
                      href={aud.detailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-slate-400 hover:text-white underline"
                    >
                      View Archive Transcript &amp; Details
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
