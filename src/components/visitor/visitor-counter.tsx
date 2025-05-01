"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import {
  getVisitorCount,
  incrementVisitorCount,
} from "@/actions/visitor-actions";

// Helper function to get client IP address
async function getClientIp(): Promise<string> {
  try {
    // Try to get IP from a public API
    const response = await fetch("https://api.ipify.org?format=json");
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error("Error getting client IP:", error);
  }

  // Fallback to a placeholder if we can't determine the IP
  return "0.0.0.0";
}

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerVisitAndFetchCount = async () => {
      try {
        setLoading(true);

        // Get client IP address
        const ipAddress = await getClientIp();

        // Register this visit using server action
        const result = await incrementVisitorCount(ipAddress);

        if ("count" in result && typeof result.count === "number") {
          setVisitorCount(result.count);
        } else {
          throw new Error("Failed to register visit");
        }
      } catch (error) {
        console.error("Error with visitor tracking:", error);

        // Fallback to just getting the count if registration fails
        try {
          const countResult = await getVisitorCount();
          if ("count" in countResult && typeof countResult.count === "number") {
            setVisitorCount(countResult.count);
          }
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    registerVisitAndFetchCount();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
      <Users size={16} className="text-orange-500" />
      <span>
        {loading ? (
          "Menghitung pengunjung..."
        ) : visitorCount !== null ? (
          <>
            Total Kunjungan:{" "}
            <span className="font-semibold">
              {visitorCount.toLocaleString()}
            </span>
          </>
        ) : (
          "Tidak dapat memuat jumlah pengunjung"
        )}
      </span>
    </div>
  );
}
