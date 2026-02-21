"use client";

import { useEffect, useRef } from "react";

interface DottedGlobeProps {
  className?: string;
  size?: number;
}

export function DottedGlobe({ className = "", size = 400 }: DottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasSize = size;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    ctx.scale(dpr, dpr);

    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = canvasSize * 0.38;

    // Pre-generate dot positions on a sphere
    const dots: { lat: number; lon: number }[] = [];
    const dotCount = 1200;

    // Use fibonacci sphere for uniform distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotCount; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / dotCount);
      const phi = (2 * Math.PI * i) / goldenRatio;
      dots.push({
        lat: theta,
        lon: phi,
      });
    }

    // Generate graticule lines (lat/lon grid)
    const graticuleLines: { lat: number; lon: number }[][] = [];

    // Longitude lines (meridians)
    for (let lon = 0; lon < 360; lon += 30) {
      const line: { lat: number; lon: number }[] = [];
      for (let lat = 0; lat <= 180; lat += 5) {
        line.push({
          lat: (lat * Math.PI) / 180,
          lon: (lon * Math.PI) / 180,
        });
      }
      graticuleLines.push(line);
    }

    // Latitude lines (parallels)
    for (let lat = 30; lat < 180; lat += 30) {
      const line: { lat: number; lon: number }[] = [];
      for (let lon = 0; lon <= 360; lon += 5) {
        line.push({
          lat: (lat * Math.PI) / 180,
          lon: (lon * Math.PI) / 180,
        });
      }
      graticuleLines.push(line);
    }

    let rotationY = 0;
    const rotationSpeed = 0.003;

    function project(
      lat: number,
      lon: number,
      rotation: number
    ): { x: number; y: number; z: number } | null {
      const adjustedLon = lon + rotation;

      const x = radius * Math.sin(lat) * Math.cos(adjustedLon);
      const y = radius * Math.cos(lat);
      const z = radius * Math.sin(lat) * Math.sin(adjustedLon);

      // Only show front-facing points
      if (z < 0) return null;

      return {
        x: centerX + x,
        y: centerY - y + radius * 0.1, // slight vertical offset
        z,
      };
    }

    function render() {
      rotationY += rotationSpeed;
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // Globe outline circle
      ctx.beginPath();
      ctx.arc(centerX, centerY + radius * 0.1, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw graticule lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 0.7;

      for (const line of graticuleLines) {
        let started = false;
        ctx.beginPath();

        for (const point of line) {
          const projected = project(point.lat, point.lon, rotationY);
          if (projected) {
            if (!started) {
              ctx.moveTo(projected.x, projected.y);
              started = true;
            } else {
              ctx.lineTo(projected.x, projected.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Draw dots
      for (const dot of dots) {
        const projected = project(dot.lat, dot.lon, rotationY);
        if (projected) {
          const depthAlpha = 0.3 + (projected.z / radius) * 0.7;
          const dotSize = 1.0 + (projected.z / radius) * 1.2;

          ctx.beginPath();
          ctx.arc(projected.x, projected.y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [size]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className=""
        aria-hidden="true"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
