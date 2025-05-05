"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export function LoginRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Use replace instead of push to avoid adding to history stack
      router.replace("/admin/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Add a second effect to handle the case where auth state changes after initial load
  useEffect(() => {
    // Check auth state periodically
    const checkInterval = setInterval(() => {
      if (isLoaded && isSignedIn) {
        router.replace("/admin/dashboard");
        clearInterval(checkInterval);
      }
    }, 500); // Check every 500ms

    // Clean up interval on unmount
    return () => clearInterval(checkInterval);
  }, [isLoaded, isSignedIn, router]);

  return null; // This component doesn't render anything
}
