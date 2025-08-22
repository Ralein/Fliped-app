"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, forwardRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, SpotLight, useDepthBuffer } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3, Matrix4, Quaternion } from "three";
import { useRouter } from "next/navigation";

// Rubik's Cube Component for Landing Page
const RubiksCubeModel = forwardRef<any, any>((props, ref) => {
  const ANIMATION_DURATION = 1.5;
  const GAP = 0.01;
  const RADIUS = 0.075;
  
  const mainGroupRef = useRef<THREE.Group>(null);
  const isAnimatingRef = useRef(false);
  const currentRotationRef = useRef(0);
  const lastMoveAxisRef = useRef<string | null>(null);
  const currentMoveRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  
  const [size] = useState(0.7);
  const [cubes, setCubes] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [deviceSettings] = useState({
    smoothness: 4,
    castShadow: false,
    receiveShadow: false
  });
  
  const reusableVec3 = useMemo(() => new Vector3(), []);
  const reusableMatrix4 = useMemo(() => new Matrix4(), []);
  const reusableQuaternion = useMemo(() => new Quaternion(), []);
  
  React.useImperativeHandle(ref, () => ({
    reset: resetCube,
    rotation: mainGroupRef.current?.rotation || { x: 0, y: 0, z: 0 }
  }));

  const initializeCubes = useCallback(() => {
    const initial = [];
    const positions = [-1, 0, 1];
    
    for (let x of positions) {
      for (let y of positions) {
        for (let z of positions) {
          initial.push({
            position: new Vector3(x, y, z),
            rotationMatrix: new Matrix4().identity(),
            id: `cube-${x}-${y}-${z}`,
            originalCoords: { x, y, z }
          });
        }
      }
    }
    return initial;
  }, []);

  useEffect(() => {
    setCubes(initializeCubes());
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, [initializeCubes]);

  const resetCube = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setCubes(initializeCubes());
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.set(0, 0, 0);
    }
    isAnimatingRef.current = false;
    currentRotationRef.current = 0;
    lastMoveAxisRef.current = null;
    currentMoveRef.current = null;
  }, [initializeCubes]);

  const possibleMoves = useMemo(() => {
    const moves = [];
    for (let axis of ['x', 'y', 'z']) {
      for (let layer of [-1, 0, 1]) {
        for (let direction of [1, -1]) {
          moves.push({ axis, layer, direction });
        }
      }
    }
    return moves;
  }, []);

  const isInLayer = useCallback((position: Vector3, axis: string, layer: number) => {
    const coord = axis === "x" ? position.x : axis === "y" ? position.y : position.z;
    return Math.abs(coord - layer) < 0.1;
  }, []);

  const selectNextMove = useCallback(() => {
    if (!isAnimatingRef.current && isVisible && isMountedRef.current) {
      const availableMoves = possibleMoves.filter(
        (move) => move.axis !== lastMoveAxisRef.current
      );
      
      const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const rotationAngle = Math.PI / 2;
            
      currentMoveRef.current = { ...move, rotationAngle };
      lastMoveAxisRef.current = move.axis;
      isAnimatingRef.current = true;
      currentRotationRef.current = 0;
    }
  }, [possibleMoves, isVisible]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextMove = () => {
      if (isVisible && isMountedRef.current) {
        const delay = isAnimatingRef.current ? ANIMATION_DURATION * 1000 : 800;
        
        timeoutId = setTimeout(() => {
          selectNextMove();
          if (isMountedRef.current) {
            scheduleNextMove();
          }
        }, delay);
      }
    };

    scheduleNextMove();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, selectNextMove]);

  const createRotationMatrix = useCallback((axis: string, angle: number) => {
    reusableMatrix4.identity();
    reusableQuaternion.identity();
    reusableVec3.set(0, 0, 0);
    
    (reusableVec3 as any)[axis] = 1;
    reusableQuaternion.setFromAxisAngle(reusableVec3, angle);
    return reusableMatrix4.makeRotationFromQuaternion(reusableQuaternion);
  }, [reusableMatrix4, reusableQuaternion, reusableVec3]);

  const easeInOutQuad = useCallback((t: number) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }, []);

  const matrixToQuaternion = useCallback((matrix: Matrix4) => {
    reusableQuaternion.setFromRotationMatrix(matrix);
    return reusableQuaternion.clone();
  }, [reusableQuaternion]);

  const normalizePositions = useCallback((cubes: any[]) => {
    return cubes.map(cube => {
      const x = Math.round(cube.position.x);
      const y = Math.round(cube.position.y);
      const z = Math.round(cube.position.z);
      
      const newPosition = 
        (Math.abs(cube.position.x - x) > 0.001 || 
         Math.abs(cube.position.y - y) > 0.001 || 
         Math.abs(cube.position.z - z) > 0.001) 
          ? new Vector3(x, y, z) 
          : cube.position;
      
      return {
        ...cube,
        position: newPosition
      };
    });
  }, []);

  const updateCubes = useCallback((prevCubes: any[], move: any, stepRotationMatrix: Matrix4) => {
    return prevCubes.map((cube) => {
      if (isInLayer(cube.position, move.axis, move.layer)) {
        const tempVec3 = new Vector3(
          cube.position.x,
          cube.position.y,
          cube.position.z
        );

        tempVec3.applyMatrix4(stepRotationMatrix);

        const newRotationMatrix = new Matrix4().multiplyMatrices(
          stepRotationMatrix,
          cube.rotationMatrix
        );

        return {
          ...cube,
          position: tempVec3,
          rotationMatrix: newRotationMatrix,
        };
      }
      return cube;
    });
  }, [isInLayer]);

  useFrame((state, delta) => {
    if (!isVisible || !isMountedRef.current) return;

    // Gentle rotation for the entire cube
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.x += delta * 0.15;
      mainGroupRef.current.rotation.y += delta * 0.25;
      mainGroupRef.current.rotation.z += delta * 0.1;
    }

    if (isAnimatingRef.current && currentMoveRef.current) {
      const move = currentMoveRef.current;
      const targetRotation = move.rotationAngle;
      const rotation = delta / ANIMATION_DURATION;

      if (currentRotationRef.current < 1) {
        const newRotation = Math.min(currentRotationRef.current + rotation, 1);
        const prevRotation = currentRotationRef.current;
        currentRotationRef.current = newRotation;

        const easedProgress = easeInOutQuad(newRotation);
        const prevEasedProgress = easeInOutQuad(prevRotation);
        const currentAngle = easedProgress * targetRotation;
        const prevAngle = prevEasedProgress * targetRotation;
        const stepRotation = currentAngle - prevAngle;

        const stepRotationMatrix = createRotationMatrix(
          move.axis,
          stepRotation * move.direction
        );

        if (isMountedRef.current) {
          setCubes((prevCubes) => {
            const updatedCubes = updateCubes(prevCubes, move, stepRotationMatrix);
            
            if (newRotation >= 1) {
              const normalizedCubes = normalizePositions(updatedCubes);
              isAnimatingRef.current = false;
              currentRotationRef.current = 0;
              currentMoveRef.current = null;
              return normalizedCubes;
            }
            
            return updatedCubes;
          });
        }
      }
    }
  });

  const chromeMaterial = useMemo(() => ({
    color: '#ffffff',
    metalness: 0.9,
    roughness: 0.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    reflectivity: 1,
    envMapIntensity: 2
  }), []);

  const sharedMaterial = useMemo(() => (
    <meshPhysicalMaterial {...chromeMaterial} />
  ), [chromeMaterial]);

  return (
    <group ref={mainGroupRef} {...props}>
      {cubes.map((cube) => (
        <group
          key={cube.id}
          position={[
            cube.position.x * (size + GAP),
            cube.position.y * (size + GAP),
            cube.position.z * (size + GAP),
          ]}
          quaternion={matrixToQuaternion(cube.rotationMatrix)}
        >
          <RoundedBox
            args={[size, size, size]}
            radius={RADIUS}
            smoothness={deviceSettings.smoothness}
            castShadow={deviceSettings.castShadow}
            receiveShadow={deviceSettings.receiveShadow}
          >
            {sharedMaterial}
          </RoundedBox>
        </group>
      ))}
    </group>
  );
});

function CameraController() {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

function EnhancedSpotlight(props: any) {
  const light = useRef<any>();
  
  useEffect(() => {
    if (light.current) {
      light.current.target.position.set(0, 0, 0);
      light.current.target.updateMatrixWorld();
    }
  }, []);
  
  return (
    <SpotLight 
      castShadow={false}
      ref={light} 
      {...props} 
    />
  );
}

function RubiksCubeScene() {
  const depthBuffer = useDepthBuffer({ 
    size: 1024,
    frames: 1,

  });
  
  return (
    <>
      <EnhancedSpotlight 
        depthBuffer={depthBuffer} 
        color="#ffffff" 
        position={[4, 4, 3]}
        volumetric={false}
        opacity={1}
        penumbra={0.8}
        distance={20}
        angle={0.6}
        attenuation={15}
        anglePower={4}
        intensity={1.5}
      />
      
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[2, 2, 2]} 
        intensity={0.8} 
        color="#ffffff"
      />
      <pointLight position={[-2, -2, 2]} intensity={0.4} color="#4f46e5" />
      
      <PerspectiveCamera
        makeDefault
        fov={35}
        position={[0, 0, 8]}
        near={0.1}
        far={1000}
      />

      <CameraController />

      <Suspense fallback={null}>
        <RubiksCubeModel position={[0, 0, 0]} scale={1.2} />
      </Suspense>
    </>
  );
}

// 3D Scene Component
function CubeScene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <RubiksCubeScene />
    </Canvas>
  );
}

interface FlipedBackgroundProps {
  className?: string;
}

const FlipedBackground: React.FC<FlipedBackgroundProps> = ({ className = "" }) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  // Particle system for floating elements
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    life: number;
  }>>([]);

  // Initialize particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 30; i++) { // Reduced particle count for better performance with 3D cube
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.2 + 0.05,
        life: Math.random() * 100 + 50
      });
    }
    particlesRef.current = particles;
    setIsLoaded(true);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      time += 0.008;
      
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle animated grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 60;
      const offsetX = (time * 15) % gridSize;
      const offsetY = (time * 10) % gridSize;

      // Vertical lines
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw subtle mouse influence
      const mouseInfluence = 100;
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, mouseInfluence
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Gentle mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.005;
          particle.vy += (dy / distance) * force * 0.005;
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle if life is over
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 0.3;
          particle.vy = (Math.random() - 0.5) * 0.3;
          particle.life = Math.random() * 100 + 50;
        }

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`fixed inset-0 w-full h-full bg-black overflow-hidden ${className}`}>
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 3D Rubik's Cube Scene - Centered and Larger */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <CubeScene />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 360,
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3,
            }}
          />
        ))}
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Content overlay - Text positioned to avoid cube */}
      <div className="relative z-10 flex items-center justify-start min-h-screen pl-12 md:pl-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-left max-w-2xl"
        >
         <motion.h1
            className="bricolage-font text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-white mb-8 tracking-tight leading-none"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.8, type: "spring", stiffness: 100 }}
            style={{
              textShadow: '0 0 60px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Flipd
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-white/80 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            Experience the future of<br />digital interaction
          </motion.p>
          
          {/* Call to action button */}
          <motion.button
            onClick={handleGetStarted}
            className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xl font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>

      {/* Minimal corner accents */}
      <motion.div 
        className="absolute top-8 left-8 w-24 h-24 border-l border-t border-white/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      />
      <motion.div 
        className="absolute top-8 right-8 w-24 h-24 border-r border-t border-white/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.7 }}
      />
      <motion.div 
        className="absolute bottom-8 left-8 w-24 h-24 border-l border-b border-white/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.9 }}
      />
      <motion.div 
        className="absolute bottom-8 right-8 w-24 h-24 border-r border-b border-white/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2.1 }}
      />
    </div>
  );
};

export default function FlipedLandingPage() {
  const [isClient, setIsClient] = useState(false);
 
  useEffect(() => {
    setIsClient(true);
  }, []);
 
  return <>{isClient && <FlipedBackground />}</>;
}