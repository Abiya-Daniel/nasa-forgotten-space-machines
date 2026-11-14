import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pickaxe,
  Radio,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

interface SampleNode {
  id: string;
  label: string;
  x: number;
  z: number;
  finding: string;
}

const SAMPLE_NODES: SampleNode[] = [
  { id: 'smp-1', label: 'Hematite Concretion Outcrop', x: 10, z: -12, finding: 'Spherules of crystalline gray hematite formed in ancient Martian groundwater.' },
  { id: 'smp-2', label: 'Layered Sulfate Sandstone', x: -14, z: -8, finding: 'Cross-bedded evaporite ripples indicating shallow acidic ancient lakes.' },
  { id: 'smp-3', label: 'Gypsum Mineral Vein', x: 16, z: 10, finding: 'Bright calcium sulfate fracture precipitated by low-temperature water flow.' },
  { id: 'smp-4', label: 'Clay Smectite Rim Bedrock', x: -11, z: 15, finding: 'Neutral-pH phyllosilicate clays favorable for preserving organic chemistry.' },
  { id: 'smp-5', label: 'Hydrothermal Silica Nodule', x: 2, z: -22, finding: 'Amorphous silica deposit mirroring Earth hot-spring mineral biosignatures.' },
];

function terrainHeightAt(x: number, z: number): number {
  const crater1 = Math.exp(-((x - 8) ** 2 + (z + 8) ** 2) / 55) * -0.9;
  const crater2 = Math.exp(-((x + 12) ** 2 + (z - 10) ** 2) / 70) * 1.1;
  const ridge = Math.sin(x * 0.14) * Math.cos(z * 0.12) * 0.55;
  const ripples = Math.sin(x * 0.45 + z * 0.25) * 0.12;
  return crater1 + crater2 + ridge + ripples;
}

const _vecFwd = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

export function MarsRoverSimulator() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const keysRef = useRef<Record<string, boolean>>({});
  const roverStateRef = useRef({
    x: 0,
    z: 0,
    heading: 0,
    battery: 100,
    distance: 0,
    slopeDeg: 0,
    hazardText: 'Nominal Terrain',
  });
  const cameraModeRef = useRef<'chase' | 'mast' | 'orbit'>('chase');
  const collectedRef = useRef<string[]>([]);
  const sampleMeshesRef = useRef<Record<string, THREE.Mesh>>({});
  const obstaclesRef = useRef<{ x: number; z: number; r: number }[]>([]);
  const delayedCmdRef = useRef<{ cmd: 'fwd' | 'back' | 'left' | 'right'; executeAt: number }[]>([]);

  const [battery, setBattery] = useState(100);
  const [distanceM, setDistanceM] = useState(0);
  const [slopeDeg, setSlopeDeg] = useState(0);
  const [hazardText, setHazardText] = useState('Nominal Terrain');
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [nearestSample, setNearestSample] = useState<SampleNode | null>(null);
  const [lastSampleFinding, setLastSampleFinding] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: string; url: string; caption: string }[]>([]);
  const [cameraMode, setCameraMode] = useState<'chase' | 'mast' | 'orbit'>('chase');
  const [delayEnabled, setDelayEnabled] = useState(false);
  const [queuedCount, setQueuedCount] = useState(0);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglLost, setWebglLost] = useState(false);

  const { unlockBadge, recordSimCompletion } = useExperience();

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x26130c);
    scene.fog = new THREE.FogExp2(0x26130c, 0.017);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 180);
    camera.position.set(0, 3.6, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const canvasEl = renderer.domElement;
    canvasEl.style.display = 'block';
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvasEl);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglLost(true);
    };
    const onContextRestored = () => setWebglLost(false);
    canvasEl.addEventListener('webglcontextlost', onContextLost);
    canvasEl.addEventListener('webglcontextrestored', onContextRestored);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmrem.dispose();

    // Lighting rig: warm Martian sun + cool sky/ground fill
    const hemi = new THREE.HemisphereLight(0xc28a6e, 0x3b1b11, 0.75);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffdfc2, 1.85);
    sun.position.set(22, 30, 14);
    sun.castShadow = !isSoftwareGl;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -28;
    sun.shadow.camera.right = 28;
    sun.shadow.camera.top = 28;
    sun.shadow.camera.bottom = -28;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const controls = new OrbitControls(camera, canvasEl);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 2.8;
    controls.maxDistance = 26;
    controlsRef.current = controls;

    // Procedural Mars regolith texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 256;
    texCanvas.height = 256;
    const tCtx = texCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#8b4328';
      tCtx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2400; i++) {
        const rx = (i * 73) % 256;
        const ry = (i * 137) % 256;
        tCtx.fillStyle = i % 3 === 0 ? 'rgba(62,24,12,0.35)' : 'rgba(186,102,64,0.28)';
        tCtx.fillRect(rx, ry, 2, 2);
      }
    }
    const groundTex = new THREE.CanvasTexture(texCanvas);
    groundTex.colorSpace = THREE.SRGBColorSpace;
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(24, 24);
    groundTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Extended Mars terrain (120x120m so no void/box boundary)
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 96, 96);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      posAttr.setY(i, terrainHeightAt(vx, vz));
    }
    terrainGeo.computeVertexNormals();
    const terrainMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.92,
      metalness: 0.04,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Instanced Martian Rocks (42 boulders with per-instance variation)
    const rockGeo = new THREE.DodecahedronGeometry(0.65, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x5c3426,
      roughness: 0.88,
      metalness: 0.08,
    });
    const rockCount = 42;
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    rocks.castShadow = !isSoftwareGl;
    rocks.receiveShadow = true;
    const dummy = new THREE.Object3D();
    const colorTmp = new THREE.Color();
    const obsList: { x: number; z: number; r: number }[] = [];

    for (let i = 0; i < rockCount; i++) {
      const angle = i * 2.39996;
      const dist = 4.5 + ((i * 1.15) % 28);
      const rx = Math.cos(angle) * dist;
      const rz = Math.sin(angle) * dist;
      const sc = 0.65 + (i % 5) * 0.22;
      const ry = terrainHeightAt(rx, rz);
      dummy.position.set(rx, ry + sc * 0.28, rz);
      dummy.rotation.set(i * 0.4, i * 0.9, i * 0.2);
      dummy.scale.set(sc * 1.1, sc * 0.78, sc);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
      colorTmp.setHSL(0.04 + (i % 3) * 0.01, 0.42, 0.22 + (i % 4) * 0.04);
      rocks.setColorAt(i, colorTmp);
      obsList.push({ x: rx, z: rz, r: sc * 0.72 });
    }
    rocks.instanceMatrix.needsUpdate = true;
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
    rocks.computeBoundingSphere();
    scene.add(rocks);
    obstaclesRef.current = obsList;

    // 5 Scientific Target Outcrops (Glowing Sky Cyan Crystal Beacons)
    const sampleGeo = new THREE.OctahedronGeometry(0.36, 0);
    SAMPLE_NODES.forEach((node) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.7,
        roughness: 0.25,
        metalness: 0.6,
      });
      const m = new THREE.Mesh(sampleGeo, mat);
      m.position.set(node.x, terrainHeightAt(node.x, node.z) + 0.55, node.z);
      m.castShadow = !isSoftwareGl;
      scene.add(m);
      sampleMeshesRef.current[node.id] = m;
    });

    // Composite 8-Part Mars Rover Group (bottom-center pivot at y=0 wheels touching ground)
    const roverGroup = new THREE.Group();
    const goldFoilMat = new THREE.MeshPhysicalMaterial({
      color: 0xd99b26,
      metalness: 0.9,
      roughness: 0.22,
      anisotropy: 0.6,
    });
    const darkDeckMat = new THREE.MeshStandardMaterial({
      color: 0x162238,
      metalness: 0.45,
      roughness: 0.35,
    });
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.85,
      roughness: 0.28,
    });
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.85,
    });

    // 1. Primary Warm Electronics Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 1.45), goldFoilMat);
    chassis.position.y = 0.52;
    chassis.castShadow = !isSoftwareGl;
    roverGroup.add(chassis);

    // 2. Solar Wing / Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.06, 1.3), darkDeckMat);
    deck.position.y = 0.76;
    deck.castShadow = !isSoftwareGl;
    roverGroup.add(deck);

    // 3. Camera Mast & Stereo Head
    const mastPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.7, 10), titaniumMat);
    mastPost.position.set(0.18, 1.1, -0.42);
    roverGroup.add(mastPost);

    const camHead = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.16, 0.2), titaniumMat);
    camHead.position.set(0.18, 1.46, -0.45);
    roverGroup.add(camHead);

    const lensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
    const lensL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), lensMat);
    lensL.rotation.x = Math.PI / 2;
    lensL.position.set(0.1, 1.46, -0.56);
    const lensR = lensL.clone();
    lensR.position.x = 0.26;
    roverGroup.add(lensL, lensR);

    // 4. High-Gain Parabolic Dish
    const dish = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.06, 0.12, 16),
      titaniumMat
    );
    dish.position.set(-0.34, 0.95, 0.35);
    dish.rotation.x = 0.45;
    roverGroup.add(dish);

    // 5. Robotic Arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.65), titaniumMat);
    arm.position.set(-0.22, 0.56, -0.92);
    arm.rotation.x = 0.3;
    roverGroup.add(arm);

    // 6. 6 Grooved Aluminum Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelOffsets: [number, number][] = [
      [-0.72, -0.55],
      [-0.72, 0],
      [-0.72, 0.55],
      [0.72, -0.55],
      [0.72, 0],
      [0.72, 0.55],
    ];
    const wheels: THREE.Mesh[] = [];
    wheelOffsets.forEach(([wx, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, 0.22, wz);
      w.castShadow = !isSoftwareGl;
      roverGroup.add(w);
      wheels.push(w);
    });

    scene.add(roverGroup);

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          keysRef.current[e.code] = true;
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let uiSyncAccum = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const rs = roverStateRef.current;

      // Process delayed Mars command queue if active
      const nowMs = performance.now();
      let queueThrottle = 0;
      let queueTurn = 0;
      delayedCmdRef.current = delayedCmdRef.current.filter((item) => {
        if (nowMs >= item.executeAt) {
          if (item.cmd === 'fwd') queueThrottle += 1;
          if (item.cmd === 'back') queueThrottle -= 1;
          if (item.cmd === 'left') queueTurn += 1;
          if (item.cmd === 'right') queueTurn -= 1;
          return nowMs - item.executeAt < 450;
        }
        return true;
      });

      const k = keysRef.current;
      const throttle =
        (k.KeyW || k.ArrowUp ? 1 : 0) -
        (k.KeyS || k.ArrowDown ? 1 : 0) +
        queueThrottle;
      const turn =
        (k.KeyA || k.ArrowLeft ? 1 : 0) -
        (k.KeyD || k.ArrowRight ? 1 : 0) +
        queueTurn;

      const driveMult = rs.battery > 0 ? 1 : 0;
      const turnSpeed = 1.65;
      const moveSpeed = 3.8;

      if (turn !== 0 && driveMult > 0) {
        rs.heading += Math.sign(turn) * turnSpeed * dt;
      }

      let movedStep = 0;
      if (throttle !== 0 && driveMult > 0) {
        const dir = Math.sign(throttle);
        const nx = rs.x - Math.sin(rs.heading) * moveSpeed * dir * dt;
        const nz = rs.z - Math.cos(rs.heading) * moveSpeed * dir * dt;

        // Check perimeter (34 m radius crater field) & rock collision
        const inBounds = nx * nx + nz * nz < 34 * 34;
        const hitRock = obstaclesRef.current.some(
          (obs) => Math.hypot(nx - obs.x, nz - obs.z) < obs.r + 0.85
        );

        if (inBounds && !hitRock) {
          movedStep = Math.hypot(nx - rs.x, nz - rs.z);
          rs.x = nx;
          rs.z = nz;
          rs.distance += movedStep;
          rs.battery = Math.max(0, rs.battery - movedStep * 0.28);
          rs.hazardText = 'Nominal Drive';
          wheels.forEach((w) => {
            w.rotation.x -= dir * moveSpeed * dt * 2.8;
          });
        } else {
          rs.hazardText = hitRock
            ? 'Obstacle Proximity Halt (Boulder)'
            : 'Crater Perimeter Boundary';
        }
      } else if (rs.battery <= 0) {
        rs.hazardText = 'Battery Depleted — Recharge or Reset';
      }

      // Ground elevation & terrain slope tilt
      const cy = terrainHeightAt(rs.x, rs.z);
      const fy = terrainHeightAt(
        rs.x - Math.sin(rs.heading) * 0.7,
        rs.z - Math.cos(rs.heading) * 0.7
      );
      const ry = terrainHeightAt(
        rs.x + Math.cos(rs.heading) * 0.6,
        rs.z - Math.sin(rs.heading) * 0.6
      );
      const pitch = Math.atan2(fy - cy, 0.7);
      const roll = Math.atan2(cy - ry, 0.6);
      rs.slopeDeg = Math.round(
        THREE.MathUtils.radToDeg(Math.max(Math.abs(pitch), Math.abs(roll)))
      );

      roverGroup.position.set(rs.x, cy, rs.z);
      roverGroup.rotation.set(pitch, rs.heading, roll);

      // Animate uncollected crystal beacons
      SAMPLE_NODES.forEach((n) => {
        const mesh = sampleMeshesRef.current[n.id];
        if (mesh) {
          mesh.visible = !collectedRef.current.includes(n.id);
          mesh.rotation.y = elapsed * 1.4;
        }
      });

      // Camera Mode Damping
      const mode = cameraModeRef.current;
      if (mode === 'chase') {
        _vecFwd.set(Math.sin(rs.heading), 0, Math.cos(rs.heading));
        _targetCamPos.set(
          rs.x + _vecFwd.x * 5.2,
          cy + 2.8,
          rs.z + _vecFwd.z * 5.2
        );
        _targetLook.set(rs.x, cy + 0.9, rs.z);
        camera.position.lerp(_targetCamPos, 1 - Math.exp(-5 * dt));
        controls.target.lerp(_targetLook, 1 - Math.exp(-6 * dt));
      } else if (mode === 'mast') {
        camera.position.set(
          rs.x - Math.sin(rs.heading) * 0.35,
          cy + 1.62,
          rs.z - Math.cos(rs.heading) * 0.35
        );
        controls.target.set(
          rs.x - Math.sin(rs.heading) * 8,
          cy + 1.15,
          rs.z - Math.cos(rs.heading) * 8
        );
      } else {
        controls.target.lerp(_targetLook.set(rs.x, cy + 0.6, rs.z), 0.1);
      }

      controls.update();
      renderer.render(scene, camera);

      // Sync React HUD at ~8Hz cleanly
      uiSyncAccum += dt;
      if (uiSyncAccum > 0.12) {
        uiSyncAccum = 0;
        setBattery(Math.round(rs.battery));
        setDistanceM(Math.round(rs.distance * 10) / 10);
        setSlopeDeg(rs.slopeDeg);
        setHazardText(rs.hazardText);
        setQueuedCount(delayedCmdRef.current.filter((c) => c.executeAt > performance.now()).length);

        const found = SAMPLE_NODES.find(
          (n) =>
            !collectedRef.current.includes(n.id) &&
            Math.hypot(n.x - rs.x, n.z - rs.z) < 2.8
        );
        setNearestSample(found || null);
      }

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', onContextLost);
      canvasEl.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      groundTex.dispose();
      rockGeo.dispose();
      rockMat.dispose();
      sampleGeo.dispose();
      wheelGeo.dispose();
      goldFoilMat.dispose();
      darkDeckMat.dispose();
      titaniumMat.dispose();
      wheelMat.dispose();
      renderer.dispose();
    };
  }, []);

  const triggerMove = useCallback(
    (cmd: 'fwd' | 'back' | 'left' | 'right', active: boolean) => {
      if (delayEnabled && active) {
        delayedCmdRef.current.push({
          cmd,
          executeAt: performance.now() + 2500, // 2.5s simulated Martian command delay queue
        });
        return;
      }
      const keyMap: Record<typeof cmd, string> = {
        fwd: 'KeyW',
        back: 'KeyS',
        left: 'KeyA',
        right: 'KeyD',
      };
      keysRef.current[keyMap[cmd]] = active;
    },
    [delayEnabled]
  );

  const handleCollectSample = () => {
    if (!nearestSample) return;
    if (collectedRef.current.includes(nearestSample.id)) return;
    collectedRef.current = [...collectedRef.current, nearestSample.id];
    setCollectedIds(collectedRef.current);
    setLastSampleFinding(`${nearestSample.label}: ${nearestSample.finding}`);
    setNearestSample(null);
    unlockBadge('badge-rover-commander');
    recordSimCompletion('mars-rover-sim');
  };

  const handleCapturePhoto = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');
    setPhotos((prev) => [
      {
        id: `cam-${Date.now()}`,
        url: dataUrl,
        caption: `Sol Navcam Frame · Distance ${distanceM} m · Slope ${slopeDeg}°`,
      },
      ...prev.slice(0, 3),
    ]);
  };

  const handleReset = () => {
    roverStateRef.current = {
      x: 0,
      z: 0,
      heading: 0,
      battery: 100,
      distance: 0,
      slopeDeg: 0,
      hazardText: 'Nominal Terrain',
    };
    collectedRef.current = [];
    setCollectedIds([]);
    setBattery(100);
    setDistanceM(0);
    setSlopeDeg(0);
    setHazardText('Nominal Terrain');
    setLastSampleFinding(null);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Interactive 3D Mars Rover Driving Simulator (Simulated Environment)
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Drive Across Simulated Martian Crater Terrain
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Use <span className="font-mono text-slate-200">WASD</span> / Arrow keys or the bottom drive pad to steer around boulders, climb crater slopes, capture Navcam snapshots, and collect 5 glowing mineral outcrops.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-amber-400 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Rover &amp; Recharge</span>
        </button>
      </div>

      {/* 3D Canvas Viewport + Solid/RGBA HUD (Zero backdrop-filter over WebGL) */}
      <div className="relative rounded-xl border border-slate-800 bg-[#1a0d08] overflow-hidden h-[480px] sm:h-[540px]">
        <div ref={mountRef} className="w-full h-full" />

        {webglLost && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#07090E]/95 text-sm text-slate-200 p-6">
            WebGL context paused. Use Reset Rover or reload to resume 3D rendering.
          </div>
        )}

        {/* Top Minimal Telemetry Strip */}
        <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
          <div className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-lg border border-slate-700/80 bg-[#07090E]/90 px-3.5 py-2 text-xs">
            <div>
              <span className="text-slate-400">Battery </span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  battery < 25 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {battery}%
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">Drive </span>
              <span className="font-mono font-bold text-amber-300 tabular-nums">
                {distanceM.toFixed(1)} m
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">Slope </span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  slopeDeg > 18 ? 'text-amber-400' : 'text-sky-300'
                }`}
              >
                {slopeDeg}°
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400">Samples </span>
              <span className="font-mono font-bold text-sky-400 tabular-nums">
                {collectedIds.length}/{SAMPLE_NODES.length}
              </span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-slate-700/80 bg-[#07090E]/90 px-3 py-1.5 text-[11px] font-mono text-slate-200">
            {hazardText.includes('Obstacle') || hazardText.includes('Depleted') ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : null}
            <span>{hazardText}</span>
            {queuedCount > 0 && (
              <span className="text-amber-300 ml-1">· {queuedCount} queued</span>
            )}
          </div>
        </div>

        {/* Bottom Collapsible Control Dock */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(900px,94%)] flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDockCollapsed((c) => !c)}
            className="inline-flex items-center gap-1 rounded-t-md border border-b-0 border-slate-700 bg-[#0A0E18] px-3 py-1 text-[11px] font-mono text-slate-300 hover:text-white cursor-pointer"
          >
            {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{dockCollapsed ? 'Show Rover Controls' : 'Hide Controls'}</span>
          </button>

          {!dockCollapsed && (
            <div className="w-full rounded-lg border border-slate-700/90 bg-[#0A0E18]/95 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Drive Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Turn Left"
                  onPointerDown={() => triggerMove('left', true)}
                  onPointerUp={() => triggerMove('left', false)}
                  onPointerLeave={() => triggerMove('left', false)}
                  className="rounded border border-slate-700 bg-[#07090E] p-2 text-slate-200 hover:border-amber-400 active:bg-amber-500 active:text-slate-950 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Drive Forward"
                  onPointerDown={() => triggerMove('fwd', true)}
                  onPointerUp={() => triggerMove('fwd', false)}
                  onPointerLeave={() => triggerMove('fwd', false)}
                  className="rounded border border-slate-700 bg-[#07090E] p-2 text-slate-200 hover:border-amber-400 active:bg-amber-500 active:text-slate-950 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Drive Backward"
                  onPointerDown={() => triggerMove('back', true)}
                  onPointerUp={() => triggerMove('back', false)}
                  onPointerLeave={() => triggerMove('back', false)}
                  className="rounded border border-slate-700 bg-[#07090E] p-2 text-slate-200 hover:border-amber-400 active:bg-amber-500 active:text-slate-950 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Turn Right"
                  onPointerDown={() => triggerMove('right', true)}
                  onPointerUp={() => triggerMove('right', false)}
                  onPointerLeave={() => triggerMove('right', false)}
                  className="rounded border border-slate-700 bg-[#07090E] p-2 text-slate-200 hover:border-amber-400 active:bg-amber-500 active:text-slate-950 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Camera Mode Switcher */}
              <div className="flex items-center gap-1 text-xs">
                {(
                  [
                    { id: 'chase', label: 'Chase Cam' },
                    { id: 'mast', label: 'Mast POV' },
                    { id: 'orbit', label: 'Free Orbit' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCameraMode(m.id)}
                    className={`rounded px-2.5 py-1.5 font-medium cursor-pointer ${
                      cameraMode === m.id
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'border border-slate-700 bg-[#07090E] text-slate-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Actions: Sample, Photo, Comms Delay */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!nearestSample}
                  onClick={handleCollectSample}
                  className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                    nearestSample
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      : 'border border-slate-800 bg-[#07090E] text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Pickaxe className="w-3.5 h-3.5" />
                  <span>{nearestSample ? `Sample: ${nearestSample.label}` : 'Drive Near Blue Crystal'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-400 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span>Snap Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDelayEnabled((d) => !d)}
                  className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    delayEnabled
                      ? 'border-amber-400 bg-[#1B150B] text-amber-300'
                      : 'border-slate-700 bg-[#07090E] text-slate-300'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{delayEnabled ? 'Signal Delay: ON (2.5s Demo)' : 'Signal Delay: Real-Time'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Latest Scientific Finding + Captured Photo Strip */}
      {lastSampleFinding && (
        <div className="rounded-lg border border-emerald-500/50 bg-emerald-950/20 px-4 py-3 text-xs sm:text-sm text-emerald-100">
          <strong className="font-mono text-emerald-400">Sample Collected:</strong> {lastSampleFinding}
        </div>
      )}

      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
            Rover Captured Navcam Strip (Simulated Environment Captures)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((p) => (
              <div key={p.id} className="rounded-lg border border-slate-800 bg-[#0B0F18] overflow-hidden">
                <img src={p.url} alt={p.caption} className="w-full aspect-video object-cover" />
                <p className="p-2 text-[11px] font-mono text-slate-300">{p.caption}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
