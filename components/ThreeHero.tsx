import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const GlowingOrb = ({ position, color, distort = 0.4 }: { position: [number, number, number], color: string, distort?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          distort={distort}
          speed={2}
        />
      </Sphere>
    </Float>
  );
};

const GeometricVeg = ({ position, color }: { position: [number, number, number], color: string }) => {
     const meshRef = useRef<THREE.Mesh>(null);
     useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
        }
      });
     return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
             <Cylinder ref={meshRef} args={[0.3, 0.3, 2, 16]} position={position} rotation={[0,0,Math.PI/4]}>
                {/* @ts-ignore */}
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} emissive={color} emissiveIntensity={0.2} />
             </Cylinder>
        </Float>
     );
}

const SceneContent = () => {
  return (
    <>
      {/* @ts-ignore */}
      <ambientLight intensity={0.8} />
      {/* @ts-ignore */}
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#2E7D32" />
      {/* @ts-ignore */}
      <pointLight position={[-10, -10, -10]} intensity={1} color="#800000" />
      
      {/* Abstract Representation of Produce */}
      <GlowingOrb position={[-2, 0, 0] as [number, number, number]} color="#2E7D32" /> {/* Green */}
      <GlowingOrb position={[2, 1, -1] as [number, number, number]} color="#800000" distort={0.2} /> {/* Maroon */}
      <GeometricVeg position={[0, -1, 1] as [number, number, number]} color="#4CAF50" /> {/* Light Green */}
    </>
  );
};

const ThreeHero: React.FC = () => {
  return (
    <div className="w-full h-[300px] md:h-[400px] absolute top-0 left-0 -z-10 opacity-30 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <React.Suspense fallback={null}>
          <SceneContent />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeHero;