import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uHoverState;
  uniform float uTime;
  uniform float uProgress; // For switching between textures
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Liquid distortion
    float noise = sin(uv.y * 10.0 + uTime * 2.0) * 0.03 * uHoverState;
    uv.x += noise;
    
    // RGB Shift intensity based on hover state
    float shift = 0.04 * uHoverState;
    
    // Texture 1 with RGB Shift
    float r1 = texture2D(uTexture1, vec2(uv.x + shift, uv.y)).r;
    float g1 = texture2D(uTexture1, uv).g;
    float b1 = texture2D(uTexture1, vec2(uv.x - shift, uv.y)).b;
    vec4 color1 = vec4(r1, g1, b1, 1.0);

    // Texture 2 with RGB Shift
    float r2 = texture2D(uTexture2, vec2(uv.x + shift, uv.y)).r;
    float g2 = texture2D(uTexture2, uv).g;
    float b2 = texture2D(uTexture2, vec2(uv.x - shift, uv.y)).b;
    vec4 color2 = vec4(r2, g2, b2, 1.0);
    
    // Mix textures for smooth transition
    vec4 finalColor = mix(color1, color2, uProgress);
    
    // Fade out completely when not hovered
    gl_FragColor = mix(vec4(0.0), finalColor, uHoverState);
  }
`;

function Scene({ hoveredProject }) {
  const materialRef = useRef();
  const hoverState = useRef(0);
  const progress = useRef(0);
  const currentTexIndex = useRef(0);
  
  // Preload textures
  const textures = useTexture([
    '/assets/images/hasan-arthur-profile.jpg',
    '/assets/images/og-image.jpg',
    '/assets/images/logo-main.png',
    '/assets/images/hasan-arthur-profile.jpg' // fallback for 4th
  ]);

  useEffect(() => {
    if (hoveredProject) {
      // Map project ID to texture array index
      const targetIndex = (hoveredProject - 1) % textures.length;
      
      // If it's a new project, we crossfade
      if (targetIndex !== currentTexIndex.current) {
        if (materialRef.current) {
          // Set old texture to tex1, new to tex2
          materialRef.current.uniforms.uTexture1.value = textures[currentTexIndex.current];
          materialRef.current.uniforms.uTexture2.value = textures[targetIndex];
          progress.current = 0; // reset crossfade
          
          gsap.to(progress, {
            current: 1,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              currentTexIndex.current = targetIndex;
            }
          });
        }
      } else {
        // Just fade in
        if (materialRef.current) {
           materialRef.current.uniforms.uTexture1.value = textures[currentTexIndex.current];
           materialRef.current.uniforms.uTexture2.value = textures[currentTexIndex.current];
        }
      }

      gsap.to(hoverState, {
        current: 1,
        duration: 0.8,
        ease: 'power3.out',
      });
    } else {
      // Fade out
      gsap.to(hoverState, {
        current: 0,
        duration: 0.6,
        ease: 'power2.in',
      });
    }
  }, [hoveredProject, textures]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uHoverState.value = hoverState.current;
      materialRef.current.uniforms.uProgress.value = progress.current;
    }
  });

  return (
    // Make the mesh cover a good portion of the screen but preserve aspect ratio loosely
    <mesh scale={[window.innerWidth / window.innerHeight * 4, 4, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture1: { value: textures[0] },
          uTexture2: { value: textures[0] },
          uHoverState: { value: 0 },
          uTime: { value: 0 },
          uProgress: { value: 0 }
        }}
        transparent={true}
      />
    </mesh>
  );
}

export default function ProjectCanvas({ hoveredProject }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 0, 
      opacity: hoveredProject ? 0.6 : 0, 
      transition: 'opacity 0.8s ease',
      // Very slight scale effect to make it feel like it's breathing
      transform: hoveredProject ? 'scale(1.05)' : 'scale(1)'
    }}>
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene hoveredProject={hoveredProject} />
        </Suspense>
      </Canvas>
    </div>
  );
}
