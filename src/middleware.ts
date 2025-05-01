import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { categories } from "@/data/categories";

// Define admin routes that require authentication
const isAdminRoute = createRouteMatcher(["/admin/dashboard(.*)"]);

// Define product category routes
const isCategoryProductRoute = createRouteMatcher(
  categories.map((cat) => `/${cat.name.toLowerCase()}/(.*)`)
);

// Define routes that should not increment visitor count
const isApiOrStaticRoute = createRouteMatcher([
  "/api/(.*)",
  "/_next/(.*)",
  "/favicon.ico",
  "/(.*)\\.jpg",
  "/(.*)\\.jpeg",
  "/(.*)\\.png",
  "/(.*)\\.gif",
  "/(.*)\\.svg",
  "/(.*)\\.ico",
  "/(.*)\\.css",
  "/(.*)\\.js",
]);

export default clerkMiddleware(async (auth, req) => {
  // Increment visitor count for non-API, non-static routes
  if (!isApiOrStaticRoute(req)) {
    // Only count unique visits by checking cookies
    const hasVisited = req.cookies.get("has_visited");

    if (!hasVisited) {
      try {
        // Increment visitor count via API
        await fetch(`${req.nextUrl.origin}/api/visitors`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error incrementing visitor count:", error);
      }
    }
  }

  // Protect admin routes - require authentication
  if (isAdminRoute(req)) {
    try {
      // This will automatically redirect to the sign-in page if the user is not authenticated
      await auth.protect();
    } catch (error) {
      // If auth.protect() throws an error, redirect to our custom login page
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle redirects for old product URLs
  if (isCategoryProductRoute(req)) {
    const { pathname } = req.nextUrl;
    const oldPatternMatch = pathname.match(/^\/([^\/]+)\/([^\/]+)$/);

    if (oldPatternMatch) {
      const [, category, slug] = oldPatternMatch;

      // Check if the category is valid
      const isValidCategory = categories.some(
        (cat) => cat.name.toLowerCase() === category.toLowerCase()
      );

      // If it's a valid category, redirect to the new URL structure
      if (isValidCategory) {
        return NextResponse.redirect(new URL(`/detail/${slug}`, req.url));
      }
    }
  }

  // Set a cookie to prevent counting the same visitor multiple times
  const response = NextResponse.next();
  if (!isApiOrStaticRoute(req) && !req.cookies.get("has_visited")) {
    // Set cookie to expire in 24 hours
    response.cookies.set("has_visited", "1", {
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
