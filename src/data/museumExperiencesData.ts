import {
  DiscoveryInvestigationCase,
  ExplorerBadge,
  FinalSignalEntry,
  PanoramaScene,
  ScaleMetricItem,
  Spacecraft3DId,
  Spacecraft3DModelDef,
} from '../types/equipment';

export const DAILY_SPACE_FACTS: string[] = [
  'Apollo 11, 14, and 15 Laser Ranging Retroreflectors still bounce laser beams back to Earth after 55+ years—proving the Moon recedes ~3.8 cm every year.',
  'Voyager 1 is more than 25 billion km away, yet its 22-watt radio transmitter is detected on Earth by 70-meter Deep Space Network antennas.',
  'Opportunity was engineered for a 90-sol Martian warranty, yet Martian wind gusts cleaned its solar panels enough to last 5,111 sols (nearly 15 years).',
  'InSight detected 1,319 marsquakes and proved that Mars has a liquid iron-alloy core roughly 1,830 km in radius.',
  'Lunokhod 1 drove 10.54 km across Mare Imbrium in 1970–1971 and its French-built retroreflector was rediscovered by laser from Earth in 2010.',
  'Cassini dove cleanly through the narrow gap between Saturn and its innermost rings 22 times before vaporizing in Saturn’s upper atmosphere to protect Enceladus.',
  'Ingenuity’s carbon-fiber blades had to spin at ~2,537 rpm to generate lift in Mars’s ultra-thin carbon-dioxide atmosphere (~1% of Earth sea-level pressure).',
];

export const FINAL_SIGNAL_RECORDS: FinalSignalEntry[] = [
  {
    id: 'fs-opportunity',
    equipmentId: 'opportunity-mer-b',
    machineName: 'Opportunity Rover (MER-B)',
    mission: 'Mars Exploration Rover (2004–2018)',
    statusLabel: 'Completed / Retired',
    lastSignalDate: 'June 10, 2018 (Sol 5111)',
    finalEventSummary:
      'Downlinked atmospheric opacity (tau) and low-power telemetry from Perseverance Valley before a planet-encircling dust storm turned daytime skies pitch dark.',
    confirmedCause:
      'Extreme dust opacity prevented Opportunity’s solar arrays from recharging its batteries; prolonged deep-freeze temperatures likely depleted batteries and scrambled its mission clock.',
    scientificInterpretation:
      'NASA sent over 835 recovery commands between June 2018 and February 2019 before declaring the mission complete on February 13, 2019.',
    unknownOrUncertain:
      'Because no response returned after Sol 5111, the exact sequence of internal fault states during the coldest winter nights cannot be directly observed.',
    aftermath:
      'Rests stationary inside Perseverance Valley on the western rim of Endeavour Crater after driving a record 45.16 km.',
    signalStrengthTimeline: [
      { label: 'May 2018', level: 88 },
      { label: 'Jun 4', level: 54 },
      { label: 'Jun 8', level: 26 },
      { label: 'Jun 10', level: 14 },
      { label: 'Feb 2019', level: 0 },
    ],
    photo: {
      nasaId: 'PIA19157',
      title: 'Opportunity rover traverse along Endeavour Crater photographed from Mars orbit',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~thumb.jpg',
      credit: 'NASA / JPL-Caltech / University of Arizona',
      sourceUrl: 'https://images.nasa.gov/details-PIA19157',
    },
    sourceUrl: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  {
    id: 'fs-insight',
    equipmentId: 'insight-lander',
    machineName: 'InSight Lander',
    mission: 'InSight Mars Geophysics Mission (2018–2022)',
    statusLabel: 'Completed / Retired',
    lastSignalDate: 'December 15, 2022 (Sol 1440)',
    finalEventSummary:
      'Failed to respond during two consecutive Deep Space Network communication windows following severe solar-panel dust buildup in Elysium Planitia.',
    confirmedCause:
      'Thick Martian dust reduced daily solar electricity generation below the threshold needed to run the lander’s flight computer and heaters.',
    scientificInterpretation:
      'Even after trickling coarse sand near the arrays in 2021 bought extra months, seasonal dust storms finally exhausted battery reserve in December 2022.',
    unknownOrUncertain:
      'Mission controllers left listening schedules open briefly in case a rare dust-clearing whirlwind restored power, though none occurred.',
    aftermath:
      'Remains stationary on Elysium Planitia with its copper-shielded SEIS seismometer resting beside it.',
    signalStrengthTimeline: [
      { label: '2019', level: 92 },
      { label: '2021', level: 48 },
      { label: 'Nov 2022', level: 18 },
      { label: 'Dec 15', level: 8 },
      { label: 'Dec 21', level: 0 },
    ],
    photo: {
      nasaId: 'PIA22876',
      title: 'InSight lander on Elysium Planitia after SEIS seismometer deployment',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~thumb.jpg',
      credit: 'NASA / JPL-Caltech',
      sourceUrl: 'https://images.nasa.gov/details-PIA22876',
    },
    sourceUrl: 'https://science.nasa.gov/mission/insight/',
  },
  {
    id: 'fs-cassini',
    equipmentId: 'cassini-huygens',
    machineName: 'Cassini Orbiter',
    mission: 'Cassini–Huygens Saturn Mission (1997–2017)',
    statusLabel: 'Completed / Intentional Deorbit',
    lastSignalDate: 'September 15, 2017 (11:55 UTC Earth-received)',
    finalEventSummary:
      'Fought Saturn’s upper atmospheric torque with thrusters at 100% duty cycle while streaming real-time ion and neutral gas mass spectrometry until the dish tilted off Earth.',
    confirmedCause:
      'Controlled "Grand Finale" plunge into Saturn after 13 years in orbit, deliberately sacrificing the spacecraft before fuel depletion so it could never accidentally contaminate moons Titan or Enceladus.',
    scientificInterpretation:
      'Atmospheric friction and heat broke apart and vaporized the spacecraft ~1 minute after signal loss, ~1,500 km above Saturn’s cloud tops.',
    unknownOrUncertain:
      'Exact second-by-second structural breakup inside Saturn’s deep atmosphere occurred after the antenna lost Earth lock.',
    aftermath:
      'Vaporized into Saturn’s upper atmosphere; its sibling Huygens probe remains resting on Saturn’s moon Titan since January 2005.',
    signalStrengthTimeline: [
      { label: 'Orb 292', level: 95 },
      { label: 'Entry -5m', level: 89 },
      { label: 'Entry -1m', level: 68 },
      { label: '11:55 UTC', level: 12 },
      { label: '11:56 UTC', level: 0 },
    ],
    photo: {
      nasaId: 'PIA17172',
      title: 'Cassini spacecraft high above Saturn rings looking toward the backlit globe',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~thumb.jpg',
      credit: 'NASA / JPL-Caltech / Space Science Institute',
      sourceUrl: 'https://images.nasa.gov/details-PIA17172',
    },
    sourceUrl: 'https://science.nasa.gov/mission/cassini/',
  },
  {
    id: 'fs-spirit',
    equipmentId: 'spirit-mer-a',
    machineName: 'Spirit Rover (MER-A)',
    mission: 'Mars Exploration Rover – Spirit (2004–2010)',
    statusLabel: 'Completed / Retired',
    lastSignalDate: 'March 22, 2010 (Sol 2210)',
    finalEventSummary:
      'Sent its last telemetry after becoming bogged in soft sulfate sand at "Troy" on the western edge of Home Plate in Gusev Crater.',
    confirmedCause:
      'Unable to drive onto a north-facing winter slope, Spirit’s solar arrays could not catch enough Martian winter sunlight to keep core electronics above -40 °C.',
    scientificInterpretation:
      'Even after losing mobility, Spirit acted as a stationary science platform whose wheel-churned sulfate trench uncovered evidence of ancient hydrothermal hot springs.',
    unknownOrUncertain:
      'Listening campaigns continued through May 2011; engineers could not verify whether survival heaters or mission clock failed first.',
    aftermath:
      'Remains stationary near Home Plate in Gusev Crater.',
    signalStrengthTimeline: [
      { label: '2007', level: 90 },
      { label: 'Apr 2009', level: 65 },
      { label: 'Jan 2010', level: 34 },
      { label: 'Mar 22', level: 15 },
      { label: 'May 2011', level: 0 },
    ],
    photo: {
      nasaId: 'PIA05040',
      title: 'Spirit rover deck on Gusev Crater landing platform',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA05040/PIA05040~thumb.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA05040/PIA05040~thumb.jpg',
      credit: 'NASA / JPL',
      sourceUrl: 'https://images.nasa.gov/details-PIA05040',
    },
    sourceUrl: 'https://science.nasa.gov/mission/mer-spirit/',
  },
  {
    id: 'fs-pioneer10',
    equipmentId: 'pioneer-10',
    machineName: 'Pioneer 10 Deep Space Probe',
    mission: 'Pioneer Program (1972–2003)',
    statusLabel: 'Silent & Still Travelling',
    lastSignalDate: 'January 23, 2003 (80+ AU)',
    finalEventSummary:
      'Delivered one very faint carrier tone detected by NASA’s 70-meter Deep Space Network dishes from ~12.2 billion km away; a follow-up attempt in February 2003 received no response.',
    confirmedCause:
      'Radioactive decay of its four SNAP-19 Plutonium-238 RTGs eventually dropped electrical output below the voltage required to power the X/S-band transmitter.',
    scientificInterpretation:
      'Because Pioneer 10 is spin-stabilized in frictionless deep space, it was neither destroyed nor stranded—it simply grew too power-starved to speak.',
    unknownOrUncertain:
      'Its exact present-day attitude drift cannot be measured directly without radio tracking, though trajectory physics places it ~140 AU outward (checked Nov 14, 2026).',
    aftermath:
      'Coasts silently outward toward the constellation Taurus carrying the Pioneer Plaque.',
    signalStrengthTimeline: [
      { label: '1973 Jup', level: 96 },
      { label: '1983 Plu', level: 70 },
      { label: '1997 End', level: 35 },
      { label: 'Jan 2003', level: 6 },
      { label: 'Feb 2003', level: 0 },
    ],
    photo: {
      nasaId: 'ARC-1972-AC72-1208',
      title: 'Pioneer 10 spacecraft inspection prior to 1972 launch',
      imageUrl: 'https://images-assets.nasa.gov/image/ARC-1972-AC72-1208/ARC-1972-AC72-1208~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/ARC-1972-AC72-1208/ARC-1972-AC72-1208~thumb.jpg',
      credit: 'NASA / Ames Research Center',
      sourceUrl: 'https://images.nasa.gov/details-ARC-1972-AC72-1208',
    },
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A',
  },
];

export const DISCOVERY_INVESTIGATIONS: DiscoveryInvestigationCase[] = [
  {
    id: 'inv-blueberries',
    title: 'Case 01: Tiny Gray Spheres Embedded in Martian Bedrock',
    machine: 'Opportunity Rover (MER-B)',
    world: 'Mars',
    observationPrompt:
      'In 2004 inside Eagle Crater, Opportunity’s Microscopic Imager photographed hundreds of millimeter-sized metallic gray spheres ("blueberries") scattered across layered sulfate sandstone.',
    question: 'What geological process best explains these spheres?',
    options: [
      'Concretions of iron-rich hematite crystallized when groundwater soaked porous Martian rock',
      'Dropped steel ball bearings from Opportunity’s airbag landing gear',
      'Volcanic hailstones formed during recent Martian eruptions',
    ],
    correctIndex: 0,
    scientificInterpretation:
      'Opportunity’s Mössbauer and Alpha Particle X-ray Spectrometers proved the spheres were rich in crystalline gray hematite—concretions that grow inside water-saturated sediment.',
    meaningForScience:
      'Confirmed that liquid water once moved persistently beneath and across Meridiani Planum.',
    photo: {
      nasaId: 'PIA05586',
      title: 'Martian hematite spherules ("blueberries") photographed by Opportunity',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA05586/PIA05586~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA05586/PIA05586~thumb.jpg',
      credit: 'NASA / JPL / Cornell / USGS',
      sourceUrl: 'https://images.nasa.gov/details-PIA05586',
    },
    sourceLabel: 'NASA Photojournal PIA05586',
    sourceUrl: 'https://images.nasa.gov/details-PIA05586',
  },
  {
    id: 'inv-genesis-rock',
    title: 'Case 02: Bright Crystalline White Rock on Spur Crater Rim',
    machine: 'Apollo 15 LRV-1 & Astronauts',
    world: 'Moon',
    observationPrompt:
      'Driving LRV-1 up the flank of Mons Hadley Delta, astronauts David Scott and James Irwin spotted a gleaming white crystalline stone perched on a dark basalt boulder.',
    question: 'Why did geologists immediately celebrate Sample 15415 ("Genesis Rock")?',
    options: [
      'It is pure calcium-rich anorthosite (~4.1 billion years old) from the Moon’s original magma-ocean crust',
      'It was a fossilized bone left inside Hadley Rille',
      'It was fresh volcanic lava deposited only 10,000 years ago',
    ],
    correctIndex: 0,
    scientificInterpretation:
      'Laboratory radiometric analysis confirmed Sample 15415 was nearly pure plagioclase anorthosite crystallized early in lunar history, supporting the lunar magma-ocean hypothesis.',
    meaningForScience:
      'Gave scientists a direct clock for dating the Moon’s primordial crust and early planetary differentiation.',
    photo: {
      nasaId: 'as15-86-11603',
      title: 'Apollo 15 Hadley–Apennine geological traverse with LRV-1',
      imageUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~thumb.jpg',
      credit: 'NASA / Johnson Space Center',
      sourceUrl: 'https://images.nasa.gov/details-as15-86-11603',
    },
    sourceLabel: 'NASA Apollo 15 Sample Catalog (15415)',
    sourceUrl: 'https://images.nasa.gov/details-as15-86-11603',
  },
  {
    id: 'inv-phoenix-ice',
    title: 'Case 03: White Chunks That Vanished From a Martian Trench',
    machine: 'Phoenix Mars Lander',
    world: 'Mars',
    observationPrompt:
      'In June 2008, Phoenix’s robotic scoop uncovered bright white dice-sized lumps ~5 cm below arctic soil. Four Martian sols later, repeat photos showed the white chunks had disappeared completely.',
    question: 'What did the disappearing white chunks prove?',
    options: [
      'They were frozen water ice that sublimated directly from solid to vapor in thin Martian air',
      'They were bright magnesium salt crystals blown away by wind',
      'They were bits of white parachute fabric buried during landing',
    ],
    correctIndex: 0,
    scientificInterpretation:
      'Salt deposits would not sublimate at -30 °C daytime arctic temperatures, whereas pure water ice turns straight into vapor under Mars’s ~6 millibar atmospheric pressure.',
    meaningForScience:
      'Provided the first visual and chemical touch-verification of accessible water ice in Mars’s polar plains.',
    photo: {
      nasaId: 'PIA10701',
      title: 'Phoenix Mars Lander arctic solar deck & workspace',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA10701/PIA10701~thumb.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA10701/PIA10701~thumb.jpg',
      credit: 'NASA / JPL-Caltech / University of Arizona',
      sourceUrl: 'https://images.nasa.gov/details-PIA10701',
    },
    sourceLabel: 'NASA JPL Phoenix Sol 20–24 Observation',
    sourceUrl: 'https://images.nasa.gov/details-PIA10701',
  },
  {
    id: 'inv-insight-core',
    title: 'Case 04: Seismic Echoes Bouncing Off Mars’s Deep Center',
    machine: 'InSight Lander (SEIS)',
    world: 'Mars',
    observationPrompt:
      'When two large meteoroid impacts struck Mars in 2021 on the far side of the planet from InSight, SEIS recorded seismic S-waves and P-waves arriving after passing through Mars’s center.',
    question: 'What did those deep seismic reflections reveal about Mars’s interior?',
    options: [
      'Mars has a liquid iron-alloy core (~1,830 km radius) blended with lighter elements',
      'Mars is completely solid rock all the way to its center',
      'Mars’s center is hollow with giant liquid-water caverns',
    ],
    correctIndex: 0,
    scientificInterpretation:
      'Shear waves (S-waves) cannot travel through liquid, and P-waves bend sharply at density boundaries—allowing geophysicists to directly measure Mars’s liquid core radius.',
    meaningForScience:
      'Explained why Mars lost its ancient global magnetic dynamo and reshaped models of rocky planet formation.',
    photo: {
      nasaId: 'PIA22876',
      title: 'InSight SEIS seismometer deployed on Elysium Planitia',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~thumb.jpg',
      credit: 'NASA / JPL-Caltech',
      sourceUrl: 'https://images.nasa.gov/details-PIA22876',
    },
    sourceLabel: 'NASA JPL InSight Core Findings',
    sourceUrl: 'https://images.nasa.gov/details-PIA22876',
  },
  {
    id: 'inv-enceladus-plumes',
    title: 'Case 05: Warm Ice Geysers Erupting From a Small Moon’s South Pole',
    machine: 'Cassini–Huygens Orbiter',
    world: 'Outer Solar System',
    observationPrompt:
      'Passing Saturn’s 500-km-wide ice moon Enceladus, Cassini detected towering plumes of water vapor, organic molecules, and silica nanoparticles erupting from warm "tiger stripe" fractures.',
    question: 'What does silica nanoparticle dust inside icy plumes point to?',
    options: [
      'Active hydrothermal reactions between liquid water and hot silicate rock on a subsurface ocean floor',
      'Comet snow left behind only on the surface skin',
      'Optical camera reflections from Saturn’s F ring',
    ],
    correctIndex: 0,
    scientificInterpretation:
      'Cassini’s Cosmic Dust Analyzer measured nanometer silica grains that on Earth only form when alkaline water interacts with hot rock above ~90 °C.',
    meaningForScience:
      'Established Enceladus as one of the premier ocean-world candidates for habitable chemistry beyond Earth.',
    photo: {
      nasaId: 'PIA17172',
      title: 'Cassini Saturn & ring-system backlit observations',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA17172/PIA17172~thumb.jpg',
      credit: 'NASA / JPL-Caltech / SSI',
      sourceUrl: 'https://images.nasa.gov/details-PIA17172',
    },
    sourceLabel: 'NASA Cassini Science Archive',
    sourceUrl: 'https://images.nasa.gov/details-PIA17172',
  },
  {
    id: 'inv-pale-blue-dot',
    title: 'Case 06: One Fragile Sub-Pixel Speck Inside a Scattered Sunbeam',
    machine: 'Voyager 1',
    world: 'Outer Solar System',
    observationPrompt:
      'On February 14, 1990, from ~6 billion km away beyond Neptune, Voyager 1 aimed its narrow-angle camera back toward the inner solar system and captured Earth occupying less than a single pixel.',
    question: 'Why did NASA engineers initially hesitate to snap the "Pale Blue Dot" portrait?',
    options: [
      'Aiming cameras near the bright Sun risked permanently burning out Voyager’s optical sensors',
      'Voyager 1’s film roll had completely run out',
      'Earth was hidden behind Mars on that exact day',
    ],
    correctIndex: 0,
    scientificInterpretation:
      'With its planetary flybys complete, engineers carefully swept the scan platform while using color filters to minimize sunlight damage—producing the iconic Family Portrait before powering cameras down forever.',
    meaningForScience:
      'Demonstrated how an exoplanet Earth-twin would look as a faint point of light from interstellar distances while delivering an enduring perspective on Earth.',
    photo: {
      nasaId: 'PIA23645',
      title: 'Pale Blue Dot Revisited — Earth suspended in a sunbeam from 6 billion km',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~medium.jpg',
      fallbackUrl: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~thumb.jpg',
      credit: 'NASA / JPL-Caltech',
      sourceUrl: 'https://images.nasa.gov/details-PIA23645',
    },
    sourceLabel: 'NASA JPL Pale Blue Dot (PIA23645)',
    sourceUrl: 'https://images.nasa.gov/details-PIA23645',
  },
];

export const PANORAMA_SCENES: PanoramaScene[] = [
  {
    id: 'pano-apollo15',
    title: 'Apollo 15 Hadley–Apennine Valley Mosaic',
    world: 'The Moon',
    mission: 'Apollo 15 (August 1971)',
    dateLabel: 'August 1971',
    description:
      'Pan across the Apennine mountain front and Hadley Rille where David Scott and James Irwin drove Lunar Roving Vehicle 1 across 27.9 km of lunar regolith.',
    nasaId: 'as15-86-11603',
    credit: 'NASA / Johnson Space Center',
    sourceUrl: 'https://images.nasa.gov/details-as15-86-11603',
    imageUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~large.jpg',
    hotspots: [
      {
        id: 'hs-mons-hadley',
        label: 'Mons Hadley Delta Massif',
        xPct: 24,
        yPct: 28,
        featureType: 'Lunar Highland Uplift',
        description:
          'Rising over 3,500 meters above the plain; astronauts drove LRV-1 up its lower slope to recover the 4.1-billion-year-old Genesis Rock.',
      },
      {
        id: 'hs-lrv-chassis',
        label: 'Lunar Roving Vehicle 1 (LRV-1)',
        xPct: 58,
        yPct: 62,
        featureType: 'Parked Electric Rover',
        description:
          'Equipped with four woven wire-mesh tires, forward color TV camera, and gold mesh parabolic dish aimed at Earth.',
      },
      {
        id: 'hs-palus-regolith',
        label: 'Palus Putredinis Basalt Soil',
        xPct: 78,
        yPct: 76,
        featureType: 'Mare Basalt Regolith',
        description:
          'Fine, sharp silicate glass and dark volcanic mare dust preserving crisp astronaut bootprints and tire tracks for millions of years.',
      },
    ],
  },
  {
    id: 'pano-apollo17',
    title: 'Apollo 17 Taurus–Littrow Valley Panorama',
    world: 'The Moon',
    mission: 'Apollo 17 (December 1972)',
    dateLabel: 'December 1972',
    description:
      'Inspect the deep steep-walled Taurus–Littrow valley explored by Eugene Cernan and geologist Harrison Schmitt during Apollo’s final surface expedition.',
    nasaId: 'as17-140-21496',
    credit: 'NASA / Johnson Space Center',
    sourceUrl: 'https://images.nasa.gov/details-as17-140-21496',
    imageUrl: 'https://images-assets.nasa.gov/image/as17-140-21496/as17-140-21496~large.jpg',
    hotspots: [
      {
        id: 'hs-lrv3-fender',
        label: 'LRV-3 Map-Repaired Fender',
        xPct: 48,
        yPct: 58,
        featureType: 'Improvised Engineering Fix',
        description:
          'Notice the taped lunar-map fender extension engineered to stop spinning wheels from spraying abrasive dust over the crew.',
      },
      {
        id: 'hs-south-massif',
        label: 'South Massif Highland Slope',
        xPct: 22,
        yPct: 30,
        featureType: 'Basin Rim Wall',
        description:
          'Formed during the giant Serenitatis basin impact; astronauts sampled ancient highland breccias along its base.',
      },
    ],
  },
  {
    id: 'pano-opportunity',
    title: 'Meridiani Planum & Endeavour Rim Survey',
    world: 'Mars',
    mission: 'Opportunity Rover (MER-B)',
    dateLabel: '2004–2018 Traverse',
    description:
      'Examine the iron-rich flat plains and eroded crater rims where Opportunity completed its historic 45.16 km Martian marathon.',
    nasaId: 'PIA19157',
    credit: 'NASA / JPL-Caltech / University of Arizona',
    sourceUrl: 'https://images.nasa.gov/details-PIA19157',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
    hotspots: [
      {
        id: 'hs-endeavour-rim',
        label: 'Endeavour Crater Rim',
        xPct: 40,
        yPct: 45,
        featureType: 'Noachian Bedrock',
        description:
          '22-km-wide ancient crater exposing clay minerals formed in neutral-pH ancient water before Mars dried out.',
      },
      {
        id: 'hs-perseverance-valley',
        label: 'Perseverance Valley Resting Site',
        xPct: 68,
        yPct: 55,
        featureType: 'Final Rover Site',
        description:
          'The shallow gully descending into Endeavour Crater where Opportunity sent its last transmission in June 2018.',
      },
    ],
  },
  {
    id: 'pano-perseverance',
    title: 'Jezero Crater Ancient River Delta Panorama',
    world: 'Mars',
    mission: 'Perseverance & Ingenuity (Mars 2020)',
    dateLabel: '2021–Present',
    description:
      'Explore Jezero Crater’s eroded fan delta where active rover Perseverance caches rock cores and Ingenuity completed 72 flights.',
    nasaId: 'PIA24924',
    credit: 'NASA / JPL-Caltech / ASU / MSSS',
    sourceUrl: 'https://images.nasa.gov/details-PIA24924',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA24924/PIA24924~large.jpg',
    hotspots: [
      {
        id: 'hs-delta-layers',
        label: 'Sedimentary Delta Cliffs',
        xPct: 36,
        yPct: 42,
        featureType: 'Ancient Lakebed Delta',
        description:
          'Visible cross-bedded layers deposited ~3.5 billion years ago when a river flowed into standing liquid water in Jezero Crater.',
      },
      {
        id: 'hs-jezero-floor',
        label: 'Crater Floor Basalt & Sand',
        xPct: 66,
        yPct: 72,
        featureType: 'Aeolian Ripples',
        description:
          'Wind-sculpted sand ripples across the crater basin—similar to the featureless dunes that challenged Ingenuity’s navigation on Flight 72.',
      },
    ],
  },
];

export const SPACE_SCALE_METRICS: ScaleMetricItem[] = [
  {
    name: 'Sojourner Rover',
    mission: 'Mars Pathfinder (1997)',
    lengthMeters: 0.65,
    massKg: 10.6,
    speedKmH: 0.036,
    distanceKm: 0.1,
    powerWatts: 16,
    oneWayLightDelaySec: 600,
    durationYears: 0.23,
  },
  {
    name: 'Apollo 15 LRV-1',
    mission: 'Apollo 15 (1971)',
    lengthMeters: 3.1,
    massKg: 210,
    speedKmH: 13.0,
    distanceKm: 27.9,
    powerWatts: 750,
    oneWayLightDelaySec: 1.28,
    durationYears: 0.01,
  },
  {
    name: 'Opportunity Rover',
    mission: 'MER-B (2004–2018)',
    lengthMeters: 1.6,
    massKg: 185,
    speedKmH: 0.18,
    distanceKm: 45.16,
    powerWatts: 140,
    oneWayLightDelaySec: 750,
    durationYears: 14.4,
  },
  {
    name: 'Perseverance Rover',
    mission: 'Mars 2020 (Active)',
    lengthMeters: 3.0,
    massKg: 1025,
    speedKmH: 0.15,
    distanceKm: 30,
    powerWatts: 110,
    oneWayLightDelaySec: 750,
    durationYears: 5.7,
  },
  {
    name: 'Hubble Space Telescope',
    mission: 'LEO Observatory (Active)',
    lengthMeters: 13.2,
    massKg: 11110,
    speedKmH: 27300,
    distanceKm: 540,
    powerWatts: 2800,
    oneWayLightDelaySec: 0.002,
    durationYears: 36.5,
  },
  {
    name: 'Cassini Orbiter',
    mission: 'Saturn (1997–2017)',
    lengthMeters: 6.7,
    massKg: 2523,
    speedKmH: 122000,
    distanceKm: 1400000000,
    powerWatts: 885,
    oneWayLightDelaySec: 4980,
    durationYears: 19.9,
  },
  {
    name: 'Voyager 1 Probe',
    mission: 'Interstellar (1977–Present)',
    lengthMeters: 3.7,
    massKg: 721.9,
    speedKmH: 61200,
    distanceKm: 25400000000,
    powerWatts: 225,
    oneWayLightDelaySec: 84600,
    durationYears: 49.2,
  },
];

export const EXPLORER_BADGES: ExplorerBadge[] = [
  {
    id: 'badge-first-machine',
    title: 'Archival Explorer',
    description: 'Inspected 3+ NASA spacecraft stories across the Moon, Mars, or Deep Space.',
    criterion: 'Open 3 machine stories',
  },
  {
    id: 'badge-investigator',
    title: 'Planetary Detective',
    description: 'Analyzed scientific surface evidence in the Discovery Investigation Lab.',
    criterion: 'Solve 3 discovery cases',
  },
  {
    id: 'badge-mission-controller',
    title: 'Flight Director',
    description: 'Navigated engineering trade-offs inside the Mission Control Simulator.',
    criterion: 'Complete all 4 scenarios',
  },
  {
    id: 'badge-spacecraft-engineer',
    title: 'Chief Systems Designer',
    description: 'Engineered and tested a custom spacecraft configuration in Build-a-Spacecraft.',
    criterion: 'Test a spacecraft build',
  },
  {
    id: 'badge-quiz-master',
    title: 'Space History Scholar',
    description: 'Scored at least 7/10 on the Multiple-Choice or True/False Mission Quiz.',
    criterion: 'Score 70%+ on a quiz',
  },
  {
    id: 'badge-moon-explorer',
    title: 'Moon Explorer',
    description: 'Completed a First-Person Lunar Journey or inspected Apollo & Lunokhod surface traverses.',
    criterion: 'Complete a lunar experience or tour',
  },
  {
    id: 'badge-mars-pioneer',
    title: 'Mars Pioneer',
    description: 'Tracked Martian landers or survived the Mars Entry, Descent & Landing simulation.',
    criterion: 'Complete a Mars landing or tracker inspection',
  },
  {
    id: 'badge-deep-space',
    title: 'Deep Space Traveller',
    description: 'Explored interstellar trajectories, light-delay physics, and Messages Beyond Earth.',
    criterion: 'Explore deep-space comms or Voyager records',
  },
  {
    id: 'badge-mission-historian',
    title: 'Mission Historian',
    description: 'Investigated Missions That Almost Failed, Lost Archives, or asked the Space Historian.',
    criterion: 'Explore history archives or complete a tour',
  },
  {
    id: 'badge-engineering-detective',
    title: 'Engineering Detective',
    description: 'Solved root-cause forensic evidence in the Mission Autopsy Laboratory.',
    criterion: 'Reconstruct a mission autopsy case',
  },
  {
    id: 'badge-rover-commander',
    title: 'Rover Commander',
    description: 'Drove a virtual Mars rover across crater terrain and collected a scientific rock sample.',
    criterion: 'Collect a sample in the 3D Mars Rover Simulator',
  },
  {
    id: 'badge-space-scientist',
    title: 'Space Scientist',
    description: 'Solved a Challenge of the Week or balanced spacecraft survival power in the Power Lab.',
    criterion: 'Complete a Power Challenge or Weekly Challenge',
  },
];

export const SPACECRAFT_3D_MODELS: Record<Spacecraft3DId, Spacecraft3DModelDef> = {
  'apollo-15-lrv1': {
    id: 'apollo-15-lrv1',
    name: 'Apollo 15 Lunar Roving Vehicle 1',
    mission: 'Apollo 15 (1971)',
    subtitle: '210 kg Electric Lunar Jeep · Hadley–Apennine',
    hotspots: [
      {
        id: 'lrv-wheels',
        name: 'Woven Wire-Mesh Tires',
        subsystem: 'Mobility & Traction',
        pos: [0.82, 0.32, 0.66],
        cameraOffset: [2.2, 1.1, 2.0],
        technicalSpec: 'Zinc-coated piano-wire mesh with titanium chevrons',
        purpose: 'Provide traction on powdery lunar regolith without pressurized rubber that would rupture or freeze.',
        howItWorks: 'Individual 0.25-hp DC motors inside each wheel hub drive flexible steel mesh.',
        whyItMatters: 'Allowed 27.9 km of exploration across cratered terrain in 1/6th Earth gravity.',
      },
      {
        id: 'lrv-nav',
        name: 'Silver-Zinc Batteries & Gyro Nav',
        subsystem: 'Power & Dead-Reckoning',
        pos: [0.48, 0.65, 0],
        cameraOffset: [1.9, 1.4, 1.6],
        technicalSpec: 'Two 36-volt non-rechargeable AgZn batteries (121 Ah each)',
        purpose: 'Track heading and range back to Falcon without GPS.',
        howItWorks: 'Directional gyro + wheel odometer pulses continuously computed bearing to the Lunar Module.',
        whyItMatters: 'Guaranteed astronauts could always drive straight back safely before life-support limits.',
      },
      {
        id: 'lrv-dish',
        name: 'Gold-Mesh High-Gain Parabolic Dish',
        subsystem: 'Direct-to-Earth Telemetry',
        pos: [0.95, 1.25, -0.3],
        cameraOffset: [2.4, 1.9, 1.5],
        technicalSpec: 'Steerable 1-meter gold-plated wire mesh dish',
        purpose: 'Beam live color television and voice directly across 384,400 km to Earth.',
        howItWorks: 'Aimed manually by astronauts at parked stops using an optical sight.',
        whyItMatters: 'Broadcast Apollo 15’s liftoff from the Moon live to viewers worldwide.',
      },
    ],
  },
  'opportunity-mer-b': {
    id: 'opportunity-mer-b',
    name: 'Opportunity Rover (MER-B)',
    mission: 'Mars Exploration Rover (2004–2018)',
    subtitle: '185 kg Solar Geologist · 45.16 km Driven',
    hotspots: [
      {
        id: 'opp-solar',
        name: 'Triple-Junction Solar Wings',
        subsystem: 'Electrical Generation',
        pos: [0, 0.85, 0],
        cameraOffset: [2.6, 2.2, 2.4],
        technicalSpec: '1.3 m² GaInP/GaAs/Ge solar deck (~900 Wh/sol peak)',
        purpose: 'Convert dim Martian sunlight into electricity for driving, computing, and survival heaters.',
        howItWorks: 'Dust storms coated the panels until periodic Martian wind gusts blew arrays clean.',
        whyItMatters: 'Enabled a 90-sol mission to operate for 5,111 sols across nearly 15 Earth years.',
      },
      {
        id: 'opp-pancam',
        name: 'Pancam Stereo Imaging Mast',
        subsystem: 'Remote Sensing & Navigation',
        pos: [0.45, 1.48, 0],
        cameraOffset: [2.0, 2.0, 1.8],
        technicalSpec: '1.5-m-high mast with 13 filter wheels & Mini-TES IR spectrometer',
        purpose: 'Capture high-resolution 360° panoramas and identify water-altered minerals from afar.',
        howItWorks: 'Dual cameras at human eye height judge stereo depth for hazard avoidance.',
        whyItMatters: 'Guided Opportunity across Meridiani Planum straight to Endeavour Crater’s rim.',
      },
      {
        id: 'opp-wheels',
        name: 'Rocker-Bogie 6-Wheel Suspension',
        subsystem: 'Surface Mobility',
        pos: [0.6, 0.25, 0.55],
        cameraOffset: [2.2, 1.0, 2.1],
        technicalSpec: '25 cm machined aluminum wheels with spiral flexures',
        purpose: 'Keep all six wheels touching rocky terrain without springs that might bounce.',
        howItWorks: 'Differential linkage averages chassis pitch while climbing obstacles up to 38 cm high.',
        whyItMatters: 'Completed an unprecedented 45.16-km Martian marathon.',
      },
    ],
  },
  'insight-lander': {
    id: 'insight-lander',
    name: 'InSight Mars Lander',
    mission: 'InSight Geophysics (2018–2022)',
    subtitle: 'Elysium Planitia Seismic & Heat Station',
    hotspots: [
      {
        id: 'ins-solar',
        name: 'Twin Circular UltraFlex Solar Arrays',
        subsystem: 'Power Generation',
        pos: [0, 0.72, 1.15],
        cameraOffset: [2.8, 1.9, 2.9],
        technicalSpec: 'Two 2.15-m fan-fold circular arrays',
        purpose: 'Supply power at equatorial Elysium Planitia without heavy nuclear fuel.',
        howItWorks: 'Unfurled like paper fans 16 minutes after touchdown.',
        whyItMatters: 'Cumulative Martian dust eventually reduced power output until final signal in December 2022.',
      },
      {
        id: 'ins-seis',
        name: 'SEIS Copper Wind & Thermal Shield',
        subsystem: 'Planetary Seismology',
        pos: [0.75, 0.22, -0.45],
        cameraOffset: [2.1, 1.3, -1.8],
        technicalSpec: 'Vacuum-sealed tri-axial very-broadband seismometer',
        purpose: 'Measure vibrations smaller than a hydrogen atom inside Mars’s crust and core.',
        howItWorks: 'Robotic arm lifted SEIS off the deck and placed a protective dome over it on the soil.',
        whyItMatters: 'Logged 1,319 marsquakes and measured Mars’s ~1,830-km liquid iron-alloy core.',
      },
    ],
  },
  'voyager-1': {
    id: 'voyager-1',
    name: 'Voyager 1 Interstellar Probe',
    mission: 'Voyager Program (1977–Present)',
    subtitle: '25.4+ Billion km Outward · Active Interstellar Probe',
    hotspots: [
      {
        id: 'voy-dish',
        name: '3.7 m High-Gain Parabolic Dish',
        subsystem: 'Interstellar Communications',
        pos: [0, 1.35, 0],
        cameraOffset: [3.0, 2.3, 2.8],
        technicalSpec: 'X-band & S-band dish focused toward Earth within 0.05°',
        purpose: 'Keep a 22-watt transmitter detectable across more than 25 billion kilometers.',
        howItWorks: '70-meter Deep Space Network dishes on Earth listen for its whisper 23.5+ hours after transmission.',
        whyItMatters: 'Allows engineers to upload software patches and receive plasma data from interstellar space.',
      },
      {
        id: 'voy-rtg',
        name: 'MHW Plutonium-238 RTG Boom',
        subsystem: 'Nuclear Power',
        pos: [-1.15, 0.65, 0],
        cameraOffset: [-2.7, 1.8, 2.2],
        technicalSpec: '3 Radioisotope Thermoelectric Generators (470 W at launch -> ~225 W today)',
        purpose: 'Generate reliable electricity far from the Sun where solar panels are useless.',
        howItWorks: 'Thermocouples convert natural radioactive decay heat directly into DC current with zero moving parts.',
        whyItMatters: 'Sustained Voyager 1 for nearly half a century beyond the heliopause.',
      },
      {
        id: 'voy-record',
        name: 'The Voyager Golden Record',
        subsystem: 'Cultural Time Capsule',
        pos: [0.48, 0.72, 0.42],
        cameraOffset: [1.9, 1.4, 1.9],
        technicalSpec: '12-inch gold-plated copper phonograph disc with Uranium-238 cover',
        purpose: 'Carry Earth’s sounds, 115 images, 55 greetings, and music across deep space.',
        howItWorks: 'Engraved diagrams on the cover explain playback speed and pulsar coordinates of our Sun.',
        whyItMatters: 'Will survive intact in interstellar space for hundreds of millions of years.',
      },
    ],
  },
  'cassini-huygens': {
    id: 'cassini-huygens',
    name: 'Cassini–Huygens Spacecraft',
    mission: 'Saturn & Titan (1997–2017)',
    subtitle: 'Orbiter + Titan Lander',
    hotspots: [
      {
        id: 'cas-dish',
        name: '4 m High-Gain Dish',
        subsystem: 'Telemetry & Sunshield',
        pos: [0, 1.4, 0],
        cameraOffset: [2.8, 2.2, 2.6],
        technicalSpec: '4-meter dual-band parabolic antenna',
        purpose: 'Acted as an umbrella protecting sensitive instruments near Venus before beaming Saturn data home.',
        howItWorks: 'Transmitted 635 GB of Saturn ring and Enceladus plume science across 1.4 billion km.',
        whyItMatters: 'Revealed subsurface ocean chemistry on Enceladus and methane lakes on Titan.',
      },
    ],
  },
  hubble: {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    mission: 'Low Earth Orbit (1990–Present)',
    subtitle: '2.4 m Optical & UV Space Observatory',
    hotspots: [
      {
        id: 'hst-mirror',
        name: '2.4 m Primary Mirror & Optical Tube',
        subsystem: 'Deep-Field Optics',
        pos: [0, 0.9, 0],
        cameraOffset: [2.9, 2.0, 2.7],
        technicalSpec: 'Ritchey-Chrétien reflector polished to 10-nanometer smoothness',
        purpose: 'Observe galaxies, nebulae, and exoplanet atmospheres free from Earth’s blurring air.',
        howItWorks: 'Five Space Shuttle servicing missions upgraded gyroscopes, batteries, and science cameras.',
        whyItMatters: 'Pinned down the age of the universe (~13.8 billion years) and continues active science after 36+ years.',
      },
    ],
  },
};
