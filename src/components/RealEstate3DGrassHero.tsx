'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

// Cache organic leaf foliage texture for foreground framing trees
let cachedFoliageTexture: THREE.CanvasTexture | null = null;
const getCachedFoliageTexture = (): THREE.CanvasTexture | null => {
  if (cachedFoliageTexture) return cachedFoliageTexture;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 512);

  // Organic branch twigs
  ctx.beginPath();
  ctx.moveTo(256, 512);
  ctx.quadraticCurveTo(240, 300, 180, 100);
  ctx.moveTo(230, 320);
  ctx.quadraticCurveTo(320, 200, 380, 80);
  ctx.strokeStyle = '#1e140d';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Dense natural leaf cluster distribution
  const leafColors = ['#1e3a1e', '#2d4a2d', '#1b331b', '#355935', '#436b43', '#162b16'];
  for (let i = 0; i < 1400; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.5) * 230;
    const lx = 256 + Math.cos(angle) * dist * 1.1;
    const ly = 240 + Math.sin(angle) * dist * 0.95;

    const rx = 4.0 + Math.random() * 6.5;
    const ry = 8.0 + Math.random() * 14.0;
    const rot = (Math.random() - 0.5) * Math.PI;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = leafColors[i % leafColors.length];
    ctx.globalAlpha = 0.88 + Math.random() * 0.12;
    ctx.fill();

    ctx.restore();
  }

  cachedFoliageTexture = new THREE.CanvasTexture(canvas);
  cachedFoliageTexture.colorSpace = THREE.SRGBColorSpace;
  return cachedFoliageTexture;
};

export default function RealEstate3DGrassHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animationFrameId: number;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const isMobile = width < 768 || (typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent));
    const pixelRatio = isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5);

    // 1. 3D Scene & Realistic Mountain Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#c2ccc0'); // Soft overcast mountain haze sky
    scene.fog = new THREE.FogExp2('#b8c5b5', 0.0035);

    // 2. Camera Setup (Elevated mountain outlook viewpoint)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 800);
    camera.position.set(0, 32, 140);
    camera.lookAt(0, 18, -120);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Soft Overcast Atmospheric Sky Dome Shader
    const skyGeo = new THREE.SphereGeometry(600, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color('#a8b6a3') },
        bottomColor: { value: new THREE.Color('#d2ded0') },
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
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, 50.0, 0.0)).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), 0.7), 0.0)), 1.0);
        }
      `,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    // 5. Natural Soft Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xdce5da, 1.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbe8, 2.4);
    sunLight.position.set(-60, 120, -40);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8fa38b, 0.8);
    fillLight.position.set(60, 40, 80);
    scene.add(fillLight);

    // 6. Layered Realistic 3D Forested Mountain Range
    const createMountainRidge = (
      widthSpan: number,
      depthSpan: number,
      segments: number,
      heightScale: number,
      posZ: number,
      posY: number,
      colorHex: string
    ) => {
      const geo = new THREE.PlaneGeometry(widthSpan, depthSpan, segments, segments);
      geo.rotateX(-Math.PI / 2);

      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);

        // Multi-octave natural terrain elevation noise
        const n1 = Math.sin(x * 0.012 + posZ * 0.05) * Math.cos(z * 0.015) * heightScale;
        const n2 = Math.sin(x * 0.028 + 1.5) * Math.sin(z * 0.032 + 0.8) * (heightScale * 0.45);
        const n3 = Math.cos(x * 0.06) * Math.sin(z * 0.05) * (heightScale * 0.15);
        const valleyDip = Math.pow(Math.sin((x / widthSpan) * Math.PI), 2) * (heightScale * 0.35);

        pos.setY(i, n1 + n2 + n3 - valleyDip);
      }
      geo.computeVertexNormals();

      // Procedural Dense Forest Canopy Shader (renders micro tree canopy texture across entire mountain)
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uBaseColor: { value: new THREE.Color(colorHex) },
          uShadowColor: { value: new THREE.Color('#0d1c0d') },
          uSunColor: { value: new THREE.Color('#466840') },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uBaseColor;
          uniform vec3 uShadowColor;
          uniform vec3 uSunColor;
          varying vec3 vNormal;
          varying vec3 vWorldPos;

          // Perlin-like procedural leaf micro noise
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main() {
            vec3 lightDir = normalize(vec3(-0.4, 0.85, -0.3));
            float diff = max(dot(vNormal, lightDir), 0.0);

            // Procedural foliage micro texture
            float fNoise = noise(vWorldPos.xz * 0.45) * 0.35 + noise(vWorldPos.xz * 1.2) * 0.15;
            vec3 col = mix(uShadowColor, uBaseColor, diff * 0.8 + 0.2);
            col = mix(col, uSunColor, fNoise * diff);

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, posY, posZ);
      return mesh;
    };

    // Layer 1: Foreground Valley Slopes
    const valleyFront = createMountainRidge(320, 140, 90, 28, -20, -12, '#233d23');
    scene.add(valleyFront);

    // Layer 2: Midground Rolling Forest Hills
    const midHills = createMountainRidge(420, 220, 90, 48, -140, 8, '#1e361e');
    scene.add(midHills);

    // Layer 3: Distant Mountain Ridges
    const backMountains = createMountainRidge(560, 300, 70, 75, -310, 28, '#1b301b');
    scene.add(backMountains);

    // Layer 4: Far Background Silhouette Horizons
    const farHorizons = createMountainRidge(720, 360, 50, 110, -520, 50, '#192b19');
    scene.add(farHorizons);

    // 7. Foreground Cinematic Tree Framing (Exact match to reference screenshot)
    const foliageTex = getCachedFoliageTexture();
    if (foliageTex) {
      const foliageMat = new THREE.MeshStandardMaterial({
        map: foliageTex,
        transparent: true,
        alphaTest: 0.15,
        side: THREE.DoubleSide,
        roughness: 0.8,
      });

      const treeGeo = new THREE.PlaneGeometry(36, 42);

      // Left Foreground Tree Cluster
      const leftTree = new THREE.Mesh(treeGeo, foliageMat);
      leftTree.position.set(-42, 28, 95);
      leftTree.rotation.y = 0.35;
      scene.add(leftTree);

      // Right Foreground Tree Cluster
      const rightTree = new THREE.Mesh(treeGeo, foliageMat);
      rightTree.position.set(44, 26, 92);
      rightTree.rotation.y = -0.42;
      scene.add(rightTree);
    }

    setIsLoaded(true);

    // 8. Non-Interactive Ultra-Smooth Slow Camera Glide
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime() * 0.08;

      // Gentle continuous forward movement over mountain valley
      camera.position.z = 140 - Math.sin(t) * 12;
      camera.position.x = Math.cos(t * 0.7) * 4;
      camera.position.y = 32 + Math.sin(t * 1.2) * 1.8;
      camera.lookAt(0, 18, -120);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
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
      height: 'clamp(580px, 72vw, 880px)',
      backgroundColor: '#c2ccc0',
      overflow: 'hidden',
      fontFamily: "'Playfair Display', Georgia, serif",
      color: '#ffffff',
    }}>
      {/* Non-Interactive 3D WebGL Mountain Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Soft Overcast Mist Vignette Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(15, 25, 15, 0.35) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Ultra-Luxury Serif Typography Overlay (Matching Screenshot Exactly) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 5%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {/* Main Serif Headline */}
        <h1 style={{
          fontSize: 'clamp(2.6rem, 6.2vw, 5.2rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          color: '#ffffff',
          textShadow: '0 4px 30px rgba(0, 0, 0, 0.45)',
          maxWidth: '900px',
          marginBottom: '2rem',
        }}>
          A Mountain Home <br />
          For <span style={{ fontStyle: 'italic', fontWeight: 300 }}>All</span> Seasons
        </h1>

        {/* Scroll Subtitle Indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.95)',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        }}>
          <span>Scroll To Explore</span>
          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            animation: 'pulseHeight 2s ease-in-out infinite',
          }} />
        </div>
        <style>{`
          @keyframes pulseHeight {
            0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
            50% { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
      </div>

      {/* Loading Overlay */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#c2ccc0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(0,0,0,0.1)',
            borderTopColor: '#2e4d2e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </section>
  );
}
