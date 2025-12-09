import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface PuzzlePieceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale?: number;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ position, rotation, color, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const shape = useMemo(() => {
    const s = 0.5; // half size
    const r = 0.15; // tab radius
    const shape = new THREE.Shape();

    // Start top left
    shape.moveTo(-s, s);
    
    // Top edge (Tab Out)
    shape.lineTo(-r, s);
    shape.absarc(0, s, r, Math.PI, 0, true); 
    shape.lineTo(s, s);

    // Right edge (Tab Out)
    shape.lineTo(s, r);
    shape.absarc(s, 0, r, Math.PI / 2, -Math.PI / 2, true);
    shape.lineTo(s, -s);

    // Bottom edge (Tab In - Hole)
    shape.lineTo(r, -s);
    shape.absarc(0, -s, r, 0, Math.PI, false);
    shape.lineTo(-s, -s);

    // Left edge (Tab In - Hole)
    shape.lineTo(-s, -r);
    shape.absarc(-s, 0, r, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(-s, s);

    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.2}
          metalness={0.8}
          transmission={0.2}
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
};

interface PuzzleSceneProps {
  className?: string;
}

const PuzzleScene: React.FC<PuzzleSceneProps> = ({ className }) => {
  return (
    <div className={`${className || ''}`}>
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        gl={{ 
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[-10, -10, -10]} color="#f472b6" intensity={1} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2} 
          color="#a78bfa"
        />
        
        <Sparkles count={50} scale={8} size={3} speed={0.4} opacity={0.5} color="#f472b6" />
        
        <group>
          {/* Main Piece */}
          <PuzzlePiece position={[0, 0, 0]} rotation={[0, 0, 0]} color="#ec4899" scale={1.5} />
          
          {/* Background Pieces */}
          <PuzzlePiece position={[-2, 1.5, -2]} rotation={[0.5, 0.5, 0]} color="#8b5cf6" scale={0.8} />
          <PuzzlePiece position={[2, -1, -1]} rotation={[-0.5, 0.2, 0.5]} color="#db2777" scale={0.6} />
          <PuzzlePiece position={[-1.5, -2, -3]} rotation={[0.2, -0.5, 0]} color="#6366f1" scale={0.7} />
        </group>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default PuzzleScene;
