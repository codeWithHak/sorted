"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ChevronRight } from "lucide-react";
import { RadialGlowButton } from "@/components/brand/RadialGlowButton";

gsap.registerPlugin(SplitText, useGSAP);

/* ───────────────────────────────────────────
   WebGL Shader Background
   Swirling emerald energy tendrils
   ─────────────────────────────────────────── */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;

  vec2 toPolar(vec2 p) {
    float r = length(p);
    float a = atan(p.y, p.x);
    return vec2(r, a);
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);

    vec2 polar = toPolar(p);
    float r = polar.x;

    vec2 i = p;
    float c = 0.0;
    float rot = r + u_time + p.x * 0.100;
    for (float n = 0.0; n < 4.0; n++) {
      float rr = r + 0.15 * sin(u_time * 0.7 + n + r * 2.0);
      p *= mat2(
        cos(rot - sin(u_time / 10.0)), sin(rot),
        -sin(cos(rot) - u_time / 10.0), cos(rot)
      ) * -0.25;

      float t = r - u_time / (n + 30.0);
      i -= p + sin(t - i.y) + rr;

      c += 2.2 / length(vec2(
        sin(i.x + t) / 0.15,
        cos(i.y + t) / 0.15
      ));
    }

    c /= 8.0;

    // Emerald energy — digital consciousness
    vec3 baseColor = vec3(0.05, 0.45, 0.3);

    vec3 finalColor = baseColor * smoothstep(0.0, 1.0, c * 0.6);

    fragColor = vec4(finalColor, 1.0);
  }

  void main() {
    vec4 fragColor;
    vec2 fragCoord = vUv * u_resolution.xy;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ───────────────────────────────────────────
   Hero Section
   ─────────────────────────────────────────── */

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microRef = useRef<HTMLUListElement>(null);

  function scrollToAgents() {
    document
      .getElementById("agent-showcase")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  // GSAP entrance animation
  useGSAP(
    () => {
      if (!headingRef.current) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(headingRef.current!, {
          type: "lines",
        });

        // Set initial states
        gsap.set(split.lines, {
          filter: "blur(16px)",
          yPercent: 24,
          autoAlpha: 0,
          scale: 1.04,
          transformOrigin: "50% 100%",
        });

        if (badgeRef.current) {
          gsap.set(badgeRef.current, { autoAlpha: 0, y: -12 });
        }
        if (subtitleRef.current) {
          gsap.set(subtitleRef.current, { autoAlpha: 0, y: 12 });
        }
        if (ctaRef.current) {
          gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 });
        }

        const microItems = microRef.current
          ? Array.from(microRef.current.querySelectorAll("li"))
          : [];
        if (microItems.length > 0) {
          gsap.set(microItems, { autoAlpha: 0, y: 8 });
        }

        // Build timeline
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (badgeRef.current) {
          tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.2);
        }

        tl.to(
          split.lines,
          {
            filter: "blur(0px)",
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.0,
            stagger: 0.15,
          },
          0.4
        );

        if (subtitleRef.current) {
          tl.to(
            subtitleRef.current,
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.5"
          );
        }

        if (ctaRef.current) {
          tl.to(
            ctaRef.current,
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.35"
          );
        }

        if (microItems.length > 0) {
          tl.to(
            microItems,
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 },
            "-=0.25"
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1: WebGL shader background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          gl={{ antialias: false, alpha: false }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ShaderPlane />
        </Canvas>
      </div>

      {/* Layer 2: Dark overlay for text readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <div ref={badgeRef}>
          <button
            onClick={scrollToAgents}
            className="group mb-8 cursor-pointer"
          >
            <span
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-mono font-medium tracking-widest uppercase
                bg-white/10 backdrop-blur-md border border-white/20 text-white/70
                hover:border-emerald-600/40 transition-colors"
            >
              The Universe of AI Agents
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        {/* Main headline */}
        <h1
          ref={headingRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] text-white"
        >
          <span className="block bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            A universe of agents
          </span>
          <span className="block bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            that work for you.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed font-light"
        >
          Meet the agents of the Sorted Universe.
          They listen, they act, they
          learn. <br></br>Start with Jett. Your task agent, and watch your world get
          sorted.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <RadialGlowButton variant="primary" size="lg" onClick={scrollToAgents}>
            Meet Your Agents
          </RadialGlowButton>
          <RadialGlowButton variant="ghost" size="lg" href="/auth/signup">
            Get Started
          </RadialGlowButton>
        </div>

        {/* Micro details */}
        <ul
          ref={microRef}
          className="mt-10 flex flex-wrap justify-center gap-6 text-xs font-light tracking-tight text-white/50"
        >
          {["Always learning", "Always adapting", "Always sorted"].map(
            (detail) => (
              <li key={detail} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-emerald-500/60" />
                {detail}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
