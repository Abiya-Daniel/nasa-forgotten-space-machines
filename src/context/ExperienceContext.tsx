import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { FEATURED_DOSSIERS } from '../data/featuredDossiers';
import { FeaturedMachineId } from '../types/equipment';
import { SoundEffectId } from '../data/mediaData';
import { spaceAudioEngine } from '../utils/audioEngine';

export type TextSizeOption = 'normal' | 'large' | 'xlarge';

interface NarrationChapterItem {
  title: string;
  text: string;
}

interface NarrationTrack {
  id: string;
  label: string;
  chapters: NarrationChapterItem[];
}

const INTRO_TRACK: NarrationTrack = {
  id: 'site-intro',
  label: 'Challenge Introduction: NASA’s Forgotten Space Machines',
  chapters: [
    {
      title: 'Humanity Sent Machines Into the Unknown',
      text: 'Humanity sent machines into the unknown. Some travelled farther than expected. Some became silent witnesses of distant worlds. Some completed missions that changed our understanding of the universe. From the Apollo 15 Lunar Roving Vehicle parked near Hadley Rille, to Opportunity resting in Perseverance Valley, InSight on Elysium Planitia, and Voyager 1 still communicating from interstellar space, every machine has a story and every mission leaves a legacy.',
    },
  ],
};

function buildTrackForMachine(machineId: FeaturedMachineId): NarrationTrack {
  const dossier = FEATURED_DOSSIERS[machineId];
  return {
    id: machineId,
    label: `${dossier.id === 'apollo-15-lrv1' ? 'Apollo 15 LRV-1' : dossier.id === 'opportunity-mer-b' ? 'Opportunity Rover' : dossier.id === 'insight-lander' ? 'InSight Lander' : 'Voyager 1'} — Mission Story`,
    chapters: dossier.chapters.map((ch) => ({
      title: `Chapter ${ch.index}: ${ch.title}`,
      text: `${ch.title}. ${ch.body} Key fact: ${ch.factHighlight}`,
    })),
  };
}

interface ExperienceContextValue {
  // Narration
  activeTrack: NarrationTrack | null;
  chapterIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  progressPct: number;
  narrationVolume: number;
  readingSpeed: number;
  speechSupported: boolean;
  startMachineNarration: (machineId: FeaturedMachineId, startChapter?: number) => void;
  startIntroNarration: () => void;
  startCustomNarration: (id: string, label: string, title: string, text: string) => void;
  togglePlayPause: () => void;
  stopNarration: () => void;
  nextChapter: () => void;
  prevChapter: () => void;
  replayChapter: () => void;
  jumpToChapter: (index: number) => void;
  setNarrationVolume: (vol: number) => void;
  setReadingSpeed: (rate: number) => void;

  // Ambience & SFX
  ambienceEnabled: boolean;
  ambienceVolume: number;
  toggleAmbience: () => void;
  setAmbienceVolume: (vol: number) => void;
  playEffect: (id: SoundEffectId) => void;

  // Accessibility
  textSize: TextSizeOption;
  setTextSize: (size: TextSizeOption) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  captionsAlwaysOn: boolean;
  setCaptionsAlwaysOn: (val: boolean) => void;
  transcriptOpen: boolean;
  setTranscriptOpen: (val: boolean) => void;

  // Personal Discovery & Explorer Progress
  favorites: string[];
  toggleFavorite: (id: string) => void;
  savedDiscoveries: string[];
  toggleSavedDiscovery: (id: string) => void;
  exploredMachines: string[];
  recordExploredMachine: (id: string) => void;
  earnedBadges: string[];
  unlockBadge: (badgeId: string) => void;
  completedSims: string[];
  recordSimCompletion: (simId: string) => void;
  completedTours: string[];
  recordTourCompletion: (tourId: string) => void;
  explainLevel: 'beginner' | 'intermediate' | 'advanced';
  setExplainLevel: (lvl: 'beginner' | 'intermediate' | 'advanced') => void;
  communityPosts: CommunityNote[];
  addCommunityPost: (author: string, machineName: string, note: string) => void;
  clearExplorerProgress: () => void;
}

export interface CommunityNote {
  id: string;
  author: string;
  machineName: string;
  note: string;
  dateLabel: string;
  isSeeded?: boolean;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

const STORAGE_KEY = 'nfsm_preferences_v2';

interface StoredPrefs {
  narrationVolume?: number;
  readingSpeed?: number;
  ambienceVolume?: number;
  textSize?: TextSizeOption;
  reducedMotion?: boolean;
  highContrast?: boolean;
  captionsAlwaysOn?: boolean;
  favorites?: string[];
  savedDiscoveries?: string[];
  exploredMachines?: string[];
  earnedBadges?: string[];
  completedSims?: string[];
  completedTours?: string[];
  explainLevel?: 'beginner' | 'intermediate' | 'advanced';
  communityPosts?: CommunityNote[];
}

const DEFAULT_COMMUNITY_POSTS: CommunityNote[] = [
  {
    id: 'seed-1',
    author: 'Student Curator Team',
    machineName: 'Opportunity Rover (MER-B)',
    note: 'A 90-day mission that lasted nearly 15 years on Mars—its hematitic "blueberries" proved liquid water once soaked Meridiani Planum.',
    dateLabel: 'Curator Pick',
    isSeeded: true,
  },
  {
    id: 'seed-2',
    author: 'A. Patel (Student Visitor Sample)',
    machineName: 'Apollo 15 LRV-1',
    note: 'Seeing the woven wire-mesh tires and silver-zinc batteries inside the anatomy diagram showed how Apollo solved lunar traction in 1971.',
    dateLabel: 'Sample Note',
    isSeeded: true,
  },
  {
    id: 'seed-3',
    author: 'M. Chen (Student Visitor Sample)',
    machineName: 'Voyager 1',
    note: 'Incredible that a 22-watt radio transmitter still reaches 70-meter dishes on Earth from over 25 billion kilometers away.',
    dateLabel: 'Sample Note',
    isSeeded: true,
  },
];

function loadPrefs(): StoredPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nfsm_preferences_v1');
    return raw ? (JSON.parse(raw) as StoredPrefs) : {};
  } catch {
    return {};
  }
}

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const initialPrefs = useRef<StoredPrefs>(loadPrefs());

  const [activeTrack, setActiveTrack] = useState<NarrationTrack | null>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [narrationVolume, setNarrationVolumeState] = useState<number>(
    initialPrefs.current.narrationVolume ?? 0.9
  );
  const [readingSpeed, setReadingSpeedState] = useState<number>(
    initialPrefs.current.readingSpeed ?? 1.0
  );

  // Never autoplay audio on initial load; user toggles ambience manually
  const [ambienceEnabled, setAmbienceEnabled] = useState(false);
  const [ambienceVolume, setAmbienceVolumeState] = useState<number>(
    initialPrefs.current.ambienceVolume ?? 0.35
  );

  const [textSize, setTextSize] = useState<TextSizeOption>(
    initialPrefs.current.textSize ?? 'normal'
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof initialPrefs.current.reducedMotion === 'boolean') {
      return initialPrefs.current.reducedMotion;
    }
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [highContrast, setHighContrast] = useState<boolean>(
    initialPrefs.current.highContrast ?? false
  );
  const [captionsAlwaysOn, setCaptionsAlwaysOn] = useState<boolean>(
    initialPrefs.current.captionsAlwaysOn ?? true
  );
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  // Personal Discovery state
  const [favorites, setFavorites] = useState<string[]>(
    initialPrefs.current.favorites ?? ['apollo-15-lrv1', 'voyager-1']
  );
  const [savedDiscoveries, setSavedDiscoveries] = useState<string[]>(
    initialPrefs.current.savedDiscoveries ?? []
  );
  const [exploredMachines, setExploredMachines] = useState<string[]>(
    initialPrefs.current.exploredMachines ?? []
  );
  const [earnedBadges, setEarnedBadges] = useState<string[]>(
    initialPrefs.current.earnedBadges ?? []
  );
  const [completedSims, setCompletedSims] = useState<string[]>(
    initialPrefs.current.completedSims ?? []
  );
  const [completedTours, setCompletedTours] = useState<string[]>(
    initialPrefs.current.completedTours ?? []
  );
  const [explainLevel, setExplainLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    initialPrefs.current.explainLevel ?? 'intermediate'
  );
  const [communityPosts, setCommunityPosts] = useState<CommunityNote[]>(
    initialPrefs.current.communityPosts ?? DEFAULT_COMMUNITY_POSTS
  );

  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const progressTimerRef = useRef<number | null>(null);
  const utteranceSessionRef = useRef(0);

  // Persist preferences & personal discovery data locally
  useEffect(() => {
    try {
      const payload: StoredPrefs = {
        narrationVolume,
        readingSpeed,
        ambienceVolume,
        textSize,
        reducedMotion,
        highContrast,
        captionsAlwaysOn,
        favorites,
        savedDiscoveries,
        exploredMachines,
        earnedBadges,
        completedSims,
        completedTours,
        explainLevel,
        communityPosts,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [
    narrationVolume,
    readingSpeed,
    ambienceVolume,
    textSize,
    reducedMotion,
    highContrast,
    captionsAlwaysOn,
    favorites,
    savedDiscoveries,
    exploredMachines,
    earnedBadges,
    completedSims,
    completedTours,
    explainLevel,
    communityPosts,
  ]);

  // Apply root accessibility attributes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', textSize);
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
    root.setAttribute('data-high-contrast', highContrast ? 'true' : 'false');
  }, [textSize, reducedMotion, highContrast]);

  const unlockBadge = useCallback((badgeId: string) => {
    setEarnedBadges((prev) => (prev.includes(badgeId) ? prev : [...prev, badgeId]));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSavedDiscovery = useCallback((id: string) => {
    setSavedDiscoveries((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const recordExploredMachine = useCallback(
    (id: string) => {
      setExploredMachines((prev) => {
        const next = [id, ...prev.filter((item) => item !== id)].slice(0, 12);
        if (next.length >= 3) {
          unlockBadge('badge-first-machine');
        }
        return next;
      });
    },
    [unlockBadge]
  );

  const recordSimCompletion = useCallback((simId: string) => {
    setCompletedSims((prev) => (prev.includes(simId) ? prev : [...prev, simId]));
  }, []);

  const recordTourCompletion = useCallback(
    (tourId: string) => {
      setCompletedTours((prev) => (prev.includes(tourId) ? prev : [...prev, tourId]));
      unlockBadge('badge-mission-historian');
    },
    [unlockBadge]
  );

  const addCommunityPost = useCallback(
    (author: string, machineName: string, note: string) => {
      const cleanAuthor = author.trim().slice(0, 40) || 'Explorer';
      const cleanNote = note.trim().slice(0, 260);
      if (!cleanNote) return;
      const entry: CommunityNote = {
        id: `local-${Date.now()}`,
        author: cleanAuthor,
        machineName,
        note: cleanNote,
        dateLabel: 'Saved Locally',
      };
      setCommunityPosts((prev) => [entry, ...prev].slice(0, 25));
    },
    []
  );

  const clearExplorerProgress = useCallback(() => {
    setFavorites([]);
    setSavedDiscoveries([]);
    setExploredMachines([]);
    setEarnedBadges([]);
    setCompletedSims([]);
    setCompletedTours([]);
    setCommunityPosts(DEFAULT_COMMUNITY_POSTS);
  }, []);

  const clearTimer = useCallback(() => {
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const stopNarration = useCallback(() => {
    utteranceSessionRef.current += 1;
    clearTimer();
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgressPct(0);
  }, [clearTimer, speechSupported]);

  const speakChapter = useCallback(
    (track: NarrationTrack, idx: number, vol: number, rate: number) => {
      const chapter = track.chapters[idx];
      if (!chapter) {
        stopNarration();
        return;
      }

      utteranceSessionRef.current += 1;
      const sessionId = utteranceSessionRef.current;
      clearTimer();

      if (speechSupported) {
        window.speechSynthesis.cancel();
      }

      setActiveTrack(track);
      setChapterIndex(idx);
      setIsPlaying(true);
      setIsPaused(false);
      setProgressPct(0);

      const words = chapter.text.split(/\s+/).length;
      const estimatedDurationMs = Math.max(4000, (words / (2.5 * rate)) * 1000);
      const startedAt = performance.now();

      progressTimerRef.current = window.setInterval(() => {
        if (utteranceSessionRef.current !== sessionId) return;
        const elapsed = performance.now() - startedAt;
        const pct = Math.min(99, (elapsed / estimatedDurationMs) * 100);
        setProgressPct((prev) => Math.max(prev, pct));
      }, 250);

      if (speechSupported) {
        try {
          const utter = new SpeechSynthesisUtterance(
            `${chapter.title}. ${chapter.text}`
          );
          utter.volume = vol;
          utter.rate = rate;
          utter.lang = 'en-US';

          utter.onboundary = (ev) => {
            if (utteranceSessionRef.current !== sessionId) return;
            if (ev.charIndex && chapter.text.length > 0) {
              const pct = Math.min(
                99,
                (ev.charIndex / chapter.text.length) * 100
              );
              setProgressPct(pct);
            }
          };

          utter.onend = () => {
            if (utteranceSessionRef.current !== sessionId) return;
            clearTimer();
            setProgressPct(100);
            if (idx + 1 < track.chapters.length) {
              speakChapter(track, idx + 1, vol, rate);
            } else {
              setIsPlaying(false);
              setIsPaused(false);
            }
          };

          utter.onerror = () => {
            // Keep visual progress ticker alive cleanly
          };

          window.speechSynthesis.speak(utter);
        } catch {
          // Graceful fallback
        }
      }
    },
    [clearTimer, speechSupported, stopNarration]
  );

  const startMachineNarration = useCallback(
    (machineId: FeaturedMachineId, startChapter = 0) => {
      const track = buildTrackForMachine(machineId);
      speakChapter(track, startChapter, narrationVolume, readingSpeed);
    },
    [narrationVolume, readingSpeed, speakChapter]
  );

  const startIntroNarration = useCallback(() => {
    speakChapter(INTRO_TRACK, 0, narrationVolume, readingSpeed);
  }, [narrationVolume, readingSpeed, speakChapter]);

  const startCustomNarration = useCallback(
    (id: string, label: string, title: string, text: string) => {
      speakChapter(
        { id, label, chapters: [{ title, text }] },
        0,
        narrationVolume,
        readingSpeed
      );
    },
    [narrationVolume, readingSpeed, speakChapter]
  );

  const togglePlayPause = useCallback(() => {
    if (!activeTrack) {
      startIntroNarration();
      return;
    }
    if (isPlaying && !isPaused) {
      if (speechSupported) window.speechSynthesis.pause();
      clearTimer();
      setIsPaused(true);
    } else if (isPaused) {
      if (speechSupported) window.speechSynthesis.resume();
      setIsPaused(false);
      speakChapter(activeTrack, chapterIndex, narrationVolume, readingSpeed);
    } else {
      speakChapter(activeTrack, chapterIndex, narrationVolume, readingSpeed);
    }
  }, [
    activeTrack,
    chapterIndex,
    clearTimer,
    isPaused,
    isPlaying,
    narrationVolume,
    readingSpeed,
    speakChapter,
    speechSupported,
    startIntroNarration,
  ]);

  const nextChapter = useCallback(() => {
    if (!activeTrack) return;
    const nextIdx = Math.min(activeTrack.chapters.length - 1, chapterIndex + 1);
    speakChapter(activeTrack, nextIdx, narrationVolume, readingSpeed);
  }, [activeTrack, chapterIndex, narrationVolume, readingSpeed, speakChapter]);

  const prevChapter = useCallback(() => {
    if (!activeTrack) return;
    const prevIdx = Math.max(0, chapterIndex - 1);
    speakChapter(activeTrack, prevIdx, narrationVolume, readingSpeed);
  }, [activeTrack, chapterIndex, narrationVolume, readingSpeed, speakChapter]);

  const replayChapter = useCallback(() => {
    if (!activeTrack) return;
    speakChapter(activeTrack, chapterIndex, narrationVolume, readingSpeed);
  }, [activeTrack, chapterIndex, narrationVolume, readingSpeed, speakChapter]);

  const jumpToChapter = useCallback(
    (index: number) => {
      if (!activeTrack) return;
      const clamped = Math.max(0, Math.min(activeTrack.chapters.length - 1, index));
      speakChapter(activeTrack, clamped, narrationVolume, readingSpeed);
    },
    [activeTrack, narrationVolume, readingSpeed, speakChapter]
  );

  const setNarrationVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(1, vol));
      setNarrationVolumeState(clamped);
      if (activeTrack && isPlaying && !isPaused) {
        speakChapter(activeTrack, chapterIndex, clamped, readingSpeed);
      }
    },
    [activeTrack, chapterIndex, isPaused, isPlaying, readingSpeed, speakChapter]
  );

  const setReadingSpeed = useCallback(
    (rate: number) => {
      setReadingSpeedState(rate);
      if (activeTrack && isPlaying && !isPaused) {
        speakChapter(activeTrack, chapterIndex, narrationVolume, rate);
      }
    },
    [activeTrack, chapterIndex, isPaused, isPlaying, narrationVolume, speakChapter]
  );

  const toggleAmbience = useCallback(() => {
    setAmbienceEnabled((prev) => {
      const next = !prev;
      if (next) {
        spaceAudioEngine.startAmbience(ambienceVolume);
      } else {
        spaceAudioEngine.stopAmbience();
      }
      return next;
    });
  }, [ambienceVolume]);

  const setAmbienceVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setAmbienceVolumeState(clamped);
    spaceAudioEngine.setAmbienceVolume(clamped);
  }, []);

  const playEffect = useCallback(
    (id: SoundEffectId) => {
      spaceAudioEngine.playSoundEffect(id, narrationVolume);
    },
    [narrationVolume]
  );

  useEffect(() => {
    return () => {
      clearTimer();
      spaceAudioEngine.stopAmbience();
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [clearTimer, speechSupported]);

  return (
    <ExperienceContext.Provider
      value={{
        activeTrack,
        chapterIndex,
        isPlaying,
        isPaused,
        progressPct,
        narrationVolume,
        readingSpeed,
        speechSupported,
        startMachineNarration,
        startIntroNarration,
        startCustomNarration,
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
        textSize,
        setTextSize,
        reducedMotion,
        setReducedMotion,
        highContrast,
        setHighContrast,
        captionsAlwaysOn,
        setCaptionsAlwaysOn,
        transcriptOpen,
        setTranscriptOpen,
        favorites,
        toggleFavorite,
        savedDiscoveries,
        toggleSavedDiscovery,
        exploredMachines,
        recordExploredMachine,
        earnedBadges,
        unlockBadge,
        completedSims,
        recordSimCompletion,
        completedTours,
        recordTourCompletion,
        explainLevel,
        setExplainLevel,
        communityPosts,
        addCommunityPost,
        clearExplorerProgress,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error('useExperience must be used inside ExperienceProvider');
  }
  return ctx;
}
