"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Inicializar con false para evitar problemas de hidratación
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Crear el media query
    const media = window.matchMedia(query);

    // Establecer el estado inicial
    setMatches(media.matches);

    // Crear el listener
    const listener = () => setMatches(media.matches);

    // Añadir el listener
    media.addEventListener("change", listener);

    // Limpiar
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
