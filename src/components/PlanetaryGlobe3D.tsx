import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EquipmentItem, PlanetaryBody } from '../types/equipment';
import { createTrekGlobeTexture, TrekLayerKey, TREK_LAYERS } from '../services/nasaApi';

interface PlanetaryGlobe3DProps {
  body: PlanetaryBody;
  layerKey: TrekLayerKey;
  items: EquipmentItem[];
  selectedItem: EquipmentItem | null;
  onSelectItem: (item: EquipmentItem) => void;
}

const GLOBE_RADIUS = 2.0;

/**
 * Converts planetary lat/lonSigned (-180..+180) to 3D Cartesian coordinates
 * matching Three.js SphereGeometry equirectangular UV orientation.
 */
function latLonToVector3(
  lat: number,
  lonSigned: number,
  radius: number,
  target: THREE.Vector3
): THREE.Vector3 {
  const phi = ((lonSigned + 180) / 360) * Math.PI * 2;
  const theta = THREE.MathUtils.degToRad(90 - lat);
  const x = -radius * Math.cos(phi) * Math.sin(theta);
  const y = radius * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return target.set(x, y, z);
}

function getMarkerColor(item: EquipmentItem): number {
  switch (item.status) {
    case 'active':
      return 0x10b981; // emerald
    case 'crashed':
      return 0xf43f5e; // rose
    case 'inactive':
      return 0xfbbf24; // amber
    case 'abandoned':
      return 0xf97316; // orange
    default:
      return item.body === 'moon' ? 0xe2e8f0 : 0xf97316;
  }
}

export function PlanetaryGlobe3D({
  body,
  layerKey,
  items,
  selectedItem,
  onSelectItem,
}: PlanetaryGlobe3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [tileStatus, setTileStatus] = useState<{
    loaded: number;
    total: number;
    offlineFallback: boolean;
  }>({ loaded: 0, total: 32, offlineFallback: false });
  const [hoveredItem, setHoveredItem] = useState<EquipmentItem | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);

  const [transitioningLabel, setTransitioningLabel] = useState<string | null>(null);

  const onSelectRef = useRef(onSelectItem);
  onSelectRef.current = onSelectItem;

  // Refs to interact with persistent Three.js scene without recreating WebGL context
  const sceneCtxRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    planetGroup: THREE.Group;
    globeMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
    transitionMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
    markerGroup: THREE.Group;
    clickables: THREE.Object3D[];
    currentTexture: THREE.Texture | null;
    outgoingTexture: THREE.Texture | null;
    flyTargetPos: THREE.Vector3 | null;
    flyTargetDist: number;
    crossfadeOpacity: number;
    globeScale: number;
    markerScale: number;
    prefersReducedMotion: boolean;
    requestRender: () => void;
    markerMeshes: Map<string, THREE.Mesh>;
  } | null>(null);

  // Initialize WebGLRenderer & Scene once
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
      setWebglError('WebGL is unavailable on this browser. Switch to the 2D NASA Trek Map above.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('WebGL context paused. Reload or use the 2D NASA Trek Map.');
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 5.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 2.75;
    controls.maxDistance = 8.5;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.8;

    // 3-point celestial lighting rig
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(6, 3.5, 5);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xcbd5e1, 0x0f172a, 0.55);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 0.6);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Subtle 3D starfield sphere via InstancedMesh or Points
    const starCount = 600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 24 + Math.random() * 14;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      starPos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      starPos[i * 3 + 1] = r * Math.cos(theta);
      starPos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.09,
      transparent: true,
      opacity: 0.7,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Planetary Group (allows unified scale & rotation settling during world switch)
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Primary Planetary Globe
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      roughness: 0.92,
      metalness: 0.04,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    planetGroup.add(globeMesh);

    // Crossfade Overlay Sphere (holds outgoing planet texture during Moon <-> Mars transition)
    const transGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.002, 72, 48);
    const transMat = new THREE.MeshStandardMaterial({
      roughness: 0.92,
      metalness: 0.04,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const transitionMesh = new THREE.Mesh(transGeo, transMat);
    transitionMesh.visible = false;
    planetGroup.add(transitionMesh);

    // Subtle latitude/longitude graticule wireframe slightly above surface
    const gratGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.005, 24, 12);
    const gratMat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    planetGroup.add(new THREE.Mesh(gratGeo, gratMat));

    const markerGroup = new THREE.Group();
    planetGroup.add(markerGroup);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // On-demand render scheduler with software-WebGL pacing & smooth camera/material damping
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    const _camGoal = new THREE.Vector3();

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
          frameId = window.setTimeout(cb, 80);
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
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        const ctx = sceneCtxRef.current;
        let needsFollowUp = false;

        // 1. Crossfade dissolve between outgoing and incoming planetary textures
        if (ctx && ctx.crossfadeOpacity > 0.005) {
          ctx.crossfadeOpacity = ctx.prefersReducedMotion
            ? 0
            : THREE.MathUtils.damp(ctx.crossfadeOpacity, 0, 7.5, delta);
          ctx.transitionMesh.material.opacity = ctx.crossfadeOpacity;
          if (ctx.crossfadeOpacity <= 0.01) {
            ctx.crossfadeOpacity = 0;
            ctx.transitionMesh.visible = false;
            ctx.transitionMesh.material.map = null;
            if (ctx.outgoingTexture) {
              ctx.outgoingTexture.dispose();
              ctx.outgoingTexture = null;
            }
            setTransitioningLabel(null);
          } else {
            needsFollowUp = true;
          }
        }

        // 2. Smooth globe scale settle on planetary switch
        if (ctx && Math.abs(1 - ctx.globeScale) > 0.001) {
          ctx.globeScale = ctx.prefersReducedMotion
            ? 1
            : THREE.MathUtils.damp(ctx.globeScale, 1, 8.5, delta);
          if (Math.abs(1 - ctx.globeScale) <= 0.002) {
            ctx.globeScale = 1;
          } else {
            needsFollowUp = true;
          }
          ctx.planetGroup.scale.setScalar(ctx.globeScale);
        }

        // 3. Smooth beacon emergence
        if (ctx && Math.abs(1 - ctx.markerScale) > 0.002) {
          ctx.markerScale = ctx.prefersReducedMotion
            ? 1
            : THREE.MathUtils.damp(ctx.markerScale, 1, 9.0, delta);
          if (Math.abs(1 - ctx.markerScale) <= 0.003) {
            ctx.markerScale = 1;
          } else {
            needsFollowUp = true;
          }
          ctx.markerGroup.children.forEach((pin) => {
            pin.scale.setScalar(ctx.markerScale);
          });
        }

        // 4. Smooth exponential-damped orbital camera fly-to
        if (ctx?.flyTargetPos) {
          _camGoal
            .copy(ctx.flyTargetPos)
            .normalize()
            .multiplyScalar(ctx.flyTargetDist);
          if (ctx.prefersReducedMotion) {
            camera.position.copy(_camGoal);
            camera.lookAt(0, 0, 0);
            ctx.flyTargetPos = null;
          } else {
            const step = 1 - Math.exp(-5.5 * delta);
            camera.position.lerp(_camGoal, step);
            camera.lookAt(0, 0, 0);
            if (camera.position.distanceTo(_camGoal) < 0.025) {
              camera.position.copy(_camGoal);
              ctx.flyTargetPos = null;
            } else {
              needsFollowUp = true;
            }
          }
        }

        const controlsChanged = controls.update();
        if (controlsChanged && controls.enableDamping) {
          needsFollowUp = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsFollowUp) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    controls.addEventListener('start', () => {
      if (sceneCtxRef.current) sceneCtxRef.current.flyTargetPos = null;
    });
    controls.addEventListener('change', requestRender);

    // Raycasting for marker hover & click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const updatePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (moved > 6) return; // drag orbit, not click
      const ctx = sceneCtxRef.current;
      if (!ctx) return;

      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(ctx.clickables, false);
      if (hits.length > 0) {
        const item = hits[0].object.userData.equipment as EquipmentItem | undefined;
        if (item) onSelectRef.current(item);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;
      const ctx = sceneCtxRef.current;
      if (!ctx) return;

      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(ctx.clickables, false);
      if (hits.length > 0) {
        const item = hits[0].object.userData.equipment as EquipmentItem | undefined;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredItem(item || null);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredItem(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    sceneCtxRef.current = {
      scene,
      camera,
      controls,
      planetGroup,
      globeMesh,
      transitionMesh,
      markerGroup,
      clickables: [],
      currentTexture: null,
      outgoingTexture: null,
      flyTargetPos: null,
      flyTargetDist: 4.6,
      crossfadeOpacity: 0,
      globeScale: 1,
      markerScale: 1,
      prefersReducedMotion,
      requestRender,
      markerMeshes: new Map(),
    };

    requestRender();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      controls.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      transGeo.dispose();
      transMat.dispose();
      gratGeo.dispose();
      gratMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (sceneCtxRef.current?.currentTexture) {
        sceneCtxRef.current.currentTexture.dispose();
      }
      if (sceneCtxRef.current?.outgoingTexture) {
        sceneCtxRef.current.outgoingTexture.dispose();
      }
      renderer.dispose();
      sceneCtxRef.current = null;
    };
  }, []);

  // Swap NASA Trek WMTS texture with smooth crossfade & globe settle when planetary body or layer changes
  useEffect(() => {
    const ctx = sceneCtxRef.current;
    if (!ctx) return;

    let active = true;
    setTileStatus({ loaded: 0, total: 32, offlineFallback: false });

    const newTex = createTrekGlobeTexture(layerKey, (loaded, total, failed) => {
      if (!active) return;
      setTileStatus({ loaded, total, offlineFallback: failed });
      ctx.requestRender();
    });

    if (ctx.currentTexture && !ctx.prefersReducedMotion) {
      // Hand off outgoing texture to the crossfade sphere
      if (ctx.outgoingTexture) {
        ctx.outgoingTexture.dispose();
      }
      ctx.outgoingTexture = ctx.currentTexture;
      ctx.transitionMesh.material.map = ctx.outgoingTexture;
      ctx.transitionMesh.material.opacity = 1;
      ctx.transitionMesh.material.needsUpdate = true;
      ctx.transitionMesh.visible = true;
      ctx.crossfadeOpacity = 1;
      ctx.globeScale = 0.94;
      setTransitioningLabel(body === 'moon' ? 'Transitioning to The Moon' : 'Transitioning to Mars');
    } else if (ctx.currentTexture) {
      ctx.currentTexture.dispose();
    }

    ctx.currentTexture = newTex;
    ctx.globeMesh.material.map = newTex;
    ctx.globeMesh.material.needsUpdate = true;

    // Orient camera smoothly toward selected site or iconic nearside
    const targetLat =
      selectedItem?.body === body && selectedItem.coordinates.lat !== null
        ? selectedItem.coordinates.lat
        : 10;
    const targetLon =
      selectedItem?.body === body && selectedItem.coordinates.lonSigned !== null
        ? selectedItem.coordinates.lonSigned
        : body === 'moon'
          ? 12
          : 60;

    const focusVec = new THREE.Vector3();
    latLonToVector3(targetLat, targetLon, 4.6, focusVec);
    ctx.flyTargetPos = focusVec;
    ctx.flyTargetDist = 4.6;
    ctx.requestRender();

    return () => {
      active = false;
    };
  }, [body, layerKey]);

  // Rebuild 3D marker pins whenever filtered items or selectedItem change
  useEffect(() => {
    const ctx = sceneCtxRef.current;
    if (!ctx) return;

    // Dispose previous marker geometries/materials
    while (ctx.markerGroup.children.length > 0) {
      const child = ctx.markerGroup.children[0];
      child.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      ctx.markerGroup.remove(child);
    }
    ctx.clickables = [];
    ctx.markerMeshes.clear();

    const up = new THREE.Vector3(0, 1, 0);
    const pos = new THREE.Vector3();
    const normal = new THREE.Vector3();

    const baseGeo = new THREE.RingGeometry(0.025, 0.042, 20);
    const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8);
    const headGeo = new THREE.SphereGeometry(0.036, 16, 12);
    const hitGeo = new THREE.SphereGeometry(0.11, 10, 8);

    items.forEach((item) => {
      if (item.coordinates.lat === null || item.coordinates.lonSigned === null) return;

      const isSelected = selectedItem?.id === item.id;
      const colorHex = getMarkerColor(item);

      const pinGroup = new THREE.Group();
      latLonToVector3(
        item.coordinates.lat,
        item.coordinates.lonSigned,
        GLOBE_RADIUS + 0.006,
        pos
      );
      pinGroup.position.copy(pos);
      normal.copy(pos).normalize();
      pinGroup.quaternion.setFromUnitVectors(up, normal);

      // Part 1: Grounded surface ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.7,
      });
      const ring = new THREE.Mesh(baseGeo.clone(), ringMat);
      ring.rotation.x = -Math.PI / 2;
      pinGroup.add(ring);

      // Part 2: Mast stem
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.4,
        metalness: 0.7,
      });
      const stem = new THREE.Mesh(stemGeo.clone(), stemMat);
      stem.position.y = 0.07;
      pinGroup.add(stem);

      // Part 3: Beacon head
      const headMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: isSelected ? 1.1 : 0.45,
        roughness: 0.25,
        metalness: 0.3,
      });
      const head = new THREE.Mesh(headGeo.clone(), headMat);
      head.position.y = 0.15;
      if (isSelected) head.scale.setScalar(1.38);
      pinGroup.add(head);

      // Invisible proxy collider for effortless click/hover
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo.clone(), hitMat);
      hitMesh.position.y = 0.11;
      hitMesh.userData.equipment = item;
      pinGroup.add(hitMesh);

      ctx.clickables.push(hitMesh);
      ctx.markerMeshes.set(item.id, head);
      ctx.markerGroup.add(pinGroup);
    });

    baseGeo.dispose();
    stemGeo.dispose();
    headGeo.dispose();
    hitGeo.dispose();

    ctx.markerScale = ctx.prefersReducedMotion ? 1 : 0.08;
    ctx.markerGroup.children.forEach((pin) => {
      pin.scale.setScalar(ctx.markerScale);
    });

    ctx.requestRender();
  }, [items, selectedItem]);

  // Fly camera smoothly to selected item when selected
  useEffect(() => {
    const ctx = sceneCtxRef.current;
    if (!ctx || !selectedItem) return;
    if (selectedItem.body !== body) return;
    if (
      selectedItem.coordinates.lat === null ||
      selectedItem.coordinates.lonSigned === null
    )
      return;

    const targetPos = new THREE.Vector3();
    latLonToVector3(
      selectedItem.coordinates.lat,
      selectedItem.coordinates.lonSigned,
      4.0,
      targetPos
    );
    ctx.flyTargetPos = targetPos;
    ctx.flyTargetDist = Math.min(ctx.camera.position.length(), 4.1);
    ctx.requestRender();
  }, [selectedItem, body]);

  return (
    <div className="relative h-full w-full min-h-[460px] lg:min-h-[600px] bg-[#05070C] rounded-lg overflow-hidden border border-slate-800">
      {webglError ? (
        <div className="flex h-full min-h-[460px] items-center justify-center p-6 text-center text-sm text-slate-300">
          {webglError}
        </div>
      ) : (
        <div ref={mountRef} className="h-full w-full min-h-[460px] lg:min-h-[600px]" />
      )}

      {/* Top-Left Compact Data Source Readout */}
      <div className="pointer-events-none absolute top-3 left-3 rounded-md border border-slate-800/90 bg-[#07090E]/88 px-3 py-2 text-xs">
        <div className="font-medium text-slate-200">
          {transitioningLabel || TREK_LAYERS[layerKey].label}
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-slate-400 tabular-nums">
          {tileStatus.offlineFallback
            ? 'Procedural Surface Fallback (Offline)'
            : tileStatus.loaded < tileStatus.total
              ? `Streaming NASA Trek WMTS: ${tileStatus.loaded}/${tileStatus.total} tiles`
              : `NASA Trek WMTS Active (${tileStatus.total}/${tileStatus.total} tiles)`}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div className="pointer-events-none absolute bottom-14 left-3 rounded-md border border-slate-700 bg-[#0B0F18]/95 px-3 py-2 text-xs shadow-lg max-w-xs">
          <div className="font-semibold text-slate-100">{hoveredItem.name}</div>
          <div className="mt-0.5 font-mono text-[11px] text-slate-400">
            {hoveredItem.mission} · {hoveredItem.coordinates.region}
          </div>
        </div>
      )}

      {/* Bottom-Left Controls Hint */}
      <div className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-slate-400 bg-[#07090E]/80 px-2.5 py-1 rounded border border-slate-800/80">
        Drag to rotate · Scroll to zoom · Click any beacon to inspect hardware
      </div>
    </div>
  );
}
