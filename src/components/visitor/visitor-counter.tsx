"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getVisitorCount } from "@/actions/visitor-actions";

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        setLoading(true);

        // Just fetch the current count without trying to increment
        const countResult = await getVisitorCount();

        if ("count" in countResult && typeof countResult.count === "number") {
          setVisitorCount(countResult.count);
        } else {
          console.error("Invalid visitor count response:", countResult);
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorCount();

    // Set up an interval to refresh the count every minute
    const intervalId = setInterval(fetchVisitorCount, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
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
