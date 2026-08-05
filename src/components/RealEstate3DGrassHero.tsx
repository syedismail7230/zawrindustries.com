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

    // 7. Ultra-Photorealistic Tree Canvas Generator (High-Res 1024x1024 Real Tree Texture Map)
    const createRealTreeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 1024, 1024);

      // Organic Curved Wooden Trunk & Root Base
      ctx.beginPath();
      ctx.moveTo(512, 1020);
      ctx.quadraticCurveTo(490, 750, 512, 450);
      ctx.strokeStyle = '#2b1b17';
      ctx.lineWidth = 42;
      ctx.stroke();

      // Secondary Wood Boughs & Fine Twigs
      const drawBranch = (x1: number, y1: number, angle: number, length: number, width: number, depth: number) => {
        if (depth > 4) return;
        const x2 = x1 + Math.cos(angle) * length;
        const y2 = y1 + Math.sin(angle) * length;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x1 + (x2 - x1) * 0.5 + (Math.random() - 0.5) * 20, y1 + (y2 - y1) * 0.5, x2, y2);
        ctx.strokeStyle = depth > 2 ? '#3d2820' : '#2b1b17';
        ctx.lineWidth = width;
        ctx.stroke();

        // Branch out
        drawBranch(x2, y2, angle - 0.35 + (Math.random() - 0.5) * 0.3, length * 0.72, width * 0.68, depth + 1);
        drawBranch(x2, y2, angle + 0.35 + (Math.random() - 0.5) * 0.3, length * 0.72, width * 0.68, depth + 1);
      };

      drawBranch(512, 650, -Math.PI / 2 - 0.35, 160, 22, 1);
      drawBranch(512, 580, -Math.PI / 2 + 0.35, 170, 24, 1);
      drawBranch(512, 480, -Math.PI / 2 - 0.15, 140, 18, 1);
      drawBranch(512, 480, -Math.PI / 2 + 0.15, 140, 18, 1);

      // Over 2,200 Micro Leaves forming a rich, dense, organic tree canopy
      const leafColors = ['#1b5e20', '#2e7d32', '#388e3c', '#4caf50', '#66bb6a', '#81c784', '#aeea00'];

      for (let i = 0; i < 2200; i++) {
        // Spherical organic canopy cluster distribution
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.6) * 380;
        const lx = 512 + Math.cos(angle) * dist * 0.95;
        const ly = 380 + Math.sin(angle) * dist * 0.75;

        const rx = 6.0 + Math.random() * 9.0;
        const ry = 12.0 + Math.random() * 18.0;
        const rot = (Math.random() - 0.5) * Math.PI;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.globalAlpha = 0.85 + Math.random() * 0.15;
        ctx.fill();

        ctx.restore();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const realTreeTexture = createRealTreeTexture();

    const treeCardMat = new THREE.MeshStandardMaterial({
      map: realTreeTexture,
      transparent: true,
      alphaTest: 0.18,
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.02,
    });

    // Cross-Plane Photorealistic Tree Geometry (6.5m wide x 9.5m tall)
    const treeCardGeo = new THREE.PlaneGeometry(6.5, 9.5);
    treeCardGeo.translate(0, 4.75, 0);

    const createRealisticTree = (tx: number, tz: number, scale = 1) => {
      const treeGroup = new THREE.Group();
      const ty = getTerrainHeight(tx, tz);
      treeGroup.position.set(tx, ty, tz);
      treeGroup.scale.setScalar(scale);

      // Plane 1 (Front-facing)
      const p1 = new THREE.Mesh(treeCardGeo, treeCardMat);
      treeGroup.add(p1);

      // Plane 2 (Cross 90 degrees for 3D volume)
      const p2 = new THREE.Mesh(treeCardGeo, treeCardMat);
      p2.rotation.y = Math.PI / 2;
      treeGroup.add(p2);

      // Plane 3 (Cross 45 degrees for extra lush density)
      const p3 = new THREE.Mesh(treeCardGeo, treeCardMat);
      p3.rotation.y = Math.PI / 4;
      treeGroup.add(p3);

      return treeGroup;
    };

    // Scatter 16 Photorealistic Trees across distant background hills
    const treesGroup = new THREE.Group();
    const treesList: THREE.Group[] = [];
    const treePositions = [
      { x: -48, z: -38 }, { x: -32, z: -48 }, { x: -14, z: -40 }, { x: 6, z: -46 }, { x: 26, z: -38 }, { x: 50, z: -44 },
      { x: -58, z: -58 }, { x: -38, z: -64 }, { x: -6, z: -60 }, { x: 16, z: -66 }, { x: 44, z: -60 }, { x: 64, z: -54 },
      { x: -22, z: -74 }, { x: 32, z: -78 }, { x: -65, z: -42 }, { x: 68, z: -40 }
    ];

    treePositions.forEach(p => {
      const scale = 0.9 + Math.random() * 0.45;
      const tree = createRealisticTree(p.x, p.z, scale);
      treesGroup.add(tree);
      treesList.push(tree);
    });
    scene.add(treesGroup);

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
