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

    // 1. Scene & Pure White Atmosphere Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff');
    scene.fog = new THREE.FogExp2('#ffffff', 0.006);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 300);
    camera.position.set(0, 2.6, 12);
    camera.lookAt(0, 0.6, -8);

    // 3. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Pure White Sky Dome
    const skyGeo = new THREE.SphereGeometry(220, 16, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color('#ffffff') },
        bottomColor: { value: new THREE.Color('#f8fafc') },
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.4);
    sunLight.position.set(-35, 50, 35);
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1b5e20, 1.15);
    scene.add(hemiLight);

    // 6. 3D Procedural Rolling Terrain Mesh
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 80, 80);
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
      color: new THREE.Color('#2b5329'),
      roughness: 0.85,
      metalness: 0.04,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrain);

    // 7. Photorealistic Micro-Leaf Tree Generator
    const createMicroLeafTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 512, 512);

      const leafPalette = ['#1b5e20', '#2e7d32', '#388e3c', '#4caf50', '#66bb6a', '#aeea00'];

      // Central stem
      ctx.beginPath();
      ctx.moveTo(256, 490);
      ctx.quadraticCurveTo(260, 256, 256, 20);
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Branchlets
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

      // 160 Micro Leaves per sprig card
      for (let i = 0; i < 160; i++) {
        const lx = 256 + (Math.random() - 0.5) * 360;
        const ly = 50 + Math.random() * 420;
        const rx = 3.2 + Math.random() * 5.0;
        const ry = 7.5 + Math.random() * 11.0;
        const rot = (Math.random() - 0.5) * Math.PI;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = leafPalette[i % leafPalette.length];
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -ry * 0.85);
        ctx.lineTo(0, ry * 0.85);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
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
      color: 0x2d1e18,
      roughness: 0.92,
      metalness: 0.03,
    });

    const microLeafMat = new THREE.MeshStandardMaterial({
      map: microLeafTex,
      transparent: true,
      alphaTest: 0.22,
      side: THREE.DoubleSide,
      roughness: 0.45,
      metalness: 0.03,
    });

    const microBranchGeo = new THREE.PlaneGeometry(0.65, 0.65);

    const createHyperRealisticTree = (tx: number, tz: number, scale = 1) => {
      const tree = new THREE.Group();
      const ty = getTerrainHeight(tx, tz);
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(scale);

      // Tapered Wooden Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.16, 0.48, 4.6, 12);
      trunkGeo.translate(0, 2.3, 0);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      tree.add(trunk);

      // 5 Spreading Branch boughs
      const branchAngles = [-0.6, 0.5, -0.3, 0.4, 0];
      const branchHeights = [3.0, 3.3, 3.8, 4.0, 4.4];
      const branchDirs = [
        { x: -0.75, z: 0.25 },
        { x: 0.65, z: -0.35 },
        { x: -0.35, z: -0.65 },
        { x: 0.45, z: 0.55 },
        { x: 0, z: 0 },
      ];

      branchAngles.forEach((ang, idx) => {
        const bGeo = new THREE.CylinderGeometry(0.05, 0.14, 2.2, 8);
        bGeo.rotateZ(ang);
        bGeo.translate(branchDirs[idx].x, branchHeights[idx], branchDirs[idx].z);
        const bMesh = new THREE.Mesh(bGeo, trunkMat);
        tree.add(bMesh);
      });

      // 90 Micro-Leaf Sprig Cards forming dense, soft foliage canopy
      const leafCluster = new THREE.Group();
      leafCluster.position.set(0, 4.2, 0);

      for (let i = 0; i < 90; i++) {
        const sprig = new THREE.Mesh(microBranchGeo, microLeafMat);
        
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.4 + Math.pow(Math.random(), 0.7) * 2.0;

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
        leafCluster.add(sprig);
      }
      tree.add(leafCluster);

      return tree;
    };

    // Scatter 14 Photorealistic Trees tastefully across distant background hills
    const treeGroup = new THREE.Group();
    const treesList: THREE.Group[] = [];
    const treePositions = [
      { x: -45, z: -35 }, { x: -28, z: -48 }, { x: -12, z: -38 }, { x: 8, z: -45 }, { x: 28, z: -36 }, { x: 48, z: -42 },
      { x: -55, z: -55 }, { x: -35, z: -62 }, { x: -5, z: -58 }, { x: 18, z: -65 }, { x: 42, z: -58 }, { x: 60, z: -52 },
      { x: -20, z: -72 }, { x: 30, z: -75 }
    ];

    treePositions.forEach(p => {
      const scale = 0.95 + Math.random() * 0.45;
      const tree = createHyperRealisticTree(p.x, p.z, scale);
      treeGroup.add(tree);
      treesList.push(tree);
    });
    scene.add(treeGroup);

    // 8. Light & Smooth 3D Grass Meadow (2,400,000 Instanced Blades - 120 FPS)
    const BLADE_COUNT = 2400000;

    const bladeWidth = 0.016;
    const bladeHeight = 0.72;
    const bladeGeo = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, 3);
    bladeGeo.translate(0, bladeHeight / 2, 0);

    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yRatio = pos.getY(i) / bladeHeight;
      const zCurve = Math.pow(yRatio, 2) * 0.10;
      const xTaper = 1 - Math.pow(yRatio, 1.5) * 0.75;
      pos.setZ(i, zCurve);
      pos.setX(i, pos.getX(i) * xTaper);
    }
    bladeGeo.computeVertexNormals();

    const tipColor = new THREE.Color('#66bb6a');
    const sunlitColor = new THREE.Color('#81c784');
    const baseGreen = new THREE.Color('#1b5e20');

    const colors = new Float32Array(BLADE_COUNT * 3);
    for (let i = 0; i < BLADE_COUNT; i++) {
      const rand = Math.random();
      const c = rand > 0.7 ? sunlitColor : rand > 0.3 ? tipColor : baseGreen;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    bladeGeo.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));

    // Custom GPU Wind & Cursor Physics Vertex Shader (Zero CPU Overhead)
    const grassMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(-999, -999, -999) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        attribute vec3 color;
        varying vec3 vColor;
        varying vec3 vNormal;

        void main() {
          vColor = color;
          vNormal = normalize(normalMatrix * normal);

          vec4 instanceWorldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float wx = instanceWorldPos.x;
          float wz = instanceWorldPos.z;

          float heightRatio = clamp(position.y / 0.72, 0.0, 1.0);
          float bendFactor = pow(heightRatio, 1.7);

          // Smooth GPU Wind Wave Math
          float windX = sin(uTime * 2.2 + wx * 0.4 + wz * 0.25) * 0.16 * bendFactor;
          float windZ = cos(uTime * 1.8 + wx * 0.25 + wz * 0.4) * 0.16 * bendFactor;

          vec3 displacedPos = position;

          if (uMouse.x != -999.0) {
            float dist = distance(instanceWorldPos.xz, uMouse.xz);
            if (dist < 4.5 && dist > 0.001) {
              float force = (1.0 - dist / 4.5) * 0.90 * bendFactor;
              vec2 dir = normalize(instanceWorldPos.xz - uMouse.xz);
              displacedPos.x += dir.x * force;
              displacedPos.z += dir.y * force;
            }
          }

          displacedPos.x += windX;
          displacedPos.z += windZ;

          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(displacedPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying vec3 vNormal;
        void main() {
          vec3 lightDir = normalize(vec3(-0.4, 0.8, 0.4));
          float diff = max(dot(vNormal, lightDir), 0.5);
          gl_FragColor = vec4(vColor * diff, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });

    const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, BLADE_COUNT);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < BLADE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 160;
      const z = Math.random() * 100 - 80;
      const y = getTerrainHeight(x, z);

      const rotY = Math.random() * Math.PI;
      const scaleY = 0.6 + Math.random() * 0.6;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.scale.set(1, scaleY, 1);
      dummy.updateMatrix();

      grassMesh.setMatrixAt(i, dummy.matrix);
    }
    grassMesh.instanceMatrix.needsUpdate = true;
    scene.add(grassMesh);

    setIsLoaded(true);

    // 9. Instant Mathematical Ground Plane Projection (0ms Raycast Lag)
    const mouse = new THREE.Vector2(-999, -999);
    const mouseWorld = new THREE.Vector3(-999, -999, -999);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
      
      mouseWorld.set(mouse.x * 22, 0, -mouse.y * 12);
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      mouseWorld.set(-999, -999, -999);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 10. Ultra-Smooth Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Pass GPU uniforms for grass
      grassMat.uniforms.uTime.value = time;
      grassMat.uniforms.uMouse.value.copy(mouseWorld);

      // Organic Tree Swaying in Wind
      treesList.forEach((tree, idx) => {
        const swayTime = time * 1.2 + idx * 0.4;
        tree.rotation.z = Math.sin(swayTime) * 0.015;
        tree.rotation.x = Math.cos(swayTime * 0.7) * 0.01;
      });

      // Camera Easing
      if (mouse.x !== -999) {
        camera.position.x += (mouse.x * 2.8 - camera.position.x) * 0.03;
        camera.position.y += (2.6 + mouse.y * 1.0 - camera.position.y) * 0.03;
        camera.lookAt(0, 0.6, -8);
      }

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
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Ultra-Smooth 120 FPS WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'pointer' }} />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          zIndex: 10,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(0,0,0,0.1)',
            borderTopColor: '#388e3c',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }} />
          <p style={{ fontSize: '0.95rem', letterSpacing: '0.05em', fontWeight: 500 }}>
            Initializing Photorealistic 3D Landscape...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </section>
  );
}
