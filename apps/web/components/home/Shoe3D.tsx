'use client';

import React, { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  useGLTF,
  Stage,
  PresentationControls,
  Environment,
  Float,
  Center,
  PerspectiveCamera,
  ContactShadows
} from '@react-three/drei';

function Model({ url, scale = 1, brightness = 1 }: { url: string; scale?: number; brightness?: number }) {
  const { scene } = useGLTF(url);
  
  // Apply brightness adjustments to all materials
  React.useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat: any) => {
            if (mat.color) {
              // Store original color if not already stored
              if (!mat._originalColor) mat._originalColor = mat.color.clone();
              
              // Apply brightness as a multiplier
              mat.color.copy(mat._originalColor).multiplyScalar(brightness);
              
              // For extra "brighten", add subtle emissive
              if (brightness > 1) {
                mat.emissive = mat._originalColor.clone().multiplyScalar(0.1);
                mat.emissiveIntensity = (brightness - 1) * 2;
              } else {
                mat.emissiveIntensity = 0;
              }
            }
          });
        }
      }
    });
  }, [scene, brightness]);

  return (
    <group scale={scale} rotation={[0.5, Math.PI / 10, 0.2]}>
      <Center>
        <primitive
          object={scene}
          position={[0, 0, 0]}
        />
      </Center>
    </group>
  );
}

export const Shoe3D = ({ 
  modelUrl, 
  scale = 1, 
  brightness = 1 
}: { 
  modelUrl: string; 
  scale?: number;
  brightness?: number;
}) => {
  return (
    <div className="h-full w-full outline-none cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} camera={{ position: [0, -1, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          
          <group position={[-0.3, -0.8, 0]}>
            <PresentationControls
              global
              snap
              rotation={[0, 0.3, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Float
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={1}
                floatingRange={[0.5, 0.7]}
              >
                <Model url={modelUrl} scale={scale} brightness={brightness} />
              </Float>
            </PresentationControls>
          </group>

          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0}
            scale={5}
            blur={2}
            far={4.5}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload the models
useGLTF.preload('/models/balmain_unicorn_low-top.glb');
useGLTF.preload('/models/nike_dunk_low_unlv.glb');
useGLTF.preload('/models/nike_dunk_high_sb_hawaii.glb');
