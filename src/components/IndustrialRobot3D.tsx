'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [telemetry, setTelemetry] = useState({
    joint1: '0.0°',
    joint2: '42.0°',
    precision: '±0.005 mm',
    status: '3D GLB LOADED',
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup (Clean White Background)
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
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup (Studio White Ambient & Key Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(8, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // Shadow Receiver Ground Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(25, 25);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Load GLB Model (/assets/robotic+arm+3d+model.glb)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb',
      (gltf) => {
        const loadedModel = gltf.scene;

        // Calculate bounding box to center & auto-scale GLB model perfectly
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        loadedModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        loadedModel.scale.set(scale, scale, scale);

        // Apply shadow casting & metalness materials
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Ensure high quality material properties
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness || 0.4, 0.5);
              mat.metalness = Math.max(mat.metalness || 0.6, 0.7);
            }
          }
        });

        modelGroup.add(loadedModel);
        setLoading(false);
      },
      (progress) => {
        // loading progress
      },
      (error) => {
        console.error('[GLB Loader Error]', error);
        setLoading(false);
      }
    );

    // 6. Interactive Drag & Touch Orbit Controls
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.15;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.3, Math.min(0.6, targetRotationX));

      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.3, Math.min(0.6, targetRotationX));

      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Orbit Rotation
      modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 0.05;
      camera.position.y += (targetRotationX * 3 + 3.2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0.4, 0);

      // Gentle continuous idle oscillation
      if (!isDragging) {
        targetRotationY += 0.002;
      }

      // Update Telemetry State
      if (Math.floor(elapsedTime * 10) % 6 === 0) {
        setTelemetry({
          joint1: `${((modelGroup.rotation.y % (Math.PI * 2)) * (180 / Math.PI)).toFixed(1)}°`,
          joint2: '42.0°',
          precision: '±0.005 mm',
          status: 'GLB ACTIVE',
        });
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
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
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
        minHeight: '480px',
        position: 'relative',
        cursor: 'grab',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Loading Indicator */}
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
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #000000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem',
          }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            LOADING 3D GLB ROBOT MODEL...
          </span>
        </div>
      )}

      {/* Sleek Telemetry HUD Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: '1.2rem',
          left: '1.2rem',
          padding: '0.8rem 1.2rem',
          background: 'rgba(255, 255, 255, 0.92)',
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000000', boxShadow: '0 0 8px rgba(0,0,0,0.5)' }}></span>
          <span style={{ color: '#000000', fontWeight: 'bold', letterSpacing: '0.05em' }}>3D GLB MODEL // TELEMETRY</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', opacity: 0.9 }}>
          <div>ORBIT ANGLE: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.joint1}</span></div>
          <div>PRECISION: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.precision}</span></div>
          <div>STATUS: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.status}</span></div>
        </div>
      </div>

      {/* Orbit Helper Pill Badge */}
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
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>Drag / Touch to Orbit 3D GLB Robot</span>
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
