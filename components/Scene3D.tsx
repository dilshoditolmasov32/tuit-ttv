
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Sphere, 
  PerspectiveCamera, 
  Stars,
  MeshTransmissionMaterial,
  ScrollControls,
  useScroll
} from '@react-three/drei';
import * as THREE from 'three';

const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Group = 'group' as any;
const Mesh = 'mesh' as any;
const TorusGeometry = 'torusGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

const Experience = () => {
  const scroll = useScroll();
  const mainSphereRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const offset = scroll.offset; // 0 to 1
    
    // Camera movement based on scroll
    state.camera.position.z = 8 - offset * 4;
    state.camera.position.y = offset * 2;
    state.camera.lookAt(0, 0, 0);

    // Sphere reactions
    if (mainSphereRef.current) {
        mainSphereRef.current.rotation.y += 0.005;
        mainSphereRef.current.scale.setScalar(1 + offset * 0.5);
    }

    if (groupRef.current) {
        groupRef.current.rotation.y = offset * Math.PI;
    }

    if (ringRef.current) {
        ringRef.current.rotation.x = offset * 2;
        ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere ref={mainSphereRef} args={[1.5, 64, 64]}>
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={1.5}
            chromaticAberration={0.05}
            anisotropy={0.3}
            distortion={0.3}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#00f2fe"
            roughness={0}
          />
        </Sphere>
      </Float>

      <Mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <TorusGeometry args={[3, 0.01, 16, 100]} />
        <MeshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={5} transparent opacity={0.3} />
      </Mesh>
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Group>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault fov={35} position={[0, 0, 8]} />
        <AmbientLight intensity={0.2} />
        <PointLight position={[10, 10, 10]} intensity={1.5} color="#4facfe" />
        <PointLight position={[-10, -5, -10]} intensity={1} color="#00f2fe" />
        
        <ScrollControls pages={4} damping={0.2}>
            <Experience />
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default Scene3D;
