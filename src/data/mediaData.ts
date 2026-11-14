import { CuratedVideoItem } from '../types/equipment';

export const CURATED_NASA_VIDEOS: CuratedVideoItem[] = [
  {
    id: 'vid-apollo15-hammer',
    nasaId: 'a-15-hammer-and-feather',
    title: 'Apollo 15 Hammer & Feather Drop beside LRV-1 at Hadley–Apennine',
    mission: 'Apollo 15',
    category: 'Scientific Discovery',
    durationLabel: 'Archival Film (~1 min)',
    description:
      'Near the parked Lunar Roving Vehicle, Commander David Scott drops a geological hammer and falcon feather simultaneously—confirming Galileo’s principle in lunar vacuum.',
    captionTranscript:
      'Transcript (Apollo 15 EVA-3, August 2, 1971): Commander David Scott demonstrates that in the absence of air resistance on the Moon, a heavy geological hammer and a feather hit the lunar regolith at the exact same instant, just steps away from Lunar Roving Vehicle 1.',
    credit: 'NASA / Johnson Space Center (Public Domain)',
    detailsUrl: 'https://images.nasa.gov/details-a-15-hammer-and-feather',
    posterUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~medium.jpg',
  },
  {
    id: 'vid-opportunity-legacy',
    nasaId: 'JPL-20190213-MERf-0001-Opportunity Complete',
    title: 'Opportunity Rover: 14.5 Years Across Meridiani Planum',
    mission: 'Mars Exploration Rover – Opportunity',
    category: 'Rover Exploration',
    durationLabel: 'Documentary Briefing',
    description:
      'NASA JPL’s retrospective tracing Opportunity’s 2004 airbag landing inside Eagle Crater, 45.16 km marathon drive, and the 2018 global dust storm.',
    captionTranscript:
      'Captions Summary: Built for a 90-sol mission in 2004, Opportunity survived nearly 15 Earth years on Mars, finding ancient water-altered hematite spheres and clay minerals before a planet-encircling dust storm halted solar charging in June 2018.',
    credit: 'NASA / Jet Propulsion Laboratory-Caltech',
    detailsUrl: 'https://images.nasa.gov/search?q=Opportunity%20rover&media=video',
    posterUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
  },
  {
    id: 'vid-insight-landing',
    nasaId: 'JPL-20181126-INSIGHf-0001-InSight Touchdown',
    title: 'InSight Lander: Touchdown & SEIS Seismometer Deployment',
    mission: 'InSight',
    category: 'Landing & Deployment',
    durationLabel: 'Mission Animation & Control Room',
    description:
      'Covers InSight’s November 26, 2018 descent into Elysium Planitia and how its robotic arm placed the copper-shielded SEIS seismometer directly on Martian soil.',
    captionTranscript:
      'Captions Summary: Mission controllers at JPL monitor telemetry relayed by the MarCO CubeSats as InSight fires its retro-rockets, touches down safely on Elysium Planitia, and unfurls its twin circular solar arrays.',
    credit: 'NASA / Jet Propulsion Laboratory-Caltech',
    detailsUrl: 'https://images.nasa.gov/search?q=InSight%20Mars%20landing&media=video',
    posterUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
  },
  {
    id: 'vid-voyager-interstellar',
    nasaId: 'JPL-20170817-VOYf-0001-Voyager 40th Anniversary',
    title: 'Voyager 1 & 2: From Jupiter and Saturn to Interstellar Space',
    mission: 'Voyager Interstellar Mission',
    category: 'Deep Space',
    durationLabel: 'Documentary Visualization',
    description:
      'Visualizes the 1977 Grand Tour trajectory, the "Pale Blue Dot" family portrait, and Voyager 1 crossing the Sun’s heliopause into interstellar space.',
    captionTranscript:
      'Captions Summary: Launched in 1977 on a rare outer-planet alignment, Voyager 1 and Voyager 2 discovered active volcanoes on Io, mapped Saturn’s rings, and crossed beyond the Sun’s solar wind bubble into the interstellar medium.',
    credit: 'NASA / Jet Propulsion Laboratory-Caltech',
    detailsUrl: 'https://images.nasa.gov/search?q=Voyager%20interstellar&media=video',
    posterUrl: 'https://images-assets.nasa.gov/image/PIA22567/PIA22567~medium.jpg',
  },
  {
    id: 'vid-apollo15-launch',
    nasaId: 'KSC-71PC-0426',
    title: 'Apollo 15 Saturn V Launch Carrying LRV-1 to Hadley Rille',
    mission: 'Apollo 15',
    category: 'Launch',
    durationLabel: 'Archival Launch Footage',
    description:
      'Liftoff of the massive Saturn V rocket from Kennedy Space Center Launch Complex 39A on July 26, 1971.',
    captionTranscript:
      'Captions Summary: Five F-1 rocket engines ignite at Kennedy Space Center Pad 39A, lifting the Apollo 15 crew, Command Module Endeavour, Lunar Module Falcon, and the folded Lunar Roving Vehicle toward Earth orbit and the Moon.',
    credit: 'NASA / Kennedy Space Center',
    detailsUrl: 'https://images.nasa.gov/search?q=Apollo%2015%20Saturn%20V%20launch&media=video',
    posterUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~thumb.jpg',
  },
  {
    id: 'vid-ingenuity-flight',
    nasaId: 'JPL-20210419-INGENf-0001-Ingenuity First Flight',
    title: 'Ingenuity Mars Helicopter: First Powered Flight on Another Planet',
    mission: 'Mars 2020 / Ingenuity',
    category: 'Rover Exploration',
    durationLabel: 'Perseverance Mastcam-Z Footage',
    description:
      'Actual footage filmed by Perseverance showing Ingenuity spinning up its blades, hovering 3 meters above Jezero Crater, and touching back down on April 19, 2021.',
    captionTranscript:
      'Captions Summary: Inside Jezero Crater at Wright Brothers Field, the 1.8 kg Ingenuity rotorcraft spins its carbon-fiber blades to ~2,537 rpm, lifts off the Martian dust, hovers for 30 seconds, and lands safely.',
    credit: 'NASA / JPL-Caltech / ASU / MSSS',
    detailsUrl: 'https://images.nasa.gov/search?q=Ingenuity%20first%20flight&media=video',
    posterUrl: 'https://images-assets.nasa.gov/image/PIA25970/PIA25970~thumb.jpg',
  },
];

export const AUDIO_EFFECT_PRESETS = [
  {
    id: 'rocket-launch',
    title: 'Rocket Launch Ignition & Acoustic Rumble',
    label: 'Synthesized Educational Sound Effect (Web Audio API)',
    description:
      'Models the low-frequency broadband roar and sub-bass rumble of heavy rocket boosters lifting off—synthesized mathematically in your browser, not a recorded audio file.',
    durationSec: 4.5,
  },
  {
    id: 'radio-telemetry',
    title: 'Deep Space Radio Carrier & DSN Telemetry Ping',
    label: 'Synthesized Educational Sound Effect (Web Audio API)',
    description:
      'Simulates high-frequency X-band carrier acquisition tones and discrete binary phase-shift keying telemetry pulses received by Deep Space Network dishes.',
    durationSec: 3.5,
  },
  {
    id: 'rover-servo',
    title: 'Rover Wheel Hub Motors & Servo Actuators',
    label: 'Synthesized Educational Sound Effect (Web Audio API)',
    description:
      'Reproduces the gentle electric stepper-motor whirr and chassis creak of an aluminum rover traversing rocky regolith.',
    durationSec: 3.5,
  },
  {
    id: 'seismometer',
    title: 'Marsquake Seismometer Sonification Pulse',
    label: 'Synthesized Educational Sound Effect (Web Audio API)',
    description:
      'Low-frequency seismic thrum followed by P-wave and S-wave reverberations modeled on how geophysicists sonify planetary quakes for human ears.',
    durationSec: 4.0,
  },
  {
    id: 'plasma-wave',
    title: 'Interstellar Plasma Wave Sweep',
    label: 'Synthesized Educational Sound Effect (Web Audio API)',
    description:
      'Sweeping harmonic resonance illustrating electron plasma oscillations measured beyond the Sun’s heliopause.',
    durationSec: 4.0,
  },
] as const;

export type SoundEffectId = (typeof AUDIO_EFFECT_PRESETS)[number]['id'];
