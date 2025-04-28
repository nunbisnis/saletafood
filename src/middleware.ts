import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { categories } from "@/data/categories";

// Define admin routes that require authentication
const isAdminRoute = createRouteMatcher(["/admin/dashboard(.*)"]);

// Define product category routes
const isCategoryProductRoute = createRouteMatcher(
  categories.map((cat) => `/${cat.name.toLowerCase()}/(.*)`)
);

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes - require authentication
  if (isAdminRoute(req)) {
    await auth.protect();
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
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
