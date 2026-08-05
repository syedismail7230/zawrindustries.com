'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function RealEstate3DGrassHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [grassDensity, setGrassDensity] = useState<'Ultra' | 'High' | 'Balanced'>('High');
  const [activeTab, setActiveTab] = useState<'overview' | 'proptech' | 'estates'>('overview');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animationFrameId: number;

    // 1. Scene & Camera Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#94d2bd');
    scene.fog = new THREE.FogExp2('#94d2bd', 0.018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 4.5, 18);
    camera.lookAt(0, 1.2, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xdff4d7, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d1, 2.5);
    sunLight.position.set(20, 30, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    scene.add(sunLight);

    const hemisphereLight = new THREE.HemisphereLight(0xb1e5fb, 0x2d6a4f, 0.8);
    scene.add(hemisphereLight);

    // 4. Ground Mesh with Rolling Hills Geometry
    const terrainGeo = new THREE.PlaneGeometry(60, 60, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // Gentle rolling hill elevation
      const y = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 1.4 + Math.sin(x * 0.05) * 0.8;
      posAttr.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2d6a4f'),
      roughness: 0.85,
      metalness: 0.05,
      flatShading: false,
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Helper function to get elevation at (x, z)
    const getTerrainHeight = (x: number, z: number) => {
      return Math.sin(x * 0.12) * Math.cos(z * 0.12) * 1.4 + Math.sin(x * 0.05) * 0.8;
    };

    // 5. Instanced 3D Grass Blades Generation
    const BLADE_COUNT = 16000;
    
    // Custom Tapered Blade Geometry
    const bladeGeo = new THREE.PlaneGeometry(0.12, 1.3, 1, 4);
    bladeGeo.translate(0, 0.65, 0); // Origin at blade base

    // Colors gradient (Emerald base to Sunlit Yellow-Green tip)
    const baseColor = new THREE.Color('#1b4332');
    const tipColor = new THREE.Color('#74c69d');
    const accentTip = new THREE.Color('#b7e4c7');

    const colors = new Float32Array(BLADE_COUNT * 3);
    for (let i = 0; i < BLADE_COUNT; i++) {
      const isGolden = Math.random() > 0.85;
      const c = isGolden ? accentTip : tipColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    bladeGeo.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));

    const bladeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#40916c'),
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADE_COUNT);
    grassMesh.castShadow = true;
    grassMesh.receiveShadow = true;

    // Store base positions & rotations for physics displacement
    const dummy = new THREE.Object3D();
    const bladeData: { x: number; y: number; z: number; rotY: number; scaleY: number; currentBendX: number; currentBendZ: number }[] = [];

    for (let i = 0; i < BLADE_COUNT; i++) {
      const radius = 22 * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const y = getTerrainHeight(x, z);

      const rotY = Math.random() * Math.PI;
      const scaleY = 0.7 + Math.random() * 0.6;

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

    // 6. Horizon Trees (3D Low-Poly Trees)
    const treeGroup = new THREE.Group();
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });

    const createTree = (tx: number, tz: number, scale = 1) => {
      const tree = new THREE.Group();
      const ty = getTerrainHeight(tx, tz);
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(scale);

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2.5, 6);
      trunkGeo.translate(0, 1.25, 0);
      const trunk = new THREE.Mesh(trunkGeo, treeTrunkMat);
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageGeo1 = new THREE.ConeGeometry(1.6, 3, 6);
      foliageGeo1.translate(0, 3.2, 0);
      const foliage1 = new THREE.Mesh(foliageGeo1, treeFoliageMat);
      foliage1.castShadow = true;
      tree.add(foliage1);

      const foliageGeo2 = new THREE.ConeGeometry(1.2, 2.4, 6);
      foliageGeo2.translate(0, 4.4, 0);
      const foliage2 = new THREE.Mesh(foliageGeo2, treeFoliageMat);
      foliage2.castShadow = true;
      tree.add(foliage2);

      return tree;
    };

    // Cluster of trees on background hill
    const treePositions = [
      [-14, -8, 1.2], [-16, -10, 1.4], [-12, -12, 1.1], [-18, -6, 1.3],
      [-15, -14, 1.0], [16, -12, 1.3], [18, -14, 1.5], [14, -16, 1.1]
    ];
    treePositions.forEach(([tx, tz, s]) => treeGroup.add(createTree(tx, tz, s)));
    scene.add(treeGroup);

    // 7. Interactive Mouse / Raycaster Grass Displacement
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const mouseWorld = new THREE.Vector3(-999, -999, -999);
    const planeIntersection = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const ray = raycaster.ray;
      const targetPos = new THREE.Vector3();
      if (ray.intersectPlane(planeIntersection, targetPos)) {
        mouseWorld.copy(targetPos);
      }
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      mouseWorld.set(-999, -999, -999);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    setIsLoaded(true);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Gentle camera parallax movement based on mouse
      if (mouse.x !== -999) {
        camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.03;
        camera.position.y += (4.5 + mouse.y * 1.2 - camera.position.y) * 0.03;
        camera.lookAt(0, 1.2, 0);
      }

      // Update Grass Blades Physics
      const DISPLACEMENT_RADIUS = 3.5;
      const MAX_BEND = 0.75;

      for (let i = 0; i < BLADE_COUNT; i++) {
        const b = bladeData[i];

        // 1. Natural Wind Wave
        const windX = Math.sin(time * 2.2 + b.x * 0.5 + b.z * 0.3) * 0.12;
        const windZ = Math.cos(time * 1.8 + b.x * 0.3 + b.z * 0.5) * 0.12;

        // 2. Cursor Hover Displacement
        let targetBendX = 0;
        let targetBendZ = 0;

        if (mouseWorld.x !== -999) {
          const dx = b.x - mouseWorld.x;
          const dz = b.z - mouseWorld.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist < DISPLACEMENT_RADIUS && dist > 0.001) {
            const force = (1 - dist / DISPLACEMENT_RADIUS) * MAX_BEND;
            targetBendX = (dx / dist) * force;
            targetBendZ = (dz / dist) * force;
          }
        }

        // Smooth physics spring interpolation
        b.currentBendX += (targetBendX - b.currentBendX) * 0.15;
        b.currentBendZ += (targetBendZ - b.currentBendZ) * 0.15;

        // Total rotation
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

    // 9. Window Resize Handling
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
      height: 'clamp(580px, 72vw, 880px)',
      backgroundColor: '#94d2bd',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#1b4332',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify-content: 'center',
          color: '#ffffff',
          zIndex: 10,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#74c69d',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }} />
          <p style={{ fontSize: '0.95rem', letterSpacing: '0.05em', fontWeight: 500 }}>
            Initializing Hyperrealistic 3D Environment...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Top Glassmorphic Header & Title Banner */}
      <div style={{
        position: 'absolute',
        top: '2.5rem',
        left: '5%',
        right: '5%',
        zIndex: 5,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1.5rem',
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto', maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            backgroundColor: 'rgba(27, 67, 50, 0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: '9999px',
            border: '1px solid rgba(116, 198, 157, 0.4)',
            color: '#b7e4c7',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52b788', boxShadow: '0 0 10px #52b788' }} />
            Interactive 3D Meadow Environment • Move Cursor to Sway Grass
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
            fontWeight: 800,
            color: '#081c15',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            textShadow: '0 2px 20px rgba(255,255,255,0.6)',
          }}>
            Real Estate & PropTech Solutions
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: '#1b4332',
            fontWeight: 500,
            lineHeight: 1.6,
            maxWidth: '560px',
            textShadow: '0 1px 8px rgba(255,255,255,0.7)',
          }}>
            Combining sustainable land development with intelligent PropTech assets across India and the UAE. Hover your cursor over the grass to feel real-time physics.
          </p>
        </div>

        {/* Real Estate Telemetry Cards */}
        <div style={{
          pointerEvents: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          minWidth: '280px',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '1.1rem 1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#52b788', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Managed Land
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#081c15', marginTop: '0.2rem' }}>
              14,500+ <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2d6a4f' }}>Acres</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '1.1rem 1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#52b788', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Asset Portfolio
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#081c15', marginTop: '0.2rem' }}>
              $1.8B+ <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2d6a4f' }}>AUM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Navigation Dock */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'rgba(8, 28, 21, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '0.6rem 0.8rem',
        borderRadius: '9999px',
        border: '1px solid rgba(116, 198, 157, 0.3)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: activeTab === 'overview' ? '#52b788' : 'transparent',
            color: activeTab === 'overview' ? '#081c15' : '#e9d8a6',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🌿 Land & Development
        </button>

        <button
          onClick={() => setActiveTab('proptech')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: activeTab === 'proptech' ? '#52b788' : 'transparent',
            color: activeTab === 'proptech' ? '#081c15' : '#e9d8a6',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🏢 PropTech Platforms
        </button>

        <button
          onClick={() => setActiveTab('estates')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: activeTab === 'estates' ? '#52b788' : 'transparent',
            color: activeTab === 'estates' ? '#081c15' : '#e9d8a6',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🌐 Smart City Infrastructure
        </button>
      </div>
    </section>
  );
}
