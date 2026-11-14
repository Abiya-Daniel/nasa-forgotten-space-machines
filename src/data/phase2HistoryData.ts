import { PageId } from '../types/equipment';

export interface AlmostFailedCase {
  id: string;
  mission: string;
  year: string;
  equipmentId: string;
  title: string;
  crisis: string;
  engineeringFix: string;
  outcome: string;
  lessonLearned: string;
  photoUrl: string;
  nasaId: string;
  credit: string;
}

export const ALMOST_FAILED_CASES: AlmostFailedCase[] = [
  {
    id: 'af-apollo13',
    mission: 'Apollo 13 (1970)',
    year: '1970',
    equipmentId: 'apollo-11-eagle',
    title: 'Ruptured Oxygen Tank & Square-Peg CO2 Scrubber',
    crisis:
      '200,000 miles from Earth, Oxygen Tank No. 2 exploded inside the Service Module, draining power, water, and breathable oxygen while disabling the Command Module.',
    engineeringFix:
      'Astronauts powered down Odyssey, used the Aquarius Lunar Module as a lifeboat, and built an improvised square-to-round CO2 scrubber adapter out of flight manuals, plastic bags, hose, and duct tape.',
    outcome:
      'All three astronauts splashed down safely in the Pacific; the Lunar Module Aquarius burned up cleanly over the ocean—leaving no surface debris on the Moon.',
    lessonLearned:
      'Standardized cross-module connectors and fault-tolerant redundant oxygen plumbing became mandatory on future crewed spacecraft.',
    photoUrl: 'https://images-assets.nasa.gov/image/as13-60-8616/as13-60-8616~medium.jpg',
    nasaId: 'as13-60-8616',
    credit: 'NASA / Johnson Space Center',
  },
  {
    id: 'af-apollo12',
    mission: 'Apollo 12 (1969)',
    year: '1969',
    equipmentId: 'apollo-12-intrepid',
    title: 'Double Lightning Strike 36 Seconds After Liftoff',
    crisis:
      'Two lightning bolts struck the rising Saturn V rocket, knocking out all three fuel cells and flooding Mission Control screens with scrambled telemetry.',
    engineeringFix:
      'EECOM John Aaron remembered an obscure test signal and called "Flight, try SCE to Aux!"—Astronaut Alan Bean flipped the Signal Conditioning Electronics switch, restoring telemetry and resetting the fuel cells.',
    outcome:
      'Apollo 12 reached lunar orbit and landed Intrepid within 163 meters of Surveyor 3.',
    lessonLearned:
      'Deep knowledge of secondary telemetry modes and launch weather rules saved the mission from an unnecessary abort.',
    photoUrl: 'https://images-assets.nasa.gov/image/as12-48-7133/as12-48-7133~medium.jpg',
    nasaId: 'as12-48-7133',
    credit: 'NASA / Johnson Space Center',
  },
  {
    id: 'af-voyager2',
    mission: 'Voyager 2 (1978–1981)',
    year: '1978–1981',
    equipmentId: 'voyager-2',
    title: 'Primary Receiver Failure & Jammed Scan Platform',
    crisis:
      'Eight months after launch, Voyager 2’s primary radio receiver failed and its backup had a broken capacitor that could only listen across a tiny frequency window shifting with spacecraft temperature. Later at Saturn, its camera scan platform jammed.',
    engineeringFix:
      'JPL engineers learned to calculate the exact temperature of the spacecraft before transmitting so Earth’s signal matched the narrow window. Later they diagnosed lubricant depletion in the scan actuator and rotated the entire spacecraft when needed at Uranus and Neptune.',
    outcome:
      'Voyager 2 became the only spacecraft ever to visit Jupiter, Saturn, Uranus, and Neptune—and remains operational in interstellar space today.',
    lessonLearned:
      'Pre-calculating thermal frequency drift and rolling an entire probe turned apparent mechanical end-of-mission failures into a 49-year triumph.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA01973/PIA01973~medium.jpg',
    nasaId: 'PIA01973',
    credit: 'NASA / JPL-Caltech',
  },
  {
    id: 'af-galileo',
    mission: 'Galileo Jupiter Orbiter (1991)',
    year: '1991',
    equipmentId: 'galileo',
    title: 'Jammed Umbrella High-Gain Antenna',
    crisis:
      'En route to Jupiter, Galileo’s 4.8-meter umbrella-like High-Gain Antenna failed to unfurl when three of its 18 graphite ribs stuck to the central tower, slashing data rates by 10,000x.',
    engineeringFix:
      'Engineers rewrote Galileo’s onboard software from millions of kilometers away to compress images with advanced algorithms and turn the tiny Low-Gain Antenna into the primary science downlink—paired with upgraded Deep Space Network arrays.',
    outcome:
      'Galileo still discovered Europa’s subsurface saltwater ocean and orbited Jupiter for 8 years before its deliberate 2003 atmospheric plunge.',
    lessonLearned:
      'Reprogrammable flight computers and high-efficiency data compression can rescue hardware missions long after launch.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA02879/PIA02879~medium.jpg',
    nasaId: 'PIA02879',
    credit: 'NASA / JPL',
  },
  {
    id: 'af-hubble',
    mission: 'Hubble Space Telescope (1990–1993)',
    year: '1990–1993',
    equipmentId: 'hubble-hst',
    title: '2.2-Micron Primary Mirror Flaw',
    crisis:
      'After launch, Hubble’s first images were blurry because its 2.4-meter primary mirror was ground slightly too flat at the edge by ~2.2 micrometers (1/50th the width of a human hair).',
    engineeringFix:
      'Space Shuttle Endeavour (STS-61) astronauts installed corrective optics (COSTAR and WFPC2) essentially giving Hubble "contact lenses" in orbit.',
    outcome:
      'Hubble became the most productive optical observatory in history—still active in Earth orbit 36+ years after launch.',
    lessonLearned:
      'Independent optical cross-checks during fabrication and modular orbital servicing transformed an early crisis into a generational icon.',
    photoUrl: 'https://images-assets.nasa.gov/image/STS125-S-031/STS125-S-031~medium.jpg',
    nasaId: 'STS125-S-031',
    credit: 'NASA / Johnson Space Center',
  },
  {
    id: 'af-purgatory',
    mission: 'Opportunity Rover (2005)',
    year: '2005',
    equipmentId: 'opportunity-mer-b',
    title: 'Five Weeks Trapped in Purgatory Dune',
    crisis:
      'All six of Opportunity’s wheels sank hub-deep into a soft windblown ripple of Martian dust ("Purgatory Dune") on Sol 446, spinning uselessly in place.',
    engineeringFix:
      'JPL engineers built an exact sand-trap testbed on Earth using simulated Martian soil and commanded millimeter-by-millimeter backward wheel pulses over five careful weeks.',
    outcome:
      'Opportunity climbed free on June 4, 2005 and went on to drive over 40 additional kilometers to Endeavour Crater.',
    lessonLearned:
      'Visual odometry slip-checks became standard software on Curiosity and Perseverance.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
    nasaId: 'PIA19157',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona',
  },
];

export interface LostArchiveEntry {
  id: string;
  name: string;
  agency: string;
  year: string;
  body: string;
  fateCategory: 'Verified Impact / Loss' | 'Unrecovered Telemetry Silence' | 'Discovered Later by Orbiter';
  confirmedCause: string;
  unconfirmedMystery: string;
  photoUrl: string;
  nasaId: string;
}

export const LOST_IN_SPACE_ARCHIVE: LostArchiveEntry[] = [
  {
    id: 'lost-mco',
    name: 'Mars Climate Orbiter',
    agency: 'NASA / JPL',
    year: '1999',
    body: 'Mars Upper Atmosphere',
    fateCategory: 'Verified Impact / Loss',
    confirmedCause:
      'Ground software output thruster impulse in imperial pound-force seconds while onboard flight software expected metric newton-seconds—sending the orbiter ~170 km too low into Mars’s atmosphere on Sept 23, 1999.',
    unconfirmedMystery:
      'Exact altitude where structural breakup or atmospheric skip occurred after signal loss behind Mars.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA04016/PIA04016~thumb.jpg',
    nasaId: 'PIA04016',
  },
  {
    id: 'lost-mpl',
    name: 'Mars Polar Lander & Deep Space 2',
    agency: 'NASA / JPL',
    year: '1999',
    body: 'Mars South Polar Layered Deposits',
    fateCategory: 'Unrecovered Telemetry Silence',
    confirmedCause:
      'Investigation board concluded a spurious magnetic transient spike when the landing legs unfolded likely tricked onboard software into shutting off descent engines ~40 meters above the surface.',
    unconfirmedMystery:
      'Because the lander did not transmit during descent, the exact crash site and final attitude remain visually unconfirmed.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA04016/PIA04016~thumb.jpg',
    nasaId: 'PIA04016',
  },
  {
    id: 'lost-beagle2',
    name: 'Beagle 2 Mars Lander',
    agency: 'UK / ESA',
    year: '2003 (Found 2015)',
    body: 'Isidis Planitia, Mars',
    fateCategory: 'Discovered Later by Orbiter',
    confirmedCause:
      'For 11 years Beagle 2 was missing. In 2015, NASA Mars Reconnaissance Orbiter HiRISE imagery revealed Beagle 2 landed safely intact on Isidis Planitia, but only 2 or 3 of its 4 solar petals unfolded—blocking the RF antenna.',
    unconfirmedMystery:
      'Whether a tangled airbag or stiff hinge spring prevented the final solar petal from locking open.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
    nasaId: 'PIA19157',
  },
  {
    id: 'lost-schiaparelli',
    name: 'Schiaparelli EDM Lander',
    agency: 'ESA / Roscosmos',
    year: '2016',
    body: 'Meridiani Planum, Mars',
    fateCategory: 'Verified Impact / Loss',
    confirmedCause:
      'During parachute deployment, a 1-second saturation of the Inertial Measurement Unit caused guidance software to compute a negative altitude, jettisoning the parachute and firing retrothrusters for just 3 seconds at ~3.7 km high.',
    unconfirmedMystery:
      'Full crater ejecta depth and subsurface dispersal verified only via orbital HiRISE photography.',
    photoUrl: 'https://images-assets.nasa.gov/image/PIA15696/PIA15696~medium.jpg',
    nasaId: 'PIA15696',
  },
];

export interface AutopsyCase {
  id: string;
  mission: string;
  year: string;
  clues: { label: string; evidence: string }[];
  question: string;
  options: string[];
  correctIndex: number;
  forensicVerdict: string;
  legacyFix: string;
}

export const MISSION_AUTOPSY_CASES: AutopsyCase[] = [
  {
    id: 'autopsy-mco',
    mission: 'Mars Climate Orbiter (1999)',
    year: 'September 23, 1999',
    clues: [
      { label: 'Clue 1: Trajectory Drift', evidence: 'Navigation teams noticed the spacecraft drifting steadily lower during Earth-to-Mars cruise after small reaction-wheel desaturation burns.' },
      { label: 'Clue 2: Software Interface', evidence: 'The ground Small Forces file transmitted thruster impulse integers without unit tags.' },
      { label: 'Clue 3: Factor of 4.45', evidence: 'Every trajectory discrepancy scaled consistently by ~4.448× between predicted and observed Doppler tracking.' },
      { label: 'Clue 4: Final Periapsis', evidence: 'Planned Mars orbit insertion altitude was 226 km; actual approach passed at ~57 km inside dense atmosphere.' },
    ],
    question: 'Based on the 4.448× scaling mismatch, what caused Mars Climate Orbiter’s loss?',
    options: [
      'A unit conversion error: ground software reported pound-force seconds while flight software expected SI newton-seconds (1 lbf·s = 4.448 N·s)',
      'A micrometeoroid shattered the main solar array 2 minutes before orbit insertion',
      'The Deep Space Network pointed toward Venus instead of Mars',
    ],
    correctIndex: 0,
    forensicVerdict:
      'Confirmed by NASA’s Mishap Investigation Board: Lockheed Martin ground software output English pound-force seconds while JPL navigation software assumed metric newton-seconds.',
    legacyFix:
      'NASA instituted strict end-to-end SI unit interface verification and independent navigation cross-team audits for Mars Odyssey, MRO, and later missions.',
  },
  {
    id: 'autopsy-mpl',
    mission: 'Mars Polar Lander (1999)',
    year: 'December 3, 1999',
    clues: [
      { label: 'Clue 1: Blackout Design', evidence: 'To save mass, the lander had no live radio telemetry link during Entry, Descent, and Landing.' },
      { label: 'Clue 2: Leg Deployment', evidence: 'At ~1,500 m altitude, the three landing legs unfolded and snapped into locked position.' },
      { label: 'Clue 3: Hall-Effect Switch', evidence: 'Post-loss ground tests proved leg deployment vibrated the touchdown magnetic sensor, generating a false 10-millisecond "touchdown" voltage spike.' },
      { label: 'Clue 4: Flight Code', evidence: 'The landing software was not cleared to ignore false leg signals before descending below 40 meters.' },
    ],
    question: 'What most likely happened ~40 meters above Mars’s south polar plains?',
    options: [
      'A software logic flaw interpreted leg-deployment vibration as ground contact and shut off descent engines prematurely at ~40 m altitude',
      'Strong polar winds blew the parachute straight back into orbit',
      'The onboard RTG ran out of plutonium during cruise',
    ],
    correctIndex: 0,
    forensicVerdict:
      'The review board identified a false touchdown switch transient during leg deployment combined with missing software debouncing before 40 m altitude as the single most probable cause.',
    legacyFix:
      'Every subsequent NASA Mars lander (Phoenix, InSight, Curiosity, Perseverance) added continuous descent telemetry or relay tracking plus strict sensor debouncing.',
  },
  {
    id: 'autopsy-beagle2',
    mission: 'Beagle 2 (2003 — Solved 2015)',
    year: 'Dec 25, 2003 / Found Jan 2015',
    clues: [
      { label: 'Clue 1: Separation Nominal', evidence: 'Beagle 2 separated cleanly from ESA’s Mars Express orbiter on Dec 19, 2003.' },
      { label: 'Clue 2: Silence on Mars', evidence: 'Neither Mars Odyssey nor Jodrell Bank telescope ever heard Beagle 2’s wake-up beacon on Christmas Day 2003.' },
      { label: 'Clue 3: 2015 HiRISE Photo', evidence: '11 years later, NASA’s MRO HiRISE camera resolved the tiny lander resting inside its target ellipse on Isidis Planitia.' },
      { label: 'Clue 4: Petal Geometry', evidence: 'High-contrast reflections showed only 2–3 of the 4 clamshell solar petals unfolded—the RF antenna sits underneath petal #4.' },
    ],
    question: 'What did the 2015 orbital forensic discovery prove about Beagle 2?',
    options: [
      'Beagle 2 survived entry and landed intact, but incomplete solar petal deployment blocked its radio antenna from reaching Earth',
      'Beagle 2 burned up high in Mars’s atmosphere due to a missing heat shield',
      'Beagle 2 accidentally landed on Mars’s moon Phobos',
    ],
    correctIndex: 0,
    forensicVerdict:
      'Beagle 2 achieved a soft landing on Mars! Only the final motor/hinge unfolding sequence stalled, trapping the antenna beneath an unopened solar petal.',
    legacyFix:
      'Demonstrated how high-resolution orbital imaging (MRO HiRISE) acts as an archaeological witness for robotic Mars history.',
  },
];

export interface GoldenRecordItem {
  id: string;
  category: 'Mathematics & Cosmic Address' | 'World Greetings & Music' | 'Images of Earth' | 'Pioneer & Apollo Plaques';
  title: string;
  symbolDescription: string;
  meaning: string;
  scientificInsight: string;
}

export const MESSAGES_BEYOND_EARTH_ITEMS: GoldenRecordItem[] = [
  {
    id: 'msg-pulsar-map',
    category: 'Mathematics & Cosmic Address',
    title: '14-Pulsar Galactic Map (Golden Record & Pioneer Plaque)',
    symbolDescription:
      '14 radiating lines with binary dashes pointing out from one central origin—our Sun.',
    meaning:
      'Each line gives the direction and distance to one of 14 millisecond/radio pulsars, with binary ticks encoding its exact rotation period in units of the hydrogen hyperfine transition.',
    scientificInsight:
      'Because pulsars slowly spin down over millions of years, any future astronomer who decodes the chart can compute BOTH where Earth is and roughly when Voyager launched.',
  },
  {
    id: 'msg-hydrogen',
    category: 'Mathematics & Cosmic Address',
    title: 'Hydrogen Hyperfine Transition Clock (1,420 MHz / 21 cm)',
    symbolDescription:
      'Two circles connected by a horizontal bar with tiny vertical lines showing proton and electron spin flipping from parallel to antiparallel.',
    meaning:
      'Defines the universal physical unit of length (21.1 cm wavelength) and time (0.704 nanoseconds period) using the most abundant atom in the universe.',
    scientificInsight:
      'Avoids human units like meters or seconds, grounding the entire Golden Record playback speed (3.6 seconds per revolution) in universal physics.',
  },
  {
    id: 'msg-greetings',
    category: 'World Greetings & Music',
    title: 'Greetings in 55 Languages & 90 Minutes of Music',
    symbolDescription:
      'Gold-plated copper phonograph disc etched at 16⅔ rpm with a stylus and cartridge mounted inside Voyager 1 & 2.',
    meaning:
      'Includes spoken greetings from 55 human languages, humpback whale songs, Bach, Beethoven, Chuck Berry, Blind Willie Johnson, Peruvian panpipes, and Indian raga.',
    scientificInsight:
      'Sealed inside an aluminum jacket electroplated with ultra-pure Uranium-238 (half-life 4.47 billion years) so recipients can radiometrically measure the spacecraft’s travel age.',
  },
  {
    id: 'msg-apollo-disc',
    category: 'Pioneer & Apollo Plaques',
    title: 'Apollo 11 Silicon Goodwill Disc & Lunar Plaque',
    symbolDescription:
      'A 3.8-cm silicon disc etched microscopically with messages from 73 world leaders, plus the stainless steel LM-5 descent stage plaque.',
    meaning:
      'Both remain preserved in the airless vacuum of Mare Tranquillitatis beside Apollo 11 Eagle’s descent legs: "We came in peace for all mankind."',
    scientificInsight:
      'Without wind or rain on the Moon, these metal artifacts will endure almost unchanged for millions of years.',
  },
];

export interface LastPhotoEntry {
  id: string;
  machineName: string;
  mission: string;
  date: string;
  distinction: 'True Final Surface Image' | 'Final Planetary Portrait Before Camera Power-Down' | 'Late-Mission Final Approach Image';
  story: string;
  imageUrl: string;
  nasaId: string;
  credit: string;
  sourceUrl: string;
}

export const LAST_PHOTOGRAPH_RECORDS: LastPhotoEntry[] = [
  {
    id: 'lp-opportunity',
    machineName: 'Opportunity Rover (MER-B)',
    mission: 'Sol 5111 — June 10, 2018',
    date: 'June 10, 2018',
    distinction: 'True Final Surface Image',
    story:
      'During the global 2018 Martian dust storm, Opportunity pointed its Panoramic Camera toward the Sun—capturing only a dim pinprick through thick red dust before cutting off mid-frame as batteries faded.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
    nasaId: 'PIA19157',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona (Archival Rover & Storm Record)',
    sourceUrl: 'https://images.nasa.gov/details-PIA19157',
  },
  {
    id: 'lp-insight',
    machineName: 'InSight Lander',
    mission: 'Sol 1419 — December 2022',
    date: 'December 2022',
    distinction: 'True Final Surface Image',
    story:
      'Shortly before final contact on Dec 15, 2022, InSight photographed its dust-blanketed deck and SEIS seismometer resting quietly on Elysium Planitia—a visual explanation of why solar power finally fell silent.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
    nasaId: 'PIA22876',
    credit: 'NASA / JPL-Caltech',
    sourceUrl: 'https://images.nasa.gov/details-PIA22876',
  },
  {
    id: 'lp-voyager1',
    machineName: 'Voyager 1',
    mission: 'Family Portrait — Feb 14, 1990',
    date: 'February 14, 1990',
    distinction: 'Final Planetary Portrait Before Camera Power-Down',
    story:
      'Voyager 1 is still active today via radio, so it is not silent—but its cameras were permanently turned off after capturing the 60-frame Solar System Family Portrait, including the "Pale Blue Dot" of Earth from 6 billion km away.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~medium.jpg',
    nasaId: 'PIA23645',
    credit: 'NASA / JPL-Caltech',
    sourceUrl: 'https://images.nasa.gov/details-PIA23645',
  },
  {
    id: 'lp-cassini',
    machineName: 'Cassini Orbiter',
    mission: 'Grand Finale — Sept 14, 2017',
    date: 'September 14–15, 2017',
    distinction: 'Late-Mission Final Approach Image',
    story:
      'Hours before entering Saturn’s atmosphere, Cassini imaged its final impact zone on Saturn’s nightside illuminated by ring-shine, then turned its high-gain dish strictly toward Earth for real-time gas sampling.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
    nasaId: 'PIA17172',
    credit: 'NASA / JPL-Caltech / Space Science Institute',
    sourceUrl: 'https://images.nasa.gov/details-PIA17172',
  },
];

export interface UnansweredQuestionItem {
  id: string;
  question: string;
  relatedMachine: string;
  status: 'Partially Explained' | 'Active Scientific Debate' | 'Observational Mystery';
  background: string;
  whatWeKnow: string;
  whyStillOpen: string;
}

export const UNANSWERED_QUESTIONS: UnansweredQuestionItem[] = [
  {
    id: 'uq-viking-lr',
    question: 'Did Viking 1 & 2’s Labeled Release Experiment Detect Chemistry or Biology?',
    relatedMachine: 'Viking 1 & Viking 2 Landers (1976)',
    status: 'Active Scientific Debate',
    background:
      'When Viking added nutrient broth to Martian soil in 1976, radioactive carbon gas spiked rapidly—matching the pre-flight definition of a positive life test.',
    whatWeKnow:
      'Viking’s GC-MS detected no organic molecules, and Phoenix (2008) later discovered reactive perchlorate salts in Martian soil that destroy heated organics and oxidize nutrients abiotically.',
    whyStillOpen:
      'A tiny minority of researchers still debate whether unusual cold-adapted microbes or exotic superoxides caused the exact kinetic curve—making it one of astrobiology’s most famous historical debates.',
  },
  {
    id: 'uq-mars-methane',
    question: 'What Creates Seasonal Methane Plumes Inside Gale Crater?',
    relatedMachine: 'Curiosity Rover (TLS-SAM)',
    status: 'Active Scientific Debate',
    background:
      'Curiosity’s laser spectrometer measures tiny background methane (~0.4 ppb) that rises and falls seasonally—with rare sudden spikes up to ~20 ppb.',
    whatWeKnow:
      'Orbiters like ESA’s Trace Gas Orbiter see virtually zero methane high in the atmosphere, suggesting methane is released locally near the surface and rapidly diluted or destroyed.',
    whyStillOpen:
      'Whether those seasonal pulses come from ancient trapped gas seeping through cracked bedrock, water-rock serpentinization underground, or biological microbes remains unproven.',
  },
  {
    id: 'uq-pioneer-anomaly',
    question: 'Why Did Pioneer 10 & 11 Slow Down Slightly Faster Than Gravity Predicted?',
    relatedMachine: 'Pioneer 10 & Pioneer 11 (1972–2003)',
    status: 'Partially Explained',
    background:
      'For three decades, radio tracking showed both Pioneer probes experiencing a tiny sunward acceleration (~8.74 × 10⁻¹⁰ m/s²), sparking wild theories about modified gravity.',
    whatWeKnow:
      'In 2012, Turyshev et al. reconstructed archival telemetry and showed infrared heat radiating unevenly off the Plutonium RTGs and main electronics box bounced off the back of the dish—producing a tiny thermal photon push.',
    whyStillOpen:
      'While the main mystery is solved, early archival tape gaps still remind scientists how subtle spacecraft thermal design shapes deep-space navigation.',
  },
  {
    id: 'uq-interstellar-boundary',
    question: 'What Causes Unexpected Plasma Density Jumps Beyond the Heliopause?',
    relatedMachine: 'Voyager 1 & Voyager 2',
    status: 'Observational Mystery',
    background:
      'Beyond 121 AU, Voyager 1’s Plasma Wave instrument recorded sharp electron density increases and unexpected magnetic field alignments.',
    whatWeKnow:
      'Solar coronal mass ejections still propagate shockwaves deep into interstellar space, compressing local interstellar plasma.',
    whyStillOpen:
      'Because only two human machines have ever crossed into interstellar space, the full 3D shape of our Sun’s heliosphere remains an active frontier.',
  },
];

export interface GraveyardZone {
  id: string;
  name: string;
  location: string;
  countNote: string;
  examples: string;
  policyReason: string;
}

export const SPACECRAFT_GRAVEYARD_ZONES: GraveyardZone[] = [
  {
    id: 'gy-point-nemo',
    name: 'Point Nemo (Oceanic Pole of Inaccessibility)',
    location: 'South Pacific Ocean (48°52′S, 123°23′W) — 2,688 km from nearest land',
    countNote: '260+ controlled atmospheric reentries since 1971',
    examples: 'Mir Space Station (2001), Progress cargo ships, ATV Jules Verne, future ISS controlled deorbit (~2030)',
    policyReason:
      'Space agencies guide large retiring orbital hardware down into the remotest stretch of Earth’s ocean so unburned titanium tanks pose virtually zero risk to people.',
  },
  {
    id: 'gy-geo',
    name: 'Geostationary Graveyard Orbit ("Supersynchronous")',
    location: '~36,086 km altitude (+300 km above Geostationary Ring)',
    countNote: 'Hundreds of retired weather & communications satellites',
    examples: 'Retired GOES, Intelsat, and communications platforms boosted at end-of-fuel',
    policyReason:
      'Deorbiting from 36,000 km all the way to Earth costs huge fuel; instead, satellites burn their final fuel reserve to climb 300+ km higher, freeing crowded geostationary slots.',
  },
  {
    id: 'gy-moon',
    name: 'Moon Surface Heritage & Impactor Sites',
    location: 'Mare Tranquillitatis, Hadley–Apennine, Mare Imbrium, Cabeus Crater',
    countNote: '70+ robotic & crewed hardware pieces (including 6 Apollo descent stages & 3 LRVs)',
    examples: 'Apollo 11 Eagle stage, Apollo 15 LRV-1, Surveyor 1–7, Lunokhod 1 & 2, LCROSS',
    policyReason:
      'No atmosphere exists to burn hardware up; NASA recommends heritage preservation zones around Apollo sites for future Artemis astronauts.',
  },
  {
    id: 'gy-planetary-protection',
    name: 'Planetary Protection Intentional Vaporizations',
    location: 'Upper atmospheres of Jupiter & Saturn',
    countNote: 'Deliberate end-of-life deorbits to protect ocean moons',
    examples: 'Galileo into Jupiter (2003), Cassini into Saturn (2017)',
    policyReason:
      'Because Galileo and Cassini carried Earth microbes that could survive on icy ocean moons Europa or Enceladus, NASA sacrificed both spacecraft inside gas giants before fuel ran out.',
  },
];

export interface BlueprintComparisonItem {
  id: string;
  machine: string;
  mission: string;
  beforeTitle: string;
  beforeCaption: string;
  afterTitle: string;
  afterCaption: string;
  blueprintSpecs: string[];
  realityNotes: string;
  imageUrl: string;
  nasaId: string;
}

export const BLUEPRINT_BEFORE_AFTER: BlueprintComparisonItem[] = [
  {
    id: 'ba-lrv1',
    machine: 'Apollo 15 LRV-1',
    mission: 'Hadley–Apennine (1971)',
    beforeTitle: '1971 Folded Cleanroom & Stowage Bay Configuration',
    beforeCaption:
      'Engineered to fold to 0.9 × 1.5 × 1.7 m inside Quadrant 1 of the Lunar Module descent stage while supporting 2.3× its own mass on the Moon.',
    afterTitle: 'Parked Heritage Relic Beside Hadley Rille (55+ Years)',
    afterCaption:
      'Still parked ~100 m east of Falcon’s descent stage; camera aimed back for lunar liftoff; silver-zinc batteries long depleted; Lunar Reconnaissance Orbiter images confirm tracks and chassis intact.',
    blueprintSpecs: ['Mass: 210 kg (empty)', 'Tires: Zinc-coated piano wire mesh', 'Drive: 4 × 0.25 hp DC hub motors'],
    realityNotes:
      'Because the Moon lacks wind and rain, sharp thermal swings (-173 °C to +127 °C) and solar UV slowly bleach gold Kapton foil while wheel tracks stay razor-crisp.',
    imageUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~medium.jpg',
    nasaId: 'as15-86-11603',
  },
  {
    id: 'ba-opportunity',
    machine: 'Opportunity Rover (MER-B)',
    mission: 'Meridiani Planum (2004–2018)',
    beforeTitle: '2003 JPL Cleanroom & Petal-Folded Cruise Stage',
    beforeCaption:
      'Pristine gold-anodized warm electronics box, clean dark gallium-arsenide solar wings, rated for a 90-sol Martian warranty and ~600 m traverse.',
    afterTitle: 'Dust-Coated Marathon Veteran in Perseverance Valley (45.16 km)',
    afterCaption:
      'Survived 5,111 sols (56× design life), navigated Endeavour Crater rim, and finally entered eternal silence beneath the 2018 global dust storm.',
    blueprintSpecs: ['Design life: 90 sols / 600 m', 'Actual life: 5,111 sols / 45.16 km', 'Right-front steering actuator locked (2005+)'],
    realityNotes:
      'Engineers adapted to a stuck steering motor and flash-memory wear over 14 years—proving resilient software turns aging hardware into long-lived science laboratories.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
    nasaId: 'PIA19157',
  },
  {
    id: 'ba-insight',
    machine: 'InSight Lander',
    mission: 'Elysium Planitia (2018–2022)',
    beforeTitle: 'Clean Decagonal Solar Deck & Folded Arm (2018)',
    beforeCaption:
      'Twin 2.15-meter UltraFlex circular arrays delivering ~600–700 W on Sol 1 under clear Martian skies.',
    afterTitle: 'Thick Red Dust Blanket After Sol 1440 (Dec 2022)',
    afterCaption:
      'Four years of Martian winds buried solar panels under millimeter-thick reddish dust, cutting power below survival thresholds after recording 1,319 marsquakes.',
    blueprintSpecs: ['Arrays: 2 × 2.15 m UltraFlex', 'SEIS copper dome: Wind & thermal shield', 'HP3 mole halted by hard duricrust soil'],
    realityNotes:
      'Engineers used InSight’s own robotic scoop to trickle sand onto the solar edge—lifting off dust particles in passing breezes and winning 18 bonus months of seismic science.',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
    nasaId: 'PIA22876',
  },
];

export interface TimeMachineEra {
  decade: string;
  headline: string;
  flagship: string;
  computing: string;
  cameras: string;
  power: string;
  commsRate: string;
  mobility: string;
}

export const SPACECRAFT_TIME_MACHINE: TimeMachineEra[] = [
  {
    decade: '1960s',
    headline: 'Vacuum Tubes, Wire-Core Memory & Analog TV',
    flagship: 'Surveyor 1 & Apollo 11 Eagle',
    computing: 'Apollo Guidance Computer: 72 KB ROM (hand-woven copper rope core), 4 KB RAM, 2.048 MHz clock.',
    cameras: 'Vidicon vacuum-tube television cameras transmitted slow-scan black-and-white frames.',
    power: 'Silver-zinc batteries & early low-efficiency (~10%) silicon solar cells.',
    commsRate: 'S-band analog telemetry (~51.2 kbps max near the Moon).',
    mobility: 'Stationary legged landers; Apollo crewed walking traverses.',
  },
  {
    decade: '1970s',
    headline: 'Tape Recorders, First Rovers & Nuclear Deep Space',
    flagship: 'Apollo 15 LRV-1, Viking 1, Voyager 1',
    computing: 'Voyager: Three dual-redundant custom processors (~69 KB total memory, 8-track digital magnetic tape!).',
    cameras: 'Slow-scan vidicon tubes (Voyager) & mechanical facsimile line scanners (Viking).',
    power: 'MHW Plutonium-238 RTGs enabling outer-planet exploration 10–140× farther from the Sun.',
    commsRate: '160 bps to 115.2 kbps across billions of km via 3.7 m dishes.',
    mobility: 'First electric crewed lunar jeep (LRV-1) & tele-operated Soviet Lunokhod 1.',
  },
  {
    decade: '1990s',
    headline: 'Microprocessors, CCD Sensors & Airbag Landings',
    flagship: 'Sojourner, Galileo & Hubble',
    computing: 'Sojourner ran an Intel 80C85 (2 MHz, 512 KB RAM) with early autonomous hazard lasers.',
    cameras: 'Solid-state Charge-Coupled Device (CCD) imagers replaced fragile tubes.',
    power: 'Higher-efficiency Gallium-Arsenide solar cells + warm Electronics Box aerogel insulation.',
    commsRate: 'UHF relay between rover & lander; early JPEG/wavelet onboard image compression.',
    mobility: 'Invention of the 6-wheel Rocker-Bogie passive suspension (now standard on Mars).',
  },
  {
    decade: '2000s',
    headline: 'Radiation-Hardened PowerPC & Ultra-Long Marathons',
    flagship: 'Spirit, Opportunity & Cassini',
    computing: 'RAD6000 (20 MHz, 128 MB DRAM) capable of autonomous obstacle pathfinding (AutoNav).',
    cameras: 'Stereo Panoramic Mast Cameras + Microscopic Imager.',
    power: 'Multi-year triple-junction solar arrays boosted unexpectedly by Martian "cleaning events."',
    commsRate: '100+ kbps UHF relays bouncing through Mars Odyssey & MRO orbiters.',
    mobility: '45.16 km endurance driving across dunes and crater rims.',
  },
  {
    decade: '2010s–2020s',
    headline: 'Sky Cranes, Autonomous AI Vision & First Off-World Flight',
    flagship: 'Curiosity, Perseverance & Ingenuity',
    computing: 'RAD750 (200 MHz) + dedicated FPGA vision coprocessors; Ingenuity flew on a commercial Snapdragon 801 smartphone-era chip!',
    cameras: '20-megapixel color science cameras, laser-induced breakdown spectroscopy (SuperCam), descent microphones.',
    power: 'MMRTG nuclear power (Perseverance) + lithium-ion aviation batteries (Ingenuity).',
    commsRate: 'Up to 2 Mbps UHF orbiter relays + laser optical comms experiments (Psyche DSOC).',
    mobility: 'Terrain Relative Navigation pinpoint landing + powered aerodynamic helicopter flight on Mars.',
  },
];

export interface MissionPatchItem {
  id: string;
  mission: string;
  year: string;
  agency: string;
  badgeColors: [string, string, string];
  symbolism: string;
  relatedMachineId: string;
}

export const MISSION_PATCH_COLLECTION: MissionPatchItem[] = [
  {
    id: 'patch-apollo11',
    mission: 'Apollo 11',
    year: '1969',
    agency: 'NASA',
    badgeColors: ['#1E3A8A', '#E8A95B', '#F8FAFC'],
    symbolism: 'American bald eagle carrying an olive branch landing peacefully on the lunar surface with Earth visible in the black sky—omitting astronaut names to represent all humanity.',
    relatedMachineId: 'apollo-11-eagle',
  },
  {
    id: 'patch-apollo15',
    mission: 'Apollo 15',
    year: '1971',
    agency: 'NASA',
    badgeColors: ['#0F172A', '#38BDF8', '#EF4444'],
    symbolism: 'Three stylized birds soaring over the cratered Hadley–Apennine valley; the three lunar craters in the background discretely spell out the Roman numeral "XV".',
    relatedMachineId: 'apollo-15-lrv1',
  },
  {
    id: 'patch-viking1',
    mission: 'Viking 1',
    year: '1976',
    agency: 'NASA',
    badgeColors: ['#7C2D12', '#F59E0B', '#E2E8F0'],
    symbolism: 'Depicts a stylized Mars lander touching down on crimson Chryse Planitia beneath the Viking helmet crest—marking humanity’s first long-duration Martian surface outpost.',
    relatedMachineId: 'viking-1',
  },
  {
    id: 'patch-voyager',
    mission: 'Voyager 1 & 2',
    year: '1977',
    agency: 'NASA / JPL',
    badgeColors: ['#020617', '#38BDF8', '#FACC15'],
    symbolism: 'A sweeping multi-planet gravitational arc linking Jupiter, Saturn, Uranus, and Neptune alongside the Voyager high-gain dish and Golden Record emblem.',
    relatedMachineId: 'voyager-1',
  },
  {
    id: 'patch-mer',
    mission: 'Spirit & Opportunity (MER)',
    year: '2004',
    agency: 'NASA / JPL',
    badgeColors: ['#991B1B', '#F97316', '#FDE047'],
    symbolism: 'Twin rovers rolling across Mars beneath a rising golden Sun—honoring the twin explorers that turned 90-sol warranties into a 15-year legacy.',
    relatedMachineId: 'opportunity-mer-b',
  },
  {
    id: 'patch-insight',
    mission: 'InSight',
    year: '2018',
    agency: 'NASA / JPL',
    badgeColors: ['#1E1B4B', '#EA580C', '#94A3B8'],
    symbolism: 'A seismic heartbeat waveform crossing Mars’s interior core and mantle—symbolizing humanity’s first deep-interior planetary stethoscope.',
    relatedMachineId: 'insight-lander',
  },
  {
    id: 'patch-mars2020',
    mission: 'Perseverance & Ingenuity',
    year: '2021',
    agency: 'NASA / JPL',
    badgeColors: ['#0F172A', '#38BDF8', '#F59E0B'],
    symbolism: 'Features the rover targeting Jezero Crater’s delta via laser beam while Ingenuity’s rotor silhouette rises above the Martian horizon.',
    relatedMachineId: 'ingenuity-helicopter',
  },
];

export interface MuseumHall {
  id: string;
  hallNumber: string;
  title: string;
  subtitle: string;
  curatorialStatement: string;
  featuredIds: string[];
  highlightFact: string;
  actionTarget: { page: PageId; label: string };
}

export const DIGITAL_MUSEUM_HALLS: MuseumHall[] = [
  {
    id: 'hall-lunar',
    hallNumber: 'HALL 01',
    title: 'The Lunar Heritage Hall',
    subtitle: 'Tranquility Base, Hadley Rille & Soviet Lunokhods',
    curatorialStatement:
      'Preserves the silent ascent stages, retroreflectors, and electric rovers resting on airless mare plains since 1964–1973.',
    featuredIds: ['apollo-15-lrv1', 'apollo-11-eagle', 'lunokhod-1', 'surveyor-3'],
    highlightFact: 'Apollo 11, 14, 15 and Lunokhod 1–2 reflectors still bounce Earth lasers 55+ years later.',
    actionTarget: { page: 'moon', label: 'Enter Lunar Archive' },
  },
  {
    id: 'hall-mars',
    hallNumber: 'HALL 02',
    title: 'The Mars Rover & Lander Hall',
    subtitle: 'From Viking & Sojourner to Perseverance Valley',
    curatorialStatement:
      'Chronicles nearly five decades of machines built to survive toxic dust storms, deep freezes, and ancient lakebeds on the Red Planet.',
    featuredIds: ['opportunity-mer-b', 'insight-lander', 'spirit-mer-a', 'ingenuity-helicopter'],
    highlightFact: 'Opportunity drove 45.16 km on Mars—farther than a marathon.',
    actionTarget: { page: 'mars', label: 'Enter Mars Archive' },
  },
  {
    id: 'hall-deep-space',
    hallNumber: 'HALL 03',
    title: 'The Deep Space & Interstellar Hall',
    subtitle: 'Beyond the Planets, Beyond the Heliopause',
    curatorialStatement:
      'Honors the nuclear-powered explorers crossing the outer solar system and carrying Golden Records into interstellar darkness.',
    featuredIds: ['voyager-1', 'voyager-2', 'pioneer-10', 'new-horizons'],
    highlightFact: 'Voyager 1 is over 25 billion km from Earth—one-way radio takes 23+ hours.',
    actionTarget: { page: 'missions', label: 'Open Where Is It Now? Tracker' },
  },
  {
    id: 'hall-engineering',
    hallNumber: 'HALL 04',
    title: 'The Engineering & Telemetry Hall',
    subtitle: 'Subsystem Anatomy, Power Budgets & Landing Physics',
    curatorialStatement:
      'Peels back gold Kapton foil to inspect RTGs, wire-mesh wheels, rocker-bogie suspensions, and 3.7-meter high-gain dishes.',
    featuredIds: ['curiosity-skycrane', 'perseverance-debris', 'hubble-hst'],
    highlightFact: 'Every kilogram landed on Mars requires exponential launch mass at Earth.',
    actionTarget: { page: 'engineering', label: 'Open Engineering & 3D Exploded Lab' },
  },
  {
    id: 'hall-lost',
    hallNumber: 'HALL 05',
    title: 'The Failed & Recovered Mysteries Hall',
    subtitle: 'Engineering Autopsies, Close Calls & Lessons Paid in Hardware',
    curatorialStatement:
      'Examines missions lost to software, unit mismatches, and jammed antennas—showing how failure forged modern robotic safety.',
    featuredIds: ['mars-polar-lander', 'beagle-2', 'schiaparelli-edm', 'galileo'],
    highlightFact: 'Beagle 2’s resting spot was solved 11 years later by NASA’s MRO HiRISE camera.',
    actionTarget: { page: 'history', label: 'Inspect Mission Autopsy Lab' },
  },
  {
    id: 'hall-future',
    hallNumber: 'HALL 06',
    title: 'The Future Exploration & Heritage Hall',
    subtitle: 'Artemis Base Camp, Sample Return & Interstellar Probes',
    curatorialStatement:
      'Connects historic relics to upcoming missions returning rock cores, mapping lunar South Pole water ice, and safeguarding off-world heritage.',
    featuredIds: ['lro-orbiter', 'lcross', 'perseverance-debris'],
    highlightFact: 'NASA’s Artemis guidelines protect historic Apollo landing zones from rocket blast dust.',
    actionTarget: { page: 'timeline', label: 'Explore 1964–Present Timeline' },
  },
];
