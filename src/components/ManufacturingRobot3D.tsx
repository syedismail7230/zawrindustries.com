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

    // 2. Camera Setup — Dead-center on Base (X = 0), Calibrated to Clear Header Text
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    const targetLookAt = new THREE.Vector3(0, 0.20, 0);
    const baseDistance = 4.4;

    const updateCameraFraming = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 1.0) {
        // Mobile / narrow viewports: smoothly back up to prevent horizontal crop
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
    const modelYOffset = -0.95;
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
    // Front-facing on load: A1 starts at -90° so arm directly faces the user
    const currentAngles = [-90.0, 0, 0, 0, 0, 0];
    const targetAngles = [-90.0, 0, 0, 0, 0, 0];
    const trackingDamping = 0.18; // Fast, snappy cursor tracking
    const jointDamping = 0.14;    // Fast, responsive joint articulation
    let isLoaded = false;

    // Model group: FIXED to the ground at X = 0, Z = 0, Y = modelYOffset
    // The pedestal base is stationary and DOES NOT MOVE with the cursor
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, modelYOffset, 0);
    modelGroup.rotation.y = 0; // Pure front-facing base pedestal
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

        // Scale calibrated so top of arm stays comfortably below header text
        const scale = 0.72;
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

        // Prime initial front-facing pose on load immediately
        const qInit = new THREE.Quaternion().setFromAxisAngle(
          jointAxes[0],
          THREE.MathUtils.degToRad(-90.0)
        );
        l1.quaternion.copy(initialQuaternions[0]).multiply(qInit);
        loadedModel.updateMatrixWorld(true);

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

    // 8. Viewport-Wide Cursor & Touch Tracking (Tracks anywhere on website)
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Map entire window viewport to [-1.0, 1.0]
      targetMouse.x = Math.max(-1.0, Math.min(1.0, (e.clientX / window.innerWidth) * 2 - 1));
      targetMouse.y = Math.max(-1.0, Math.min(1.0, -(e.clientY / window.innerHeight) * 2 + 1));
    };

    const handleMouseLeave = () => {
      // Gracefully return to center front-facing pose
      targetMouse.x = 0;
      targetMouse.y = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      targetMouse.x = Math.max(-1.0, Math.min(1.0, (e.touches[0].clientX / window.innerWidth) * 2 - 1));
      targetMouse.y = Math.max(-1.0, Math.min(1.0, -(e.touches[0].clientY / window.innerHeight) * 2 + 1));
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

      // Fast, snappy mouse coordinate smoothing
      mouse.x += (targetMouse.x - mouse.x) * trackingDamping;
      mouse.y += (targetMouse.y - mouse.y) * trackingDamping;

      // Note: modelGroup is FIXED to the ground (rotation.y = 0).
      // All 6 kinematics joints (link_1 through link_6) actively move together!
      if (isLoaded && jointNodes.length === 6) {
        const timeSeconds = clock.getElapsedTime();

        // Rest / Breathing micro-oscillation when idle
        const breathing = Math.sin(timeSeconds * 1.5) * 1.2;

        // All 6 kinematics joints actively articulate to follow the cursor:
        // A1 (Base Carousel Yaw): turns left/right to aim towards cursor X
        targetAngles[0] = -90.0 + (mouse.x * 45.0);

        // A2 (Shoulder Pitch): reaches forward/upward based on cursor Y and lateral reach
        targetAngles[1] = (-mouse.y * 18.0) + (Math.abs(mouse.x) * 4.0) + breathing;

        // A3 (Elbow Pitch): coordinates with shoulder to lift/lower and reach
        targetAngles[2] = (-mouse.y * 22.0) + (mouse.x * 12.0);

        // A4 (Forearm Roll): rolls the arm tube displaying the embossed ZAWR titanium badge
        targetAngles[3] = (mouse.x * 28.0) + (mouse.y * 12.0);

        // A5 (Wrist Pitch): tilts the tool head up/down and left/right directly aiming at cursor
        targetAngles[4] = (-mouse.y * 30.0) + (mouse.x * 16.0);

        // A6 (Tool Flange Spin): spins the circular end effector with cursor tracking & idle oscillation
        targetAngles[5] = (mouse.x * 40.0) + Math.sin(timeSeconds * 1.8) * 15.0;

        // Fast, responsive joint interpolation & delta quaternion update
        for (let i = 0; i < 6; i++) {
          currentAngles[i] += (targetAngles[i] - currentAngles[i]) * jointDamping;

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
