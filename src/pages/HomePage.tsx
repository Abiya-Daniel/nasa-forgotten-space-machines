import { useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Volume2,
  Pause,
  Play,
  GraduationCap,
  Film,
  Layers,
  ShieldCheck,
  Radio,
  Sparkles,
  Microscope,
  Eye,
  Shuffle,
  ChevronDown,
  Gamepad2,
  Landmark,
  Wrench,
  MessageSquareText,
  Award,
} from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { FEATURED_DOSSIERS } from '../data/featuredDossiers';
import { DAILY_SPACE_FACTS } from '../data/museumExperiencesData';
import { EquipmentItem, FeaturedMachineId, PageId } from '../types/equipment';
import { DiscoveriesTabId } from './DiscoveriesPage';
import { useExperience } from '../context/ExperienceContext';
import { NasaImage } from '../components/NasaImage';
import { StatusIndicator } from '../components/StatusIndicator';
import heroLunarImg from '../assets/images/hero_deep_space_horizon_1794660625835.jpg';
import marsDuskImg from '../assets/images/mars_dusk_horizon_1794660626138.jpg';
import voyagerInterstellarImg from '../assets/images/voyager_interstellar_dark_1794660626639.jpg';
import lunarSouthPoleImg from '../assets/images/lunar_south_pole_shadows_1794660627056.jpg';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onNavigateDiscoveries: (tab: DiscoveriesTabId) => void;
  onSelectItem: (item: EquipmentItem) => void;
  onOpenFeaturedDossier: (id: FeaturedMachineId) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

const FEATURED_ORDER: FeaturedMachineId[] = [
  'apollo-15-lrv1',
  'opportunity-mer-b',
  'insight-lander',
  'voyager-1',
];

export function HomePage({
  onNavigate,
  onNavigateDiscoveries,
  onSelectItem,
  onOpenFeaturedDossier,
  onLocateOnMap,
}: HomePageProps) {
  const {
    activeTrack,
    isPlaying,
    isPaused,
    startIntroNarration,
    startMachineNarration,
    togglePlayPause,
  } = useExperience();

  const moonCount = EQUIPMENT_DATA.filter((i) => i.body === 'moon').length;
  const marsCount = EQUIPMENT_DATA.filter((i) => i.body === 'mars').length;
  const deepSpaceCount = EQUIPMENT_DATA.filter((i) => i.body === 'deep-space').length;
  const activeCount = EQUIPMENT_DATA.filter(
    (i) => i.status === 'active' || i.status === 'travelling'
  ).length;
  const retiredOrSilentCount = EQUIPMENT_DATA.filter(
    (i) => i.status === 'retired' || i.status === 'silent' || i.status === 'abandoned'
  ).length;

  const dailyFact = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86_400_000) % DAILY_SPACE_FACTS.length;
    return DAILY_SPACE_FACTS[dayIndex];
  }, []);

  const isIntroPlaying = activeTrack?.id === 'site-intro' && isPlaying && !isPaused;

  const openRandomMachine = () => {
    const picked = EQUIPMENT_DATA[Math.floor(Math.random() * EQUIPMENT_DATA.length)];
    if (picked) {
      if (picked.featuredStoryId) {
        onOpenFeaturedDossier(picked.featuredStoryId);
      } else {
        onSelectItem(picked);
      }
    }
  };

  return (
    <div className="relative z-10">
      {/* 1. Cinematic Documentary Hero */}
      <section className="relative min-h-[600px] sm:min-h-[660px] flex items-end overflow-hidden border-b border-slate-800/80">
        <img
          src={heroLunarImg}
          alt="Environment visualization of lunar regolith overlooking Earth in black space"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/75 to-[#07090E]/30"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs font-mono tracking-widest uppercase text-amber-400">
              HUMANITY SENT MACHINES INTO THE UNKNOWN.
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.06] [text-wrap:balance]">
              NASA&apos;S FORGOTTEN SPACE MACHINES
            </h1>

            <p className="text-lg sm:text-xl font-medium text-sky-200/95">
              Every machine has a story. Every discovery leaves a legacy.
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Some completed their missions. Some fell silent. Some remain on distant
              worlds—and some still cross interstellar space. Discover the engineering,
              scientific discoveries, and endurance of humanity&apos;s off-world pioneers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('machines')}
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>EXPLORE THE MACHINES</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('home-story-journey');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 rounded-md border border-slate-600 bg-[#0A0F1A]/90 px-5 py-3 text-sm font-semibold text-white hover:border-sky-400 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4 text-sky-400" />
                <span>BEGIN THE JOURNEY</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#080B13]/90 px-4 py-3 text-sm font-semibold text-sky-300 hover:border-sky-400 transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>3D Planetary Atlas</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  activeTrack?.id === 'site-intro'
                    ? togglePlayPause()
                    : startIntroNarration()
                }
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#080B13]/90 px-4 py-3 text-sm font-medium text-slate-200 hover:border-amber-400 transition-colors cursor-pointer"
              >
                {isIntroPlaying ? (
                  <Pause className="w-4 h-4 text-amber-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {isIntroPlaying ? 'Pause Intro Audio' : 'Listen to Intro'}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-4 text-[11px] text-slate-400">
            <span>
              Backdrop Caption: Environment Visualization (AI-Generated) — Lunar crater horizon looking toward Earth. Authentic NASA photos are explicitly labeled throughout.
            </span>
            <span className="font-mono text-slate-300">
              {EQUIPMENT_DATA.length} Documented Machines · NSSDCA &amp; JPL Cataloged
            </span>
          </div>
        </div>
      </section>

      {/* 1B. Daily Space Fact + Statistics Strip + Random Machine */}
      <section
        id="home-story-journey"
        className="border-b border-slate-800/80 bg-[#080C16]"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {EQUIPMENT_DATA.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Documented Spacecraft &amp; Relics
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-sky-400 tabular-nums">
                60+ Years
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Exploration Span (1964–Present)
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums">
                {activeCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Active &amp; Travelling Pioneers Today
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">
                {retiredOrSilentCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Completed, Silent &amp; Heritage Craft
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg border border-slate-800 bg-[#0B0F18] px-5 py-4">
            <div className="space-y-1">
              <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                Daily Space Exploration Fact
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {dailyFact}
              </p>
            </div>
            <button
              type="button"
              onClick={openRandomMachine}
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#07090E] px-4 py-2.5 text-xs font-semibold text-sky-300 hover:border-amber-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0 self-start md:self-auto"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Forgotten Machine</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Challenge Introduction & Status Distinction */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-sky-400">
              Challenge Context · Scientific Honesty
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 [text-wrap:balance]">
              Not Every Machine Left Behind Is &ldquo;Abandoned&rdquo;
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Returning heavy hardware against the gravity of the Moon or Mars
              requires exponential rocket fuel. Engineers intentionally left
              descent stages and rovers behind after mission completion—while
              several deep-space and Martian explorers are still actively working
              today.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('why')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <span>Explore the Rocket Equation &amp; Why Hardware Stays</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4 space-y-1.5">
              <StatusIndicator status="active" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Curiosity, Perseverance, LRO, Hubble, and Apollo retroreflectors still return active measurements to Earth today.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4 space-y-1.5">
              <StatusIndicator status="travelling" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Voyager 1, Voyager 2, and New Horizons remain operational and still transmit science across deep space.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4 space-y-1.5">
              <StatusIndicator status="retired" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Opportunity, InSight, Spirit, Cassini, Lunokhod 1 &amp; 2, and Ingenuity completed historic campaigns before power or mission end.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4 space-y-1.5">
              <StatusIndicator status="abandoned" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Expended sky cranes, heat shields, and Lunar Module descent stages jettisoned by mission design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Three Frontiers: Moon, Mars, Deep Space */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Planetary Environments
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-100">
              Explore the Moon, Mars &amp; Deep Space
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('machines')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 cursor-pointer"
          >
            <span>Browse All {EQUIPMENT_DATA.length} Machines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Moon */}
          <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#0B0F18] hover:border-slate-700 transition-colors">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={heroLunarImg}
                alt="Environment visualization of the Moon"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                Environment Visualization (AI-Generated)
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="font-mono text-xs text-sky-400">
                  {moonCount} Cataloged Lunar Sites
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-100">The Moon</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Surveyor landers, Lunokhod 1 &amp; 2 rovers, six Apollo Lunar Module
                  descent stages, three electric Lunar Roving Vehicles, and laser retroreflectors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('moon')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <span>Explore Lunar Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>

          {/* Mars */}
          <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#0B0F18] hover:border-slate-700 transition-colors">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={marsDuskImg}
                alt="Environment visualization of Mars twilight horizon"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                Environment Visualization (AI-Generated)
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="font-mono text-xs text-amber-400">
                  {marsCount} Documented Martian Sites
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-100">Mars</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Viking landers, Sojourner, Spirit, Opportunity, InSight, Ingenuity,
                  plus active nuclear rovers Curiosity and Perseverance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('mars')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <span>Explore Martian Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>

          {/* Deep Space */}
          <article className="group flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#0B0F18] hover:border-slate-700 transition-colors">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={voyagerInterstellarImg}
                alt="Environment visualization of interstellar deep space"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                Environment Visualization (AI-Generated)
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="font-mono text-xs text-emerald-400">
                  {deepSpaceCount} Outer-Solar &amp; Interstellar Scouts
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-100">Deep Space</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Voyager 1 &amp; 2, Pioneer 10 &amp; 11, Giotto, and New Horizons—probes
                  that reshaped planetary science and carry humanity&apos;s legacy
                  beyond the heliopause.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <span>View Deep Space Routes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 4. Four Featured Machine Stories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-mono uppercase tracking-wider text-sky-400">
            Featured Documentary Stories · Full 12-Chapter Narratives &amp; Interactive Diagrams
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-100">
            Four Landmark Machines
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Select any featured spacecraft to read its 12-chapter story, inspect clickable engineering schematics and 3D models, or listen to full audio narration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FEATURED_ORDER.map((id) => {
            const dossier = FEATURED_DOSSIERS[id];
            const item = EQUIPMENT_DATA.find((e) => e.id === dossier.equipmentId);
            if (!item) return null;

            const isNarratingThis = activeTrack?.id === id && isPlaying && !isPaused;

            return (
              <article
                key={id}
                className="flex flex-col sm:flex-row overflow-hidden rounded-lg border border-slate-800 bg-[#0B0F18] hover:border-slate-700 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onOpenFeaturedDossier(id)}
                  className="sm:w-56 shrink-0 bg-[#06080E] text-left cursor-pointer"
                >
                  <NasaImage
                    src={dossier.heroPhoto.imageUrl}
                    fallbackSrc={dossier.heroPhoto.fallbackUrl}
                    alt={dossier.heroPhoto.title}
                    aspectClassName="aspect-[4/3] sm:h-full w-full"
                  />
                </button>

                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-sky-400">
                        NSSDCA {item.nssdcaId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <StatusIndicator status={item.status} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-100">
                      <button
                        type="button"
                        onClick={() => onOpenFeaturedDossier(id)}
                        className="text-left hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {item.name}
                      </button>
                    </h3>

                    <p className="text-xs text-slate-400 font-mono">
                      {dossier.subtitle}
                    </p>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {dossier.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => onOpenFeaturedDossier(id)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open 12-Chapter Story</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        isNarratingThis
                          ? togglePlayPause()
                          : startMachineNarration(id, 0)
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs font-medium text-sky-300 hover:border-sky-400 cursor-pointer"
                    >
                      {isNarratingThis ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>{isNarratingThis ? 'Pause Audio' : 'Play Audio'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectItem(item)}
                      className="ml-auto text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Quick Specs
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Signature Museum Exhibits (Final Signal, Speak, Discovery, Panorama) */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-b border-slate-800/80 space-y-8">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Immersive Museum Exhibits
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-100">
            Evidence, Final Signals &amp; First-Person Perspectives
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Step into four signature interactive halls designed to honor the science and history of spacecraft exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            type="button"
            onClick={() => onNavigateDiscoveries('investigate')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-sky-500/70 transition-colors cursor-pointer space-y-2.5"
          >
            <Microscope className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              Discovery Investigation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyze 6 landmark findings—from hematite blueberries to Mars&apos;s liquid core and Enceladus plumes.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateDiscoveries('final-signal')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-amber-400/70 transition-colors cursor-pointer space-y-2.5"
          >
            <Radio className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Final Signal Experience
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examine last telemetry dates and attenuation profiles for Opportunity, InSight, Cassini, Spirit, and Pioneer 10.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateDiscoveries('speak')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-sky-500/70 transition-colors cursor-pointer space-y-2.5"
          >
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              If This Machine Could Speak
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Listen to creative first-person reflections grounded in documented facts (explicitly labeled as literature).
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateDiscoveries('panorama')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-amber-400/70 transition-colors cursor-pointer space-y-2.5"
          >
            <Eye className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Surface Panorama Viewer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pan and zoom across authentic Apollo 15, Apollo 17, Opportunity, and Perseverance surface mosaics.
            </p>
          </button>
        </div>
      </section>

      {/* 6. Scientific Discoveries, Heritage Legacy & Interactive Centres */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-lg border border-slate-800 bg-[#0B0F18] overflow-hidden">
          <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[260px]">
            <img
              src={lunarSouthPoleImg}
              alt="Environment visualization of lunar south pole craters and shadows"
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2.5 left-2.5 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">
              Environment Visualization (AI-Generated)
            </span>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Machine Legacy &amp; Future Exploration</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              From Apollo Heritage Parks to Artemis &amp; Sample Return
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every machine left on the Moon or Mars teaches future engineers how
              metals, seals, optics, and batteries age across decades of radiation
              and thermal shock. NASA&apos;s Artemis astronauts returning toward the
              Lunar South Pole and future Mars explorers will treat historic landing
              sites as protected scientific heritage—while designing next-generation
              rovers using lessons earned by Spirit, Opportunity, InSight, and Ingenuity.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('timeline')}
                className="rounded-md bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-white cursor-pointer"
              >
                View 1964–Present Timeline
              </button>
              <button
                type="button"
                onClick={() => onLocateOnMap(EQUIPMENT_DATA[2])}
                className="rounded-md border border-slate-700 px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 cursor-pointer"
              >
                Inspect Lunar South Pole Sites
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Hub Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={() => onNavigate('machines')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-6 hover:border-sky-500/70 transition-colors cursor-pointer space-y-2"
          >
            <Layers className="w-6 h-6 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              Interactive Anatomy &amp; Scale
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click spacecraft subsystems, rotate 3D engineering models, compare
              machines side by side, and inspect scale &amp; light-delay metrics.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-6 hover:border-amber-400/70 transition-colors cursor-pointer space-y-2"
          >
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Learning Lab, Builder &amp; Certificate
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quizzes, matching, timeline ordering, Guess the Spacecraft, Build-a-Spacecraft
              lab, badges, glossary &amp; downloadable Explorer Certificate.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('media')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-6 hover:border-sky-500/70 transition-colors cursor-pointer space-y-2"
          >
            <Film className="w-6 h-6 text-sky-400" />
            <h3 className="text-base font-bold text-slate-100">
              NASA Gallery, Videos &amp; Audio Centre
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zoomable authentic NASA photos, official mission video streams, full
              story narration, ambience controls, and labeled sound effects.
            </p>
          </button>
        </div>
      </section>

      {/* 6B. Advanced Interactive Simulators, Museum Wings & AI Historian */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-slate-800/80 space-y-6">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Advanced Museum Wings · Interactive Simulators &amp; AI Historian
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-100">
            Pilot a 3D Mars Rover, Inspect Mission Autopsies &amp; Ask the Space Historian
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Explore five interactive wings designed to turn passive history into hands-on planetary engineering and discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('missions')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-amber-400/70 transition-colors cursor-pointer space-y-2"
          >
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              3D Rover &amp; First-Person Missions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drive a rover on Mars, walk real traverse routes, manage Mission Control &amp; track active probes.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-sky-400/70 transition-colors cursor-pointer space-y-2"
          >
            <Landmark className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Museum Halls &amp; Mission Autopsy
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Investigate near-failures, spacecraft graveyards, final photos, blueprints &amp; Golden Record.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('engineering')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-amber-400/70 transition-colors cursor-pointer space-y-2"
          >
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              3D Exploded Hardware &amp; Survival Lab
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Separate spacecraft layers in 3D, ration failing power, test light delays &amp; survive EDL landing.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('historian')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-sky-400/70 transition-colors cursor-pointer space-y-2"
          >
            <MessageSquareText className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Ask the Space Historian
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore missions at Beginner, Intermediate, or Advanced depth and compose grounded AI stories.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('passport')}
            className="text-left rounded-lg border border-slate-800 bg-[#0B0F18] p-5 hover:border-amber-400/70 transition-colors cursor-pointer space-y-2"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Explorer Passport &amp; Tours
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Take 5 curated museum tours, unlock 12 badges, solve Weekly Challenges &amp; export PNG cards.
            </p>
          </button>
        </div>
      </section>

      {/* 7. Final Emotional Storytelling Closing Section */}
      <section className="border-t border-slate-800/80 bg-[#05070D]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            The Legacy of Distant Silence
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight [text-wrap:balance]">
            Even when communication ends, discovery continues.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Across lunar mare plains, crimson Martian craters, and the cold dark past
            the heliopause, thirty-one historic machines stand as quiet monuments to
            human curiosity. Their stories remain open for every new explorer.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateDiscoveries('final-signal')}
              className="rounded-md bg-amber-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Visit Final Signal Experience
            </button>
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="rounded-md border border-slate-700 bg-[#0B0F18] px-5 py-2.5 text-xs font-semibold text-slate-200 hover:border-sky-400 transition-colors cursor-pointer"
            >
              Earn Explorer Badges
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
