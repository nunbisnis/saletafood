"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/visitors", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch visitor count");
        }

        const data = await response.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors">
      <Users size={16} className="text-orange-500" />
      <span>
        {loading ? (
          "Menghitung pengunjung..."
        ) : visitorCount !== null ? (
          <>
            Total Pengunjung:{" "}
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
