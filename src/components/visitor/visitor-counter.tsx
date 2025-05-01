"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerVisitAndFetchCount = async () => {
      try {
        setLoading(true);

        // Register this visit
        const registerResponse = await fetch("/api/visitors", {
          method: "POST",
        });

        if (!registerResponse.ok) {
          throw new Error("Failed to register visit");
        }

        const data = await registerResponse.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error("Error with visitor tracking:", error);

        // Fallback to just getting the count if registration fails
        try {
          const getResponse = await fetch("/api/visitors", {
            method: "GET",
          });

          if (getResponse.ok) {
            const data = await getResponse.json();
            setVisitorCount(data.count);
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
