'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

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

    // 1. 3D Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0f1d');
    scene.fog = new THREE.FogExp2('#0a0f1d', 0.012);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(0, 8, 22);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Dusk/Golden-Hour Sky Dome Shader
    const skyGeo = new THREE.SphereGeometry(300, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color('#090d16') },
        midColor: { value: new THREE.Color('#1e293b') },
        bottomColor: { value: new THREE.Color('#d97706') }, // Sunset golden glow
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
        uniform vec3 midColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, 10.0, 0.0)).y;
          vec3 col = mix(bottomColor, midColor, max(pow(max(h, 0.0), 0.6), 0.0));
          col = mix(col, topColor, max(pow(max(h, 0.0), 1.8), 0.0));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    // 5. Architectural Lights
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfebd69, 2.8);
    sunLight.position.set(-45, 30, -25);
    sunLight.castShadow = !isMobile;
    if (!isMobile) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
    }
    scene.add(sunLight);

    const interiorGlow = new THREE.PointLight(0xfbbf24, 4.5, 35);
    interiorGlow.position.set(0, 4, 0);
    scene.add(interiorGlow);

    // 6. Architectural Estate Pavilion Structure
    const buildingGroup = new THREE.Group();

    // Polished Concrete Podium / Foundation
    const podiumGeo = new THREE.BoxGeometry(32, 0.8, 24);
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.1 });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = -0.4;
    podium.receiveShadow = true;
    buildingGroup.add(podium);

    // Floor-to-Ceiling Tinted Glass Core
    const glassGeo = new THREE.BoxGeometry(22, 6, 14);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 1.2,
      transparent: true,
      opacity: 0.9,
    });
    const glassBuilding = new THREE.Mesh(glassGeo, glassMat);
    glassBuilding.position.y = 3;
    buildingGroup.add(glassBuilding);

    // Cantilevered Upper Architectural Roof Slab
    const roofGeo = new THREE.BoxGeometry(26, 0.6, 18);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.2, metalness: 0.7 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 6.3;
    roof.castShadow = true;
    buildingGroup.add(roof);

    // Structural Obsidian Steel Beams
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3, metalness: 0.9 });
    const beamPositions = [
      [-10.8, 3, -6.8], [10.8, 3, -6.8], [-10.8, 3, 6.8], [10.8, 3, 6.8]
    ];
    beamPositions.forEach(([bx, by, bz]) => {
      const beamGeo = new THREE.BoxGeometry(0.5, 6, 0.5);
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(bx, by, bz);
      beam.castShadow = true;
      buildingGroup.add(beam);
    });

    // Interior Warm Architectural Floor & Furniture Accents
    const intFloorGeo = new THREE.BoxGeometry(21.6, 0.1, 13.6);
    const intFloorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 }); // Warm teak wood
    const intFloor = new THREE.Mesh(intFloorGeo, intFloorMat);
    intFloor.position.y = 0.05;
    buildingGroup.add(intFloor);

    // Infinity Reflective Water Pool Terrace
    const poolGeo = new THREE.PlaneGeometry(28, 8);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.02, 10);
    buildingGroup.add(pool);

    // Manicured Surrounding Hedges & Lawns
    const lawnGeo = new THREE.PlaneGeometry(160, 160);
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x0f381e, roughness: 0.85 });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = -0.41;
    lawn.receiveShadow = true;
    scene.add(lawn);

    scene.add(buildingGroup);

    setIsLoaded(true);

    // 7. Non-Interactive Smooth Flyby Cinematic Camera Motion
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime() * 0.15;

      // Smooth slow orbit around the architectural pavilion
      camera.position.x = Math.sin(t) * 26;
      camera.position.z = Math.cos(t) * 26;
      camera.position.y = 7.5 + Math.sin(t * 1.5) * 1.5;
      camera.lookAt(0, 3, 0);

      // Subtle water ripple reflection effect
      poolMat.roughness = 0.08 + Math.sin(t * 8) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
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
      height: 'clamp(550px, 68vw, 820px)',
      backgroundColor: '#0a0f1d',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
    }}>
      {/* Non-Interactive 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Dark Ambient Overlay Gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(10, 15, 29, 0.95) 0%, rgba(10, 15, 29, 0.3) 50%, rgba(10, 15, 29, 0.7) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Premium Hero Content Overlay */}
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
      }}>
        {/* Category Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1.1rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#fef08a',
          marginBottom: '1.5rem',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#eab308' }} />
          PropTech & Real Estate Infrastructure
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          maxWidth: '1050px',
          marginBottom: '1.25rem',
          color: '#ffffff',
          textShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>
          Architecting Next-Gen Smart Cities & High-Yield Commercial Assets
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'rgba(241, 245, 249, 0.88)',
          fontWeight: 300,
          maxWidth: '750px',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
        }}>
          Zawr Industries engineers intelligent real estate developments, sustainable commercial complexes, and AI-enabled PropTech platforms across India, UAE, and global growth corridors.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center' }}>
          <Link
            href="/contact/partner"
            style={{
              padding: '0.9rem 2.2rem',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            Explore Development Projects
          </Link>
          <Link
            href="/investors"
            style={{
              padding: '0.9rem 2.2rem',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 500,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            Investor & Partner Relations
          </Link>
        </div>
      </div>

      {/* Loading Fallback */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#0a0f1d',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#f59e0b',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </section>
  );
}
