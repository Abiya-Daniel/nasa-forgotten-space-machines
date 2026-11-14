import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, RotateCcw } from 'lucide-react';
import { Spacecraft3DHotspot, Spacecraft3DId } from '../types/equipment';
import { SPACECRAFT_3D_MODELS } from '../data/museumExperiencesData';

interface SpacecraftModel3DProps {
  machineId: Spacecraft3DId;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (hotspot: Spacecraft3DHotspot | null) => void;
  exploded?: boolean;
  onToggleExploded?: () => void;
  heightClassName?: string;
}

interface ExplodablePart {
  object: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeOffset: THREE.Vector3;
}

function addPart(
  group: THREE.Group,
  explodable: ExplodablePart[],
  obj: THREE.Object3D,
  offset: [number, number, number]
) {
  group.add(obj);
  explodable.push({
    object: obj,
    basePos: obj.position.clone(),
    explodeOffset: new THREE.Vector3(offset[0], offset[1], offset[2]),
  });
}

function buildApolloLRV(
  group: THREE.Group,
  mats: Record<string, THREE.Material>,
  explodable: ExplodablePart[]
) {
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.14, 1.1), mats.aluminum);
  chassis.position.y = 0.45;
  addPart(group, explodable, chassis, [0, 0, 0]);

  // Silver-zinc battery + nav console on forward chassis
  const navPack = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.22, 0.46), mats.gold);
  navPack.position.set(0.48, 0.58, 0);
  addPart(group, explodable, navPack, [0.35, 0.45, 0]);

  // 4 Wire-mesh wheels
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.18, 24);
  wheelGeo.rotateX(Math.PI / 2);
  const wheelOffsets: [number, number][] = [
    [-0.82, 0.66],
    [0.82, 0.66],
    [-0.82, -0.66],
    [0.82, -0.66],
  ];
  wheelOffsets.forEach(([x, z]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(x, 0.32, z);
    const wheel = new THREE.Mesh(wheelGeo, mats.darkMetal);
    wheelGroup.add(wheel);
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.21, 12).rotateX(Math.PI / 2),
      mats.gold
    );
    wheelGroup.add(hub);
    addPart(group, explodable, wheelGroup, [x * 0.45, -0.1, z * 0.6]);
  });

  // Two astronaut seats
  [-0.28, 0.28].forEach((z) => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.42, 0.36), mats.slate);
    seat.position.set(-0.15, 0.72, z);
    addPart(group, explodable, seat, [-0.25, 0.55, z * 0.7]);
  });

  // High-gain parabolic mesh dish + mast
  const dishGroup = new THREE.Group();
  dishGroup.position.set(0.75, 0.9, -0.2);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), mats.aluminum);
  dishGroup.add(mast);
  const dish = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 0.18, 20, 1, true),
    mats.gold
  );
  dish.rotation.x = Math.PI * 0.7;
  dish.position.y = 0.45;
  dishGroup.add(dish);
  addPart(group, explodable, dishGroup, [0.4, 0.6, -0.3]);

  // Forward TV camera
  const cam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.16), mats.skyAccent);
  cam.position.set(0.88, 0.95, 0.25);
  addPart(group, explodable, cam, [0.55, 0.45, 0.3]);
}

function buildOpportunity(
  group: THREE.Group,
  mats: Record<string, THREE.Material>,
  explodable: ExplodablePart[]
) {
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 0.85), mats.gold);
  body.position.y = 0.72;
  addPart(group, explodable, body, [0, 0, 0]);

  const wings = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 1.9), mats.solar);
  wings.position.y = 0.94;
  addPart(group, explodable, wings, [0, 0.55, 0]);

  const mastGroup = new THREE.Group();
  mastGroup.position.set(0.32, 1.35, 0.2);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.85, 10), mats.aluminum);
  mastGroup.add(mast);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.42), mats.skyAccent);
  head.position.y = 0.43;
  mastGroup.add(head);
  addPart(group, explodable, mastGroup, [0.2, 0.75, 0.2]);

  const hga = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.06, 0.08, 20), mats.aluminum);
  hga.rotation.z = -0.35;
  hga.position.set(-0.32, 1.15, -0.25);
  addPart(group, explodable, hga, [-0.4, 0.65, -0.3]);

  // IDD Robotic Arm
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.08), mats.copper);
  arm.position.set(0.76, 0.62, -0.05);
  arm.rotation.z = -0.25;
  addPart(group, explodable, arm, [0.65, 0.15, 0]);

  const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 18);
  wheelGeo.rotateX(Math.PI / 2);
  [-0.65, 0, 0.65].forEach((x) => {
    [-0.62, 0.62].forEach((z) => {
      const w = new THREE.Mesh(wheelGeo, mats.darkMetal);
      w.position.set(x, 0.18, z);
      addPart(group, explodable, w, [x * 0.45, -0.1, z * 0.6]);
    });
  });

  const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8);
  [-0.55, 0.55].forEach((z) => {
    const s = new THREE.Mesh(strutGeo, mats.aluminum);
    s.position.set(0, 0.42, z);
    addPart(group, explodable, s, [0, -0.05, z * 0.45]);
  });
}

function buildInSight(
  group: THREE.Group,
  mats: Record<string, THREE.Material>,
  explodable: ExplodablePart[]
) {
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.68, 0.34, 8), mats.slate);
  deck.position.y = 0.68;
  addPart(group, explodable, deck, [0, 0.1, 0]);

  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const legGroup = new THREE.Group();
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8), mats.aluminum);
    leg.position.set(Math.cos(angle) * 0.65, 0.34, Math.sin(angle) * 0.65);
    leg.rotation.z = Math.cos(angle) * 0.35;
    leg.rotation.x = -Math.sin(angle) * 0.35;
    legGroup.add(leg);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 14), mats.darkMetal);
    pad.position.set(Math.cos(angle) * 0.82, 0.02, Math.sin(angle) * 0.82);
    legGroup.add(pad);
    addPart(group, explodable, legGroup, [Math.cos(angle) * 0.4, -0.1, Math.sin(angle) * 0.4]);
  }

  [-1.35, 1.35].forEach((x) => {
    const panel = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.03, 10), mats.solar);
    panel.position.set(x, 0.76, 0);
    addPart(group, explodable, panel, [x * 0.48, 0.42, 0]);
  });

  const seis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.24, 6), mats.copper);
  seis.position.set(0.35, 0.12, 1.15);
  addPart(group, explodable, seis, [0.15, 0.2, 0.65]);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), mats.aluminum);
  arm.position.set(0.25, 1.05, 0.45);
  arm.rotation.x = 0.45;
  addPart(group, explodable, arm, [0.2, 0.55, 0.3]);

  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 12), mats.gold);
  horn.position.set(0, 0.94, -0.1);
  addPart(group, explodable, horn, [0, 0.6, -0.2]);
}

function buildVoyager(
  group: THREE.Group,
  mats: Record<string, THREE.Material>,
  explodable: ExplodablePart[]
) {
  const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.38, 10), mats.slate);
  bus.position.y = 0.9;
  addPart(group, explodable, bus, [0, 0, 0]);

  const dishGroup = new THREE.Group();
  dishGroup.position.y = 1.26;
  const dish = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.32, 32, 1, true), mats.aluminum);
  dish.rotation.x = Math.PI;
  dishGroup.add(dish);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 6), mats.aluminum);
    strut.position.set(Math.cos(a) * 0.45, 0.24, Math.sin(a) * 0.45);
    strut.rotation.z = Math.cos(a) * 0.45;
    strut.rotation.x = -Math.sin(a) * 0.45;
    dishGroup.add(strut);
  }
  addPart(group, explodable, dishGroup, [0, 0.68, 0]);

  const record = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24).rotateZ(Math.PI / 2),
    mats.gold
  );
  record.position.set(0.66, 0.9, 0);
  addPart(group, explodable, record, [0.45, 0.2, 0]);

  const rtgGroup = new THREE.Group();
  const rtgBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), mats.aluminum);
  rtgBoom.rotation.z = Math.PI / 2;
  rtgBoom.position.set(-1.15, 0.85, 0);
  rtgGroup.add(rtgBoom);
  const rtgCan = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.65, 12), mats.darkMetal);
  rtgCan.rotation.z = Math.PI / 2;
  rtgCan.position.set(-1.75, 0.85, 0);
  rtgGroup.add(rtgCan);
  addPart(group, explodable, rtgGroup, [-0.65, 0, 0]);

  const scanGroup = new THREE.Group();
  const scanBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 8), mats.aluminum);
  scanBoom.rotation.z = Math.PI / 2;
  scanBoom.position.set(1.15, 0.95, 0.25);
  scanGroup.add(scanBoom);
  const scanHead = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.26), mats.skyAccent);
  scanHead.position.set(1.75, 0.95, 0.25);
  scanGroup.add(scanHead);
  addPart(group, explodable, scanGroup, [0.65, 0.25, 0.2]);

  const magBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.1, 6), mats.skyAccent);
  magBoom.rotation.x = Math.PI / 2;
  magBoom.position.set(0, 0.9, -1.55);
  addPart(group, explodable, magBoom, [0, 0, -0.65]);
}

function buildCassini(
  group: THREE.Group,
  mats: Record<string, THREE.Material>,
  explodable: ExplodablePart[]
) {
  // Stacked cylindrical/octagonal bus wrapped in gold thermal blanket
  const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.15, 12), mats.gold);
  bus.position.y = 0.95;
  addPart(group, explodable, bus, [0, 0, 0]);

  // 4-meter white/aluminum High-Gain Dish at top
  const hga = new THREE.Mesh(new THREE.ConeGeometry(1.18, 0.28, 32, 1, true), mats.aluminum);
  hga.rotation.x = Math.PI;
  hga.position.y = 1.66;
  addPart(group, explodable, hga, [0, 0.72, 0]);

  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.45, 10), mats.slate);
  feed.position.y = 1.88;
  addPart(group, explodable, feed, [0, 0.92, 0]);

  // Detachable ESA Huygens Probe conical shield on side
  const huygens = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.26, 24), mats.copper);
  huygens.rotation.z = -Math.PI / 2;
  huygens.position.set(0.68, 0.92, 0.12);
  addPart(group, explodable, huygens, [0.75, 0.15, 0.15]);

  // 3× RTGs + twin main engines at base
  const propulsion = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 + 0.5;
    const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.48, 10), mats.darkMetal);
    rtg.position.set(Math.cos(angle) * 0.44, 0.42, Math.sin(angle) * 0.44);
    rtg.rotation.z = -Math.cos(angle) * 0.65;
    rtg.rotation.x = Math.sin(angle) * 0.65;
    propulsion.add(rtg);
  }
  const engine = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.3, 16, 1, true), mats.darkMetal);
  engine.position.y = 0.25;
  propulsion.add(engine);
  addPart(group, explodable, propulsion, [0, -0.35, -0.35]);

  // 11-meter Magnetometer Truss Boom
  const magBoom = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.06, 0.06), mats.skyAccent);
  magBoom.position.set(-1.18, 1.05, 0);
  addPart(group, explodable, magBoom, [-0.7, 0.25, 0]);
}

function buildHubble(
  group: THREE.Group,
  mats: Record<string, THREE.Material>,
  explodable: ExplodablePart[]
) {
  // Aft shroud & servicing instrument bays
  const aft = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.95, 24), mats.aluminum);
  aft.position.set(0, 0.62, -0.2);
  aft.rotation.x = Math.PI * 0.35;
  addPart(group, explodable, aft, [0, -0.28, -0.35]);

  // Forward light shield & optical tube
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.56, 1.45, 24), mats.aluminum);
  tube.position.set(0, 1.25, 0.38);
  tube.rotation.x = Math.PI * 0.35;
  addPart(group, explodable, tube, [0, 0.35, 0.45]);

  // Hinged Aperture Door
  const door = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 24), mats.gold);
  door.position.set(0, 1.66, 1.05);
  door.rotation.x = -0.25;
  addPart(group, explodable, door, [0, 0.65, 0.72]);

  // Twin Solar Array Wings
  [-1.45, 1.45].forEach((x) => {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.03, 0.55), mats.solar);
    wing.position.set(x, 0.95, 0);
    wing.rotation.x = 0.2;
    addPart(group, explodable, wing, [x * 0.45, 0.25, 0]);
  });

  // High-gain S-band TDRSS dish boom
  const dish = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.08, 18, 1, true), mats.skyAccent);
  dish.position.set(0.35, 1.68, -0.25);
  addPart(group, explodable, dish, [0.3, 0.6, -0.3]);
}

export function SpacecraftModel3D({
  machineId,
  selectedHotspotId = null,
  onSelectHotspot,
  exploded = false,
  onToggleExploded,
  heightClassName = 'h-[360px] sm:h-[440px]',
}: SpacecraftModel3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // Refs synced to imperative Three.js loop without destroying WebGL context on prop change
  const selectedIdRef = useRef<string | null>(selectedHotspotId);
  const explodedRef = useRef<boolean>(exploded);
  const onSelectRef = useRef(onSelectHotspot);
  const cameraPresetRef = useRef<{ pos: [number, number, number]; target: [number, number, number] } | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    selectedIdRef.current = selectedHotspotId;
    const model = SPACECRAFT_3D_MODELS[machineId];
    const spot = model?.hotspots.find((h) => h.id === selectedHotspotId);
    if (spot) {
      cameraPresetRef.current = {
        pos: spot.cameraOffset,
        target: spot.pos,
      };
    }
    requestRenderRef.current?.();
  }, [selectedHotspotId, machineId]);

  useEffect(() => {
    explodedRef.current = exploded;
    requestRenderRef.current?.();
  }, [exploded]);

  useEffect(() => {
    onSelectRef.current = onSelectHotspot;
  }, [onSelectHotspot]);

  const setCameraPreset = useCallback((preset: 'overview' | 'top' | 'side') => {
    if (preset === 'overview') {
      cameraPresetRef.current = { pos: [3.3, 2.2, 3.6], target: [0, 0.82, 0] };
    } else if (preset === 'top') {
      cameraPresetRef.current = { pos: [0.05, 4.6, 0.6], target: [0, 0.75, 0] };
    } else {
      cameraPresetRef.current = { pos: [4.2, 1.15, 0.05], target: [0, 0.8, 0] };
    }
    requestRenderRef.current?.();
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch {
      setError('3D WebGL preview unavailable in this browser. Use the 2D Schematic or Component Cards.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 400;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    camera.position.set(3.3, 2.2, 3.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.82, 0);
    controls.enablePan = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 8.5;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;

    // User interaction immediately cancels any scripted camera fly-to
    controls.addEventListener('start', () => {
      cameraPresetRef.current = null;
    });

    // 3-point space lighting rig
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.25);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    scene.add(new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.7));
    const rim = new THREE.DirectionalLight(0x4c9aff, 0.9);
    rim.position.set(-4, 2.5, -4);
    scene.add(rim);

    // Subtle ground reference grid
    const ground = new THREE.GridHelper(5.5, 12, 0x263449, 0x131b2b);
    scene.add(ground);

    const mats = {
      aluminum: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.78, roughness: 0.28 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.62, roughness: 0.56 }),
      slate: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.28, roughness: 0.72 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xe8a95b, metalness: 0.86, roughness: 0.22 }),
      copper: new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.75, roughness: 0.35 }),
      solar: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.45, roughness: 0.2 }),
      skyAccent: new THREE.MeshStandardMaterial({ color: 0x4c9aff, metalness: 0.35, roughness: 0.28 }),
    };

    const craftGroup = new THREE.Group();
    const explodable: ExplodablePart[] = [];

    if (machineId === 'apollo-15-lrv1') buildApolloLRV(craftGroup, mats, explodable);
    else if (machineId === 'opportunity-mer-b') buildOpportunity(craftGroup, mats, explodable);
    else if (machineId === 'insight-lander') buildInSight(craftGroup, mats, explodable);
    else if (machineId === 'cassini-huygens') buildCassini(craftGroup, mats, explodable);
    else if (machineId === 'hubble') buildHubble(craftGroup, mats, explodable);
    else buildVoyager(craftGroup, mats, explodable);

    scene.add(craftGroup);

    // Interactive 3D Hotspot Beacons
    const modelDef = SPACECRAFT_3D_MODELS[machineId];
    const hotspotMeshes: THREE.Mesh[] = [];
    const hotspotRecords: {
      mesh: THREE.Mesh;
      ring: THREE.Mesh;
      hotspot: Spacecraft3DHotspot;
    }[] = [];

    const pinGeo = new THREE.SphereGeometry(0.085, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.11, 0.145, 24);
    ringGeo.rotateX(-Math.PI / 2);

    modelDef.hotspots.forEach((spot) => {
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0x4c9aff,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.9,
        roughness: 0.25,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
      pin.userData = { hotspotId: spot.id };
      scene.add(pin);
      hotspotMeshes.push(pin);

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xe8a95b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(spot.pos[0], spot.pos[1] - 0.04, spot.pos[2]);
      scene.add(ring);

      hotspotRecords.push({ mesh: pin, ring, hotspot: spot });
    });

    // Raycaster & pre-allocated scratch vectors (zero per-frame GC allocation)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const targetCamPos = new THREE.Vector3();
    const targetLookPos = new THREE.Vector3();
    const targetPartPos = new THREE.Vector3();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let explodeFactor = explodedRef.current ? 1 : 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 70);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const requestRender = () => {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        const dt = 1 / 60;
        let needsAnotherFrame = false;

        // Smooth exploded-view transition
        const goalExplode = explodedRef.current ? 1 : 0;
        if (Math.abs(explodeFactor - goalExplode) > 0.005) {
          explodeFactor = THREE.MathUtils.damp(explodeFactor, goalExplode, 7, dt);
          needsAnotherFrame = true;
        } else {
          explodeFactor = goalExplode;
        }

        explodable.forEach(({ object, basePos, explodeOffset }) => {
          targetPartPos.copy(basePos).addScaledVector(explodeOffset, explodeFactor);
          object.position.copy(targetPartPos);
        });

        // Update hotspot beacon highlight styling
        hotspotRecords.forEach(({ mesh, ring, hotspot }) => {
          const isSelected = selectedIdRef.current === hotspot.id;
          const m = mesh.material as THREE.MeshStandardMaterial;
          m.color.setHex(isSelected ? 0xe8a95b : 0x4c9aff);
          m.emissive.setHex(isSelected ? 0xe8a95b : 0x1d4ed8);
          m.emissiveIntensity = isSelected ? 1.4 : 0.75;
          mesh.scale.setScalar(isSelected ? 1.32 : 1.0);
          ring.visible = isSelected;
        });

        // Smooth camera fly-to transition when a preset or part is picked
        if (cameraPresetRef.current) {
          targetCamPos.set(...cameraPresetRef.current.pos);
          targetLookPos.set(...cameraPresetRef.current.target);
          camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.x, 6, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.y, 6, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.z, 6, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookPos.x, 6, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookPos.y, 6, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookPos.z, 6, dt);

          if (
            camera.position.distanceTo(targetCamPos) > 0.03 ||
            controls.target.distanceTo(targetLookPos) > 0.02
          ) {
            needsAnotherFrame = true;
          } else {
            cameraPresetRef.current = null;
          }
        }

        const changed = controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty || needsAnotherFrame || (changed && controls.enableDamping)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    const updateNdc = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerUp = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
      if (dist > 6) return; // Dragged orbit, not a click
      updateNdc(ev);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hotspotMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.hotspotId as string;
        const matched = modelDef.hotspots.find((h) => h.id === hitId) || null;
        if (matched && onSelectRef.current) {
          onSelectRef.current(matched);
        }
      }
    };

    const onPointerMove = (ev: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;
      updateNdc(ev);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hotspotMeshes, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.hotspotId as string;
        const matched = modelDef.hotspots.find((h) => h.id === hitId);
        renderer.domElement.style.cursor = 'pointer';
        setHoveredName(matched ? matched.name : null);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredName(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    requestRender();

    return () => {
      requestRenderRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      craftGroup.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          (o as THREE.Mesh).geometry.dispose();
        }
      });
      hotspotRecords.forEach(({ mesh, ring }) => {
        (mesh.material as THREE.Material).dispose();
        (ring.material as THREE.Material).dispose();
      });
      pinGeo.dispose();
      ringGeo.dispose();
      Object.values(mats).forEach((m) => m.dispose());
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [machineId]);

  if (error) {
    return (
      <div className={`flex ${heightClassName} items-center justify-center p-6 text-center text-xs text-slate-400 bg-[#05070D]`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`relative ${heightClassName} w-full bg-[#05070D]`}>
      <div ref={mountRef} className="h-full w-full" aria-label="Interactive 3D spacecraft model" />

      {/* Solid compact bottom control dock (no backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-md border border-slate-800 bg-[#080E1B] px-3 py-1.5 text-[11px] font-mono text-slate-300">
          <span>
            {hoveredName ? `Click to inspect: ${hoveredName}` : 'Illustrative 3D Reconstruction · Click pins or drag to orbit'}
          </span>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-md border border-slate-800 bg-[#080E1B] p-1">
          <button
            type="button"
            onClick={() => setCameraPreset('overview')}
            className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('top')}
            className="rounded px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            Top
          </button>
          <button
            type="button"
            onClick={() => setCameraPreset('side')}
            className="rounded px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            Side
          </button>
          {onToggleExploded && (
            <button
              type="button"
              onClick={onToggleExploded}
              aria-pressed={exploded}
              className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                exploded
                  ? 'bg-[#E8A95B] text-[#05070D]'
                  : 'bg-[#10213A] text-[#4C9AFF] hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{exploded ? 'Assemble' : 'Explode View'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
