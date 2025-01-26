"use client";

import { useEffect, useRef } from "react";
import { useMouseParticles } from "@/hooks/use-mouse-particles";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface ParticlesBackgroundProps {
  className?: string;
  particleColor?: string;
  particleCount?: number;
  minSpeed?: number;
  maxSpeed?: number;
  minSize?: number;
  maxSize?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
}

export function ParticlesBackground({
  className = "",
  particleColor = "rgb(var(--primary))",
  particleCount = 50,
  minSpeed = 0.1,
  maxSpeed = 0.5,
  minSize = 1,
  maxSize = 3,
  mouseInteraction = true,
  mouseRadius = 100,
  mouseStrength = 0.1,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const { applyMouseForce } = useMouseParticles({
    radius: mouseRadius,
    strength: mouseStrength,
  });

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

    const createParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedX: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
        speedY: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        if (mouseInteraction) {
          applyMouseForce(particle);
        }

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor.replace(")", `, ${particle.opacity})`)}`;
        ctx.fill();
      });

      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${particleColor.replace(
              ")",
              `, ${0.15 * (1 - distance / 100)})`
            )}`;
            ctx.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [
    particleColor,
    particleCount,
    minSpeed,
    maxSpeed,
    minSize,
    maxSize,
    mouseInteraction,
    applyMouseForce,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 bg-transparent ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
