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
  // Generate random pieces for better distribution
  const pieces = useMemo(() => {
    const items = [];
    const colors = ["#ec4899", "#8b5cf6", "#db2777", "#6366f1"];
    
    for (let i = 0; i < 30; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 25, // x: -12.5 to 12.5
          (Math.random() - 0.5) * 15, // y: -7.5 to 7.5
          (Math.random() - 0.5) * 10 - 5 // z: -10 to 0
        ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        ] as [number, number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.5 + Math.random() * 1.0
      });
    }
    return items;
  }, []);

  return (
    <div className={`${className || ''}`}>
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }} 
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
        
        <Sparkles count={100} scale={20} size={3} speed={0.4} opacity={0.4} color="#f472b6" />
        
        <group>
          {pieces.map((piece, i) => (
            <PuzzlePiece 
              key={i}
              position={piece.position} 
              rotation={piece.rotation} 
              color={piece.color} 
              scale={piece.scale} 
            />
          ))}
        </group>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default PuzzleScene;
