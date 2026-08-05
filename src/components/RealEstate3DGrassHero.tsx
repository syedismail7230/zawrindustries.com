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

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Pure White Sky Dome
    const skyGeo = new THREE.SphereGeometry(220, 32, 16);
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

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x388e3c, 1.15);
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
    scene.add(terrain);

    // 7. GPU-Accelerated 3D Grass Meadow (Silky Smooth 60 FPS, Zero CPU Lag)
    const BLADE_COUNT = 800000;

    const bladeWidth = 0.024;
    const bladeHeight = 0.78;
    const bladeGeo = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, 5);
    bladeGeo.translate(0, bladeHeight / 2, 0);

    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const yRatio = pos.getY(i) / bladeHeight;
      const zCurve = Math.pow(yRatio, 2) * 0.12;
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

    // Custom GPU Wind & Cursor Physics Vertex Shader
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

          // Get blade instance base position in world space
          vec4 instanceWorldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float wx = instanceWorldPos.x;
          float wz = instanceWorldPos.z;

          // Height bend ratio (0 at root, 1 at tip)
          float heightRatio = clamp(position.y / 0.78, 0.0, 1.0);
          float bendFactor = pow(heightRatio, 1.7);

          // GPU Wind Wave Oscillations (Silky Smooth)
          float windX = sin(uTime * 2.2 + wx * 0.4 + wz * 0.25) * 0.16 * bendFactor;
          float windZ = cos(uTime * 1.8 + wx * 0.25 + wz * 0.4) * 0.16 * bendFactor;

          vec3 displacedPos = position;

          // GPU Cursor Displacement Physics Force
          if (uMouse.x != -999.0) {
            float dist = distance(instanceWorldPos.xz, uMouse.xz);
            if (dist < 4.8 && dist > 0.001) {
              float force = (1.0 - dist / 4.8) * 0.92 * bendFactor;
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
      const x = (Math.random() - 0.5) * 170;
      const z = Math.random() * 105 - 85;
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

    // 8. Cursor Raycasting & Mouse Tracking
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

    // 9. Silky Smooth 60 FPS GPU Shader Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Update GPU Shader Uniforms (0 CPU Matrix overhead per frame!)
      grassMat.uniforms.uTime.value = time;
      grassMat.uniforms.uMouse.value.copy(mouseWorld);

      // Camera Parallax Easing
      if (mouse.x !== -999) {
        camera.position.x += (mouse.x * 3.2 - camera.position.x) * 0.03;
        camera.position.y += (2.6 + mouse.y * 1.1 - camera.position.y) * 0.03;
        camera.lookAt(0, 0.6, -8);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Handler
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
      {/* GPU-Accelerated 3D WebGL Canvas */}
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
            Initializing GPU-Accelerated 3D Grass Meadow...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </section>
  );
}
