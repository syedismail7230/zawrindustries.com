'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function RealEstate3DGrassHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animationFrameId: number;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Atmosphere Fog Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#64b5f6');
    scene.fog = new THREE.FogExp2('#b3e5fc', 0.009); // Realistic distance haze

    // 2. Camera Setup (Cinematic Meadow Angle)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 300);
    camera.position.set(0, 2.6, 12);
    camera.lookAt(0, 0.6, -8);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Procedural Sky Dome Gradient (Azure Blue -> Golden Horizon)
    const skyGeo = new THREE.SphereGeometry(220, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color('#1565c0') },
        bottomColor: { value: new THREE.Color('#e0f7fa') },
        offset: { value: 12 },
        exponent: { value: 0.5 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // 5. Sun & Atmosphere Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    sunLight.position.set(-35, 50, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 180;
    const d = 50;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x64b5f6, 0x388e3c, 1.15);
    scene.add(hemiLight);

    // 6. 3D Procedural Rolling Terrain Mesh
    const terrainGeo = new THREE.PlaneGeometry(180, 180, 140, 140);
    terrainGeo.rotateX(-Math.PI / 2);

    const getTerrainHeight = (x: number, z: number) => {
      const h1 = Math.sin(x * 0.035) * Math.cos(z * 0.035) * 3.8;
      const h2 = Math.sin(x * 0.08 + 1.2) * Math.sin(z * 0.07 + 0.8) * 1.6;
      const h3 = Math.cos(x * 0.018) * Math.sin(z * 0.025) * 5.2;
      return h1 + h2 + h3 - 2.8;
    };

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      posAttr.setY(i, getTerrainHeight(x, z));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#43a047'),
      roughness: 0.85,
      metalness: 0.04,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 7. AAA Micro-Leaf Branch Texture Generator (100+ Tiny Leaves per Sprig)
    const createMicroLeafTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 512, 512);

      const leafPalette = ['#2e7d32', '#388e3c', '#4caf50', '#76ff03', '#1b5e20', '#aeea00', '#66bb6a'];

      // Draw Central Wooden Twig Stem
      ctx.beginPath();
      ctx.moveTo(256, 490);
      ctx.quadraticCurveTo(260, 256, 256, 20);
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Side stem branches
      for (let b = 0; b < 12; b++) {
        const by = 80 + b * 34;
        const dir = b % 2 === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(256, by);
        ctx.quadraticCurveTo(256 + dir * 60, by - 20, 256 + dir * 140, by - 50);
        ctx.strokeStyle = '#4e342e';
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      // Draw 140 Tiny Micro Leaves along stems
      for (let i = 0; i < 140; i++) {
        const lx = 256 + (Math.random() - 0.5) * 360;
        const ly = 50 + Math.random() * 420;
        const rx = 3.5 + Math.random() * 5.5; // Drastically smaller micro leaves
        const ry = 8.0 + Math.random() * 12.0;
        const rot = (Math.random() - 0.5) * Math.PI;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = leafPalette[i % leafPalette.length];
        ctx.fill();

        // Central leaf vein
        ctx.beginPath();
        ctx.moveTo(0, -ry * 0.85);
        ctx.lineTo(0, ry * 0.85);
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const microLeafTex = createMicroLeafTexture();

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719,
      roughness: 0.90,
      metalness: 0.04,
    });

    const microLeafMat = new THREE.MeshStandardMaterial({
      map: microLeafTex,
      transparent: true,
      alphaTest: 0.22,
      side: THREE.DoubleSide,
      roughness: 0.45,
      metalness: 0.03,
    });

    // Micro-Leaf Card Geometry (Drastically Reduced Size: 0.55 x 0.55)
    const microBranchGeo = new THREE.PlaneGeometry(0.55, 0.55);

    const createHyperRealisticTree = (tx: number, tz: number, scale = 1) => {
      const tree = new THREE.Group();
      const ty = getTerrainHeight(tx, tz);
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(scale);

      // Smooth Tapered Wood Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.52, 4.8, 12);
      trunkGeo.translate(0, 2.4, 0);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.castShadow = true;
      tree.add(trunk);

      // 5 Spreading Branch Arms
      const branchAngles = [-0.65, 0.55, -0.35, 0.45, 0];
      const branchHeights = [3.2, 3.5, 4.0, 4.2, 4.6];
      const branchDirs = [
        { x: -0.8, z: 0.3 },
        { x: 0.7, z: -0.4 },
        { x: -0.4, z: -0.7 },
        { x: 0.5, z: 0.6 },
        { x: 0, z: 0 },
      ];

      branchAngles.forEach((ang, idx) => {
        const bGeo = new THREE.CylinderGeometry(0.06, 0.16, 2.4, 8);
        bGeo.rotateZ(ang);
        bGeo.translate(branchDirs[idx].x, branchHeights[idx], branchDirs[idx].z);
        const bMesh = new THREE.Mesh(bGeo, trunkMat);
        bMesh.castShadow = true;
        tree.add(bMesh);
      });

      // 120 Micro-Leaf Sprig Cards forming dense, soft, natural tree canopy
      const leafCluster = new THREE.Group();
      leafCluster.position.set(0, 4.5, 0);

      for (let i = 0; i < 120; i++) {
        const sprig = new THREE.Mesh(microBranchGeo, microLeafMat);
        
        // Random spherical distribution
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.4 + Math.pow(Math.random(), 0.7) * 2.1;

        const rx = r * Math.sin(phi) * Math.cos(theta);
        const ry = (r * Math.cos(phi)) * 0.85 + 0.3;
        const rz = r * Math.sin(phi) * Math.sin(theta);

        sprig.position.set(rx, ry, rz);
        sprig.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        sprig.scale.setScalar(0.75 + Math.random() * 0.5);
        sprig.castShadow = true;
        sprig.receiveShadow = true;
        leafCluster.add(sprig);
      }
      tree.add(leafCluster);

      return tree;
    };

    // Scatter 52 Photorealistic Micro-Leaf Trees across hills
    const treeGroup = new THREE.Group();
    const treesList: THREE.Group[] = [];
    for (let i = 0; i < 52; i++) {
      const tx = (Math.random() - 0.5) * 140;
      const tz = -10 - Math.random() * 65;
      const scale = 0.95 + Math.random() * 1.15;
      const tree = createHyperRealisticTree(tx, tz, scale);
      treeGroup.add(tree);
      treesList.push(tree);
    }
    scene.add(treeGroup);

    // 8. Universal 3D Instanced Grass Meadow Covering ENTIRE Terrain (320,000 Blades)
    const BLADE_COUNT = 320000;

    const bladeWidth = 0.010;
    const bladeHeight = 0.58;
    const bladeGeo = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, 5);
    bladeGeo.translate(0, bladeHeight / 2, 0);

    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yRatio = pos.getY(i) / bladeHeight;
      const zCurve = Math.pow(yRatio, 2) * 0.09;
      const xTaper = 1 - Math.pow(yRatio, 1.5) * 0.75;
      pos.setZ(i, zCurve);
      pos.setX(i, pos.getX(i) * xTaper);
    }
    bladeGeo.computeVertexNormals();

    const tipColor = new THREE.Color('#9be526');
    const sunlitColor = new THREE.Color('#d4fc79');
    const baseGreen = new THREE.Color('#388e3c');

    const colors = new Float32Array(BLADE_COUNT * 3);
    for (let i = 0; i < BLADE_COUNT; i++) {
      const rand = Math.random();
      const c = rand > 0.7 ? sunlitColor : rand > 0.3 ? tipColor : baseGreen;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    bladeGeo.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));

    const bladeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#558b2f'),
      roughness: 0.4,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADE_COUNT);
    grassMesh.castShadow = true;
    grassMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const bladeData: { x: number; y: number; z: number; rotY: number; scaleY: number; currentBendX: number; currentBendZ: number }[] = [];

    // Distribute 320,000 grass blades across 100% of terrain (surrounding all trees)
    for (let i = 0; i < BLADE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 140;
      const z = Math.random() * 52 - 34; // Covers full depth from far hill trees to camera
      const y = getTerrainHeight(x, z);

      const rotY = Math.random() * Math.PI;
      const scaleY = 0.55 + Math.random() * 0.65;

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

    setIsLoaded(true);

    // 9. Cursor Raycasting & Real-time Displacement Physics
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const mouseWorld = new THREE.Vector3(-999, -999, -999);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(terrain);
      if (intersects.length > 0) {
        mouseWorld.copy(intersects[0].point);
      }
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      mouseWorld.set(-999, -999, -999);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 10. Animation & Physics Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera Smooth Parallax Easing
      if (mouse.x !== -999) {
        camera.position.x += (mouse.x * 3.2 - camera.position.x) * 0.03;
        camera.position.y += (2.6 + mouse.y * 1.1 - camera.position.y) * 0.03;
        camera.lookAt(0, 0.6, -8);
      }

      // Gentle Organic Tree Sway in Wind
      treesList.forEach((tree, idx) => {
        const swayTime = time * 1.2 + idx * 0.5;
        tree.rotation.z = Math.sin(swayTime) * 0.02;
        tree.rotation.x = Math.cos(swayTime * 0.7) * 0.012;
      });

      // Wind & Cursor Hover Physics on Grass
      const DISPLACEMENT_RADIUS = 4.8;
      const BEND_FORCE = 0.95;

      for (let i = 0; i < BLADE_COUNT; i++) {
        const b = bladeData[i];

        // Skip distant blades calculation optimization
        if (b.z < -12) continue;

        const windX = Math.sin(time * 2.2 + b.x * 0.5 + b.z * 0.3) * 0.14;
        const windZ = Math.cos(time * 1.8 + b.x * 0.3 + b.z * 0.5) * 0.14;

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

        b.currentBendX += (targetBendX - b.currentBendX) * 0.2;
        b.currentBendZ += (targetBendZ - b.currentBendZ) * 0.2;

        dummy.position.set(b.x, b.y, b.z);
        dummy.rotation.set(windX + b.currentBendZ, b.rotY, windZ - b.currentBendX);
        dummy.scale.set(1, b.scaleY, 1);
        dummy.updateMatrix();

        grassMesh.setMatrixAt(i, dummy.matrix);
      }

      grassMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 11. Resize Handler
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
      height: 'clamp(580px, 68vw, 880px)',
      backgroundColor: '#1b3a1a',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* 100% 3D WebGL Environment Canvas */}
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
            Generating Hyper-Realistic 3D World & Meadow...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </section>
  );
}
