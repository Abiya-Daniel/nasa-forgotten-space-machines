export type PageId =
  | 'home'
  | 'machines'
  | 'moon'
  | 'mars'
  | 'map'
  | 'timeline'
  | 'why'
  | 'discoveries'
  | 'learn'
  | 'media'
  | 'gallery'
  | 'about'
  | 'missions'
  | 'history'
  | 'engineering'
  | 'historian'
  | 'passport';

export type PlanetaryBody = 'moon' | 'mars' | 'deep-space' | 'orbital';

export type EquipmentStatus =
  | 'active'
  | 'travelling'
  | 'silent'
  | 'retired'
  | 'inactive'
  | 'crashed'
  | 'abandoned';

export type EquipmentCategory =
  | 'descent-stage'
  | 'rover'
  | 'lander'
  | 'science-package'
  | 'impactor'
  | 'aircraft'
  | 'probe'
  | 'orbiter'
  | 'telescope';

export type CoordinatePrecision = 'verified' | 'approximate' | 'unknown';

export interface EquipmentCoordinates {
  lat: number | null; // degrees North (+N, -S)
  lonEast: number | null; // 0 to 360 East convention (standard planetary cartography)
  lonSigned: number | null; // -180 to +180 (+E, -W) for equirectangular projection
  precision: CoordinatePrecision;
  region: string;
  source: string;
}

export interface EquipmentPhoto {
  nasaId: string;
  title: string;
  imageUrl: string;
  fallbackUrl: string;
  credit: string;
  sourceUrl: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  mission: string;
  body: PlanetaryBody;
  agency: string;
  category: EquipmentCategory;
  categoryLabel: string;
  status: EquipmentStatus;
  launchDate: string;
  landingDate: string;
  endDate?: string;
  nssdcaId: string;
  nssdcaUrl: string;
  coordinates: EquipmentCoordinates;
  massKg?: string;
  powerSource?: string;
  designLifetime?: string;
  missionDuration?: string;
  communicationSystem?: string;
  scientificInstruments?: string[];
  missionChallenges?: string;
  distanceTravelledOrFromEarth?: string;
  lastCheckedDate?: string;
  isEstimatedTelemetry?: boolean;
  missionPurpose: string;
  achievements: string[];
  whyLeftBehind: string;
  scientificValue: string;
  futureEncounters: string;
  photo: EquipmentPhoto;
  references: { label: string; url: string }[];
  featured?: boolean;
  featuredStoryId?: FeaturedMachineId;
}

export type FeaturedMachineId =
  | 'apollo-15-lrv1'
  | 'opportunity-mer-b'
  | 'insight-lander'
  | 'voyager-1';

export type Spacecraft3DId =
  | FeaturedMachineId
  | 'cassini-huygens'
  | 'hubble';

export interface Spacecraft3DHotspot {
  id: string;
  name: string;
  subsystem: string;
  pos: [number, number, number];
  cameraOffset: [number, number, number];
  technicalSpec: string;
  purpose: string;
  howItWorks: string;
  whyItMatters: string;
}

export interface Spacecraft3DModelDef {
  id: Spacecraft3DId;
  name: string;
  mission: string;
  subtitle: string;
  hotspots: Spacecraft3DHotspot[];
}

export interface DossierChapter {
  index: number;
  title: string;
  summary: string;
  body: string;
  factHighlight: string;
  sourceNote: string;
}

export interface AnatomyComponent {
  id: string;
  label: string;
  subsystem: string;
  xPct: number;
  yPct: number;
  material: string;
  role: string;
  currentState: string;
}

export interface FeaturedMachineDossier {
  id: FeaturedMachineId;
  equipmentId: string;
  subtitle: string;
  tagline: string;
  statusNote: string;
  lastCheckedDate: string;
  heroPhoto: EquipmentPhoto;
  creativeStorytellingTitle: string;
  creativeStorytellingDisclaimer: string;
  creativeStorytellingPassage: string;
  chapters: DossierChapter[];
  anatomyTitle: string;
  anatomySubtitle: string;
  anatomyComponents: AnatomyComponent[];
  specs: { label: string; value: string }[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  dateLabel: string;
  body: PlanetaryBody;
  mission: string;
  title: string;
  objective: string;
  achievement: string;
  equipmentLeft: string;
  equipmentId: string;
  nssdcaId: string;
}

export interface NasaImageSearchItem {
  nasaId: string;
  title: string;
  description: string;
  center: string;
  dateCreated: string;
  keywords: string[];
  previewUrl: string;
  detailsUrl: string;
  mediaType?: 'image' | 'video' | 'audio';
}

export interface CuratedVideoItem {
  id: string;
  nasaId: string;
  title: string;
  mission: string;
  category:
    | 'Launch'
    | 'Landing & Deployment'
    | 'Rover Exploration'
    | 'Deep Space'
    | 'Scientific Discovery';
  durationLabel: string;
  description: string;
  captionTranscript: string;
  credit: string;
  detailsUrl: string;
  posterUrl: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceLabel: string;
}

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  sourceLabel: string;
}

export interface MatchingPair {
  id: string;
  machine: string;
  discovery: string;
  hint: string;
}

export interface OrderingMilestone {
  id: string;
  year: number;
  label: string;
  detail: string;
}

export interface GuessCraftPuzzle {
  id: string;
  answerName: string;
  mission: string;
  clues: [string, string, string];
  options: string[];
  fact: string;
}

export interface MissionScenario {
  id: string;
  title: string;
  machine: string;
  situation: string;
  choices: {
    label: string;
    isOptimal: boolean;
    outcome: string;
  }[];
}

export interface GlossaryTerm {
  term: string;
  category:
    | 'Propulsion & Physics'
    | 'Instruments & Power'
    | 'Planetary Geology'
    | 'Deep Space Navigation';
  definition: string;
  example: string;
}

export interface FinalSignalEntry {
  id: string;
  equipmentId: string;
  machineName: string;
  mission: string;
  statusLabel: string;
  lastSignalDate: string;
  finalEventSummary: string;
  confirmedCause: string;
  scientificInterpretation: string;
  unknownOrUncertain: string;
  aftermath: string;
  signalStrengthTimeline: { label: string; level: number }[];
  photo: EquipmentPhoto;
  sourceUrl: string;
}

export interface DiscoveryInvestigationCase {
  id: string;
  title: string;
  machine: string;
  world: 'Moon' | 'Mars' | 'Outer Solar System';
  observationPrompt: string;
  question: string;
  options: string[];
  correctIndex: number;
  scientificInterpretation: string;
  meaningForScience: string;
  photo: EquipmentPhoto;
  sourceLabel: string;
  sourceUrl: string;
}

export interface PanoramaHotspot {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  featureType: string;
  description: string;
}

export interface PanoramaScene {
  id: string;
  title: string;
  world: 'The Moon' | 'Mars';
  mission: string;
  dateLabel: string;
  description: string;
  nasaId: string;
  credit: string;
  sourceUrl: string;
  imageUrl: string;
  hotspots: PanoramaHotspot[];
}

export interface ScaleMetricItem {
  name: string;
  mission: string;
  lengthMeters: number;
  massKg: number;
  speedKmH: number;
  distanceKm: number;
  powerWatts: number;
  oneWayLightDelaySec: number;
  durationYears: number;
}

export interface ExplorerBadge {
  id: string;
  title: string;
  description: string;
  criterion: string;
}

export interface DataSourceRecord {
  name: string;
  url: string;
  publisher: string;
  license: string;
  usage: string;
  category:
    | 'NASA Official Data'
    | 'NASA Mapping Service'
    | 'NASA Media Archive'
    | 'Software Library';
}
