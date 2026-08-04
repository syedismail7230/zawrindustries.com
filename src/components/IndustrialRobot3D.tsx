'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [telemetry, setTelemetry] = useState({
    rotation: '0.0°',
    camDistance: '5.2m',
    mode: 'SCROLL DRIVEN 3D TELEMETRY',
    status: 'SYNCHRONIZED',
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup (Pure Studio White Background)
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

    // 4. Studio Lighting (Crisp High-Contrast Monochrome Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(8, 14, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // Soft Shadow Ground Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(30, 30);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 5. Load User's GLB 3D Model (/assets/robotic+arm+3d+model.glb)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let robotMesh: THREE.Object3D | null = null;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb',
      (gltf) => {
        robotMesh = gltf.scene;

        // Auto-center & auto-scale GLB model perfectly inside bounding box
        const box = new THREE.Box3().setFromObject(robotMesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        robotMesh.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.6 / maxDim;
        robotMesh.scale.set(scale, scale, scale);

        // Apply crisp shadows & metallic material optimizations
        robotMesh.traverse((child) => {
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
        });

        modelGroup.add(robotMesh);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[3D GLB Load Error]', err);
        setLoading(false);
      }
    );

    // 6. Mouse Parallax & Scroll Listener
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.15;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleWindowScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrolled / maxScroll : 0;
      setScrollProgress(progress);

      // Rotate GLB 3D model based on scroll depth
      if (!isDragging && modelGroup) {
        targetRotationY = 0.4 + progress * Math.PI * 2.5;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0005;
      mouseY = (e.clientY - windowHalfY) * 0.0005;

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        targetRotationX = Math.max(-0.3, Math.min(0.6, targetRotationX));

        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch gesture support for mobile devices
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
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    domElem.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera & model rotation
      modelGroup.rotation.y += (targetRotationY + mouseX - modelGroup.rotation.y) * 0.06;
      camera.position.y += (targetRotationX * 3 + 3.2 + mouseY * 2 - camera.position.y) * 0.06;
      camera.lookAt(0, 0.4, 0);

      // Idle subtle breathing motion when not dragging
      if (!isDragging) {
        modelGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // Update HUD telemetry
      if (Math.floor(elapsedTime * 10) % 5 === 0) {
        const deg = ((modelGroup.rotation.y % (Math.PI * 2)) * (180 / Math.PI)).toFixed(1);
        const dist = (4.5 + Math.sin(elapsedTime * 0.8) * 0.2).toFixed(2);
        setTelemetry({
          rotation: `${deg}°`,
          camDistance: `${dist}m`,
          mode: 'SCROLL DRIVEN 3D TELEMETRY',
          status: 'SYNCHRONIZED',
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
      window.removeEventListener('scroll', handleWindowScroll);
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
        minHeight: '520px',
        position: 'relative',
        cursor: 'grab',
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
            INITIALIZING 3D GLB ROBOT...
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
          <span style={{ color: '#000000', fontWeight: 'bold', letterSpacing: '0.05em' }}>3D GLB MODEL // SCROLL SYNCED</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', opacity: 0.9 }}>
          <div>ROTATION: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.rotation}</span></div>
          <div>SCROLL DEPTH: <span style={{ color: '#000000', fontWeight: 'bold' }}>{(scrollProgress * 100).toFixed(0)}%</span></div>
          <div>CAMERA DIST: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.camDistance}</span></div>
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
        <span>Scroll / Drag to Control 3D GLB Robot</span>
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
