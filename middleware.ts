import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rutas públicas y protegidas
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/api/webhooks"
];

export default authMiddleware({
  publicRoutes,
  ignoredRoutes: ["/api/webhooks(.*)"],
  
  async afterAuth(auth, req) {
    const url = req.nextUrl;
    
    // Debug logs
    console.log("Auth Debug:", {
      url: url.pathname,
      userId: auth.userId,
      isPublicRoute: publicRoutes.some(pattern => url.pathname.startsWith(pattern))
    });

    // Verificar si es una ruta de admin
    const isAdminRoute = url.pathname.startsWith('/admin');

    if (isAdminRoute) {
      if (!auth.userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

      try {
        // Obtener el usuario y sus metadatos directamente
        const user = await clerkClient.users.getUser(auth.userId);
        const role = (user.publicMetadata.role as string)?.toLowerCase();
        
        console.log("Admin Check:", {
          isAdminRoute,
          userId: auth.userId,
          role: role,
          publicMetadata: user.publicMetadata
        });

        if (role !== "admin") {
          console.log("Admin access denied:", { 
            userId: auth.userId,
            role: role,
            publicMetadata: user.publicMetadata
          });
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Si no está autenticado y la ruta no es pública
    if (!auth.userId && !publicRoutes.some(pattern => url.pathname.startsWith(pattern))) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', url.pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};