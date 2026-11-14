import {
  GlossaryTerm,
  GuessCraftPuzzle,
  MatchingPair,
  MissionScenario,
  OrderingMilestone,
  QuizQuestion,
  TrueFalseQuestion,
} from '../types/equipment';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Why did Apollo 15 leave Lunar Roving Vehicle 1 (LRV-1) parked on the Moon?',
    options: [
      'Its steering broke permanently before departure',
      'Returning 210 kg to orbit exceeded Lunar Module ascent fuel limits, and its batteries were non-rechargeable',
      'Astronauts forgot where they parked it behind Hadley Rille',
      'NASA planned to reuse it for Apollo 16',
    ],
    correctIndex: 1,
    explanation:
      'Apollo’s Lunar Module ascent stage was engineered with razor-thin mass margins to carry two astronauts and Moon rocks back to lunar orbit. Leaving the 210 kg rover and descent stage behind saved enormous rocket fuel.',
    sourceLabel: 'NASA NSSDCA (1971-063C)',
  },
  {
    id: 'q2',
    question: 'What kind of tires did the Apollo 15, 16, and 17 Lunar Roving Vehicles use?',
    options: [
      'Pressurized synthetic rubber car tires',
      'Solid wooden wheels with steel rims',
      'Woven zinc-coated steel wire mesh with titanium chevron treads',
      'Inflatable Kevlar airbags',
    ],
    correctIndex: 2,
    explanation:
      'Rubber tires would freeze brittle at -170 °C or burst in lunar vacuum. Engineers wove springy piano-wire mesh tires with titanium treads to grip loose lunar dust.',
    sourceLabel: 'NASA Marshall Space Flight Center LRV Manual',
  },
  {
    id: 'q3',
    question: 'How long was Opportunity rover originally designed to operate on Mars, and how long did it actually survive?',
    options: [
      'Planned for 90 Martian sols; operated for 5,111 sols (nearly 15 Earth years)',
      'Planned for 10 years; operated for 3 months',
      'Planned for 30 days; operated for 1 year',
      'Planned for 2 years; operated for 4 years',
    ],
    correctIndex: 0,
    explanation:
      'Opportunity was built for a 90-sol prime mission, yet wind gusts repeatedly cleaned dust off its solar panels—allowing it to drive a record 45.16 km over nearly 15 Earth years.',
    sourceLabel: 'NASA JPL MER Mission Conclusion (2019)',
  },
  {
    id: 'q4',
    question: 'What ended Opportunity’s 14.5-year mission in June 2018?',
    options: [
      'A wheel fell off inside Eagle Crater',
      'A planet-encircling dust storm blocked sunlight to its solar panels',
      'It drove into a deep volcanic canyon',
      'Its nuclear RTG battery ran out of plutonium',
    ],
    correctIndex: 1,
    explanation:
      'A massive global dust storm turned daytime skies over Meridiani Planum nearly pitch black, preventing Opportunity’s solar panels from charging its batteries.',
    sourceLabel: 'NASA JPL / NSSDCA (2003-032A)',
  },
  {
    id: 'q5',
    question: 'What was the main scientific breakthrough of NASA’s InSight Lander on Elysium Planitia?',
    options: [
      'It flew 72 times across Jezero Crater',
      'It detected over 1,300 marsquakes and confirmed Mars has a liquid iron-alloy core',
      'It returned rock core samples directly to Earth',
      'It discovered active lava fountains on Olympus Mons',
    ],
    correctIndex: 1,
    explanation:
      'By placing the SEIS seismometer directly onto Martian soil, InSight listened to seismic waves travelling through Mars, mapping its crust, mantle, and liquid core.',
    sourceLabel: 'NASA JPL InSight Science Team',
  },
  {
    id: 'q6',
    question: 'Which statement accurately describes Voyager 1 today?',
    options: [
      'It is abandoned and completely silent in Jupiter’s orbit',
      'It crashed into Saturn’s moon Titan in 1980',
      'It is not abandoned—it is actively travelling through interstellar space and still communicates with Earth',
      'It is orbiting Mars as a communications relay',
    ],
    correctIndex: 2,
    explanation:
      'Voyager 1 crossed the heliopause into interstellar space in August 2012 and continues sending plasma and cosmic-ray telemetry via NASA’s Deep Space Network.',
    sourceLabel: 'NASA Voyager Interstellar Mission Status',
  },
  {
    id: 'q7',
    question: 'Which Apollo hardware on the Moon is STILL actively used by scientists on Earth more than 55 years later?',
    options: [
      'The Lunar Roving Vehicle headlights',
      'The Laser Ranging Retroreflectors (LRRR) left by Apollo 11, 14, and 15',
      'The Lunar Module descent stage rocket engines',
      'The spacesuit cooling backpacks',
    ],
    correctIndex: 1,
    explanation:
      'Earth observatories bounce laser pulses off the Apollo corner-cube mirror arrays to measure the Earth–Moon distance to millimeter precision, proving the Moon moves away ~3.8 cm/year.',
    sourceLabel: 'NASA LRO / Lunar Laser Ranging',
  },
  {
    id: 'q8',
    question: 'Why did NASA send Ingenuity to Mars alongside Perseverance?',
    options: [
      'To carry astronauts across Jezero Crater',
      'To test whether powered aerodynamic flight was possible in Mars’s ultra-thin atmosphere (~1% of Earth’s)',
      'To drill 5 meters underground for water',
      'To launch rock tubes back to Earth',
    ],
    correctIndex: 1,
    explanation:
      'Ingenuity proved controlled rotorcraft flight works on Mars, completing 72 flights—far beyond its planned 5-flight test—before rotor damage retired it in January 2024.',
    sourceLabel: 'NASA JPL Mars 2020 / Ingenuity',
  },
  {
    id: 'q9',
    question: 'Why do Voyager 1, Voyager 2, Curiosity, and Perseverance use Plutonium-238 RTGs instead of solar panels?',
    options: [
      'Solar panels melt in cold space',
      'RTGs provide reliable heat and electricity regardless of sunlight, dust storms, or extreme distance from the Sun',
      'RTGs are lighter than paper',
      'Plutonium panels glow like lasers to steer the rover',
    ],
    correctIndex: 1,
    explanation:
      'Out past Jupiter and in interstellar space, sunlight is dozens to thousands of times weaker than at Earth—and on Mars, dust storms can block solar panels for months.',
    sourceLabel: 'NASA Radioisotope Power Systems',
  },
  {
    id: 'q10',
    question: 'What made Surveyor 3 (landed on the Moon in 1967) unique in space history?',
    options: [
      'It drove 50 kilometers around Tycho Crater',
      'Apollo 12 astronauts landed 163–180 meters away in 1969, walked over, and brought its camera back to Earth',
      'It launched itself back to Earth automatically',
      'It carried the first Martian seismometer',
    ],
    correctIndex: 1,
    explanation:
      'Apollo 12 proved pinpoint lunar landing by touching down beside Surveyor 3 so Pete Conrad and Alan Bean could inspect it and retrieve parts after 31 months on the Moon.',
    sourceLabel: 'NASA NSSDCA (1967-035A & 1969-099C)',
  },
];

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: 'tf1',
    statement: 'Every NASA machine left in space—including Voyager 1—is considered abandoned and dead.',
    isTrue: false,
    explanation:
      'False! Voyager 1, Voyager 2, New Horizons, Curiosity, and Perseverance are active, communicating missions. Even passive Apollo retroreflectors remain active science tools.',
    sourceLabel: 'NASA Science Mission Fleet Status',
  },
  {
    id: 'tf2',
    statement: 'The Apollo 15 Lunar Roving Vehicle had four electric motors—one inside each wheel hub.',
    isTrue: true,
    explanation:
      'True! Each wire-mesh wheel held its own 0.25-horsepower (186 W) DC electric motor, giving redundant traction across loose lunar regolith.',
    sourceLabel: 'NASA MSFC LRV Operations Handbook',
  },
  {
    id: 'tf3',
    statement: 'Beagle 2 exploded on impact in 2003 and was never found.',
    isTrue: false,
    explanation:
      'False! In 2015, NASA’s Mars Reconnaissance Orbiter HiRISE camera spotted Beagle 2 resting intact in Isidis Planitia—its solar petals simply failed to unfold fully, blocking its radio antenna.',
    sourceLabel: 'NASA MRO HiRISE / NSSDCA (2003-022C)',
  },
  {
    id: 'tf4',
    statement: 'InSight used its robotic arm scoop to trickle Martian sand onto its dusty solar panels to help clean them.',
    isTrue: true,
    explanation:
      'True! Engineers discovered that dropping coarse sand grains next to the solar wings allowed passing wind gusts to sweep finer dust particles off the cells.',
    sourceLabel: 'NASA JPL InSight Mission Log (2021)',
  },
  {
    id: 'tf5',
    statement: 'Voyager 1 is closer to Earth than Voyager 2.',
    isTrue: false,
    explanation:
      'False! Even though Voyager 1 launched 16 days after Voyager 2, its faster trajectory overtook Voyager 2 in late 1977. Today Voyager 1 is roughly 170 AU away versus ~142 AU for Voyager 2.',
    sourceLabel: 'NASA JPL Voyager Distance Tracker',
  },
  {
    id: 'tf6',
    statement: 'The rocket equation makes returning heavy hardware from Mars hundreds of times more fuel-expensive per kilogram than landing it.',
    isTrue: true,
    explanation:
      'True! Every kilogram lifted off Mars requires propellant for Mars ascent, Earth return, and atmospheric entry—compounding exponentially into massive Earth-launch rockets.',
    sourceLabel: 'Tsiolkovsky Rocket Equation Astrodynamics',
  },
  {
    id: 'tf7',
    statement: 'Ingenuity was the first spacecraft ever to achieve powered aerodynamic flight on another planet.',
    isTrue: true,
    explanation:
      'True! On April 19, 2021, Ingenuity hovered 3 meters above Wright Brothers Field in Jezero Crater, completing 72 flights total.',
    sourceLabel: 'NASA JPL Mars 2020',
  },
  {
    id: 'tf8',
    statement: 'Apollo 17 astronauts fixed a broken rover fender using laminated lunar maps and duct tape.',
    isTrue: true,
    explanation:
      'True! Without the fender repair, spinning wheels threw abrasive dust showers over Eugene Cernan and Harrison Schmitt.',
    sourceLabel: 'Apollo 17 Lunar Surface Journal',
  },
  {
    id: 'tf9',
    statement: 'Phoenix Mars Lander operated for 10 years at the Martian north pole.',
    isTrue: false,
    explanation:
      'False! Phoenix lasted ~5 months during northern arctic summer (May–November 2008) before winter darkness and heavy CO2 dry-ice frost collapsed its solar arrays.',
    sourceLabel: 'NASA NSSDCA (2007-034A)',
  },
  {
    id: 'tf10',
    statement: 'Pioneer 10 and Pioneer 11 are still travelling outward from the solar system even though their transmitters went silent years ago.',
    isTrue: true,
    explanation:
      'True! In frictionless space, momentum keeps them coasting outward toward distant stars long after their RTGs dropped below radio threshold.',
    sourceLabel: 'NASA NSSDCA (1972-012A & 1973-019A)',
  },
];

export const MATCHING_PAIRS: MatchingPair[] = [
  {
    id: 'mp-1',
    machine: 'Apollo 15 LRV-1',
    discovery: 'Recovered the 4.1-billion-year-old "Genesis Rock" anorthosite near Hadley Rille',
    hint: 'Driven 27.9 km by David Scott and James Irwin on the Moon.',
  },
  {
    id: 'mp-2',
    machine: 'Opportunity Rover',
    discovery: 'Found hematite "blueberries" & drove a 45.16 km marathon across Meridiani Planum',
    hint: 'Designed for 90 sols; endured nearly 15 years on Mars.',
  },
  {
    id: 'mp-3',
    machine: 'InSight Lander',
    discovery: 'Recorded 1,300+ marsquakes and confirmed Mars has a liquid iron-alloy core',
    hint: 'Placed the copper-shielded SEIS seismometer directly on Elysium Planitia soil.',
  },
  {
    id: 'mp-4',
    machine: 'Voyager 1',
    discovery: 'Discovered volcanoes on Io, snapped "Pale Blue Dot", and crossed into interstellar space',
    hint: 'Carries the Golden Record beyond 165+ AU.',
  },
  {
    id: 'mp-5',
    machine: 'LCROSS Impactor',
    discovery: 'Excavated a plume confirming water ice inside permanently shadowed Cabeus Crater',
    hint: 'Crashed a Centaur upper stage near the lunar south pole in 2009.',
  },
  {
    id: 'mp-6',
    machine: 'Phoenix Lander',
    discovery: 'Dug trenches revealing shallow arctic water ice and perchlorate salts on Mars',
    hint: 'Landed at 68° N in Vastitas Borealis.',
  },
  {
    id: 'mp-7',
    machine: 'Ingenuity Helicopter',
    discovery: 'Proved powered rotorcraft flight works in Mars’s 1%-density atmosphere (72 flights)',
    hint: '1.8 kg coaxial helicopter at Jezero Crater.',
  },
  {
    id: 'mp-8',
    machine: 'Surveyor 3',
    discovery: 'Dug lunar trenches in 1967 and showed how electronics age after 31 months in vacuum',
    hint: 'Visited in person by Apollo 12 astronauts.',
  },
];

export const ORDERING_MILESTONES: OrderingMilestone[] = [
  { id: 'ord-1', year: 1964, label: 'Ranger 7 impacts Mare Cognitum', detail: 'First U.S. close-up lunar photos' },
  { id: 'ord-2', year: 1969, label: 'Apollo 11 Eagle lands at Tranquility Base', detail: 'First crewed Moon landing' },
  { id: 'ord-3', year: 1971, label: 'Apollo 15 deploys Lunar Roving Vehicle 1', detail: 'First off-world crewed drive' },
  { id: 'ord-4', year: 1976, label: 'Viking 1 lands in Chryse Planitia', detail: 'First multi-year Mars lander' },
  { id: 'ord-5', year: 1977, label: 'Voyager 1 & 2 launch on the Grand Tour', detail: 'Heading out to interstellar space' },
  { id: 'ord-6', year: 1997, label: 'Sojourner rolls onto Ares Vallis', detail: 'First wheeled rover on Mars' },
  { id: 'ord-7', year: 2004, label: 'Opportunity bounces into Eagle Crater', detail: 'Beginning a 45.16 km Mars marathon' },
  { id: 'ord-8', year: 2018, label: 'InSight places SEIS on Elysium Planitia', detail: 'Listening to over 1,300 marsquakes' },
];

export const GUESS_CRAFT_PUZZLES: GuessCraftPuzzle[] = [
  {
    id: 'gc-1',
    answerName: 'Apollo 15 Lunar Roving Vehicle (LRV-1)',
    mission: 'Apollo 15 (1971)',
    clues: [
      'Clue 1: I folded up like an origami suitcase inside a Lunar Module bay and weighed only ~35 kg in local gravity.',
      'Clue 2: My four wheels were woven from zinc-coated steel wire mesh because rubber would fail in vacuum.',
      'Clue 3: I carried astronauts 27.9 km near Hadley Rille and filmed Lunar Module Falcon blasting off.',
    ],
    options: [
      'Apollo 15 Lunar Roving Vehicle (LRV-1)',
      'Sojourner Mars Rover',
      'Surveyor 3 Lander',
      'Curiosity Rover',
    ],
    fact: 'LRV-1 remains parked about 100 meters east of Falcon in Palus Putredinis.',
  },
  {
    id: 'gc-2',
    answerName: 'Voyager 1',
    mission: 'Voyager Interstellar Mission (1977–Present)',
    clues: [
      'Clue 1: I launched in 1977 powered by three Plutonium-238 RTGs and carry a gold-plated copper phonograph disc.',
      'Clue 2: In 1990 I turned my camera backward to capture Earth as a tiny "Pale Blue Dot" from 6 billion km away.',
      'Clue 3: In August 2012 I crossed the heliopause, becoming the first human-made object in interstellar space.',
    ],
    options: ['Voyager 1', 'Pioneer 10', 'New Horizons', 'InSight Lander'],
    fact: 'Voyager 1 is still active and communicating across a 23+ hour one-way radio light delay.',
  },
  {
    id: 'gc-3',
    answerName: 'InSight Lander',
    mission: 'InSight (2018–2022)',
    clues: [
      'Clue 1: Unlike rovers, I never moved an inch after touching down on flat Elysium Planitia.',
      'Clue 2: I used a 2.4-meter robotic arm to place a copper-shielded French seismometer directly onto Mars.',
      'Clue 3: I trickled sand beside my twin circular solar panels to knock dust off before retiring in December 2022.',
    ],
    options: ['InSight Lander', 'Viking 1 Lander', 'Phoenix Lander', 'Opportunity Rover'],
    fact: 'InSight detected 1,319 marsquakes and proved Mars has a liquid iron-alloy core.',
  },
  {
    id: 'gc-4',
    answerName: 'Opportunity Rover (MER-B)',
    mission: 'Mars Exploration Rover (2004–2018)',
    clues: [
      'Clue 1: I bounced 26 times inside Vectran airbags before rolling to a stop inside Eagle Crater ("a hole-in-one").',
      'Clue 2: I was built to last 90 Martian sols, yet drove 45.16 kilometers over nearly 15 years.',
      'Clue 3: A global Martian dust storm in June 2018 blocked sunlight over Perseverance Valley and ended my signal.',
    ],
    options: [
      'Opportunity Rover (MER-B)',
      'Spirit Rover (MER-A)',
      'Perseverance Rover',
      'Sojourner Rover',
    ],
    fact: 'Opportunity discovered hematite "blueberries" and neutral-pH clay minerals on Endeavour Crater’s rim.',
  },
  {
    id: 'gc-5',
    answerName: 'Ingenuity Mars Helicopter',
    mission: 'Mars 2020 (2021–2024)',
    clues: [
      'Clue 1: I weigh just 1.8 kg and spin twin counter-rotating carbon-fiber blades at ~2,500 rpm.',
      'Clue 2: I flew 72 times in an atmosphere only 1% as thick as Earth’s.',
      'Clue 3: Rotor blade damage during landing on sand ripples in January 2024 grounded me at "Valinor Hills".',
    ],
    options: [
      'Ingenuity Mars Helicopter',
      'Beagle 2 Lander',
      'Surveyor 7 Lander',
      'New Horizons',
    ],
    fact: 'Ingenuity rode to Mars tucked beneath Perseverance’s belly pan.',
  },
  {
    id: 'gc-6',
    answerName: 'Pioneer 10',
    mission: 'Pioneer Program (1972–2003)',
    clues: [
      'Clue 1: I was the first spacecraft to fly safely through the Asteroid Belt and reach Jupiter in 1973.',
      'Clue 2: I carry an engraved gold-anodized aluminum plaque showing a hydrogen atom and Earth’s pulsar map.',
      'Clue 3: My final faint radio signal reached Earth in January 2003; I now coast silently toward Taurus.',
    ],
    options: ['Pioneer 10', 'Voyager 2', 'Ranger 7', 'Viking 2'],
    fact: 'Pioneer 10’s Jupiter flyby proved spacecraft could survive intense planetary radiation belts.',
  },
];

export const MISSION_SCENARIOS: MissionScenario[] = [
  {
    id: 'sc-dust',
    title: 'Challenge 1: Martian Dust Crisis',
    machine: 'InSight Lander (2021)',
    situation:
      'Red Martian dust has coated 75% of your circular solar arrays, and winds in Elysium Planitia are too gentle to blow it off naturally. Winter is approaching and your seismometer needs power. What do you command?',
    choices: [
      {
        label: 'Scoop coarse sand with the robotic arm and trickle it above the panels during a mild wind gust.',
        isOptimal: true,
        outcome:
          'Smart engineering! Real JPL engineers did exactly this—larger sand grains bounced across the panels and carried fine dust away, giving InSight months of extra marsquake science.',
      },
      {
        label: 'Fire the retro-landing thrusters to blow the panels clean.',
        isOptimal: false,
        outcome:
          'Risky! Firing landing engines on the ground would blast dust clouds over the delicate SEIS dome and likely tip or damage the lander.',
      },
      {
        label: 'Drive the lander onto a steeper sunny hill.',
        isOptimal: false,
        outcome:
          'Impossible—InSight is a stationary three-legged lander with zero wheels!',
      },
    ],
  },
  {
    id: 'sc-voyager',
    title: 'Challenge 2: Power Budget at 165+ AU',
    machine: 'Voyager 1 (Interstellar Space)',
    situation:
      'Your Plutonium-238 RTGs lose ~4 watts of electrical power every year. Today, power is barely enough to keep the transmitter, computer, and four interstellar instruments running. What is the best mission choice?',
    choices: [
      {
        label: 'Turn off remaining non-essential heaters and prioritize cosmic-ray & plasma-wave instruments.',
        isOptimal: true,
        outcome:
          'Spot on! NASA’s Voyager team carefully turns off instrument heaters and individual sensors in stages—remarkably, the electronics keep working far colder than tested.',
      },
      {
        label: 'Deploy backup solar wings to catch sunlight at 165 AU.',
        isOptimal: false,
        outcome:
          'Ineffective—Voyager has no solar panels, and sunlight at 165 AU is more than 27,000 times weaker than on Earth!',
      },
      {
        label: 'Turn the spacecraft around and fly back to Earth for repairs.',
        isOptimal: false,
        outcome:
          'Impossible—Voyager 1 travels at ~17 km/s on an escape trajectory with only small attitude-control thrusters.',
      },
    ],
  },
  {
    id: 'sc-apollo',
    title: 'Challenge 3: Broken Lunar Fender',
    machine: 'Apollo 17 LRV-3 (1972)',
    situation:
      'While loading tools on the Moon, a hammer knocks off part of your rover’s fiberglass rear fender. Every time you drive, spinning wire wheels spray abrasive razor-sharp regolith over your spacesuit and cameras! What can you improvise using items on board?',
    choices: [
      {
        label: 'Tape four laminated lunar maps together with gray duct tape and clamp them in place with optical clamps.',
        isOptimal: true,
        outcome:
          'Classic Apollo ingenuity! Astronauts Eugene Cernan and Harrison Schmitt used laminated maps, duct tape, and telescope clamps—keeping dust down for the rest of the 35.9 km drive.',
      },
      {
        label: 'Wash the wheels down with water from the Lunar Module tank.',
        isOptimal: false,
        outcome:
          'Dangerous! Water freezes instantly in lunar vacuum, wasting precious crew coolant and turning dust into caked mud.',
      },
      {
        label: 'Abandon the rover immediately and return to Earth early.',
        isOptimal: false,
        outcome:
          'Unnecessary—with a simple 10-minute field repair, LRV-3 went on to set the Apollo distance record.',
      },
    ],
  },
  {
    id: 'sc-memory',
    title: 'Challenge 4: Corrupted Memory Across 24 Billion Kilometers',
    machine: 'Voyager 1 (2023–2024)',
    situation:
      'A single memory chip inside the Flight Data Subsystem fails, causing Voyager 1 to send back repeating gibberish instead of science data. Round-trip radio messages take ~45 hours. How can you rescue it?',
    choices: [
      {
        label: 'Rewrite the flight software into smaller chunks and relocate them into healthy memory addresses elsewhere in the chip.',
        isOptimal: true,
        outcome:
          'Brilliant! That is exactly how JPL engineers rescued Voyager 1 in April 2024—splitting the code across free memory blocks and restoring full science telemetry.',
      },
      {
        label: 'Upload a brand-new 2 GB operating system update over the radio link.',
        isOptimal: false,
        outcome:
          'Impossible—Voyager’s total computer memory is ~69.6 KB, and its Deep Space Network downlink/uplink runs at tens to hundreds of bits per second.',
      },
      {
        label: 'Send a robotic repair drone to swap the chip within a week.',
        isOptimal: false,
        outcome:
          'Even at Voyager 1’s speed of 61,000 km/h, catching up to it would take nearly 50 years!',
      },
    ],
  },
  {
    id: 'sim-low-battery',
    title: 'Mission Control Sim 1: Low Battery Entering Lunar Shadow',
    machine: 'Educational Simulation · Polar Lunar Rover',
    situation:
      'Battery reserves have dropped to 18% while nightfall approaches a polar crater rim. Heating electronics overnight requires 12%, leaving only 6% for operations. What do you prioritize?',
    choices: [
      {
        label: 'Halt driving immediately, point the high-gain dish toward Earth, and enter survival heater sleep mode.',
        isOptimal: true,
        outcome:
          'Optimal Trade-Off! Preserving survival heaters protects flight computers and batteries from -170 °C thermal shock so science can resume at sunrise.',
      },
      {
        label: 'Drive at full speed downhill to collect one extra soil sample.',
        isOptimal: false,
        outcome:
          'Battery hits 0% before heaters stabilize; extreme lunar night cold permanently fractures unheated battery cells.',
      },
      {
        label: 'Leave all floodlights and stereo cameras recording continuously overnight.',
        isOptimal: false,
        outcome:
          'Floodlights drain the remaining 18% within two hours without returning usable data.',
      },
    ],
  },
  {
    id: 'sim-discovery-path',
    title: 'Mission Control Sim 2: Unusual Mineral Vein in Path',
    machine: 'Educational Simulation · Mars Exploration Rover',
    situation:
      'Your rover spots bright layered sulfate veins along a steep crater slope just 4 meters off its scheduled route—but winter sunlight angles drop next week. What is the safest science command?',
    choices: [
      {
        label: 'Pause traverse for 1 sol to capture Pancam spectra and check wheel slip before driving close with the robotic arm.',
        isOptimal: true,
        outcome:
          'Smart Science Operations! Verifying slope stability protects the rover from getting trapped in soft sulfate sand while still capturing the mineral breakthrough.',
      },
      {
        label: 'Charge straight down the steep loose slope at maximum speed without imaging first.',
        isOptimal: false,
        outcome:
          'High wheel-slip risk! Spirit became permanently bogged down when its wheels sank into unseen soft sulfate sand.',
      },
      {
        label: 'Ignore every rock outcrop along the drive to save 100% of travel time.',
        isOptimal: false,
        outcome:
          'You arrive ahead of schedule, but miss Opportunity-style "blueberries" or ancient hydrothermal clay veins.',
      },
    ],
  },
  {
    id: 'sim-weak-comms',
    title: 'Mission Control Sim 3: Weak Earth Direct-to-Spacecraft Link',
    machine: 'Educational Simulation · Mars Surface Ops',
    situation:
      'Solar interference and dust attenuate your direct X-band signal to Earth down to a trickle, risking corrupted command uploads. How do you protect telemetry?',
    choices: [
      {
        label: 'Buffer high-resolution science locally and relay compressed packets when an overhead Mars orbiter passes overhead on UHF.',
        isOptimal: true,
        outcome:
          'Standard NASA Relay Strategy! Over 90% of Mars rover science travels through UHF passes with Mars Reconnaissance Orbiter and Mars Odyssey.',
      },
      {
        label: 'Delete unconfirmed science images from onboard memory to shrink transmission size.',
        isOptimal: false,
        outcome:
          'Permanent science loss—solid-state flash memory should hold data safely until Earth confirms receipt.',
      },
      {
        label: 'Spin the high-gain dish continuously in circles to boost signal strength.',
        isOptimal: false,
        outcome:
          'Continuous slewing breaks Earth lock and wastes motor power.',
      },
    ],
  },
  {
    id: 'sim-obstacle',
    title: 'Mission Control Sim 4: Sharp Boulder Field Blocking Crater Exit',
    machine: 'Educational Simulation · Autonomous Surface Navigation',
    situation:
      'Hazard avoidance cameras detect jagged basalt rocks taller than the rover’s belly clearance across the direct path. Earth is 14 light-minutes away (28 min round-trip). What should control do?',
    choices: [
      {
        label: 'Stop safely, transmit a stereo Hazcam mesh to Earth, and upload a curved waypoint path skirting the boulder field.',
        isOptimal: true,
        outcome:
          'Textbook Planetary Driving! Because light delay makes real-time joysticks impossible, engineers plot guarded routes around sharp rocks that could tear aluminum wheels.',
      },
      {
        label: 'Try to steer in real time from Earth using live joystick commands.',
        isOptimal: false,
        outcome:
          'With a 28-minute round-trip radio delay, the rover hits the boulder nearly half an hour before a human driver even sees the warning frame.',
      },
      {
        label: 'Disable wheel slip sensors and climb directly over the sharp 50 cm rocks.',
        isOptimal: false,
        outcome:
          'Severe wheel puncture risk—jagged basalt tore holes in Curiosity’s aluminum wheels early in Gale Crater.',
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'AU (Astronomical Unit)',
    category: 'Deep Space Navigation',
    definition: 'The average distance between Earth and the Sun—roughly 149.6 million kilometers (93 million miles).',
    example: 'Voyager 1 is beyond 166 AU from Earth, meaning it is over 166 times farther from the Sun than Earth is.',
  },
  {
    term: 'Delta-v (Δv)',
    category: 'Propulsion & Physics',
    definition: 'The total change in velocity a spacecraft needs to perform a maneuver, such as launching into orbit or landing.',
    example: 'Returning from Mars requires ~6.1 km/s of delta-v, which drives up fuel requirements exponentially.',
  },
  {
    term: 'Deep Space Network (DSN)',
    category: 'Deep Space Navigation',
    definition: 'NASA’s global trio of giant radio dish complexes (California, Spain, Australia) placed ~120° apart around Earth so spacecraft never slip out of view as Earth rotates.',
    example: 'The 70-meter dishes at Goldstone, Madrid, and Canberra still catch Voyager 1’s ~22-watt whispers.',
  },
  {
    term: 'Descent Stage',
    category: 'Propulsion & Physics',
    definition: 'The lower engine-equipped half of a two-stage lander that slows the spacecraft to touchdown and serves as a launch pad for the ascent stage.',
    example: 'All six Apollo Lunar Module descent stages remain on the Moon.',
  },
  {
    term: 'EDL (Entry, Descent, and Landing)',
    category: 'Propulsion & Physics',
    definition: 'The high-speed sequence—sometimes called "seven minutes of terror" on Mars—where a spacecraft hits an atmosphere, deploys parachutes, and touches down.',
    example: 'Perseverance’s EDL left behind a heat shield, parachute, backshell, and sky crane.',
  },
  {
    term: 'Golden Record',
    category: 'Deep Space Navigation',
    definition: 'A 12-inch gold-plated copper phonograph disc carried aboard Voyager 1 and Voyager 2 containing Earth music, greetings in 55 languages, and encoded images.',
    example: 'Engineered to survive more than a billion years in interstellar space.',
  },
  {
    term: 'Heliopause',
    category: 'Deep Space Navigation',
    definition: 'The outer boundary of the Sun’s magnetic and solar-wind bubble (the heliosphere), where cold interstellar gas pushes back.',
    example: 'Voyager 1 crossed the heliopause in August 2012; Voyager 2 followed in November 2018.',
  },
  {
    term: 'Hematite',
    category: 'Planetary Geology',
    definition: 'An iron-oxide mineral that frequently forms in the presence of liquid water on Earth and Mars.',
    example: 'Opportunity discovered marble-like hematite spheres ("blueberries") in Meridiani Planum.',
  },
  {
    term: 'HiRISE',
    category: 'Instruments & Power',
    definition: 'High Resolution Imaging Science Experiment—a powerful telescopic camera aboard NASA’s Mars Reconnaissance Orbiter capable of resolving 30 cm details on Mars.',
    example: 'HiRISE photographed Beagle 2, Opportunity, Spirit, Viking, and InSight from orbit.',
  },
  {
    term: 'LRRR (Laser Ranging Retroreflector)',
    category: 'Instruments & Power',
    definition: 'A panel of special corner-cube mirrors that reflect laser beams straight back toward their source on Earth without needing electricity.',
    example: 'Apollo 11, 14, and 15 LRRRs remain active scientific instruments today.',
  },
  {
    term: 'Marsquake',
    category: 'Planetary Geology',
    definition: 'A seismic tremor inside Mars caused by cooling crust contraction, tectonic faulting, or meteoroid impacts.',
    example: 'InSight’s SEIS instrument detected more than 1,300 marsquakes.',
  },
  {
    term: 'NSSDCA / COSPAR ID',
    category: 'Deep Space Navigation',
    definition: 'The official international catalog code assigned to every launched spacecraft (launch year + launch number + component letter).',
    example: 'Apollo 11 Lunar Module Eagle is cataloged as 1969-059C.',
  },
  {
    term: 'Perchlorate',
    category: 'Planetary Geology',
    definition: 'A reactive chlorine-oxygen salt discovered in Martian arctic and equatorial soil that lowers the freezing point of water.',
    example: 'Detected in situ by the Phoenix Mars Lander in 2008.',
  },
  {
    term: 'Permanently Shadowed Region (PSR)',
    category: 'Planetary Geology',
    definition: 'Deep polar crater floors on the Moon where low sun angles never shine, keeping temperatures near -230 °C and trapping ancient water ice.',
    example: 'LCROSS proved water ice exists inside Cabeus Crater’s shadows.',
  },
  {
    term: 'Regolith',
    category: 'Planetary Geology',
    definition: 'The layer of loose, fractured dust, sand, and broken rock covering solid bedrock on the Moon and Mars.',
    example: 'Lunar regolith consists of sharp, electrostatic glass-like shards formed by meteoroid impacts.',
  },
  {
    term: 'Rocker-Bogie Suspension',
    category: 'Instruments & Power',
    definition: 'A six-wheeled mechanical linkage without springs that keeps all wheels pressed to uneven rocky ground while keeping the rover body stable.',
    example: 'Used on Sojourner, Spirit, Opportunity, Curiosity, and Perseverance.',
  },
  {
    term: 'RTG (Radioisotope Thermoelectric Generator)',
    category: 'Instruments & Power',
    definition: 'A nuclear battery that converts natural heat from decaying Plutonium-238 directly into steady electricity using thermocouples—no moving parts.',
    example: 'Powers Viking 1/2, Voyager 1/2, Curiosity, Perseverance, and New Horizons.',
  },
  {
    term: 'Seismometer',
    category: 'Instruments & Power',
    definition: 'A precision motion detector that records tiny ground vibrations to reveal the internal layers of a planet.',
    example: 'InSight’s SEIS could detect vibrations smaller than the width of a hydrogen atom.',
  },
  {
    term: 'Sol',
    category: 'Deep Space Navigation',
    definition: 'One Martian solar day—about 24 hours, 39 minutes, and 35 seconds long.',
    example: 'Opportunity survived 5,111 sols on Mars.',
  },
  {
    term: 'Tsiolkovsky Rocket Equation',
    category: 'Propulsion & Physics',
    definition: 'The physics law showing that fuel needed grows exponentially with desired velocity change (Δv), explaining why heavy return vehicles are rarely feasible.',
    example: 'Returning 1 kg from Mars without local fuel production demands roughly ~150–200 kg of extra Earth launch mass.',
  },
];
