import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Fix for TypeScript not recognizing Intrinsic elements globally.
// We explicitly define the R3F elements used in this file to satisfy the compiler.
// We declare both global JSX and React.JSX to cover different React type versions.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

// For React 18+ types where JSX is under React namespace
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
    }
  }
}

// Fallback component if R3F fails or loading
const SimpleBackground = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50 to-white -z-20 opacity-50" />
);

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
             <mesh ref={meshRef} position={position} rotation={[0,0,Math.PI/4]}>
                <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} emissive={color} emissiveIntensity={0.2} />
             </mesh>
        </Float>
     );
}

const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#2E7D32" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#800000" />
      
      <GlowingOrb position={[-2, 0, 0]} color="#2E7D32" />
      <GlowingOrb position={[2, 1, -1]} color="#800000" distort={0.2} />
      <GeometricVeg position={[0, -1, 1]} color="#4CAF50" />
    </>
  );
};

const ThreeHero: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <SimpleBackground />;

  return (
    <div className="w-full h-[300px] md:h-[400px] absolute top-0 left-0 -z-10 opacity-30 pointer-events-none">
       <React.Suspense fallback={<SimpleBackground />}>
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <SceneContent />
          </Canvas>
       </React.Suspense>
    </div>
  );
};

export default ThreeHero;