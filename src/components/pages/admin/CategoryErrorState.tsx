"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface CategoryErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function CategoryErrorState({ error, onRetry }: CategoryErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <p className="font-medium">Error</p>
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
      <p>{error}</p>
    </div>
  );
}
