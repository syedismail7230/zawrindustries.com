'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function IndustrialRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup (Transparent WebGL Canvas for Seamless Overlay)
    const scene = new THREE.Scene();

    // 2. Camera Setup (Centered Perspective facing Upward Arm)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 5.8);

    // 3. Renderer Setup with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
    mainLight.position.set(5, 12, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // 5. Load GLB Model
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, -1.2, 0); // Position at center bottom rising up
    scene.add(modelGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let clawPartsLeft: THREE.Object3D[] = [];
    let clawPartsRight: THREE.Object3D[] = [];
    let clawInitialPositionsLeft: THREE.Vector3[] = [];
    let clawInitialPositionsRight: THREE.Vector3[] = [];

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb',
      (gltf) => {
        const loadedModel = gltf.scene;

        // Auto-center & scale model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        loadedModel.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.2 / maxDim;
        loadedModel.scale.set(scale, scale, scale);

        // Classify mesh nodes for shadows & claw articulation
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness || 0.35, 0.4);
              mat.metalness = Math.max(mat.metalness || 0.7, 0.85);
            }

            const pos = mesh.position;
            if (mesh.name.includes('claw') || mesh.name.includes('finger') || mesh.name.includes('id2') || (pos.x > 0.4 && pos.y > 0.2)) {
              if (pos.z >= 0) {
                clawPartsLeft.push(mesh);
                clawInitialPositionsLeft.push(mesh.position.clone());
              } else {
                clawPartsRight.push(mesh);
                clawInitialPositionsRight.push(mesh.position.clone());
              }
            }
          }
        });

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(loadedModel);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.play();
          });
        }

        modelGroup.add(loadedModel);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[GLB Load Error]', err);
        setLoading(false);
      }
    );

    // 6. Cursor Tracking
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = container.getBoundingClientRect();
      targetMouse.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 7. Render Loop with Arm Pitching & Claw Articulation
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (mixer) {
        mixer.update(delta);
      }

      mouse.lerp(targetMouse, 0.08);

      // Centered Up/Down Arm Pitching & Yaw
      const targetArmHeight = -1.2 + mouse.y * 0.4 + Math.sin(elapsedTime * 1.5) * 0.1;
      const targetArmRotationY = mouse.x * 0.8 + Math.sin(elapsedTime * 0.5) * 0.15;

      modelGroup.rotation.y = targetArmRotationY;
      modelGroup.position.y = targetArmHeight;
      modelGroup.rotation.x = -mouse.y * 0.3; // Pitch up towards title when cursor moves up

      // Open/Close Claw Cycle
      const clawOpeningFactor = (Math.sin(elapsedTime * 2.2) + 1) / 2;

      clawPartsLeft.forEach((mesh, i) => {
        if (clawInitialPositionsLeft[i]) {
          const initPos = clawInitialPositionsLeft[i];
          mesh.position.z = initPos.z + clawOpeningFactor * 0.12;
          mesh.rotation.y = clawOpeningFactor * 0.25;
        }
      });

      clawPartsRight.forEach((mesh, i) => {
        if (clawInitialPositionsRight[i]) {
          const initPos = clawInitialPositionsRight[i];
          mesh.position.z = initPos.z - clawOpeningFactor * 0.12;
          mesh.rotation.y = -clawOpeningFactor * 0.25;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Listener
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
        cursor: 'crosshair',
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
