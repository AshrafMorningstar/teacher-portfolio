
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const FloatingCubes = () => {
  const meshRef = useRef<Mesh>(null!);
  const meshRef2 = useRef<Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.2;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.position.y = Math.sin(t) * 0.5;

    meshRef2.current.rotation.x = -t * 0.15;
    meshRef2.current.rotation.z = t * 0.25;
    meshRef2.current.position.x = Math.cos(t) * 1.5;
  });

  return (
    <>
      <mesh ref={meshRef} position={[-2, 0, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#000" wireframe />
      </mesh>
      <mesh ref={meshRef2} position={[2, 2, -6]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#666" wireframe />
      </mesh>
    </>
  );
};

export const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingCubes />
      </Canvas>
    </div>
  );
};
