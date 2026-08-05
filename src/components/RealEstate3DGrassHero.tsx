'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function RealEstate3DGrassHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'proptech' | 'estates'>('overview');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animationFrameId: number;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 1.4, 9.5);
    camera.lookAt(0, 0.2, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Photorealistic Background Texture Plane (Matches Reference Meadow Photo)
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('/assets/estate_hero_3d_landscape.png', () => {
      setIsLoaded(true);
    });
    bgTexture.colorSpace = THREE.SRGBColorSpace;

    const bgGeo = new THREE.PlaneGeometry(36, 18);
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTexture, depthWrite: false });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 3.2, -14);
    scene.add(bgMesh);

    // 4. Photorealistic Lighting Matching Golden Sun & Azure Sky
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(-15, 25, 12);
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x365314, 1.0);
    scene.add(hemiLight);

    // 5. Foreground Ground Base Texture Matching Photo Soil/Grass
    const groundGeo = new THREE.PlaneGeometry(24, 16, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);

    // Subtle gentle contour
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      posAttr.setY(i, Math.sin(x * 0.15) * 0.18 + Math.cos(z * 0.2) * 0.12);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#254d19'),
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, -0.6, 2);
    scene.add(ground);

    // 6. Hyper-Realistic Instanced 3D Grass Blades (Ultra-Dense Carpet)
    const BLADE_COUNT = 75000;

    // Curved Ribbon Blade Geometry (Ultra-Slim & Delicate)
    const bladeWidth = 0.016;
    const bladeHeight = 1.15;
    const bladeGeo = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, 5);
    bladeGeo.translate(0, bladeHeight / 2, 0);

    // Curve geometry points slightly forward to catch sunlight
    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yRatio = pos.getY(i) / bladeHeight;
      const zCurve = Math.pow(yRatio, 2) * 0.15; // Natural arc curve forward
      const xTaper = 1 - Math.pow(yRatio, 1.5) * 0.75; // Taper to needle tip
      pos.setZ(i, zCurve);
      pos.setX(i, pos.getX(i) * xTaper);
    }
    bladeGeo.computeVertexNormals();

    // Color attribute for gradient (Sunlit Lime Tip -> Deep Forest Emerald Base)
    const baseColor = new THREE.Color('#143811');
    const midColor = new THREE.Color('#4d7c0f');
    const tipColor = new THREE.Color('#a3e635');
    const sunlitColor = new THREE.Color('#d9f99d');

    const colors = new Float32Array(BLADE_COUNT * 3);
    for (let i = 0; i < BLADE_COUNT; i++) {
      const isSunlit = Math.random() > 0.75;
      const c = isSunlit ? sunlitColor : tipColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    bladeGeo.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));

    const bladeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#65a30d'),
      roughness: 0.45,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADE_COUNT);

    const dummy = new THREE.Object3D();
    const bladeData: { x: number; y: number; z: number; rotY: number; scaleY: number; currentBendX: number; currentBendZ: number }[] = [];

    // Distribute grass blades across foreground meadow
    for (let i = 0; i < BLADE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 22;
      const z = Math.random() * 10 - 2.5; // Concentrated in foreground
      const y = -0.6 + (Math.sin(x * 0.15) * 0.18 + Math.cos(z * 0.2) * 0.12);

      const rotY = Math.random() * Math.PI;
      const scaleY = 0.75 + Math.random() * 0.5;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();

      grassMesh.setMatrixAt(i, dummy.matrix);

      bladeData.push({
        x,
        y,
        z,
        rotY,
        scaleY,
        currentBendX: 0,
        currentBendZ: 0,
      });
    }
    grassMesh.instanceMatrix.needsUpdate = true;
    scene.add(grassMesh);

    // 7. Interactive Cursor Raycasting & Mouse Displacement Physics
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const mouseWorld = new THREE.Vector3(-999, -999, -999);
    const planeIntersection = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.6);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targetPos = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(planeIntersection, targetPos)) {
        mouseWorld.copy(targetPos);
      }
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      mouseWorld.set(-999, -999, -999);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 8. Animation & Physics Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth camera parallax matching mouse
      if (mouse.x !== -999) {
        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.035;
        camera.position.y += (1.4 + mouse.y * 0.6 - camera.position.y) * 0.035;
        camera.lookAt(0, 0.2, 0);
      }

      // Physics: Grass Sway + Real-time Cursor Ripple Displacement
      const DISPLACEMENT_RADIUS = 3.2;
      const BEND_FORCE = 0.85;

      for (let i = 0; i < BLADE_COUNT; i++) {
        const b = bladeData[i];

        // Natural Wind Waves
        const windX = Math.sin(time * 2.4 + b.x * 0.6 + b.z * 0.4) * 0.14;
        const windZ = Math.cos(time * 2.0 + b.x * 0.4 + b.z * 0.6) * 0.14;

        // Interactive Cursor Hover Force
        let targetBendX = 0;
        let targetBendZ = 0;

        if (mouseWorld.x !== -999) {
          const dx = b.x - mouseWorld.x;
          const dz = b.z - mouseWorld.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < DISPLACEMENT_RADIUS && dist > 0.001) {
            const force = (1 - dist / DISPLACEMENT_RADIUS) * BEND_FORCE;
            targetBendX = (dx / dist) * force;
            targetBendZ = (dz / dist) * force;
          }
        }

        // Spring Dampening Interpolation
        b.currentBendX += (targetBendX - b.currentBendX) * 0.18;
        b.currentBendZ += (targetBendZ - b.currentBendZ) * 0.18;

        const finalRotX = windX + b.currentBendZ;
        const finalRotZ = windZ - b.currentBendX;

        dummy.position.set(b.x, b.y, b.z);
        dummy.rotation.set(finalRotX, b.rotY, finalRotZ);
        dummy.scale.set(1, b.scaleY, 1);
        dummy.updateMatrix();

        grassMesh.setMatrixAt(i, dummy.matrix);
      }

      grassMesh.instanceMatrix.needsUpdate = true;
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: 'clamp(620px, 78vw, 920px)',
      backgroundColor: '#1a3a14',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'pointer' }} />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0a1d08',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          zIndex: 10,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#a3e635',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }} />
          <p style={{ fontSize: '0.95rem', letterSpacing: '0.05em', fontWeight: 500 }}>
            Loading Photorealistic 3D Meadow Environment...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Top Title Overlay */}
      <div style={{
        position: 'absolute',
        top: '3.5rem',
        left: '5%',
        right: '5%',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto', maxWidth: '680px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.75)',
          }}>
            Real Estate & PropTech Solutions
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: '#f0fdf4',
            fontWeight: 500,
            lineHeight: 1.6,
            maxWidth: '580px',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)',
          }}>
            Combining sustainable land development with intelligent PropTech assets across India and the UAE.
          </p>
        </div>
      </div>
    </section>
  );
}
