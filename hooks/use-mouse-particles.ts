import { useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface UseMouseParticlesOptions {
  radius?: number;
  strength?: number;
}

export function useMouseParticles({
  radius = 100,
  strength = 0.1,
}: UseMouseParticlesOptions = {}) {
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const isMouseMovingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      isMouseMovingRef.current = true;

      // I reset the movement flag after a short delay
      setTimeout(() => {
        isMouseMovingRef.current = false;
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const applyMouseForce = (particle: {
    x: number;
    y: number;
    speedX: number;
    speedY: number;
  }) => {
    if (!isMouseMovingRef.current) return;

    const dx = particle.x - mousePositionRef.current.x;
    const dy = particle.y - mousePositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // I apply force only to particles within the influence radius
    if (distance < radius) {
      const force = (1 - distance / radius) * strength;
      particle.speedX += (dx / distance) * force;
      particle.speedY += (dy / distance) * force;
    }
  };

  return {
    applyMouseForce,
    mousePosition: mousePositionRef.current,
    isMouseMoving: isMouseMovingRef.current,
  };
}
