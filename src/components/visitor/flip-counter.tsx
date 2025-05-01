"use client";

import { useEffect, useState, useRef } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipDigitProps {
  digit: string;
  previousDigit?: string;
}

function FlipDigit({ digit, previousDigit }: FlipDigitProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const prevDigitRef = useRef(previousDigit);

  useEffect(() => {
    if (previousDigit !== undefined && digit !== previousDigit) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    prevDigitRef.current = digit;
  }, [digit, previousDigit]);

  return (
    <div className="relative w-9 h-11 mx-0.5 overflow-hidden rounded-md bg-white shadow-md">
      {/* Card background with 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-orange-100"></div>

      {/* Static digit */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xl font-bold text-orange-500">{digit}</div>
      </div>

      {/* Flipping card (animated) */}
      {isFlipping && (
        <div className="absolute inset-0 flex items-center justify-center z-10 animate-fade-out bg-orange-50">
          <div className="text-xl font-bold text-orange-500">
            {prevDigitRef.current}
          </div>
        </div>
      )}

      {/* Reflections and shadows */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/5 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/70" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/10" />

      {/* Side shadows for 3D effect */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-r from-black/10 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-l from-black/10 to-transparent" />
    </div>
  );
}

interface FlipCounterProps {
  count: number;
  loading?: boolean;
  className?: string;
}

export function FlipCounter({
  count,
  loading = false,
  className,
}: FlipCounterProps) {
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    if (!loading && count !== prevCount) {
      setPrevCount(count);
    }
  }, [count, loading, prevCount]);

  // Format the count with commas and convert to string
  const formattedCount = loading ? "0" : count.toString();
  const formattedPrevCount = prevCount.toString();

  // Split the formatted count into individual digits
  const digits = formattedCount.split("");
  const prevDigits = formattedPrevCount.split("");

  // Ensure we have at least 4 digits for better appearance
  while (digits.length < 4) {
    digits.unshift("0");
    if (prevDigits.length < digits.length) {
      prevDigits.unshift("0");
    }
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center mb-2">
        <Users size={18} className="text-orange-500 mr-2" />
        <span className="text-sm font-medium text-orange-600">
          Total Pengunjung
        </span>
      </div>

      <div className="flex p-2 bg-gradient-to-r from-orange-50 via-orange-100/80 to-orange-50 rounded-lg shadow-md border border-orange-200">
        {loading ? (
          <div className="flex items-center justify-center h-12 px-4 text-sm text-orange-400">
            Menghitung...
          </div>
        ) : (
          <div className="flex">
            {digits.map((digit, index) => (
              <FlipDigit
                key={`digit-${index}`}
                digit={digit}
                previousDigit={prevDigits[index]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ClientFlipCounter() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
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

  return <FlipCounter count={visitorCount} loading={loading} />;
}
