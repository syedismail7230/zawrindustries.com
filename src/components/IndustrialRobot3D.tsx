'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState({
    joint1: '0.0°',
    joint2: '42.0°',
    joint3: '-25.0°',
    claw: 'GRIPPER ENGAGED',
    precision: '±0.005 mm',
    status: 'OPERATIONAL',
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup (Studio White Environment)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4.5, 3.2, 5.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting (High contrast black & white studio rendering)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainLight.position.set(6, 10, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    // 5. Create "ZAWR INDUSTRIES" Canvas Texture for Arm Branding
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 128;
    const ctx = textCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#181a1f';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText('ZAWR INDUSTRIES', 40, 75);
    }
    const textTexture = new THREE.CanvasTexture(textCanvas);

    // 6. Materials (Matte Black Industrial Finish + Polished Chrome accents)
    const matteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.35,
      metalness: 0.8,
    });

    const jointCapMat = new THREE.MeshStandardMaterial({
      color: 0x0d0e11,
      roughness: 0.2,
      metalness: 0.9,
    });

    const brandedArmMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.35,
      metalness: 0.8,
      map: textTexture,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    });

    const redLedMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    // Shadow Receiver Ground Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(20, 20);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 7. Construct 3D Industrial Robot Arm (Matching Reference Image)
    const robotGroup = new THREE.Group();
    robotGroup.position.y = -1.2;
    scene.add(robotGroup);

    // Base Assembly (Cylindrical Stack)
    const baseBottomGeo = new THREE.CylinderGeometry(1.3, 1.4, 0.3, 32);
    const baseBottom = new THREE.Mesh(baseBottomGeo, matteBlackMat);
    baseBottom.position.y = 0.15;
    baseBottom.castShadow = true;
    baseBottom.receiveShadow = true;
    robotGroup.add(baseBottom);

    const baseMidGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.4, 32);
    const baseMid = new THREE.Mesh(baseMidGeo, jointCapMat);
    baseMid.position.y = 0.5;
    baseMid.castShadow = true;
    robotGroup.add(baseMid);

    // Red LED Status Indicator on Base
    const ledGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const led = new THREE.Mesh(ledGeo, redLedMat);
    led.position.set(0.9, 0.35, 0.9);
    robotGroup.add(led);

    // Turntable Pivot (J1 Rotation)
    const j1Group = new THREE.Group();
    j1Group.position.y = 0.7;
    robotGroup.add(j1Group);

    const turntableTopGeo = new THREE.CylinderGeometry(1.0, 1.05, 0.3, 32);
    const turntableTop = new THREE.Mesh(turntableTopGeo, matteBlackMat);
    turntableTop.position.y = 0.15;
    turntableTop.castShadow = true;
    j1Group.add(turntableTop);

    // Shoulder Joint Cap (Side Disc)
    const shoulderDiscGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.4, 32);
    const shoulderDisc = new THREE.Mesh(shoulderDiscGeo, jointCapMat);
    shoulderDisc.rotation.x = Math.PI / 2;
    shoulderDisc.position.set(0, 0.6, 0);
    shoulderDisc.castShadow = true;
    j1Group.add(shoulderDisc);

    // J2 Shoulder Pivot Group
    const j2Group = new THREE.Group();
    j2Group.position.set(0, 0.6, 0);
    j1Group.add(j2Group);

    // Lower Arm Link (Main Branded Arm Segment)
    const lowerArmBoxGeo = new THREE.BoxGeometry(0.7, 1.8, 0.5);
    const lowerArmMesh = new THREE.Mesh(lowerArmBoxGeo, brandedArmMat);
    lowerArmMesh.position.set(0, 0.9, 0);
    lowerArmMesh.castShadow = true;
    j2Group.add(lowerArmMesh);

    // Elbow Joint (J3 Pivot Cap)
    const elbowDiscGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 32);
    const elbowDisc = new THREE.Mesh(elbowDiscGeo, jointCapMat);
    elbowDisc.rotation.x = Math.PI / 2;
    elbowDisc.position.set(0, 1.8, 0);
    elbowDisc.castShadow = true;
    j2Group.add(elbowDisc);

    // J3 Elbow Pivot Group
    const j3Group = new THREE.Group();
    j3Group.position.set(0, 1.8, 0);
    j2Group.add(j3Group);

    // Upper Arm Link
    const upperArmGeo = new THREE.CylinderGeometry(0.32, 0.38, 1.5, 32);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, matteBlackMat);
    upperArmMesh.rotation.z = -Math.PI / 3;
    upperArmMesh.position.set(0.65, 0.4, 0);
    upperArmMesh.castShadow = true;
    j3Group.add(upperArmMesh);

    // Wrist Rotation Joint (J4 / J5)
    const wristGroup = new THREE.Group();
    wristGroup.position.set(1.3, 0.8, 0);
    j3Group.add(wristGroup);

    const wristDiscGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32);
    const wristDisc = new THREE.Mesh(wristDiscGeo, jointCapMat);
    wristDisc.rotation.z = Math.PI / 2;
    wristDisc.castShadow = true;
    wristGroup.add(wristDisc);

    // Tool Head & Segmented Optical Gripper Claw
    const toolGroup = new THREE.Group();
    toolGroup.position.set(0.2, 0, 0);
    wristGroup.add(toolGroup);

    const clawBaseGeo = new THREE.BoxGeometry(0.3, 0.4, 0.4);
    const clawBase = new THREE.Mesh(clawBaseGeo, matteBlackMat);
    clawBase.castShadow = true;
    toolGroup.add(clawBase);

    // Top Segmented Claw Finger
    const fingerTopGroup = new THREE.Group();
    fingerTopGroup.position.set(0.15, 0.15, 0);
    toolGroup.add(fingerTopGroup);

    const seg1TopGeo = new THREE.BoxGeometry(0.4, 0.08, 0.12);
    const seg1Top = new THREE.Mesh(seg1TopGeo, chromeMat);
    seg1Top.position.x = 0.2;
    seg1Top.rotation.z = -0.3;
    seg1Top.castShadow = true;
    fingerTopGroup.add(seg1Top);

    const seg2TopGeo = new THREE.BoxGeometry(0.35, 0.07, 0.1);
    const seg2Top = new THREE.Mesh(seg2TopGeo, glassMat);
    seg2Top.position.set(0.45, -0.08, 0);
    seg2Top.rotation.z = 0.5;
    seg2Top.castShadow = true;
    fingerTopGroup.add(seg2Top);

    // Bottom Segmented Claw Finger
    const fingerBottomGroup = new THREE.Group();
    fingerBottomGroup.position.set(0.15, -0.15, 0);
    toolGroup.add(fingerBottomGroup);

    const seg1BottomGeo = new THREE.BoxGeometry(0.4, 0.08, 0.12);
    const seg1Bottom = new THREE.Mesh(seg1BottomGeo, chromeMat);
    seg1Bottom.position.x = 0.2;
    seg1Bottom.rotation.z = 0.3;
    seg1Bottom.castShadow = true;
    fingerBottomGroup.add(seg1Bottom);

    const seg2BottomGeo = new THREE.BoxGeometry(0.35, 0.07, 0.1);
    const seg2Bottom = new THREE.Mesh(seg2BottomGeo, glassMat);
    seg2Bottom.position.set(0.45, 0.08, 0);
    seg2Bottom.rotation.z = -0.5;
    seg2Bottom.castShadow = true;
    fingerBottomGroup.add(seg2Bottom);

    // Initial Joint Angles matching Reference Image
    j2Group.rotation.z = -0.45;
    j3Group.rotation.z = 0.85;

    // 8. Interactive Orbit & Drag Controls
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0.3;
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

    // Mobile touch support
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

    // 9. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Orbit Camera Interpolation
      robotGroup.rotation.y += (targetRotationY - robotGroup.rotation.y) * 0.05;
      camera.position.y += (targetRotationX * 3 + 3.2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0.6, 0);

      // Gentle Articulation Oscillations
      const j1Rot = Math.sin(elapsedTime * 0.6) * 0.35;
      const clawPulse = Math.sin(elapsedTime * 2.5) * 0.12;

      j1Group.rotation.y = j1Rot;
      fingerTopGroup.rotation.z = clawPulse;
      fingerBottomGroup.rotation.z = -clawPulse;

      // Update Telemetry State
      if (Math.floor(elapsedTime * 10) % 6 === 0) {
        setTelemetry({
          joint1: `${(j1Rot * (180 / Math.PI)).toFixed(1)}°`,
          joint2: '42.5°',
          joint3: '-25.0°',
          claw: clawPulse > 0 ? 'SYNCHRONIZING' : 'GRIPPER ENGAGED',
          precision: '±0.005 mm',
          status: 'OPERATIONAL',
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Handling
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
      {/* Sleek Monochrome Telemetry HUD Overlay */}
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
          <span style={{ color: '#000000', fontWeight: 'bold', letterSpacing: '0.05em' }}>ROBOTICS TELEMETRY // 3D CANVAS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', opacity: 0.9 }}>
          <div>J1 ROTATION: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.joint1}</span></div>
          <div>J2 PITCH: <span style={{ color: '#000000', fontWeight: 'bold' }}>{telemetry.joint2}</span></div>
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
        <span>Drag / Touch to Orbit 3D Model</span>
      </div>
    </div>
  );
}
