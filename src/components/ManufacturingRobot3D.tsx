'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function ManufacturingRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0.35, 4.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
    fillLight.position.set(-6, 6, 6);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    // Root pivot — Y-rotation driven by mouse X (whole arm pans left/right)
    const rootPivot = new THREE.Group();
    rootPivot.position.set(0, -1.45, 0);
    scene.add(rootPivot);

    // Joint pivot chain — each pivot is a child of the previous,
    // so rotating joint1 moves all downstream joints with it.
    // pivot positions are set AFTER model load using bounding box analysis.
    const j1Pivot = new THREE.Group(); // shoulder — rotates around Z
    const j2Pivot = new THREE.Group(); // elbow    — rotates around Z
    const j3Pivot = new THREE.Group(); // wrist    — rotates around Z + small Y

    // Chain: rootPivot → j1Pivot → j2Pivot → j3Pivot
    rootPivot.add(j1Pivot);
    j1Pivot.add(j2Pivot);
    j2Pivot.add(j3Pivot);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb?v=23',
      (gltf) => {
        const raw = gltf.scene;
        raw.updateMatrixWorld(true);

        // ── Step 1: Scale + anchor bottom to y=0 ──────────────────────────
        const totalBox = new THREE.Box3().setFromObject(raw);
        const size = totalBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / maxDim;
        raw.scale.setScalar(scale);
        raw.updateMatrixWorld(true);

        const box2 = new THREE.Box3().setFromObject(raw);
        const cx = (box2.min.x + box2.max.x) / 2;
        const cz = (box2.min.z + box2.max.z) / 2;
        raw.position.set(-cx, -box2.min.y, -cz);
        raw.updateMatrixWorld(true);

        // ── Step 2: Fix materials ─────────────────────────────────────────
        raw.traverse((child) => {
          if (!(child as THREE.Mesh).isMesh) return;
          const mats = Array.isArray((child as THREE.Mesh).material)
            ? (child as THREE.Mesh).material as THREE.Material[]
            : [(child as THREE.Mesh).material as THREE.Material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              if (mat.color.r < 0.05 && mat.color.g < 0.05 && mat.color.b < 0.05) {
                mat.color.setHex(0x2d323c);
              }
              mat.roughness = 0.3;
              mat.metalness = 0.8;
              mat.envMapIntensity = 1.8;
            }
          });
        });

        // ── Step 3: Collect all meshes with world positions ───────────────
        const meshes: THREE.Mesh[] = [];
        raw.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
        });

        // Compute scaled bounding box of whole arm
        const scaledBox = new THREE.Box3().setFromObject(raw);
        const totalH = scaledBox.max.y - scaledBox.min.y;
        const yBase = scaledBox.min.y;

        // Joint Y thresholds (tune these to match the arm's visual joints)
        // From the screenshot: base+turret = bottom 25%, lower arm 25-50%,
        // elbow+upper arm 50-80%, wrist+claw 80-100%
        const t1 = yBase + totalH * 0.22;  // shoulder joint cut
        const t2 = yBase + totalH * 0.55;  // elbow joint cut
        const t3 = yBase + totalH * 0.80;  // wrist joint cut

        // Partition meshes by world centroid Y
        const BASE: THREE.Mesh[] = [];
        const LOWER: THREE.Mesh[] = [];
        const UPPER: THREE.Mesh[] = [];
        const CLAW: THREE.Mesh[] = [];

        meshes.forEach((mesh) => {
          const mb = new THREE.Box3().setFromObject(mesh);
          const cy = (mb.min.y + mb.max.y) / 2;
          if (cy < t1)       BASE.push(mesh);
          else if (cy < t2)  LOWER.push(mesh);
          else if (cy < t3)  UPPER.push(mesh);
          else               CLAW.push(mesh);
        });

        // ── Step 4: Place pivot groups at joint Y positions ───────────────
        // Each pivot sits at the joint's Y level (and average X/Z of surrounding meshes)
        // so that rotation around that point bends the arm naturally.
        const getAvgWorldPos = (group: THREE.Mesh[]) => {
          if (group.length === 0) return new THREE.Vector3();
          const avg = new THREE.Vector3();
          group.forEach((m) => {
            const b = new THREE.Box3().setFromObject(m);
            avg.add(b.getCenter(new THREE.Vector3()));
          });
          avg.divideScalar(group.length);
          return avg;
        };

        const baseCtr = getAvgWorldPos(BASE);
        const lowerCtr = getAvgWorldPos(LOWER);
        const upperCtr = getAvgWorldPos(UPPER);
        const clawCtr = getAvgWorldPos(CLAW);

        // j1Pivot (shoulder) sits at the top of BASE / bottom of LOWER
        j1Pivot.position.set(
          (baseCtr.x + lowerCtr.x) / 2,
          t1,
          (baseCtr.z + lowerCtr.z) / 2
        );

        // j2Pivot (elbow) sits at top of LOWER / bottom of UPPER
        j2Pivot.position.set(
          (lowerCtr.x + upperCtr.x) / 2,
          t2 - j1Pivot.position.y,  // relative to j1Pivot
          (lowerCtr.z + upperCtr.z) / 2
        );

        // j3Pivot (wrist) sits at top of UPPER / bottom of CLAW
        j3Pivot.position.set(
          (upperCtr.x + clawCtr.x) / 2,
          t3 - (j1Pivot.position.y + j2Pivot.position.y),
          (upperCtr.z + clawCtr.z) / 2
        );

        // ── Step 5: Re-parent each mesh into the correct pivot ────────────
        // THREE.Group.attach() converts world transform to local automatically.

        // Add the raw model to rootPivot first so world matrices are correct
        rootPivot.add(raw);
        raw.updateMatrixWorld(true);

        // Now re-parent: move meshes from raw scene into their joint pivots.
        // attach() keeps world-space position, so the visual stays the same.
        BASE.forEach((m)  => rootPivot.attach(m));
        LOWER.forEach((m) => j1Pivot.attach(m));
        UPPER.forEach((m) => j2Pivot.attach(m));
        CLAW.forEach((m)  => j3Pivot.attach(m));

        // Remove the now-empty raw model container
        rootPivot.remove(raw);

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[GLB Load Error]', err);
        setLoading(false);
      }
    );

    // Mouse tracking
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop
    let animId: number;
    let t = 0;

    // Rest poses — gentle "ready position" angles for the arm
    const REST = {
      j1: { z: 0.15 },   // shoulder slightly raised
      j2: { z: -0.25 },  // elbow bent inward
      j3: { z: 0.10, y: 0 },  // wrist neutral
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.007;

      mouse.lerp(targetMouse, 0.05);

      // Root: horizontal Y-pan from mouse X (whole arm turns)
      rootPivot.position.set(0, -1.45, 0);
      rootPivot.rotation.y = mouse.x * 0.45;
      rootPivot.rotation.x = 0;
      rootPivot.rotation.z = 0;

      // Mouse Y → gentle overall arm pitch (mapped to shoulder)
      const mousePitch = mouse.y * 0.15;

      // Joint 1 — shoulder: slow lazy swing + mouse Y
      j1Pivot.rotation.z = REST.j1.z + Math.sin(t * 0.5) * 0.06 + mousePitch;
      j1Pivot.rotation.x = 0;
      j1Pivot.rotation.y = 0;

      // Joint 2 — elbow: opposite phase, deeper bend + follows mouse
      j2Pivot.rotation.z = REST.j2.z + Math.sin(t * 0.5 + Math.PI * 0.5) * 0.08 - mousePitch * 0.6;
      j2Pivot.rotation.x = 0;
      j2Pivot.rotation.y = 0;

      // Joint 3 — wrist: faster micro-flutter + slight Y twist
      j3Pivot.rotation.z = REST.j3.z + Math.sin(t * 1.1 + Math.PI * 0.8) * 0.05;
      j3Pivot.rotation.y = Math.sin(t * 0.9) * 0.04;
      j3Pivot.rotation.x = 0;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      pmremGenerator.dispose();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', cursor: 'default', background: 'transparent' }}
    >
      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'transparent', zIndex: 40, color: '#000000',
        }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #e2e8f0',
            borderTop: '3px solid #000000', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', marginBottom: '0.8rem',
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            LOADING 3D ROBOT...
          </span>
        </div>
      )}
    </div>
  );
}
