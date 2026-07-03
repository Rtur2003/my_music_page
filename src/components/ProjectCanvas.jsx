import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Simple Custom Shader for Liquid/RGB Distortion effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHoverState;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Liquid distortion based on hover state and time
    float noise = sin(uv.y * 10.0 + uTime) * 0.05 * uHoverState;
    uv.x += noise;
    
    // RGB Shift
    float r = texture2D(uTexture, vec2(uv.x + 0.02 * uHoverState, uv.y)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, vec2(uv.x - 0.02 * uHoverState, uv.y)).b;
    
    vec4 color = vec4(r, g, b, 1.0);
    
    // Mix with transparent based on hover state so it fades in
    gl_FragColor = mix(vec4(0.0), color, uHoverState);
  }
`;

function Scene({ hoveredProject }) {
  const materialRef = useRef();
  const hoverState = useRef(0);

  // In a real scenario, you'd load actual textures for each project ID
  // Here we just use a procedural gradient as a placeholder for the "image"
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#d4b078');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    // Animate the hover state uniform
    gsap.to(hoverState, {
      current: hoveredProject ? 1 : 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [hoveredProject]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uHoverState.value = hoverState.current;
    }
  });

  return (
    <mesh scale={[window.innerWidth / window.innerHeight * 2, 2, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uHoverState: { value: 0 },
          uTime: { value: 0 }
        }}
        transparent={true}
      />
    </mesh>
  );
}

// Fixed position canvas that only renders when a project is hovered (or transitioning)
export default function ProjectCanvas({ hoveredProject }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0, // Behind main content
      opacity: hoveredProject ? 1 : 0, // Quick CSS fade as fallback
      transition: 'opacity 0.5s ease'
    }}>
      {/* frameloop="demand" is a performance optimization, but for liquid animation we use "always" 
          HOWEVER, since we unmount or fade out when not hovered, performance is saved! */}
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Scene hoveredProject={hoveredProject} />
      </Canvas>
    </div>
  );
}
