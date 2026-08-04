'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState({
    trackingX: '0.00',
    trackingY: '0.00',
    animationState: 'RIGGED ANIMATION ACTIVE',
    status: 'CURSOR TRACKING',
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4.5, 3.2, 5.5);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
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

    // Shadow Ground Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Load Rigged 3D GLB Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let ikBones: THREE.Object3D[] = [];
    let endEffectorBone: THREE.Object3D | null = null;

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

        // Traverse hierarchy to detect rigged bones, joints, and apply shadows
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
          }

          // Collect bone joints for cursor tracking
          if (child.type === 'Bone' || child.name.toLowerCase().includes('joint') || child.name.toLowerCase().includes('arm') || child.name.toLowerCase().includes('hand')) {
            ikBones.push(child);
            if (!endEffectorBone && (child.name.toLowerCase().includes('hand') || child.name.toLowerCase().includes('claw') || child.name.toLowerCase().includes('wrist') || child.name.toLowerCase().includes('effector'))) {
              endEffectorBone = child;
            }
          }
        });

        // Setup Animation Mixer if GLB model contains animation clips
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

    // 6. Cursor & Raycaster 3D Position Tracking
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(0, 0);
    const target3D = new THREE.Vector3(0, 1.2, 2.5);
    const currentLookTarget = new THREE.Vector3(0, 1.2, 2.5);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Normalized device coordinates (-1 to +1)
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Project mouse into 3D space at plane Z=2.0
      target3D.set(mouseVector.x * 3.5, mouseVector.y * 2.5 + 1.2, 2.5);

      setTelemetry(prev => ({
        ...prev,
        trackingX: (mouseVector.x * 100).toFixed(1),
        trackingY: (mouseVector.y * 100).toFixed(1),
      }));
    };

    // Touch support for mobile cursor tracking
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

      target3D.set(mouseVector.x * 3.5, mouseVector.y * 2.5 + 1.2, 2.5);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update rigged GLB animations if present
      if (mixer) {
        mixer.update(delta);
      }

      // Smoothly interpolate 3D tracking target towards cursor position
      currentLookTarget.lerp(target3D, 0.08);

      // Rotate entire model base towards cursor
      const targetRotationY = Math.atan2(currentLookTarget.x, currentLookTarget.z) * 0.75;
      modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 0.08;

      // Pitch camera & model height dynamically to see cursor
      const targetRotationX = (currentLookTarget.y - 1.2) * 0.25;
      camera.position.y += (targetRotationX + 3.2 - camera.position.y) * 0.08;
      camera.lookAt(0, 0.4, 0);

      // Articulate inner joints / bones to point at cursor
      if (ikBones.length > 0) {
        const primaryJoint = ikBones[0];
        primaryJoint.rotation.x = Math.sin(clock.getElapsedTime() * 1.5) * 0.1 + (currentLookTarget.y - 1.2) * 0.2;
      }

      if (endEffectorBone) {
        endEffectorBone.lookAt(currentLookTarget);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handling
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
            ACTIVATING RIGGED 3D CURSOR TRACKING...
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
          <span style={{ color: '#000000', fontWeight: 'bold', letterSpacing: '0.05em' }}>3D RIGGED MODEL // CURSOR TRACKING</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', opacity: 0.9 }}>
          <div>CURSOR X: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.trackingX}%</span></div>
          <div>CURSOR Y: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.trackingY}%</span></div>
          <div>ANIMATION: <span style={{ color: '#000000', fontWeight: 'bold' }}>ACTIVE</span></div>
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
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span>Move Cursor to Direct 3D Robot Arm</span>
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
