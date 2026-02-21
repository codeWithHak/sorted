"use client";

import { useEffect, useRef } from "react";

interface GlitchyOrbProps {
  className?: string;
}

export function GlitchyOrb({ className = "" }: GlitchyOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const paramsRef = useRef({
    rotation: 0,
    atmosphereShift: 0,
    glitchIntensity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const grainCanvas = grainCanvasRef.current!;
    if (!canvas || !grainCanvas) return;

    const ctx = canvas.getContext("2d")!;
    const grainCtx = grainCanvas.getContext("2d")!;
    if (!ctx || !grainCtx) return;

    const density = " .:-=+*#%@";
    const params = paramsRef.current;

    // Simple animation drivers (no GSAP dependency needed here)
    let rotationSpeed = 0.03;
    let atmosphereDir = 1;

    const generateFilmGrain = (
      width: number,
      height: number,
      intensity = 0.15
    ) => {
      const imageData = grainCtx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 1] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 2] = Math.max(0, Math.min(255, 128 + grain));
        data[i + 3] = Math.abs(grain) * 3;
      }

      return imageData;
    };

    const drawGlitchedOrb = (
      centerX: number,
      centerY: number,
      radius: number,
      hue: number,
      _time: number,
      glitchIntensity: number
    ) => {
      ctx.save();

      const shouldGlitch =
        Math.random() < 0.08 && glitchIntensity > 0.3;
      const glitchOffset = shouldGlitch
        ? (Math.random() - 0.5) * 15 * glitchIntensity
        : 0;
      const glitchScale = shouldGlitch
        ? 1 + (Math.random() - 0.5) * 0.2 * glitchIntensity
        : 1;

      if (shouldGlitch) {
        ctx.translate(glitchOffset, glitchOffset * 0.8);
        ctx.scale(glitchScale, 1 / glitchScale);
      }

      // Main orb gradient
      const orbGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 1.5
      );

      orbGradient.addColorStop(0, `hsla(${hue + 10}, 100%, 95%, 0.9)`);
      orbGradient.addColorStop(0.2, `hsla(${hue + 20}, 90%, 80%, 0.7)`);
      orbGradient.addColorStop(0.5, `hsla(${hue}, 70%, 50%, 0.4)`);
      orbGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = orbGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bright center
      const centerRadius = radius * 0.3;
      ctx.fillStyle = `hsla(${hue + 20}, 100%, 95%, 0.8)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Glitch effects
      if (shouldGlitch) {
        ctx.globalCompositeOperation = "screen";

        ctx.fillStyle = `hsla(40, 100%, 50%, ${0.5 * glitchIntensity})`;
        ctx.beginPath();
        ctx.arc(
          centerX + glitchOffset * 0.5,
          centerY,
          centerRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = `hsla(270, 100%, 50%, ${0.4 * glitchIntensity})`;
        ctx.beginPath();
        ctx.arc(
          centerX - glitchOffset * 0.5,
          centerY,
          centerRadius,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.globalCompositeOperation = "source-over";

        // Digital noise lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * glitchIntensity})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const y = centerY - radius + Math.random() * radius * 2;
          const startX = centerX - radius + Math.random() * 20;
          const endX = centerX + radius - Math.random() * 20;
          ctx.beginPath();
          ctx.moveTo(startX, y);
          ctx.lineTo(endX, y);
          ctx.stroke();
        }
      }

      // Outer ring
      ctx.strokeStyle = `hsla(${hue + 20}, 80%, 70%, 0.5)`;
      ctx.lineWidth = 2;

      if (shouldGlitch) {
        const segments = 8;
        for (let i = 0; i < segments; i++) {
          const startAngle = (i / segments) * Math.PI * 2;
          const endAngle = ((i + 1) / segments) * Math.PI * 2;
          const ringRadius =
            radius * 1.2 + (Math.random() - 0.5) * 8 * glitchIntensity;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, startAngle, endAngle);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    function render() {
      timeRef.current += 0.016;
      const time = timeRef.current;

      // Update animation params
      params.rotation += rotationSpeed;
      params.atmosphereShift += 0.008 * atmosphereDir;
      if (params.atmosphereShift > 1 || params.atmosphereShift < 0)
        atmosphereDir *= -1;

      // Random glitch bursts
      if (Math.random() < 0.02) {
        params.glitchIntensity = 0.8 + Math.random() * 0.2;
      } else {
        params.glitchIntensity *= 0.95;
      }

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const width = (canvas.width = grainCanvas.width = rect.width);
      const height = (canvas.height = grainCanvas.height = rect.height);

      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.22;

      // Atmospheric background glow
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY - 30,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.7
      );

      const hue = 30 + params.atmosphereShift * 30; // amber/orange range
      bgGradient.addColorStop(0, `hsla(${hue + 20}, 80%, 60%, 0.25)`);
      bgGradient.addColorStop(0.3, `hsla(${hue}, 60%, 40%, 0.15)`);
      bgGradient.addColorStop(0.6, `hsla(${hue - 20}, 40%, 20%, 0.08)`);
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw the orb
      drawGlitchedOrb(
        centerX,
        centerY,
        radius,
        hue,
        time,
        params.glitchIntensity
      );

      // ASCII sphere particles
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const spacing = 10;
      const cols = Math.min(Math.floor(width / spacing), 120);
      const rows = Math.min(Math.floor(height / spacing), 80);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i - cols / 2) * spacing + centerX;
          const y = (j - rows / 2) * spacing + centerY;

          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius && Math.random() > 0.5) {
            const z = Math.sqrt(
              Math.max(0, radius * radius - dx * dx - dy * dy)
            );
            const angle = params.rotation;
            const rotZ = dx * Math.sin(angle) + z * Math.cos(angle);
            const brightness = (rotZ + radius) / (radius * 2);

            if (rotZ > -radius * 0.3) {
              const charIndex = Math.floor(
                brightness * (density.length - 1)
              );
              const char = density[charIndex];
              const alpha = Math.max(0.15, brightness * 0.8);
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.fillText(char, x, y);
            }
          }
        }
      }

      // Film grain overlay
      grainCtx.clearRect(0, 0, width, height);
      const grainIntensity = 0.18 + Math.sin(time * 8) * 0.02;
      const grainImageData = generateFilmGrain(width, height, grainIntensity);
      grainCtx.putImageData(grainImageData, 0, 0);

      frameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "transparent" }}
      />
      <canvas
        ref={grainCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
