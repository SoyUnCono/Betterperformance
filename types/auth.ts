import { UserRole } from "@prisma/client";

export interface UserMetadata {
  role?: UserRole;
}

declare module "@clerk/nextjs/server" {
  interface PublicMetadata extends UserMetadata {}
}

declare module "@clerk/nextjs/dist/types/server" {
  interface PublicMetadata extends UserMetadata {}
}

declare module "@clerk/backend" {
  interface PublicMetadata extends UserMetadata {}
} 