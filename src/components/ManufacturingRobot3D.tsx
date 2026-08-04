'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function ManufacturingRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup (Clean White Studio Environment)
    const scene = new THREE.Scene();

    // 2. Camera Setup (Positioned for a compact, doubled-reduction 3D robot arm)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0.1, 6.2);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup with PMREM Environment Generator
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Generate Studio Environment Map for Metallic Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 5. Studio Direct Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
    fillLight.position.set(-6, 6, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    // 6. Load GLB Model (Doubled reduction scale factor 0.55)
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, -0.4, 0);
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb?v=7',
      (gltf) => {
        const loadedModel = gltf.scene;

        // Auto-center & scale model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        loadedModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.55 / maxDim; // Doubled size reduction (half of previous 1.1 scale)
        loadedModel.scale.set(scale, scale, scale);

        // Preserve intact materials & prevent pitch black silhouetting
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;

            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                  if (mat.color.r < 0.05 && mat.color.g < 0.05 && mat.color.b < 0.05) {
                    mat.color.setHex(0x2d323c); // Dark metallic charcoal
                  }
                  mat.roughness = 0.3;
                  mat.metalness = 0.8;
                  mat.envMapIntensity = 1.8;
                }
              });
            }
          }
        });

        modelGroup.add(loadedModel);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[GLB Load Error]', err);
        setLoading(false);
      }
    );

    // 7. Mouse & Touch Cursor Tracking (ONLY Mouse X drives horizontal Y-rotation)
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 8. Render Loop (Stationary Base, ONLY horizontal Y-axis rotation from mouse X)
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      mouse.lerp(targetMouse, 0.25);

      // Model base is fixed stationary at y = -0.4
      modelGroup.position.set(0, -0.4, 0);
      modelGroup.rotation.y = mouse.x * 0.45;
      modelGroup.rotation.x = 0;
      modelGroup.rotation.z = 0;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
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
      cancelAnimationFrame(animId);
      pmremGenerator.dispose();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'default',
        background: 'transparent',
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          zIndex: 40,
          color: '#000000',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #000000',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '0.8rem',
          }}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            LOADING 3D ROBOT...
          </span>
        </div>
      )}
    </div>
  );
}
