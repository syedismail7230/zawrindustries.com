'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState({
    armHeight: 'UP / DOWN ACTIVE',
    clawState: 'OPENING / CLOSING',
    precision: '±0.005 mm',
    status: 'REALTIME ARTICULATION',
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup (Clean Studio White Background)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4.8, 3.5, 5.8);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(8, 14, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    // Ground Shadow Receiver Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Load GLB Model & Separate Nodes into Arm & Claw Groups
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let mixer: THREE.AnimationMixer | null = null;

    // Node categories for procedural IK articulation
    let armJoints: THREE.Object3D[] = [];
    let clawPartsLeft: THREE.Object3D[] = [];
    let clawPartsRight: THREE.Object3D[] = [];
    let clawInitialPositionsLeft: THREE.Vector3[] = [];
    let clawInitialPositionsRight: THREE.Vector3[] = [];

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb',
      (gltf) => {
        const loadedModel = gltf.scene;

        // Auto-center & scale model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        loadedModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        loadedModel.scale.set(scale, scale, scale);

        // Classify mesh nodes by position for dynamic Up/Down Arm & Open/Close Claw animation
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness || 0.4, 0.45);
              mat.metalness = Math.max(mat.metalness || 0.6, 0.75);
            }

            // Get local position relative to model center
            const pos = mesh.position;

            // Classify top claw nodes vs arm joint nodes
            if (mesh.name.includes('claw') || mesh.name.includes('finger') || mesh.name.includes('id2') || (pos.x > 0.4 && pos.y > 0.2)) {
              if (pos.z >= 0) {
                clawPartsLeft.push(mesh);
                clawInitialPositionsLeft.push(mesh.position.clone());
              } else {
                clawPartsRight.push(mesh);
                clawInitialPositionsRight.push(mesh.position.clone());
              }
            } else if (mesh.parent && mesh.parent !== loadedModel) {
              armJoints.push(mesh.parent);
            }
          }
        });

        // Check if model has built-in GLB animation tracks
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.play();
          });
        }

        modelGroup.add(loadedModel);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[GLB Load Error]', err);
        setLoading(false);
      }
    );

    // 6. Cursor Mouse & Touch Tracking
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

    // 7. Render Loop with Arm Up/Down & Claw Open/Close Motion
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update GLB animations if present
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth mouse position interpolation
      mouse.lerp(targetMouse, 0.08);

      // A) Arm UP/DOWN Articulation driven by cursor Y position + Sine wave
      const targetArmHeight = mouse.y * 0.8 + Math.sin(elapsedTime * 1.5) * 0.2;
      const targetArmRotationY = mouse.x * 1.2 + elapsedTime * 0.2;

      modelGroup.rotation.y = targetArmRotationY;
      modelGroup.position.y = targetArmHeight * 0.4;
      modelGroup.rotation.x = -mouse.y * 0.35; // Tilt arm up when cursor moves up

      // Camera dynamic height adjustment
      camera.position.y = 3.5 + mouse.y * 0.6;
      camera.lookAt(0, 0.4 + mouse.y * 0.3, 0);

      // B) Open / Close Claw Gripper Animation Cycle
      const clawOpeningFactor = (Math.sin(elapsedTime * 2.2) + 1) / 2; // 0 (closed) to 1 (open)

      clawPartsLeft.forEach((mesh, i) => {
        if (clawInitialPositionsLeft[i]) {
          const initPos = clawInitialPositionsLeft[i];
          mesh.position.z = initPos.z + clawOpeningFactor * 0.12;
          mesh.rotation.y = clawOpeningFactor * 0.25;
        }
      });

      clawPartsRight.forEach((mesh, i) => {
        if (clawInitialPositionsRight[i]) {
          const initPos = clawInitialPositionsRight[i];
          mesh.position.z = initPos.z - clawOpeningFactor * 0.12;
          mesh.rotation.y = -clawOpeningFactor * 0.25;
        }
      });

      // Update Telemetry State
      if (Math.floor(elapsedTime * 10) % 5 === 0) {
        setTelemetry({
          armHeight: mouse.y > 0 ? 'PITCHING UP' : 'LOWERING DOWN',
          clawState: clawOpeningFactor > 0.5 ? 'GRIPPER OPEN' : 'GRIPPER CLOSED',
          precision: '±0.005 mm',
          status: 'UP/DOWN + CLAW SYNCED',
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Listener
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '520px',
        position: 'relative',
        cursor: 'crosshair',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          zIndex: 40,
          color: '#000000',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #000000',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }}></div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            ACTIVATING ARM UP/DOWN & CLAW MOTION...
          </span>
        </div>
      )}

      {/* Telemetry HUD Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: '1.2rem',
          left: '1.2rem',
          padding: '0.8rem 1.2rem',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          color: '#0f172a',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', boxShadow: '0 0 8px rgba(0,0,0,0.4)' }}></span>
          <span style={{ color: '#000000', fontWeight: 'bold', letterSpacing: '0.05em' }}>3D ROBOT ARTICULATION</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', opacity: 0.9 }}>
          <div>ARM PITCH: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.armHeight}</span></div>
          <div>CLAW STATE: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.clawState}</span></div>
          <div>PRECISION: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.precision}</span></div>
          <div>STATUS: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.status}</span></div>
        </div>
      </div>

      {/* Helper Pill Badge */}
      <div 
        style={{
          position: 'absolute',
          bottom: '1.2rem',
          right: '1.2rem',
          padding: '0.5rem 1rem',
          background: '#000000',
          borderRadius: '30px',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <span>Move Cursor Up/Down to Control Arm & Claw</span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
