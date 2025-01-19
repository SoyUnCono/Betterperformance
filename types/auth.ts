export interface UserMetadata {
  role?: "admin" | "user";
}

declare module "@clerk/nextjs/server" {
  interface PublicMetadata extends UserMetadata { }
}

declare module "@clerk/backend" {
  interface PublicMetadata extends UserMetadata { }
} 