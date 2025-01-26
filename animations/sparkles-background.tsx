"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedY: number;
  pulse: number;
}

interface SparklesBackgroundProps {
  className?: string;
  sparkleCount?: number;
  minSize?: number;
  maxSize?: number;
}

export function SparklesBackground({
  className = "",
  sparkleCount = 30,
  minSize = 1,
  maxSize = 3,
}: SparklesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const createSparkle = (): Sparkle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (maxSize - minSize) + minSize,
      opacity: Math.random() * 0.5 + 0.2,
      speedY: -0.2 - Math.random() * 0.3,
      pulse: Math.random() * Math.PI,
    });

    const createSparkles = () => {
      sparklesRef.current = Array.from({ length: sparkleCount }, createSparkle);
    };

    const updateSparkles = () => {
      sparklesRef.current.forEach((sparkle) => {
        sparkle.y += sparkle.speedY;
        sparkle.pulse += 0.05;
        sparkle.opacity = Math.sin(sparkle.pulse) * 0.3 + 0.2;

        if (sparkle.y < -10) {
          Object.assign(sparkle, {
            ...createSparkle(),
            y: canvas.height + 10,
          });
        }
      });
    };

    const drawSparkles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparklesRef.current.forEach((sparkle) => {
        // Draw main sparkle
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        // Color principal de Supabase (verde azulado claro)
        ctx.fillStyle = `rgba(62, 207, 142, ${sparkle.opacity})`;
        ctx.fill();

        // Draw glow effect
        const glow = ctx.createRadialGradient(
          sparkle.x,
          sparkle.y,
          0,
          sparkle.x,
          sparkle.y,
          sparkle.size * 2
        );
        // Brillo con el color de acento de Supabase
        glow.addColorStop(0, `rgba(62, 207, 142, ${sparkle.opacity * 0.3})`);
        glow.addColorStop(0.5, `rgba(24, 180, 222, ${sparkle.opacity * 0.1})`);
        glow.addColorStop(1, "rgba(24, 180, 222, 0)");

        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });
    };

    const animate = () => {
      updateSparkles();
      drawSparkles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    createSparkles();
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [sparkleCount, minSize, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 bg-[#1C1C1C] ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
