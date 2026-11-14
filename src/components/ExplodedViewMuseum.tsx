import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

type CraftTemplate = 'rover' | 'lander' | 'voyager';

interface ExplodedPartSpec {
  id: string;
  name: string;
  role: string;
  material: string;
  offset: [number, number, number];
}

const PART_SPECS: Record<CraftTemplate, ExplodedPartSpec[]> = {
  rover: [
    { id: 'chassis', name: 'Warm Electronics Box', role: 'Aerogel-insulated titanium heart housing computers & batteries.', material: 'Gold-Anodized Aluminum & Aerogel', offset: [0, 0, 0] },
    { id: 'deck', name: 'Solar Wing Assembly', role: 'Generates ~140–900 W on Mars; hinged to fold inside aeroshell.', material: 'Triple-Junction GaAs Cells', offset: [0, 1.35, 0] },
    { id: 'mast', name: 'Pancam Stereo Mast', role: 'Rises 1.5 m high to survey terrain and capture panoramas.', material: 'Titanium Mast & Optical Glass', offset: [0.6, 2.0, -0.7] },
    { id: 'dish', name: 'High-Gain Parabolic Dish', role: 'Steerable X-band dish beaming science straight to Earth.', material: 'Composite Honeycomb Dish', offset: [-0.8, 1.8, 0.7] },
    { id: 'wheels', name: 'Rocker-Bogie Mobility Suspension', role: '6 independently driven wheels climb rocks 1.5× wheel diameter.', material: '7075 Aluminum Alloy', offset: [0, -1.2, 0] },
  ],
  lander: [
    { id: 'chassis', name: 'Apollo LM Descent Octagon Stage', role: 'Housed descent propellant tanks, lunar rover bay & plaque.', material: 'Gold Kapton MLI Blanket over Aluminum', offset: [0, 0, 0] },
    { id: 'deck', name: 'Descent Engine & Bell Nozzle', role: 'Throttleable hypergolic engine guiding safe lunar touchdown.', material: 'Columbium Alloy Nozzle', offset: [0, -1.4, 0] },
    { id: 'mast', name: '4 Shock-Absorbing Landing Legs', role: 'Honeycomb crushable struts built to absorb lunar impact.', material: 'Crushable Aluminum Honeycomb', offset: [0, -0.9, 1.2] },
    { id: 'dish', name: 'LRV-1 Folded Quadrant & Plaque', role: 'Carried folded 210-kg lunar jeep and Earth goodwill disc.', material: 'Stainless Steel & Kapton', offset: [1.3, 0.6, 0] },
    { id: 'wheels', name: 'Ascent Stage Docking Collar', role: 'Upper crew cabin blasted off from this lower ring back to orbit.', material: 'Machined Titanium Ring', offset: [0, 1.45, 0] },
  ],
  voyager: [
    { id: 'chassis', name: '10-Sided Avionics Bus', role: 'Protected flight data computers across Jupiter radiation belts.', material: 'Irradiation-Shielded Aluminum', offset: [0, 0, 0] },
    { id: 'deck', name: '3.7 m High-Gain Dish', role: 'Focuses a 22 W radio beam across 25+ billion km to Earth.', material: 'Aluminum Honeycomb', offset: [0, 1.55, 0] },
    { id: 'mast', name: 'MHW Plutonium-238 RTG Boom', role: 'Three nuclear power canisters generating steady heat & electricity.', material: 'Plutonium-238 Dioxide / SiGe', offset: [-1.8, -0.4, 0] },
    { id: 'dish', name: 'Science Scan Platform Boom', role: 'Carries wide/narrow cameras & UV/IR spectrometers.', material: 'Fiberglass Truss & Optics', offset: [1.8, 0.3, 0.4] },
    { id: 'wheels', name: 'Golden Record Cover Disc', role: 'Gold-plated copper time capsule sealed in Uranium-238 jacket.', material: 'Gold-Plated Copper', offset: [0, -1.35, 0.8] },
  ],
};

export function ExplodedViewMuseum() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [template, setTemplate] = useState<CraftTemplate>('rover');
  const [explodePct, setExplodePct] = useState(45);
  const [selectedPartId, setSelectedPartId] = useState<string>('chassis');
  const [dockOpen, setDockOpen] = useState(true);

  const explodeTargetRef = useRef(0.45);
  const templateRef = useRef<CraftTemplate>('rover');
  const rebuildFnRef = useRef<((tpl: CraftTemplate) => void) | null>(null);

  useEffect(() => {
    explodeTargetRef.current = explodePct / 100;
  }, [explodePct]);

  useEffect(() => {
    templateRef.current = template;
    rebuildFnRef.current?.(template);
    setSelectedPartId(PART_SPECS[template][0].id);
  }, [template]);

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

    const w = container.clientWidth || 720;
    const h = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060911);

    const camera = new THREE.PerspectiveCamera(44, w / h, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvas);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.85);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1d6, 1.8);
    key.position.set(5, 8, 5);
    scene.add(key);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.8;

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const partsMap: {
      id: string;
      obj: THREE.Object3D;
      basePos: THREE.Vector3;
      offset: THREE.Vector3;
    }[] = [];

    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0a12b,
      metalness: 0.92,
      roughness: 0.2,
      anisotropy: 0.7,
    });
    const alloyMat = new THREE.MeshStandardMaterial({
      color: 0xdbe3ee,
      metalness: 0.85,
      roughness: 0.28,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x172554,
      metalness: 0.55,
      roughness: 0.35,
    });
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.75,
    });

    const buildTemplate = (tpl: CraftTemplate) => {
      while (rootGroup.children.length > 0) {
        rootGroup.remove(rootGroup.children[0]);
      }
      partsMap.length = 0;

      const specs = PART_SPECS[tpl];

      if (tpl === 'rover') {
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 1.4), goldMat);
        const deck = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.3), darkMat);
        deck.position.set(0, 0.35, 0);
        const mast = new THREE.Group();
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 10), alloyMat);
        post.position.set(0.2, 0.75, -0.4);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.16, 0.2), alloyMat);
        head.position.set(0.2, 1.15, -0.4);
        mast.add(post, head);
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.06, 0.12, 18), alloyMat);
        dish.position.set(-0.35, 0.6, 0.35);
        dish.rotation.x = 0.5;
        const wheelsGroup = new THREE.Group();
        const wg = new THREE.CylinderGeometry(0.22, 0.22, 0.16, 16);
        wg.rotateZ(Math.PI / 2);
        [
          [-0.75, -0.5],
          [-0.75, 0.5],
          [0.75, -0.5],
          [0.75, 0.5],
        ].forEach(([x, z]) => {
          const wMesh = new THREE.Mesh(wg, wheelMat);
          wMesh.position.set(x, -0.35, z);
          wheelsGroup.add(wMesh);
        });

        const objs = [chassis, deck, mast, dish, wheelsGroup];
        objs.forEach((obj, i) => {
          rootGroup.add(obj);
          partsMap.push({
            id: specs[i].id,
            obj,
            basePos: obj.position.clone(),
            offset: new THREE.Vector3(...specs[i].offset),
          });
        });
      } else if (tpl === 'lander') {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.85, 8), goldMat);
        const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.48, 0.65, 16), wheelMat);
        nozzle.position.set(0, -0.68, 0);
        const legs = new THREE.Group();
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2 + Math.PI / 4;
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.25, 8), goldMat);
          leg.position.set(Math.cos(a) * 1.15, -0.45, Math.sin(a) * 1.15);
          leg.rotation.z = Math.cos(a) * -0.45;
          leg.rotation.x = Math.sin(a) * 0.45;
          legs.add(leg);
        }
        const bay = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.35), alloyMat);
        bay.position.set(0.95, 0.1, 0);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.08, 10, 24), alloyMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 0.55, 0);

        const objs = [body, nozzle, legs, bay, ring];
        objs.forEach((obj, i) => {
          rootGroup.add(obj);
          partsMap.push({
            id: specs[i].id,
            obj,
            basePos: obj.position.clone(),
            offset: new THREE.Vector3(...specs[i].offset),
          });
        });
      } else {
        const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.45, 10), darkMat);
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 0.15, 0.25, 24), alloyMat);
        dish.position.set(0, 0.48, 0);
        const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.4, 12), wheelMat);
        rtg.rotation.z = Math.PI / 2;
        rtg.position.set(-1.35, -0.1, 0);
        const scan = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.22), alloyMat);
        scan.position.set(1.25, 0.1, 0.2);
        const goldenDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 20), goldMat);
        goldenDisc.rotation.x = Math.PI / 2;
        goldenDisc.position.set(0, -0.1, 0.78);

        const objs = [bus, dish, rtg, scan, goldenDisc];
        objs.forEach((obj, i) => {
          rootGroup.add(obj);
          partsMap.push({
            id: specs[i].id,
            obj,
            basePos: obj.position.clone(),
            offset: new THREE.Vector3(...specs[i].offset),
          });
        });
      }
    };

    rebuildFnRef.current = buildTemplate;
    buildTemplate(templateRef.current);

    let currentExplode = explodeTargetRef.current;
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const handleResize = () => {
      if (!container) return;
      const cw = container.clientWidth || 720;
      const ch = container.clientHeight || 420;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener('resize', handleResize);

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
      currentExplode = THREE.MathUtils.damp(currentExplode, explodeTargetRef.current, 6.5, dt);

      partsMap.forEach((p) => {
        p.obj.position.set(
          p.basePos.x + p.offset.x * currentExplode,
          p.basePos.y + p.offset.y * currentExplode,
          p.basePos.z + p.offset.z * currentExplode
        );
      });

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      goldMat.dispose();
      alloyMat.dispose();
      darkMat.dispose();
      wheelMat.dispose();
      renderer.dispose();
    };
  }, []);

  const currentSpecs = PART_SPECS[template];
  const activeSpec =
    currentSpecs.find((s) => s.id === selectedPartId) || currentSpecs[0];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <Layers className="w-4 h-4" />
            <span>Exploded View Museum · Interactive 3D Engineering Disassembly</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Separate &amp; Inspect Spacecraft Subsystems in 3D
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Choose a spacecraft architecture, drag to orbit 360°, and pull the Exploded Separation slider to examine internal thermal shields, RTGs, and optical hardware.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'rover', label: 'Mars Rover (MER-Class)' },
              { id: 'lander', label: 'Apollo Descent Stage' },
              { id: 'voyager', label: 'Voyager Interstellar Probe' },
            ] as { id: CraftTemplate; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold cursor-pointer ${
                template === t.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas with Unified Bottom Control Dock */}
      <div className="relative rounded-xl border border-slate-800 bg-[#060911] overflow-hidden h-[460px]">
        <div ref={mountRef} className="w-full h-full" />

        <div className="pointer-events-none absolute top-3 left-3 rounded-md border border-slate-800 bg-[#07090E]/90 px-3 py-1.5 text-xs">
          <span className="font-mono text-amber-400">{activeSpec.name}</span>
          <span className="text-slate-300 ml-2">— {activeSpec.role}</span>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(860px,94%)] flex flex-col items-center">
          <button
            type="button"
            onClick={() => setDockOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-t-md border border-b-0 border-slate-700 bg-[#0A0E18] px-3 py-1 text-[11px] font-mono text-slate-300 hover:text-white cursor-pointer"
          >
            {dockOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            <span>{dockOpen ? 'Hide Controls' : 'Show Exploded Controls'}</span>
          </button>

          {dockOpen && (
            <div className="w-full rounded-lg border border-slate-700/90 bg-[#0A0E18]/95 px-4 py-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label
                  htmlFor="explode-slider"
                  className="font-mono text-xs text-sky-400 whitespace-nowrap"
                >
                  Exploded Separation: <strong className="text-white tabular-nums">{explodePct}%</strong>
                </label>
                <input
                  id="explode-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  className="flex-1 accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {currentSpecs.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSelectedPartId(sp.id)}
                    className={`rounded px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-colors ${
                      selectedPartId === sp.id
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'border border-slate-700 bg-[#07090E] text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    {sp.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Material & Function Inspection Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs rounded-lg border border-slate-800 bg-[#0B0F18] p-4">
        <div>
          <span className="font-mono text-amber-400 block">Selected Subsystem</span>
          <span className="text-sm font-bold text-white mt-0.5 block">{activeSpec.name}</span>
          <p className="text-slate-300 mt-1 leading-relaxed">{activeSpec.role}</p>
        </div>
        <div>
          <span className="font-mono text-sky-400 block">Aerospace Material Specification</span>
          <span className="text-sm font-semibold text-slate-100 mt-0.5 block">
            {activeSpec.material}
          </span>
        </div>
      </div>
    </section>
  );
}
