export interface FirstPersonStage {
  stageNum: number;
  title: string;
  altitudeOrDist: string;
  telemetryNote: string;
  narrative: string;
  visualType: 'Historical NASA Photo' | 'Simulated Mission Environment';
  photoUrl: string;
  nasaId?: string;
  credit: string;
  actionPrompt: string;
}

export interface FirstPersonJourney {
  id: string;
  title: string;
  machineName: string;
  mission: string;
  summary: string;
  badgeOnComplete: string;
  stages: FirstPersonStage[];
}

export const FIRST_PERSON_JOURNEYS: FirstPersonJourney[] = [
  {
    id: 'fp-earth-moon',
    title: 'Journey 01: Earth to Hadley Rille on the Moon',
    machineName: 'Apollo 15 Lunar Module Falcon & LRV-1',
    mission: 'Apollo 15 (July–August 1971)',
    summary: 'Experience Trans-Lunar Injection, powered descent over the Apennine mountains, and unfolding LRV-1 onto lunar regolith.',
    badgeOnComplete: 'badge-moon-explorer',
    stages: [
      {
        stageNum: 1,
        title: 'Stage 1: Leaving Earth Orbit (TLI Burn)',
        altitudeOrDist: '185 km -> 384,400 km',
        telemetryNote: 'Velocity: ~10.8 km/s · Simulated Mission Staging + Archival Apollo Context',
        narrative:
          'The Saturn V S-IVB third stage reignites for nearly six minutes, hurling Commander David Scott, Al Worden, Jim Irwin, and a folded 210-kg electric rover tucked inside Falcon toward the Moon.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~medium.jpg',
        nasaId: 'as15-86-11603',
        credit: 'NASA / Johnson Space Center',
        actionPrompt: 'Engage Trans-Lunar Coast',
      },
      {
        stageNum: 2,
        title: 'Stage 2: Powered Descent Over Mons Hadley',
        altitudeOrDist: '15 km -> 0 m Lunar Altitude',
        telemetryNote: 'Gravity: 1.62 m/s² (1/6th Earth) · Historical Apollo 15 Landing Profile',
        narrative:
          'Diving over the towering 4,500-meter Apennine peaks at a steep 26-degree approach angle, Falcon’s descent engine kicks up a blinding veil of silver dust before touching down beside Hadley Rille.',
        visualType: 'Simulated Mission Environment',
        photoUrl: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
        nasaId: 'as11-40-5903',
        credit: 'NASA Apollo Lunar Archive',
        actionPrompt: 'Unfold Lunar Roving Vehicle 1',
      },
      {
        stageNum: 3,
        title: 'Stage 3: Driving LRV-1 Along Spur Crater',
        altitudeOrDist: '27.9 km Surface Traverse',
        telemetryNote: 'Top Speed: ~13 km/h · 1.28 s One-Way Earth Radio Delay',
        narrative:
          'Wire-mesh tires bounce gently across Mare basalt. At Spur Crater you spot Sample 15415—a gleaming white anorthosite "Genesis Rock" 4.1 billion years old from the Moon’s original magma ocean.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~medium.jpg',
        nasaId: 'as15-86-11603',
        credit: 'NASA / Johnson Space Center',
        actionPrompt: 'Park LRV-1 & Record Liftoff',
      },
      {
        stageNum: 4,
        title: 'Stage 4: Quiet Heritage Witness',
        altitudeOrDist: '26.13° N, 3.63° E (Palus Putredinis)',
        telemetryNote: 'Status: Heritage Relic · LRO Verified 2009–Present',
        narrative:
          'Parked ~100 meters east of Falcon’s descent stage, LRV-1 beamed color video of the ascent stage blasting back toward orbit. Today it stands preserved in vacuum beside footprints that will last millions of years.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001925/GSFC_20171208_Archive_e001925~medium.jpg',
        nasaId: 'GSFC_20171208_Archive_e001925',
        credit: 'NASA / GSFC / Arizona State Univ. (LRO)',
        actionPrompt: 'Complete Lunar Journey',
      },
    ],
  },
  {
    id: 'fp-mars-landing',
    title: 'Journey 02: Seven Minutes of Terror — Mars Landing',
    machineName: 'InSight & Perseverance Descent Systems',
    mission: 'Martian Entry, Descent & Landing',
    summary: 'Step inside the automated Entry, Descent & Landing sequence where 14+ minute round-trip radio delays mean Earth can only watch.',
    badgeOnComplete: 'badge-mars-pioneer',
    stages: [
      {
        stageNum: 1,
        title: 'Stage 1: Atmospheric Entry (~19,800 km/h)',
        altitudeOrDist: '125 km Mars Altitude',
        telemetryNote: 'Peak Heat Shield Temp: ~1,500 °C · Simulated EDL Sequence',
        narrative:
          'At 125 km altitude, the spacecraft slams into Mars’s thin carbon dioxide atmosphere. Signal plasma briefly blocks radio waves while the ablative PICA heat shield absorbs searing friction.',
        visualType: 'Simulated Mission Environment',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~medium.jpg',
        nasaId: 'PIA19808',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Deploy Supersonic Parachute',
      },
      {
        stageNum: 2,
        title: 'Stage 2: Supersonic Parachute Inflation (~Mach 1.7)',
        altitudeOrDist: '11 km Altitude · Velocity ~400 m/s',
        telemetryNote: 'Atmospheric Pressure: ~1% of Earth · Historical Context Photo',
        narrative:
          'A 16–21.5 meter supersonic parachute snaps open in under a second. Seconds later the charred heat shield drops away—exposing descent radar to lock onto Martian craters below.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA25970/PIA25970~thumb.jpg',
        nasaId: 'PIA25970',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Ignite Descent Retro-Engines',
      },
      {
        stageNum: 3,
        title: 'Stage 3: Touchdown on Martian Regolith',
        altitudeOrDist: '0 m Surface Contact',
        telemetryNote: 'Touchdown Speed: < 2.4 m/s · Confirmed via UHF Relay',
        narrative:
          'Retro-rockets throttle down, legs or bridle cables absorb the final jolt, and the expended backshell/sky crane flies safely away to crash at a safe distance—leaving an operational laboratory on Mars.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA22876/PIA22876~medium.jpg',
        nasaId: 'PIA22876',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Complete Mars EDL Journey',
      },
    ],
  },
  {
    id: 'fp-mars-surface',
    title: 'Journey 03: Exploring Meridiani Planum & Endeavour Rim',
    machineName: 'Opportunity Rover (MER-B)',
    mission: '2004–2018 (5,111 Sols)',
    summary: 'Roll out of Eagle Crater, discover hematite "blueberries," survive Purgatory Dune, and descend into Perseverance Valley.',
    badgeOnComplete: 'badge-mars-pioneer',
    stages: [
      {
        stageNum: 1,
        title: 'Stage 1: Hole-in-One at Eagle Crater',
        altitudeOrDist: '0.02 km Traverse · Sol 1–50',
        telemetryNote: 'Solar Power: ~900 Wh/sol · Authentic Opportunity Discovery',
        narrative:
          'Opportunity’s bounced airbags rolled to a halt inside a small 22-meter crater—exposing layered bedrock studded with tiny gray hematite spheres formed by ancient groundwater.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA05586/PIA05586~medium.jpg',
        nasaId: 'PIA05586',
        credit: 'NASA / JPL / Cornell / USGS',
        actionPrompt: 'Drive Across Meridiani Plains',
      },
      {
        stageNum: 2,
        title: 'Stage 2: Marathon to Endeavour Crater',
        altitudeOrDist: '45.16 km Total Traverse',
        telemetryNote: 'Duration: 5,111 Sols (~56× 90-sol warranty)',
        narrative:
          'Braving wheel-motor stalls, freezing Martian winters, and soft sand dunes, Opportunity rolled 45.16 kilometers over 14 Earth years to discover clay minerals from ancient neutral water.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
        nasaId: 'PIA19157',
        credit: 'NASA / JPL-Caltech / Univ. of Arizona',
        actionPrompt: 'Enter 2018 Global Dust Storm',
      },
      {
        stageNum: 3,
        title: 'Stage 3: Sol 5111 — Into the Dust',
        altitudeOrDist: 'Perseverance Valley Resting Site',
        telemetryNote: 'Last Signal: June 10, 2018 · Mission Complete Feb 13, 2019',
        narrative:
          'A planet-encircling dust storm blotted out the Sun. After transmitting one final darkened sky measurement, Opportunity entered deep sleep—remembered worldwide as one of humanity’s most resilient robots.',
        visualType: 'Simulated Mission Environment',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA19157/PIA19157~medium.jpg',
        nasaId: 'PIA19157',
        credit: 'NASA / JPL-Caltech / Univ. of Arizona',
        actionPrompt: 'Complete Surface Journey',
      },
    ],
  },
  {
    id: 'fp-deep-space',
    title: 'Journey 04: Crossing the Heliopause Into Interstellar Space',
    machineName: 'Voyager 1',
    mission: '1977–Present (49+ Years Active)',
    summary: 'Leave Jupiter and Saturn behind, glance back at the Pale Blue Dot, and cross the boundary of our Sun’s magnetic bubble.',
    badgeOnComplete: 'badge-deep-space',
    stages: [
      {
        stageNum: 1,
        title: 'Stage 1: Jupiter & Saturn Gravity Slingshots (1979–1980)',
        altitudeOrDist: '5.2 AU -> 9.5 AU',
        telemetryNote: 'Cruising Speed: ~61,200 km/h · Authentic Voyager Discovery',
        narrative:
          'Voyager 1 uncovered active sulfur volcanoes on Jupiter’s moon Io and examined Titan’s hazy nitrogen skies, bending its path 35° northward out of the ecliptic plane.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA22567/PIA22567~medium.jpg',
        nasaId: 'PIA22567',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Look Back at Earth (1990)',
      },
      {
        stageNum: 2,
        title: 'Stage 2: The Pale Blue Dot (February 14, 1990)',
        altitudeOrDist: '~6.0 Billion km from Earth',
        telemetryNote: 'Camera Shutdown After Family Portrait · Historical Image',
        narrative:
          'Before turning off its cameras forever to save power and memory, Voyager 1 turned back and captured Earth as a tiny 0.12-pixel speck caught inside a scattered beam of sunlight.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA23645/PIA23645~medium.jpg',
        nasaId: 'PIA23645',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Cross the Heliopause (121 AU)',
      },
      {
        stageNum: 3,
        title: 'Stage 3: Interstellar Ambassador Today',
        altitudeOrDist: '25.4+ Billion km (170+ AU)',
        telemetryNote: 'One-Way Light Time: 23.5+ Hours · Active Radio Carrier',
        narrative:
          'Still whispering across 25+ billion kilometers with ~22 watts of radio power, Voyager 1 measures cold interstellar plasma between the stars—carrying the Golden Record for billions of years to come.',
        visualType: 'Simulated Mission Environment',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA22567/PIA22567~medium.jpg',
        nasaId: 'PIA22567',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Complete Deep Space Journey',
      },
    ],
  },
  {
    id: 'fp-blackout',
    title: 'Journey 05: Experiencing a Spacecraft Communication Blackout',
    machineName: 'Mars Solar Conjunction & Atmospheric Plasma',
    mission: 'Deep Space Network Operations',
    summary: 'Step inside Mission Control when the Sun moves directly between Earth and Mars—and rovers must think entirely for themselves.',
    badgeOnComplete: 'badge-deep-space',
    stages: [
      {
        stageNum: 1,
        title: 'Stage 1: Approaching Solar Conjunction (~2° Sun-Earth-Mars Angle)',
        altitudeOrDist: '~380 Million km Across the Sun',
        telemetryNote: 'Signal Corruption Risk · Solar Corona Plasma Interference',
        narrative:
          'Every 26 months, Mars passes behind the Sun from Earth’s viewpoint. Superheated solar corona gas can corrupt radio bits—a garbled command could tell a rover to drive off a cliff.',
        visualType: 'Simulated Mission Environment',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA24924/PIA24924~large.jpg',
        nasaId: 'PIA24924',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Enter 14-Day Command Moratorium',
      },
      {
        stageNum: 2,
        title: 'Stage 2: Autonomous Survival Mode',
        altitudeOrDist: 'Total Command Blackout',
        telemetryNote: 'Onboard Autonomy Active · Weather & Seismic Logging Continues',
        narrative:
          'Mission Control halts all driving commands. Rovers park safely, collect stationary weather and radiation logs, and store science packets in flash memory until Mars emerges cleanly from behind the Sun.',
        visualType: 'Historical NASA Photo',
        photoUrl: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~medium.jpg',
        nasaId: 'PIA19808',
        credit: 'NASA / JPL-Caltech',
        actionPrompt: 'Reacquire Deep Space Network Carrier Lock',
      },
    ],
  },
];

export interface WhereIsItNowItem {
  id: string;
  equipmentId: string;
  name: string;
  mission: string;
  destination: string;
  statusLabel: string;
  isStillOperational: boolean;
  lastConfirmedPosition: string;
  distanceFromEarth: string;
  lightTimeOneWay: string;
  trajectoryOrRegion: string;
  milestones: string[];
  checkedDate: string;
  sourceUrl: string;
}

export const WHERE_IS_IT_NOW_RECORDS: WhereIsItNowItem[] = [
  {
    id: 'win-voyager1',
    equipmentId: 'voyager-1',
    name: 'Voyager 1',
    mission: 'Outer Planets & Interstellar Mission (1977)',
    destination: 'Interstellar Space (Heading toward Ophiuchus)',
    statusLabel: 'Active / Travelling',
    isStillOperational: true,
    lastConfirmedPosition: '~170+ AU outward into the local interstellar medium (~61,200 km/h heliocentric speed)',
    distanceFromEarth: '> 25.4 billion km (estimated propagation from JPL ephemeris)',
    lightTimeOneWay: '~23 hours 35 minutes',
    trajectoryOrRegion: '35° north of the ecliptic plane, well outside the Sun’s heliopause',
    milestones: ['Jupiter 1979', 'Saturn 1980', 'Pale Blue Dot 1990', 'Heliopause Crossing Aug 2012', 'FDS memory patch recovered 2024'],
    checkedDate: 'Checked Nov 14, 2026',
    sourceUrl: 'https://science.nasa.gov/mission/voyager/',
  },
  {
    id: 'win-voyager2',
    equipmentId: 'voyager-2',
    name: 'Voyager 2',
    mission: 'Grand Tour & Interstellar Mission (1977)',
    destination: 'Interstellar Space (Heading toward Pavo / Telescopium)',
    statusLabel: 'Active / Travelling',
    isStillOperational: true,
    lastConfirmedPosition: '~142+ AU outward in interstellar plasma (~55,300 km/h)',
    distanceFromEarth: '> 21.2 billion km',
    lightTimeOneWay: '~19 hours 40 minutes',
    trajectoryOrRegion: '48° south of the ecliptic plane',
    milestones: ['Jupiter 1979', 'Saturn 1981', 'Uranus 1986', 'Neptune 1989', 'Heliopause Crossing Nov 2018'],
    checkedDate: 'Checked Nov 14, 2026',
    sourceUrl: 'https://science.nasa.gov/mission/voyager/',
  },
  {
    id: 'win-newhorizons',
    equipmentId: 'new-horizons',
    name: 'New Horizons',
    mission: 'Pluto & Kuiper Belt Extended Mission (2006)',
    destination: 'Deep Kuiper Belt (Crossing ~64+ AU)',
    statusLabel: 'Active / Travelling',
    isStillOperational: true,
    lastConfirmedPosition: '~64+ AU from the Sun studying Kuiper Belt dust and distant Uranus/Neptune phase angles',
    distanceFromEarth: '~9.5+ billion km',
    lightTimeOneWay: '~8 hours 50 minutes',
    trajectoryOrRegion: 'Escape trajectory toward Sagittarius',
    milestones: ['Jupiter gravity assist 2007', 'Pluto flyby Jul 2015', 'Arrokoth flyby Jan 2019', '2nd Kuiper Extended Mission'],
    checkedDate: 'Checked Nov 14, 2026',
    sourceUrl: 'https://science.nasa.gov/mission/new-horizons/',
  },
  {
    id: 'win-pioneer10',
    equipmentId: 'pioneer-10',
    name: 'Pioneer 10',
    mission: 'First Asteroid Belt & Jupiter Probe (1972)',
    destination: 'Coasting Silently Toward Aldebaran / Taurus',
    statusLabel: 'Silent & Still Travelling',
    isStillOperational: false,
    lastConfirmedPosition: 'Last radio signal detected Jan 23, 2003 at 80 AU; ballistic trajectory places it ~140+ AU today',
    distanceFromEarth: '~21 billion km (ballistic estimate; no radio tracking)',
    lightTimeOneWay: '~19+ hours (if it could transmit)',
    trajectoryOrRegion: 'Opposite the Sun’s galactic direction toward Taurus',
    milestones: ['Asteroid Belt 1972', 'Jupiter Dec 1973', 'Last telemetry Apr 2002', 'Final weak carrier Jan 23, 2003'],
    checkedDate: 'Checked Nov 14, 2026',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A',
  },
  {
    id: 'win-opportunity',
    equipmentId: 'opportunity-mer-b',
    name: 'Opportunity Rover (MER-B)',
    mission: 'Mars Exploration Rover (2004–2018)',
    destination: 'Perseverance Valley, Endeavour Crater, Mars',
    statusLabel: 'Completed / Retired',
    isStillOperational: false,
    lastConfirmedPosition: 'Stationary at 2.27° S, 354.62° E inside Perseverance Valley (45.16 km odometer)',
    distanceFromEarth: '55–401 million km (varies with Mars-Earth orbit)',
    lightTimeOneWay: '3 to 22 minutes (varies by orbital position)',
    trajectoryOrRegion: 'Western rim of 22-km-wide Endeavour Crater',
    milestones: ['Eagle Crater 2004', 'Victoria Crater 2006', 'Endeavour Rim 2011', 'Final Signal Sol 5111 (Jun 10, 2018)'],
    checkedDate: 'Verified Stationary Site',
    sourceUrl: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  {
    id: 'win-insight',
    equipmentId: 'insight-lander',
    name: 'InSight Lander',
    mission: 'Mars Geophysics Station (2018–2022)',
    destination: 'Elysium Planitia, Mars',
    statusLabel: 'Completed / Retired',
    isStillOperational: false,
    lastConfirmedPosition: 'Stationary at 4.50° N, 135.62° E with deployed SEIS copper dome nearby',
    distanceFromEarth: '55–401 million km (Mars orbital distance)',
    lightTimeOneWay: '3 to 22 minutes',
    trajectoryOrRegion: 'Flat volcanic plains of western Elysium Planitia',
    milestones: ['Landed Nov 26, 2018', '1,319 marsquakes logged', 'Liquid core measured', 'Mission ended Dec 2022'],
    checkedDate: 'Verified Stationary Site',
    sourceUrl: 'https://science.nasa.gov/mission/insight/',
  },
  {
    id: 'win-apollo15',
    equipmentId: 'apollo-15-lrv1',
    name: 'Apollo 15 LRV-1 & Falcon Descent Stage',
    mission: 'Apollo 15 J-Mission (1971)',
    destination: 'Hadley–Apennine Valley, Moon',
    statusLabel: 'Heritage Relic (Imaged by LRO)',
    isStillOperational: false,
    lastConfirmedPosition: 'Stationary at 26.13° N, 3.63° E (LRV parked ~100 m east of Falcon)',
    distanceFromEarth: '~384,400 km average',
    lightTimeOneWay: '1.28 seconds',
    trajectoryOrRegion: 'Palus Putredinis plain beside Hadley Rille',
    milestones: ['Landed Jul 30, 1971', 'Drove 27.9 km across 3 EVAs', 'Genesis Rock 15415 collected', 'Imaged by LRO 2009+'],
    checkedDate: 'Verified Lunar Site',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
  },
  {
    id: 'win-hubble',
    equipmentId: 'hubble-hst',
    name: 'Hubble Space Telescope',
    mission: 'Low Earth Orbit Observatory (1990–Present)',
    destination: 'Low Earth Orbit (~515–540 km altitude)',
    statusLabel: 'Active / Operational',
    isStillOperational: true,
    lastConfirmedPosition: 'Orbiting Earth every ~95 minutes at ~27,300 km/h (~28.5° inclination)',
    distanceFromEarth: '~515–540 km overhead',
    lightTimeOneWay: '< 0.003 seconds',
    trajectoryOrRegion: 'Low Earth Orbit',
    milestones: ['Launched Apr 1990', '5 Shuttle Servicing Missions (1993–2009)', '1.6+ million observations', 'Operating 36+ years'],
    checkedDate: 'Checked Nov 14, 2026',
    sourceUrl: 'https://science.nasa.gov/mission/hubble/',
  },
];

export interface FootstepWaypoint {
  id: string;
  name: string;
  xPct: number;
  yPct: number;
  elevationNote: string;
  discovery: string;
}

export interface FootstepRoute {
  id: string;
  title: string;
  world: 'Moon' | 'Mars';
  machineName: string;
  siteName: string;
  totalDistance: string;
  terrainSummary: string;
  sourceCredit: string;
  waypoints: FootstepWaypoint[];
}

export const FOOTSTEPS_TRAVERSES: FootstepRoute[] = [
  {
    id: 'fs-apollo15',
    title: 'Apollo 15 Hadley–Apennine LRV-1 Traverse',
    world: 'Moon',
    machineName: 'Apollo 15 LRV-1',
    siteName: 'Palus Putredinis & Mons Hadley Delta',
    totalDistance: '27.9 km across 3 moonwalks',
    terrainSummary: 'Flat dark mare basalt bordered by the 300-m-deep Hadley Rille gorge and 3,500-m Apennine mountains.',
    sourceCredit: 'NASA Lunar Reconnaissance Orbiter & Apollo 15 Preliminary Science Report',
    waypoints: [
      { id: 'w1', name: 'Falcon Landing Site & ALSEP', xPct: 48, yPct: 35, elevationNote: '0 m baseline', discovery: 'Deployed laser retroreflector (still active today) and heat-flow probes.' },
      { id: 'w2', name: 'Station 2: St. George Crater Rim', xPct: 24, yPct: 60, elevationNote: '+85 m slope', discovery: 'Astronauts peered down into 1.2-km-wide Hadley Rille canyon exposing stacked lava strata.' },
      { id: 'w3', name: 'Station 7: Spur Crater (Genesis Rock)', xPct: 58, yPct: 78, elevationNote: '+140 m highland flank', discovery: 'Collected Sample 15415—4.1-billion-year-old white crystalline anorthosite.' },
      { id: 'w4', name: 'Final LRV-1 Parking Spot ("VIP Site")', xPct: 62, yPct: 33, elevationNote: '100 m east of LM', discovery: 'Aimed gold TV dish back at Falcon to broadcast lunar ascent live to Earth.' },
    ],
  },
  {
    id: 'fs-opportunity',
    title: 'Opportunity Rover 45.16 km Marathon Traverse',
    world: 'Mars',
    machineName: 'Opportunity (MER-B)',
    siteName: 'Meridiani Planum -> Endeavour Crater',
    totalDistance: '45.16 km (Off-World Record)',
    terrainSummary: 'Wind-rippled hematite plains transitioning into heavily cratered ancient Noachian rim bedrock.',
    sourceCredit: 'NASA / JPL-Caltech MER Traverse Atlas',
    waypoints: [
      { id: 'o1', name: 'Eagle Crater (Sol 1 Landing)', xPct: 14, yPct: 26, elevationNote: '-1,420 m elevation', discovery: 'Discovered cross-bedded sandstone and hematite "blueberries" formed in ancient groundwater.' },
      { id: 'o2', name: 'Endurance & Victoria Craters', xPct: 38, yPct: 44, elevationNote: '100 m - 750 m wide', discovery: 'Descended Duck Bay into layered cliff walls recording millions of years of Martian climate shifts.' },
      { id: 'o3', name: 'Cape York / Endeavour Rim', xPct: 72, yPct: 62, elevationNote: '+135 m rim climb', discovery: 'Identified neutral-pH smectite clays and pure white gypsum mineral veins.' },
      { id: 'o4', name: 'Perseverance Valley (Sol 5111)', xPct: 86, yPct: 75, elevationNote: '15° gully slope', discovery: 'Final resting site inside a fluid-carved notch on Endeavour’s western rim.' },
    ],
  },
  {
    id: 'fs-lunokhod1',
    title: 'Lunokhod 1 Mare Imbrium Robotic Traverse',
    world: 'Moon',
    machineName: 'Lunokhod 1 (Luna 17)',
    siteName: 'Mare Imbrium (Sea of Rains)',
    totalDistance: '10.54 km over 322 Earth days',
    terrainSummary: 'Gentle basaltic mare plains dotted with small secondary impact craters and scattered regolith boulders.',
    sourceCredit: 'Soviet Lavochkin Archive & NASA LROC Rediscovery (2010)',
    waypoints: [
      { id: 'l1', name: 'Luna 17 Descent Stage Ramp', xPct: 20, yPct: 48, elevationNote: 'Nov 17, 1970 rollout', discovery: 'World’s first remote-controlled planetary rover rolled down twin ramps onto another world.' },
      { id: 'l2', name: '30-m Crater Soil Penetrometer Test', xPct: 48, yPct: 36, elevationNote: '322 soil tests', discovery: 'Measured lunar regolith bearing strength across hundreds of cones and slopes.' },
      { id: 'l3', name: '2010 Laser Ranging Rediscovery Spot', xPct: 80, yPct: 60, elevationNote: '38.32° N, 325.00° E', discovery: 'LRO pinpointed its parked coordinates, allowing astronomers to bounce laser pulses off its French retroreflector again.' },
    ],
  },
  {
    id: 'fs-perseverance',
    title: 'Perseverance & Ingenuity Jezero Delta Expedition',
    world: 'Mars',
    machineName: 'Perseverance & Ingenuity',
    siteName: 'Jezero Crater, Mars',
    totalDistance: '30+ km driven · 72 flights flown',
    terrainSummary: 'Rough crater-floor fractured basalt transitioning onto a sweeping 40-meter-high ancient river delta escarpment.',
    sourceCredit: 'NASA / JPL-Caltech Mars 2020 Traverse Map',
    waypoints: [
      { id: 'p1', name: 'Octavia E. Butler Landing & Wright Brothers Field', xPct: 24, yPct: 68, elevationNote: 'April 19, 2021', discovery: 'Site of humanity’s first powered aerodynamic flight on another planet (Ingenuity Flight 1).' },
      { id: 'p2', name: 'Three Forks Sample Depot', xPct: 46, yPct: 54, elevationNote: '10 titanium core tubes', discovery: 'Placed 10 sealed rock and regolith cores on flat ground as a backup cache for future Sample Return.' },
      { id: 'p3', name: 'Jezero Fan Delta Front ("Enchanted Lake")', xPct: 66, yPct: 36, elevationNote: '+45 m climb', discovery: 'Sampled fine-grained mudstones rich in organic-preserving clay minerals.' },
      { id: 'p4', name: 'Airfield Sigma (Ingenuity Flight 72)', xPct: 82, yPct: 28, elevationNote: 'Sandy ripple basin', discovery: 'Ingenuity suffered rotor damage on landing after 72 flights—14× its planned 5-flight test.' },
    ],
  },
];

export interface CosmicStop {
  id: string;
  label: string;
  distanceLabel: string;
  lightTimeLabel: string;
  scaleKm: string;
  machineName: string;
  environmentFact: string;
}

export const COSMIC_JOURNEY_STOPS: CosmicStop[] = [
  {
    id: 'cs-leo',
    label: 'Low Earth Orbit',
    distanceLabel: '540 km',
    lightTimeLabel: '0.002 seconds',
    scaleKm: '5.4 × 10² km',
    machineName: 'Hubble Space Telescope',
    environmentFact: 'Above 99.9% of Earth’s atmosphere; circles the globe every 95 minutes at 27,300 km/h.',
  },
  {
    id: 'cs-moon',
    label: 'The Moon',
    distanceLabel: '384,400 km',
    lightTimeLabel: '1.28 seconds',
    scaleKm: '3.84 × 10⁵ km',
    machineName: 'Apollo 15 LRV-1 & Lunokhod 1',
    environmentFact: 'Airless vacuum with 14-day nights (-173 °C) and 14-day sunlit days (+127 °C).',
  },
  {
    id: 'cs-mars',
    label: 'Mars Orbit & Surface',
    distanceLabel: '55 – 401 Million km',
    lightTimeLabel: '3 – 22 minutes',
    scaleKm: '~2.25 × 10⁸ km avg',
    machineName: 'Opportunity, InSight & Perseverance',
    environmentFact: 'Thin 6-millibar CO2 air, planet-wide dust storms, and ~14-minute average light delay.',
  },
  {
    id: 'cs-jupiter',
    label: 'Jupiter System',
    distanceLabel: '~778 Million km',
    lightTimeLabel: '~43 minutes',
    scaleKm: '7.78 × 10⁸ km (5.2 AU)',
    machineName: 'Galileo Orbiter (1995–2003)',
    environmentFact: 'Sunlight is 27× dimmer than at Earth; intense radiation belts test electronics to their limits.',
  },
  {
    id: 'cs-saturn',
    label: 'Saturn & Titan',
    distanceLabel: '~1.43 Billion km',
    lightTimeLabel: '~79 minutes',
    scaleKm: '1.43 × 10⁹ km (9.5 AU)',
    machineName: 'Cassini Orbiter & Huygens Probe',
    environmentFact: 'Sunlight is 90× dimmer than Earth—requiring Plutonium-238 RTGs for heat and power.',
  },
  {
    id: 'cs-pluto',
    label: 'Pluto & Kuiper Belt',
    distanceLabel: '~5.9 – 9.5 Billion km',
    lightTimeLabel: '5.5 – 8.8 hours',
    scaleKm: '40 – 64 AU',
    machineName: 'New Horizons',
    environmentFact: 'Nitrogen glaciers flow at -230 °C across ancient icy dwarf worlds.',
  },
  {
    id: 'cs-interstellar',
    label: 'Interstellar Space (Beyond Heliopause)',
    distanceLabel: '> 25.4 Billion km',
    lightTimeLabel: '23.5+ hours one-way',
    scaleKm: '170+ AU',
    machineName: 'Voyager 1',
    environmentFact: 'Outside the Sun’s solar wind bubble—cold interstellar plasma and cosmic rays between the stars.',
  },
];

export interface MuseumTour {
  id: string;
  title: string;
  durationLabel: string;
  badgeId: string;
  summary: string;
  stops: {
    equipmentId: string;
    stopTitle: string;
    curatorNote: string;
  }[];
}

export const GUIDED_MUSEUM_TOURS: MuseumTour[] = [
  {
    id: 'tour-moon',
    title: 'Tour 01: Moon Landings & Heritage Sites',
    durationLabel: '4 Stops · ~4 min',
    badgeId: 'badge-moon-explorer',
    summary: 'Trace humanity’s early robotic lunar scouts through Apollo 11, 15, and Lunokhod 1.',
    stops: [
      { equipmentId: 'surveyor-1', stopTitle: 'Stop 1: Surveyor 1 (1966)', curatorNote: 'Proved lunar soil was firm enough to hold a heavy crewed lander instead of swallowing it in deep dust.' },
      { equipmentId: 'apollo-11-eagle', stopTitle: 'Stop 2: Apollo 11 Eagle Descent Stage', curatorNote: 'Tranquility Base’s permanent landing platform, carrying the Golden Goodwill Disc and laser retroreflector.' },
      { equipmentId: 'lunokhod-1', stopTitle: 'Stop 3: Lunokhod 1 Rover', curatorNote: 'The first remote-controlled rover on another world—driven from Crimea across 10.54 km of Mare Imbrium.' },
      { equipmentId: 'apollo-15-lrv1', stopTitle: 'Stop 4: Apollo 15 LRV-1', curatorNote: 'Unfolded electric lunar jeep that carried astronauts 27.9 km up the flanks of Mons Hadley Delta.' },
    ],
  },
  {
    id: 'tour-mars',
    title: 'Tour 02: Mars Rovers & Surface Pioneers',
    durationLabel: '4 Stops · ~4 min',
    badgeId: 'badge-mars-pioneer',
    summary: 'Follow robotic rovers from microwave-sized Sojourner to marathoner Opportunity and aerial Ingenuity.',
    stops: [
      { equipmentId: 'sojourner', stopTitle: 'Stop 1: Sojourner (1997)', curatorNote: 'Just 10.6 kg, Sojourner pioneered the 6-wheel rocker-bogie design still used on Mars today.' },
      { equipmentId: 'spirit-mer-a', stopTitle: 'Stop 2: Spirit Rover (MER-A)', curatorNote: 'Its stuck wheel churned Gusev soil to uncover ancient hydrothermal silica hot springs.' },
      { equipmentId: 'opportunity-mer-b', stopTitle: 'Stop 3: Opportunity Rover (MER-B)', curatorNote: 'Outlasted a 90-sol warranty for 5,111 sols, logging 45.16 km before the 2018 global dust storm.' },
      { equipmentId: 'ingenuity-helicopter', stopTitle: 'Stop 4: Ingenuity Mars Helicopter', curatorNote: 'Completed 72 flights in 1% Earth air pressure—opening the era of extraterrestrial aviation.' },
    ],
  },
  {
    id: 'tour-deep-space',
    title: 'Tour 03: Deep Space & Interstellar Messengers',
    durationLabel: '4 Stops · ~4 min',
    badgeId: 'badge-deep-space',
    summary: 'Journey outward past Jupiter, Saturn, Pluto, and the Sun’s heliopause.',
    stops: [
      { equipmentId: 'pioneer-10', stopTitle: 'Stop 1: Pioneer 10', curatorNote: 'First through the Asteroid Belt and past Jupiter—now silently coasting ~140+ AU outward.' },
      { equipmentId: 'voyager-1', stopTitle: 'Stop 2: Voyager 1', curatorNote: 'Humanity’s farthest active ambassador, crossing interstellar space with the Golden Record.' },
      { equipmentId: 'cassini-huygens', stopTitle: 'Stop 3: Cassini–Huygens', curatorNote: 'Discovered Enceladus’s ocean plumes and landed Huygens on methane-carved Titan.' },
      { equipmentId: 'new-horizons', stopTitle: 'Stop 4: New Horizons', curatorNote: 'Captured nitrogen glaciers on Pluto and ancient contact binary Arrokoth.' },
    ],
  },
  {
    id: 'tour-abandoned',
    title: 'Tour 04: Left Behind, Expended & Silent Relics',
    durationLabel: '4 Stops · ~4 min',
    badgeId: 'badge-mission-historian',
    summary: 'Understand why some stages are intentionally jettisoned while landers remain quiet monuments.',
    stops: [
      { equipmentId: 'curiosity-skycrane', stopTitle: 'Stop 1: Curiosity Descent Sky Crane', curatorNote: 'Flown away ~650 m after lowering Curiosity cleanly onto Gale Crater so its exhaust wouldn’t bury the rover.' },
      { equipmentId: 'lcross', stopTitle: 'Stop 2: LCROSS Centaur Impactor', curatorNote: 'Intentionally crashed into shadowed Cabeus Crater in 2009 to blast subsurface lunar water ice into sunlight.' },
      { equipmentId: 'beagle-2', stopTitle: 'Stop 3: Beagle 2 Lander', curatorNote: 'Missing for 11 years until MRO revealed it landed intact with two stuck solar petals.' },
      { equipmentId: 'insight-lander', stopTitle: 'Stop 4: InSight Lander', curatorNote: 'Silently rests on Elysium Planitia after red Martian dust blanketed its UltraFlex solar wings.' },
    ],
  },
  {
    id: 'tour-discoveries',
    title: 'Tour 05: Greatest Scientific Breakthroughs',
    durationLabel: '4 Stops · ~4 min',
    badgeId: 'badge-investigator',
    summary: 'Four discoveries that permanently rewrote textbooks about moons, Mars, and our Solar System.',
    stops: [
      { equipmentId: 'apollo-15-lrv1', stopTitle: 'Stop 1: Lunar Magma-Ocean Crust (Apollo 15)', curatorNote: 'Sample 15415 "Genesis Rock" confirmed the young Moon was once wrapped in molten rock.' },
      { equipmentId: 'phoenix-lander', stopTitle: 'Stop 2: Subsurface Martian Ice (Phoenix)', curatorNote: 'Scraped bright ice chunks from arctic soil that vanished into thin Martian vapor over four sols.' },
      { equipmentId: 'insight-lander', stopTitle: 'Stop 3: Liquid Martian Core (InSight)', curatorNote: 'Deep seismic waves revealed Mars’s molten iron-alloy core radius (~1,830 km).' },
      { equipmentId: 'galileo', stopTitle: 'Stop 4: Europa’s Subsurface Ocean (Galileo)', curatorNote: 'Magnetic induction measurements proved salty liquid water lies beneath Europa’s fractured ice shell.' },
    ],
  },
];

export interface WeeklyChallengeItem {
  id: string;
  weekLabel: string;
  title: string;
  missionFocus: string;
  prompt: string;
  hint: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const WEEKLY_CHALLENGES: WeeklyChallengeItem[] = [
  {
    id: 'wc-1',
    weekLabel: 'Week 01 Challenge',
    title: 'Why Can’t Opportunity Simply Be Towed Home?',
    missionFocus: 'Rocket Equation & Delta-V',
    prompt:
      'Returning a 185-kg rover from Mars’s surface back to Earth requires overcoming Mars’s gravity (~3.72 m/s²), aerodynamic drag, and interplanetary transfer. Roughly how much launch mass at Earth is needed to return each single kilogram from Mars?',
    hint: 'Think of the exponential compounding of Tsiolkovsky’s rocket equation across multiple rocket stages.',
    options: [
      'Roughly 200 to 300+ kg of Earth launch mass per 1 kg returned from Mars',
      'Exactly 1 kg of launch fuel per 1 kg returned',
      'Only 5 kg using standard solar panels',
    ],
    correctIndex: 0,
    explanation:
      'Every stage lifting return fuel must itself carry fuel to lift that fuel! Because of this exponential gear-ratio, engineers design one-way surface rovers packed with laboratories rather than bringing heavy metal frames home.',
  },
  {
    id: 'wc-2',
    weekLabel: 'Week 02 Challenge',
    title: 'Surviving Beyond the Asteroid Belt',
    missionFocus: 'Inverse-Square Sunlight Law',
    prompt:
      'Saturn orbits ~9.5 AU (9.5× Earth’s distance from the Sun). According to the inverse-square law (1 / r²), how strong is sunlight at Saturn compared to Earth?',
    hint: 'Calculate 1 divided by 9.5 squared (9.5 × 9.5 ≈ 90.25).',
    options: [
      'About 90 times weaker (~1.1% of Earth sunlight)',
      'Half as bright (~50% of Earth sunlight)',
      'About 9.5 times weaker (~10.5% of Earth sunlight)',
    ],
    correctIndex: 0,
    explanation:
      'Sunlight weakens with the square of distance! At Saturn (~90× weaker), solar arrays would have to be enormous—which is why Cassini, Voyager, Pioneer, and New Horizons rely on compact Plutonium-238 RTGs.',
  },
  {
    id: 'wc-3',
    weekLabel: 'Week 03 Challenge',
    title: 'Why Helicopter Blades Spin 5× Faster on Mars',
    missionFocus: 'Ingenuity Aerodynamics',
    prompt:
      'Mars has ~38% of Earth’s gravity, which helps lift—yet its carbon-dioxide atmosphere has only ~1% of Earth’s surface density. How did Ingenuity generate flight lift in near-vacuum?',
    hint: 'Think about rotor blade rotational speed and blade pitch angle.',
    options: [
      'Lightweight 1.2 m carbon-fiber counter-rotating blades spinning at ~2,400–2,700 rpm',
      'Jet afterburners burning Martian atmospheric oxygen',
      'Hydrogen weather balloons lifting the solar deck',
    ],
    correctIndex: 0,
    explanation:
      'Spinning ultra-lightweight 1.2-m carbon-fiber rotors nearly 5× faster than a terrestrial helicopter (~2,537 rpm) generated enough aerodynamic lift in Mars’s 1% air density.',
  },
];
