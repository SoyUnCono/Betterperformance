import { Tweak } from "@prisma/client";
import { z } from "zod";

export interface ApiResponse<T = void> {
    success: boolean;
    data?: T;
    error?: string;
    details?: z.ZodError;
}

export interface TweakResponse extends ApiResponse<Tweak> { }

export interface ErrorResponse extends ApiResponse {
    error: string;
} 