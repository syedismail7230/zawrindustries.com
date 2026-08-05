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

    // 3. Ultra-Wide Photorealistic Landscape Background (Matches Uploaded Meadow Photo)
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('/assets/estate_hero_landscape_wide.jpg', () => {
      setIsLoaded(true);
    });
    bgTexture.colorSpace = THREE.SRGBColorSpace;

    const bgGeo = new THREE.PlaneGeometry(42, 21);
    const bgMat = new THREE.MeshBasicMaterial({ map: bgTexture, depthWrite: false });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    bgMesh.position.set(0, 3.6, -14);
    scene.add(bgMesh);

    // 4. Photorealistic Lighting Matching Golden Sun & Azure Sky
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(-15, 25, 12);
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x365314, 1.0);
    scene.add(hemiLight);

    // 5. Instanced 3D Grass Blades (Blends Directly onto Photo Landscape, No Solid Ground Shelf)
    const BLADE_COUNT = 180000;

    // Curved Ribbon Blade Geometry
    const bladeWidth = 0.007;
    const bladeHeight = 0.45;
    const bladeGeo = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, 5);
    bladeGeo.translate(0, bladeHeight / 2, 0);

    // Curve geometry points slightly forward to catch sunlight
    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yRatio = pos.getY(i) / bladeHeight;
      const zCurve = Math.pow(yRatio, 2) * 0.06;
      const xTaper = 1 - Math.pow(yRatio, 1.5) * 0.75;
      pos.setZ(i, zCurve);
      pos.setX(i, pos.getX(i) * xTaper);
    }
    bladeGeo.computeVertexNormals();

    // Color attribute sampled directly from meadow photo (Lush Sunlit Lime & Meadow Green)
    const tipColor = new THREE.Color('#a8eb34');
    const sunlitColor = new THREE.Color('#d4fc79');
    const baseGreen = new THREE.Color('#589e1a');

    const colors = new Float32Array(BLADE_COUNT * 3);
    for (let i = 0; i < BLADE_COUNT; i++) {
      const rand = Math.random();
      const c = rand > 0.75 ? sunlitColor : rand > 0.35 ? tipColor : baseGreen;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    bladeGeo.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));

    const bladeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6db322'),
      roughness: 0.35,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADE_COUNT);

    const dummy = new THREE.Object3D();
    const bladeData: { x: number; y: number; z: number; rotY: number; scaleY: number; currentBendX: number; currentBendZ: number }[] = [];

    // Distribute 3D grass blades smoothly across the photo meadow foreground with zero hard edges
    for (let i = 0; i < BLADE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 26;
      const z = Math.random() * 8.5 - 3.2; // Foreground meadow region
      
      // Gentle subtle curve matching the hills in photo
      const y = -1.2 + Math.sin(x * 0.1) * 0.12 + (z + 3.2) * 0.08;

      const rotY = Math.random() * Math.PI;

      // Distance height feathering: Blades scale smoothly to zero as z approaches back horizon (-3.2)
      const distRatio = Math.max(0, (z - (-3.2)) / 8.5); // 0 at back, 1 at front
      const distanceFactor = Math.pow(distRatio, 0.85); // Smooth quadratic fade
      const scaleY = (0.2 + Math.random() * 0.8) * distanceFactor;

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
      width: '100vw',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      height: 'clamp(540px, 64vw, 840px)',
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

    </section>
  );
}
