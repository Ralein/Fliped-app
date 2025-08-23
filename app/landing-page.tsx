"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback, forwardRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, PerspectiveCamera, SpotLight, useDepthBuffer } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3, Matrix4, Quaternion } from "three";
import { Shield, Zap, Users, CheckCircle, ArrowRight, Star, Globe, Code, Smartphone } from 'lucide-react';

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
        <RubiksCubeModel position={[0, 0, 0]} scale={1.4} />
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

// Hero Section Component
const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Particle system
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    life: number;
  }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        life: Math.random() * 200 + 100
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
      time += 0.01;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      const gridSize = 80;
      const offsetX = (time * 20) % gridSize;
      const offsetY = (time * 15) % gridSize;

      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Mouse glow effect
      const mouseInfluence = 120;
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, mouseInfluence
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = (Math.random() - 0.5) * 0.5;
          particle.life = Math.random() * 200 + 100;
        }

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <motion.section 
      className="fixed inset-0 w-full h-full bg-black overflow-hidden z-0"
      style={{ y, opacity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 3D Cube - Now with higher z-index */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 w-80 h-80">
          <CubeScene />
        </div>
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
              rotate: 360,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-start min-h-screen pl-12 md:pl-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-left max-w-2xl"
        >
          <motion.h1
            className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-white mb-8 tracking-tight leading-none"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5, type: "spring", stiffness: 100 }}
          >
            Flipd
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            Experience the future of<br />digital interaction
          </motion.p>
          
          <motion.button
            onClick={scrollToFeatures}
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

      {/* Corner accents */}
      {[
        { position: "top-8 left-8", borders: "border-l border-t" },
        { position: "top-8 right-8", borders: "border-r border-t" },
        { position: "bottom-8 left-8", borders: "border-l border-b" },
        { position: "bottom-8 right-8", borders: "border-r border-b" }
      ].map((corner, i) => (
        <motion.div 
          key={i}
          className={`absolute ${corner.position} w-24 h-24 ${corner.borders} border-white/30 z-30`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 + i * 0.2 }}
        />
      ))}
    </motion.section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="bg-white/5 border border-white/20 rounded-2xl p-8 hover:bg-white/10 hover:border-white/30 transition-all duration-500 group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption and security protocols to keep your data safe from any threat."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance that delivers results in milliseconds, not seconds."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools that bring your team together, no matter where they are."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Built to scale globally with infrastructure that grows with your business."
    },
    {
      icon: Code,
      title: "Developer First",
      description: "Powerful APIs and developer tools that make integration simple and intuitive."
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Responsive design that works perfectly across all devices and platforms."
    }
  ];

  return (
    <section id="features" className="relative min-h-screen bg-black py-32 z-30">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Built for the Future
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the powerful features that make Flipd the perfect choice for modern digital experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "10M+", label: "Users" },
    { number: "150+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <section className="relative py-32 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-4">
                {stat.number}
              </div>
              <div className="text-xl text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechStart",
      content: "Flipd transformed how we approach digital experiences. The results were immediate and impressive.",
      rating: 5
    },
    {
      name: "Marcus Johnson", 
      role: "CTO, Innovation Labs",
      content: "The security features and performance optimization exceeded our expectations completely.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Product Manager, GlobalCorp", 
      content: "Outstanding platform with incredible support. Our team productivity increased by 300%.",
      rating: 5
    }
  ];

  return (
    <section className="relative py-32 bg-black">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Trusted by Leaders
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See what industry leaders are saying about their experience with Flipd.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/5 border border-white/20 rounded-2xl p-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-gray-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 5 projects",
        "Basic security features",
        "Community support",
        "1GB storage"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing teams and businesses",
      features: [
        "Unlimited projects",
        "Advanced security",
        "Priority support",
        "100GB storage",
        "Team collaboration",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated support",
        "Unlimited storage",
        "SLA guarantee",
        "White-label options"
      ],
      popular: false
    }
  ];

  return (
    <section className="relative py-32 bg-black">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-blue-500 bg-gradient-to-b from-blue-500/10 to-purple-600/10' 
                  : 'border-white/10'
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-400">{plan.period}</span>}
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                plan.popular
                  ? 'bg-white/10 text-white border border-white/20 hover:scale-105'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const handleGetStarted = () => {
    // You can replace this with your actual routing logic
    alert('Starting your journey with Flipd!');
  };

  const handleScheduleDemo = () => {
    // You can replace this with your actual demo scheduling logic
    alert('Demo scheduled!');
  };

  return (
    <section className="relative py-32 bg-black">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Join thousands of teams already using Flipd to transform their digital experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={handleGetStarted}
              className="px-12 py-6 bg-white text-black text-xl font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              onClick={handleScheduleDemo}
              className="px-12 py-6 bg-transparent border-2 border-white text-white text-xl font-semibold rounded-xl hover:bg-white hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Security", "Pricing", "API"],
    Company: ["About", "Careers", "Blog", "Contact"],
    Resources: ["Documentation", "Help Center", "Community", "Status"],
    Legal: ["Privacy", "Terms", "Security", "Compliance"]
  };

  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="text-4xl font-bold text-white mb-4">Flipd</div>
            <p className="text-gray-400 max-w-md">
              Experience the future of digital interaction with our cutting-edge platform.
            </p>
            <div className="flex space-x-4 mt-8">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <div key={social} className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="text-white text-sm">{social[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-6">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Flipd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page Component
export default function IntegratedFlipedLandingPage() {
  const [isClient, setIsClient] = useState(false);
 
  useEffect(() => {
    setIsClient(true);
  }, []);
 
  if (!isClient) return null;

  return (
    <div className="relative">
      <HeroSection />
      <div className="h-screen" />
      <div className="relative z-20 bg-black">
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}