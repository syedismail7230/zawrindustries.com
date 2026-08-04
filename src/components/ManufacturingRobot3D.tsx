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

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 0.35, 4.2);
    camera.lookAt(0, 0.2, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 5. Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
    fillLight.position.set(-6, 6, 6);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(0, 8, -8);
    scene.add(rimLight);

    // 6. Root group at lowered position
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, -1.45, 0);
    scene.add(modelGroup);

    // Track discovered joint groups for animation
    // joint[0] = base (stationary)
    // joint[1] = lower arm (rotates around X - up/down swing)
    // joint[2] = elbow (rotates around X)
    // joint[3] = upper arm/wrist (rotates around X)
    // joint[4] = claw (rotates around Z - grip)
    const joints: THREE.Group[] = [];

    const loader = new GLTFLoader();
    loader.load(
      '/assets/robotic+arm+3d+model.glb?v=22',
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.updateMatrixWorld(true);

        // Scale the model to fit
        const totalBox = new THREE.Box3().setFromObject(loadedModel);
        const totalSize = totalBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(totalSize.x, totalSize.y, totalSize.z);
        const scale = 3.2 / maxDim;
        loadedModel.scale.set(scale, scale, scale);

        // Anchor base to y = 0, center x/z on base
        const baseBox = new THREE.Box3().setFromObject(loadedModel);
        const baseMin = baseBox.min;
        const baseCenter = baseBox.getCenter(new THREE.Vector3());
        loadedModel.position.set(-baseCenter.x, -baseMin.y, -baseCenter.z);

        // Fix all materials
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                if (mat.color.r < 0.05 && mat.color.g < 0.05 && mat.color.b < 0.05) {
                  mat.color.setHex(0x2d323c);
                }
                mat.roughness = 0.3;
                mat.metalness = 0.8;
                mat.envMapIntensity = 1.8;
              }
            });
          }
        });

        modelGroup.add(loadedModel);

        // ===== RIGGING: Partition model into joint segments by bounding-box Y height =====
        // After scaling, compute bounds per child mesh and group them into segments:
        // Segment 0: BASE (bottom 15% Y)  - stationary
        // Segment 1: LOWER ARM (15-35% Y) - rotates slowly on X axis
        // Segment 2: ELBOW (35-55% Y)     - rotates on X axis
        // Segment 3: FOREARM (55-75% Y)   - rotates on X axis  
        // Segment 4: WRIST/CLAW (75-100% Y) - rotates on Y/Z axis (grip)

        const scaledBox = new THREE.Box3().setFromObject(loadedModel);
        const totalH = scaledBox.max.y - scaledBox.min.y;
        const yMin = scaledBox.min.y;

        const segmentThresholds = [0, 0.15, 0.35, 0.55, 0.75, 1.0];

        // Create joint groups for segments 1-4 (0 = base, stays in modelGroup)
        const segmentGroups: THREE.Group[] = segmentThresholds.slice(0, -1).map(() => new THREE.Group());

        // Move each mesh into its segment group based on Y centroid
        const meshesToMove: { mesh: THREE.Object3D; segIdx: number; worldPos: THREE.Vector3 }[] = [];
        
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const box = new THREE.Box3().setFromObject(child);
            const centerY = (box.min.y + box.max.y) / 2;
            const normalizedY = (centerY - yMin) / totalH;
            
            let segIdx = 0;
            for (let i = 0; i < segmentThresholds.length - 1; i++) {
              if (normalizedY >= segmentThresholds[i] && normalizedY < segmentThresholds[i + 1]) {
                segIdx = i;
                break;
              }
            }
            
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            meshesToMove.push({ mesh: child, segIdx, worldPos });
          }
        });

        // Actually build the joint pivot groups
        // Pivot points for each joint (approximate world-space Y positions after scaling)
        const jointPivotYs = [
          yMin,                          // base bottom
          yMin + totalH * 0.15,          // lower arm pivot
          yMin + totalH * 0.38,          // elbow pivot
          yMin + totalH * 0.60,          // forearm pivot
          yMin + totalH * 0.78,          // wrist pivot
        ];

        // Create 4 pivot groups stacked parented to the model
        // joint0 (base) → joint1 (lower arm) → joint2 (elbow) → joint3 (forearm) → joint4 (claw)
        // Each pivot is at the joint Y level

        const pivotGroup1 = new THREE.Group(); // lower arm pivot
        const pivotGroup2 = new THREE.Group(); // elbow pivot
        const pivotGroup3 = new THREE.Group(); // forearm pivot  
        const pivotGroup4 = new THREE.Group(); // wrist/claw pivot

        // Store for animation
        joints.push(modelGroup);    // joint[0] = base (whole arm root, Y rotation from mouse)
        joints.push(pivotGroup1);   // joint[1] = lower arm
        joints.push(pivotGroup2);   // joint[2] = elbow
        joints.push(pivotGroup3);   // joint[3] = forearm
        joints.push(pivotGroup4);   // joint[4] = claw/wrist

        // Move meshes into the right pivot groups
        // We can't reparent GLTF nodes easily, so instead we animate the whole scene
        // using a simpler approach: just animate the top-level GLTF Object3D children
        // by grouping them using their bounding box Y position.

        // Simpler robust approach: animate the loaded scene's direct GLTF children
        // by finding the named nodes in the hierarchy
        const namedNodes: Map<string, THREE.Object3D> = new Map();
        loadedModel.traverse((obj) => {
          if (obj.name) namedNodes.set(obj.name, obj);
        });

        // From the inspector: 
        // root (node 4) → node_id112 (node 18) = main arm body
        // node_id112 → many children at various Z depths (Z = depth along arm)
        // 
        // Key structure (by Z translation of node_id112 children):
        // Z ~90-200: base/turret area (low Z)
        // Z ~300-450: lower arm section
        // Z ~530-680: upper arm / elbow
        // Z ~680-760: wrist area  
        // Z ~200-250: claw-like tips

        // Get the main arm node
        const armRoot = namedNodes.get('node_id112');

        if (armRoot) {
          // Sort children by world Z position to find arm chain
          const armChildren: { obj: THREE.Object3D; wz: number }[] = [];
          armRoot.children.forEach((child) => {
            const wp = new THREE.Vector3();
            child.getWorldPosition(wp);
            armChildren.push({ obj: child, wz: wp.z });
          });
          armChildren.sort((a, b) => a.wz - b.wz);

          // Segment children into 4 groups by Z position
          const minZ = armChildren[0].wz;
          const maxZ = armChildren[armChildren.length - 1].wz;
          const zRange = maxZ - minZ;

          const zJointGroups: THREE.Group[] = [
            new THREE.Group(), // segment A: base (~0-25% Z)
            new THREE.Group(), // segment B: lower arm (~25-50% Z)
            new THREE.Group(), // segment C: upper arm (~50-75% Z)
            new THREE.Group(), // segment D: wrist/claw (~75-100% Z)
          ];

          armChildren.forEach(({ obj, wz }) => {
            const nz = (wz - minZ) / zRange;
            let seg = 0;
            if (nz < 0.25) seg = 0;
            else if (nz < 0.50) seg = 1;
            else if (nz < 0.75) seg = 2;
            else seg = 3;
            
            // Save original parent and reparent to segment group
            // Store reference for animation
            (obj as any)._animSegment = seg;
          });

          // Store segment refs for animation
          (loadedModel as any)._armChildren = armChildren;
          (loadedModel as any)._minZ = minZ;
          (loadedModel as any)._maxZ = maxZ;
        }

        // Store reference for the animate loop
        (modelGroup as any)._loadedModel = loadedModel;
        (modelGroup as any)._namedNodes = namedNodes;

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('[GLB Load Error]', err);
        setLoading(false);
      }
    );

    // 7. Mouse tracking
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

    // 8. Render / Animate Loop
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.008;

      mouse.lerp(targetMouse, 0.06);

      // Base group: Y-rotation from mouse X (horizontal pan)
      modelGroup.position.set(0, -1.45, 0);
      modelGroup.rotation.y = mouse.x * 0.45;
      modelGroup.rotation.x = 0;
      modelGroup.rotation.z = 0;

      // Rigged joint animation using named nodes from the GLTF tree
      const loadedModel = (modelGroup as any)._loadedModel as THREE.Object3D | undefined;
      const namedNodes = (modelGroup as any)._namedNodes as Map<string, THREE.Object3D> | undefined;

      if (loadedModel && namedNodes) {
        // Animate arm segments by rotating named GLTF nodes
        // From inspector: the main arm chain runs through node_id112 children
        // We animate groups of nodes based on their Z depth segments

        const armChildren = (loadedModel as any)._armChildren as { obj: THREE.Object3D; wz: number }[] | undefined;
        const minZ = (loadedModel as any)._minZ as number | undefined;
        const maxZ = (loadedModel as any)._maxZ as number | undefined;

        if (armChildren && minZ !== undefined && maxZ !== undefined) {
          const zRange = maxZ - minZ;

          armChildren.forEach(({ obj, wz }) => {
            const nz = (wz - minZ) / zRange;

            // Apply gentle idle animation per segment
            // Mouse Y drives the overall arm pitch (tilt)
            const mousePitch = mouse.y * 0.18;

            if (nz < 0.25) {
              // Base section: no extra rotation (stationary)
              obj.rotation.x = 0;
              obj.rotation.z = 0;
            } else if (nz < 0.50) {
              // Lower arm: slow wave + mouse pitch
              obj.rotation.x = Math.sin(t * 0.8) * 0.04 + mousePitch * 0.5;
              obj.rotation.z = Math.sin(t * 0.5) * 0.02;
            } else if (nz < 0.75) {
              // Upper arm / elbow: opposite phase wave
              obj.rotation.x = Math.sin(t * 0.8 + Math.PI * 0.4) * 0.05 + mousePitch * 0.8;
              obj.rotation.z = Math.cos(t * 0.6) * 0.02;
            } else {
              // Wrist / claw: faster micro-movement
              obj.rotation.x = Math.sin(t * 1.2 + Math.PI * 0.8) * 0.04 + mousePitch;
              obj.rotation.z = Math.sin(t * 1.5) * 0.06;
            }
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize
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
      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'transparent', zIndex: 40, color: '#000000',
        }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #000000',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '0.8rem',
          }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}>
            LOADING 3D ROBOT...
          </span>
        </div>
      )}
    </div>
  );
}
