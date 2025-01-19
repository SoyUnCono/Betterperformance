"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Opcional: Log del error al servicio de análisis
    console.error(error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">
          Algo salió mal!
        </h2>
        <p className="text-muted-foreground mb-4">
          No tienes permisos para acceder a esta página
        </p>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
          >
            Volver al inicio
          </Button>
          <Button
            onClick={() => reset()}
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    </div>
  );
} 