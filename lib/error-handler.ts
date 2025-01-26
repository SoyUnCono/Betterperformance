import toast from "react-hot-toast";

interface ErrorDetails {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
}

class AppError extends Error {
  code: string;
  context?: Record<string, unknown>;

  constructor({ message, code = "UNKNOWN_ERROR", context }: ErrorDetails) {
    super(message);
    this.code = code;
    this.context = context;
  }
}

export function handleError(
  error: unknown,
  fallbackMessage = "Ha ocurrido un error"
) {
  console.error("Error:", error);

  if (error instanceof AppError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error(fallbackMessage);
}

export function createError(details: ErrorDetails): AppError {
  return new AppError(details);
}

export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;
