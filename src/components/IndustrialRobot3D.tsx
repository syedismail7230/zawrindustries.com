'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [telemetry, setTelemetry] = useState({
    joint1: '0.0°',
    joint2: '45.0°',
    joint3: '-30.0°',
    laserPower: '98.4%',
    precision: '±0.02 mm',
    status: 'ACTIVE - SYNCHRONIZED',
  });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3, 5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueSpotLight = new THREE.PointLight(0x00f0ff, 3, 10);
    blueSpotLight.position.set(0, 2, 2);
    scene.add(blueSpotLight);

    const orangeSpotLight = new THREE.PointLight(0xff6600, 2, 8);
    orangeSpotLight.position.set(-2, 1, -2);
    scene.add(orangeSpotLight);

    // 5. Materials
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1d24,
      metalness: 0.85,
      roughness: 0.25,
    });

    const industrialOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xe65100, // Vibrant Industrial KUKA-style Orange
      metalness: 0.4,
      roughness: 0.3,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const glowingBlueMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
    });

    const gridHelper = new THREE.GridHelper(8, 16, 0x00e5ff, 0x333333);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // 6. Robot Construction Hierarchy
    const robotGroup = new THREE.Group();
    robotGroup.position.y = -1;
    scene.add(robotGroup);

    // Base Assembly
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkMetalMat);
    baseMesh.position.y = 0.2;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    robotGroup.add(baseMesh);

    // Turntable (Joint 1 Rotates around Y)
    const turntableGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.3, 32);
    const turntableMesh = new THREE.Mesh(turntableGeo, industrialOrangeMat);
    turntableMesh.position.y = 0.55;
    turntableMesh.castShadow = true;
    robotGroup.add(turntableMesh);

    const joint1Group = new THREE.Group();
    joint1Group.position.y = 0.7;
    robotGroup.add(joint1Group);

    // Shoulder Housing (Joint 2 Pivot)
    const shoulderHousingGeo = new THREE.BoxGeometry(0.8, 0.9, 0.8);
    const shoulderHousing = new THREE.Mesh(shoulderHousingGeo, darkMetalMat);
    shoulderHousing.position.y = 0.45;
    shoulderHousing.castShadow = true;
    joint1Group.add(shoulderHousing);

    // Main Lower Arm (Link 1)
    const joint2Group = new THREE.Group();
    joint2Group.position.set(0, 0.6, 0);
    joint1Group.add(joint2Group);

    const lowerArmGeo = new THREE.CylinderGeometry(0.22, 0.28, 1.8, 16);
    const lowerArm = new THREE.Mesh(lowerArmGeo, industrialOrangeMat);
    lowerArm.position.y = 0.9;
    lowerArm.castShadow = true;
    joint2Group.add(lowerArm);

    // Hydraulic Pistons on Lower Arm
    const pistonGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16);
    const piston = new THREE.Mesh(pistonGeo, chromeMat);
    piston.position.set(0.25, 0.8, 0);
    joint2Group.add(piston);

    // Elbow Joint (Joint 3 Pivot)
    const joint3Group = new THREE.Group();
    joint3Group.position.set(0, 1.8, 0);
    joint2Group.add(joint3Group);

    const elbowGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const elbow = new THREE.Mesh(elbowGeo, darkMetalMat);
    joint3Group.add(elbow);

    // Upper Arm (Link 2)
    const upperArmGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.5, 16);
    const upperArm = new THREE.Mesh(upperArmGeo, industrialOrangeMat);
    upperArm.rotation.z = Math.PI / 2;
    upperArm.position.x = 0.75;
    upperArm.castShadow = true;
    joint3Group.add(upperArm);

    // Wrist Joint (Joint 4 / 5)
    const wristGroup = new THREE.Group();
    wristGroup.position.set(1.5, 0, 0);
    joint3Group.add(wristGroup);

    const wristGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const wrist = new THREE.Mesh(wristGeo, chromeMat);
    wristGroup.add(wrist);

    // Tool Head / Laser Scanner End-Effector
    const toolGroup = new THREE.Group();
    wristGroup.add(toolGroup);

    const toolBaseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
    const toolBase = new THREE.Mesh(toolBaseGeo, darkMetalMat);
    toolBase.rotation.z = Math.PI / 2;
    toolBase.position.x = 0.25;
    toolGroup.add(toolBase);

    // Dual Claw Prongs
    const clawGeo = new THREE.BoxGeometry(0.3, 0.05, 0.08);
    const claw1 = new THREE.Mesh(clawGeo, chromeMat);
    claw1.position.set(0.4, 0.1, 0);
    toolGroup.add(claw1);

    const claw2 = new THREE.Mesh(clawGeo, chromeMat);
    claw2.position.set(0.4, -0.1, 0);
    toolGroup.add(claw2);

    // Laser Emitter Cone
    const laserLensGeo = new THREE.CylinderGeometry(0.02, 0.08, 0.15, 16);
    const laserLens = new THREE.Mesh(laserLensGeo, glowingBlueMat);
    laserLens.rotation.z = Math.PI / 2;
    laserLens.position.x = 0.48;
    toolGroup.add(laserLens);

    // Laser Beam Projection Line
    const laserBeamGeo = new THREE.CylinderGeometry(0.01, 0.08, 2.5, 8);
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
    });
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeam.rotation.z = Math.PI / 2;
    laserBeam.position.x = 1.75;
    toolGroup.add(laserBeam);

    // Spark Particles for End-Effector Precision Laser
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 0.4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
    });
    const sparkParticles = new THREE.Points(particleGeo, particleMat);
    sparkParticles.position.set(3.0, 0, 0);
    toolGroup.add(sparkParticles);

    // 7. Interactive Orbit & Mouse Controls
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.2;

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

      targetRotationX = Math.max(-0.4, Math.min(0.8, targetRotationX));

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

      targetRotationX = Math.max(-0.4, Math.min(0.8, targetRotationX));

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

    // 8. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera orbit interpolated towards target mouse position
      robotGroup.rotation.y += (targetRotationY - robotGroup.rotation.y) * 0.05;
      camera.position.y += (targetRotationX * 3 + 3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0.8, 0);

      // Automated 6-Axis Kinematic Articulation Animation
      const j1 = Math.sin(elapsedTime * 0.8) * 0.6;
      const j2 = Math.sin(elapsedTime * 1.2) * 0.25 - 0.2;
      const j3 = Math.cos(elapsedTime * 1.5) * 0.35 + 0.1;
      const wristRot = elapsedTime * 2.0;

      joint1Group.rotation.y = j1;
      joint2Group.rotation.z = j2;
      joint3Group.rotation.z = j3;
      toolGroup.rotation.x = wristRot;

      // Animate Laser Beam intensity pulse
      laserBeamMat.opacity = 0.4 + Math.sin(elapsedTime * 10) * 0.2;

      // Rotate Spark Particles
      sparkParticles.rotation.x = elapsedTime * 4;

      // Update HUD telemetry values periodically
      if (Math.floor(elapsedTime * 10) % 5 === 0) {
        setTelemetry({
          joint1: `${(j1 * (180 / Math.PI)).toFixed(1)}°`,
          joint2: `${(j2 * (180 / Math.PI) + 45).toFixed(1)}°`,
          joint3: `${(j3 * (180 / Math.PI)).toFixed(1)}°`,
          laserPower: `${(98.2 + Math.sin(elapsedTime * 2) * 1.2).toFixed(1)}%`,
          precision: '±0.02 mm',
          status: 'ACTIVE - SYNCHRONIZED',
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        position: 'relative',
        cursor: 'grab',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, rgba(26, 32, 44, 0.9) 0%, rgba(10, 12, 16, 0.98) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 229, 255, 0.08)',
      }}
    >
      {/* 3D Telemetry Futuristic Glass HUD Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: '1.2rem',
          left: '1.2rem',
          padding: '0.8rem 1.2rem',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '12px',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00e5ff', boxShadow: '0 0 10px #00e5ff', animation: 'pulse 1.5s infinite' }}></span>
          <span style={{ color: '#00e5ff', fontWeight: 'bold', letterSpacing: '0.05em' }}>ROBOTICS TELEMETRY // 6-AXIS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', opacity: 0.9 }}>
          <div>J1 ROTATION: <span style={{ color: '#00f0ff' }}>{telemetry.joint1}</span></div>
          <div>J2 PITCH: <span style={{ color: '#00f0ff' }}>{telemetry.joint2}</span></div>
          <div>J3 ELBOW: <span style={{ color: '#00f0ff' }}>{telemetry.joint3}</span></div>
          <div>PRECISION: <span style={{ color: '#00ff66' }}>{telemetry.precision}</span></div>
        </div>
      </div>

      {/* Orbit Helper Pill Badge */}
      <div 
        style={{
          position: 'absolute',
          bottom: '1.2rem',
          right: '1.2rem',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '30px',
          color: '#e2e8f0',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>Drag / Touch to Orbit 3D Robot</span>
      </div>
    </div>
  );
}
