import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroCanvas — a soft, slow WebGL field behind the hero (CODEGRID-style
 * fullscreen shader, kept featherweight). One plane + an fbm domain-warp
 * shader blending the brand colours (sand → sage → pine → honey). Lazy-loaded
 * and only mounted on desktop + non-reduced-motion (see OpeningScene), with a
 * capped DPR. Decorative only.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uSand;
  uniform vec3 uSage;
  uniform vec3 uPine;
  uniform vec3 uHoney;

  vec2 hash(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.04;
    vec2 q = vec2(fbm(uv * 1.8 + t), fbm(uv * 1.8 + vec2(5.2, 1.3) - t));
    float n = fbm(uv * 2.2 + q * 1.6 + t);
    vec3 col = uSand;
    col = mix(col, uSage, smoothstep(0.15, 0.75, n) * 0.7);
    col = mix(col, uPine, smoothstep(0.55, 0.95, n) * 0.32);
    col = mix(col, uHoney, smoothstep(0.72, 1.0, fbm(uv * 2.6 - t)) * 0.28);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Field() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSand: { value: new THREE.Color('#F4E7D0') },
      uSage: { value: new THREE.Color('#A9B89E') },
      uPine: { value: new THREE.Color('#214335') },
      uHoney: { value: new THREE.Color('#DDA84C') },
    }),
    []
  );

  useFrame((_, dt) => {
    if (ref.current) ref.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={ref} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      className="rd-hero__canvas"
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.62, pointerEvents: 'none' }}
    >
      <Field />
    </Canvas>
  );
}
