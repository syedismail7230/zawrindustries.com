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
    scene.background = new THREE.Color('#78c0e0');
    scene.fog = new THREE.FogExp2('#b8e2f2', 0.012); // Realistic distance atmospheric haze

    // 2. Camera Setup (Wide Cinematic Angle)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 250);
    camera.position.set(0, 2.2, 11);
    camera.lookAt(0, 0.8, -10);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Procedural Sky Dome Gradient (Azure Blue -> Horizon Warmth)
    const skyGeo = new THREE.SphereGeometry(180, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color('#1e88e5') },
        bottomColor: { value: new THREE.Color('#d4eaf7') },
        offset: { value: 10 },
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

    // 5. Sun & Global Illumination Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8e7, 3.2);
    sunLight.position.set(-30, 45, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    const d = 40;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x78c0e0, 0x4d7c0f, 1.1);
    scene.add(hemiLight);

    // 6. 3D Procedural Rolling Hills Terrain Mesh
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 128, 128);
    terrainGeo.rotateX(-Math.PI / 2);

    // Rolling Hills Height Function
    const getTerrainHeight = (x: number, z: number) => {
      const h1 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 3.5;
      const h2 = Math.sin(x * 0.09 + 1.2) * Math.sin(z * 0.08 + 0.8) * 1.5;
      const h3 = Math.cos(x * 0.02) * Math.sin(z * 0.03) * 5.0;
      return h1 + h2 + h3 - 2.5;
    };

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      posAttr.setY(i, getTerrainHeight(x, z));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4c8c2b'),
      roughness: 0.85,
      metalness: 0.05,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 7. AAA Photorealistic 3D Trees with High-Res Leaf-Branch Alpha Sprites & Smooth Shading
    const treeGroup = new THREE.Group();

    // Procedural Leaf Branch Canvas Texture Map
    const createLeafTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 256, 256);
      const colors = ['#388e3c', '#4caf50', '#76ff03', '#2e7d32', '#1b5e20', '#aeea00'];

      // Draw 40 detailed overlapping leaves with veins and soft edges
      for (let i = 0; i < 42; i++) {
        const lx = 128 + (Math.random() - 0.5) * 170;
        const ly = 128 + (Math.random() - 0.5) * 170;
        const rx = 12 + Math.random() * 20;
        const ry = 22 + Math.random() * 30;
        const rot = Math.random() * Math.PI * 2;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -ry * 0.8);
        ctx.lineTo(0, ry * 0.8);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const leafTex = createLeafTexture();

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719,
      roughness: 0.88,
      metalness: 0.05,
    });

    const leafMat = new THREE.MeshStandardMaterial({
      map: leafTex,
      transparent: true,
      alphaTest: 0.2,
      side: THREE.DoubleSide,
      roughness: 0.45,
      metalness: 0.04,
    });

    // Smooth High-Poly Branch Plane Geometry
    const branchGeo = new THREE.PlaneGeometry(3.2, 3.2);

    const createHyperRealisticTree = (tx: number, tz: number, scale = 1) => {
      const tree = new THREE.Group();
      const ty = getTerrainHeight(tx, tz);
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(scale);

      // Smooth Tapered Wood Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.48, 4.2, 12);
      trunkGeo.translate(0, 2.1, 0);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.castShadow = true;
      tree.add(trunk);

      // Secondary Wood Branches
      const b1Geo = new THREE.CylinderGeometry(0.08, 0.18, 2.4, 8);
      b1Geo.rotateZ(-0.5);
      b1Geo.translate(-0.7, 3.2, 0);
      const b1 = new THREE.Mesh(b1Geo, trunkMat);
      b1.castShadow = true;
      tree.add(b1);

      const b2Geo = new THREE.CylinderGeometry(0.07, 0.16, 2.2, 8);
      b2Geo.rotateZ(0.48);
      b2Geo.translate(0.6, 3.4, 0.2);
      const b2 = new THREE.Mesh(b2Geo, trunkMat);
      b2.castShadow = true;
      tree.add(b2);

      // Dense Intersecting Leaf-Branch Planes (22 Planes forming realistic billowing canopy)
      const leafCluster = new THREE.Group();
      leafCluster.position.set(0, 4.2, 0);

      for (let i = 0; i < 22; i++) {
        const leafMesh = new THREE.Mesh(branchGeo, leafMat);
        const rx = (Math.random() - 0.5) * 1.8;
        const ry = (Math.random() - 0.5) * 1.8;
        const rz = (Math.random() - 0.5) * 1.8;
        leafMesh.position.set(rx, ry, rz);

        leafMesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        leafMesh.scale.setScalar(0.85 + Math.random() * 0.5);
        leafMesh.castShadow = true;
        leafMesh.receiveShadow = true;
        leafCluster.add(leafMesh);
      }
      tree.add(leafCluster);

      return tree;
    };

    // Scatter 48 Photorealistic Trees along rolling hill ridges
    const treesList: THREE.Group[] = [];
    for (let i = 0; i < 48; i++) {
      const tx = (Math.random() - 0.5) * 130;
      const tz = -16 - Math.random() * 65;
      const scale = 0.9 + Math.random() * 1.2;
      const tree = createHyperRealisticTree(tx, tz, scale);
      treeGroup.add(tree);
      treesList.push(tree);
    }
    scene.add(treeGroup);

    // 8. 100% 3D Instanced Curved Grass Meadow (200,000 Blades)
    const BLADE_COUNT = 200000;

    const bladeWidth = 0.012;
    const bladeHeight = 0.65;
    const bladeGeo = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, 5);
    bladeGeo.translate(0, bladeHeight / 2, 0);

    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yRatio = pos.getY(i) / bladeHeight;
      const zCurve = Math.pow(yRatio, 2) * 0.1;
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
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, BLADE_COUNT);
    grassMesh.castShadow = true;
    grassMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const bladeData: { x: number; y: number; z: number; rotY: number; scaleY: number; currentBendX: number; currentBendZ: number }[] = [];

    // Distribute 200,000 blades across 3D terrain
    for (let i = 0; i < BLADE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = Math.random() * 32 - 16;
      const y = getTerrainHeight(x, z);

      const rotY = Math.random() * Math.PI;
      const scaleY = 0.6 + Math.random() * 0.6;

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

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera Smooth Parallax Easing
      if (mouse.x !== -999) {
        camera.position.x += (mouse.x * 3.0 - camera.position.x) * 0.03;
        camera.position.y += (2.2 + mouse.y * 1.0 - camera.position.y) * 0.03;
        camera.lookAt(0, 0.8, -10);
      }

      // Gentle Organic Tree Sway in Wind
      treesList.forEach((tree, idx) => {
        const swayTime = time * 1.4 + idx * 0.7;
        tree.rotation.z = Math.sin(swayTime) * 0.025;
        tree.rotation.x = Math.cos(swayTime * 0.8) * 0.015;
      });

      // Wind & Cursor Hover Physics
      const DISPLACEMENT_RADIUS = 4.5;
      const BEND_FORCE = 0.95;

      for (let i = 0; i < BLADE_COUNT; i++) {
        const b = bladeData[i];

        // Skip distant blades optimization
        if (b.z < -10) continue;

        const windX = Math.sin(time * 2.2 + b.x * 0.5 + b.z * 0.3) * 0.15;
        const windZ = Math.cos(time * 1.8 + b.x * 0.3 + b.z * 0.5) * 0.15;

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
            Generating 100% 3D Hyper-Realistic Environment...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </section>
  );
}
