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
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup — Centered on Base (X = 0), Straight Stance, Increased Size
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    const targetLookAt = new THREE.Vector3(0, 0.25, 0);
    const baseDistance = 4.4;

    const updateCameraFraming = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 1.0) {
        // Mobile / narrow viewports: smoothly back up to keep full arm in view without horizontal crop
        const factor = Math.max(1.0, (1.25 / aspect) * 0.85);
        camera.position.set(0, 0.35, baseDistance * factor);
      } else {
        camera.position.set(0, 0.35, baseDistance);
      }
      camera.lookAt(targetLookAt);
      camera.updateProjectionMatrix();
    };

    updateCameraFraming(width, height);

    // 3. Renderer Setup with ACES Filmic Tone Mapping and Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Generate Studio Environment Map for Titanium & Metallic Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 5. Studio Direct Lighting
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f2fe, 1.4);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xff8844, 0.7);
    fillLight.position.set(0, 2, 4);
    scene.add(fillLight);

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x181c24, 0.65);
    scene.add(ambientLight);

    // Floor shadow receiver plane positioned directly under the base cylinder
    const modelYOffset = -0.90;
    const shadowPlaneGeo = new THREE.PlaneGeometry(10, 10);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, modelYOffset, 0);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Kinematics State & Joint Definitions
    const jointAxes = [
      new THREE.Vector3(0, 0, 1), // A1: Base Carousel Yaw
      new THREE.Vector3(0, 1, 0), // A2: Shoulder Pitch
      new THREE.Vector3(0, 0, 1), // A3: Elbow Pitch
      new THREE.Vector3(0, 0, 1), // A4: Forearm Roll
      new THREE.Vector3(0, 0, 1), // A5: Wrist Pitch
      new THREE.Vector3(0, 1, 0), // A6: Tool Flange Spin
    ];

    let jointNodes: THREE.Object3D[] = [];
    let initialQuaternions: THREE.Quaternion[] = [];
    const currentAngles = [0, 0, 0, 0, 0, 0];
    const targetAngles = [0, 0, 0, 0, 0, 0];
    const damping = 0.045; // Industrial mass inertia damping factor
    let isLoaded = false;

    // Model group centered dead-center at X = 0, Z = 0
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, modelYOffset, 0);
    modelGroup.rotation.y = -0.35; // Slight -20° front-angle in rest for 3D showroom perspective
    scene.add(modelGroup);

    // 7. Load Comau N-220-27 GLB Model and Prime Kinematic Hierarchy
    const loader = new GLTFLoader();
    loader.load(
      '/assets/comau_n220_27.glb',
      (gltf) => {
        const loadedModel = gltf.scene;

        // Enable shadows
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Set model scale for increased, prominent 3D presence
        const scale = 1.05;
        loadedModel.scale.set(scale, scale, scale);

        // Update world matrices before parenting
        loadedModel.updateMatrixWorld(true);

        // Retrieve joint nodes
        const l1 = loadedModel.getObjectByName('link_1');
        const l2 = loadedModel.getObjectByName('link_2');
        const l3 = loadedModel.getObjectByName('link_3');
        const l4 = loadedModel.getObjectByName('link_4');
        const l5 = loadedModel.getObjectByName('link_5');
        const l6 = loadedModel.getObjectByName('link_6');

        if (!l1 || !l2 || !l3 || !l4 || !l5 || !l6) {
          console.error('[Robot3D] Missing link nodes in GLTF hierarchy');
          setLoading(false);
          return;
        }

        // Re-parent into forward kinematic parent-child chain
        l1.attach(l2);
        l2.attach(l3);
        l3.attach(l4);
        l4.attach(l5);
        l5.attach(l6);

        loadedModel.updateMatrixWorld(true);

        // Cache rest quaternions immediately for delta joint rotations
        jointNodes = [l1, l2, l3, l4, l5, l6];
        initialQuaternions = jointNodes.map((node) => node.quaternion.clone());

        modelGroup.add(loadedModel);
        isLoaded = true;
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[Robot3D] Error loading Comau GLB:', err);
        setLoading(false);
      }
    );

    // 8. Normalized Cursor & Touch Tracking (Centered directly on the 3D Stage)
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetMouse.x = Math.max(-1.2, Math.min(1.2, (e.clientX - centerX) / (rect.width / 2)));
      targetMouse.y = Math.max(-1.2, Math.min(1.2, -(e.clientY - centerY) / (rect.height / 2)));
    };

    const handleMouseLeave = () => {
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetMouse.x = Math.max(-1.2, Math.min(1.2, (e.touches[0].clientX - centerX) / (rect.width / 2)));
      targetMouse.y = Math.max(-1.2, Math.min(1.2, -(e.touches[0].clientY - centerY) / (rect.height / 2)));
    };

    const handleTouchEnd = () => {
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 9. Animation & Kinematics Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth mouse coordinate lerping with mass inertia
      mouse.x += (targetMouse.x - mouse.x) * damping;
      mouse.y += (targetMouse.y - mouse.y) * damping;

      // Base group turns smoothly around centered base cylinder to track cursor horizontally
      modelGroup.rotation.y = -0.35 + mouse.x * 0.45;

      if (isLoaded && jointNodes.length === 6) {
        const timeSeconds = clock.getElapsedTime();

        // Rest / Breathing micro-oscillation when idle
        const breathing = Math.sin(timeSeconds * 1.5) * 1.2;

        // Kinematic joint angles follow pointer naturally
        targetAngles[0] = mouse.x * 25.0;                                      // A1 Base Carousel
        targetAngles[1] = -mouse.y * 14.0 + breathing;                        // A2 Shoulder Pitch
        targetAngles[2] = mouse.y * 18.0;                                     // A3 Elbow Pitch
        targetAngles[3] = mouse.x * 12.0;                                     // A4 Forearm Roll
        targetAngles[4] = -mouse.y * 22.0;                                    // A5 Wrist Pitch
        targetAngles[5] = mouse.x * 20.0 + Math.sin(timeSeconds * 0.8) * 8.0; // A6 Flange Spin

        // Interpolate current angles to target angles & apply delta quaternions
        for (let i = 0; i < 6; i++) {
          currentAngles[i] += (targetAngles[i] - currentAngles[i]) * damping;

          const qDelta = new THREE.Quaternion().setFromAxisAngle(
            jointAxes[i],
            THREE.MathUtils.degToRad(currentAngles[i])
          );
          jointNodes[i].quaternion.copy(initialQuaternions[i]).multiply(qDelta);
        }

        modelGroup.updateMatrixWorld(true);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Listener
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      updateCameraFraming(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      pmremGenerator.dispose();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

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
        <div
          style={{
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
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e2e8f0',
              borderTop: '3px solid #000000',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '0.8rem',
            }}
          />
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            LOADING 3D ROBOT...
          </span>
        </div>
      )}
    </div>
  );
}
