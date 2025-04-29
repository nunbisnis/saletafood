"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ProductFormSkeleton() {
  return (
    <Card>
      <form>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-7 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full max-w-md" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Product Name and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="border border-dashed border-input rounded-lg p-4 flex flex-col items-center justify-center">
                  <Skeleton className="h-32 w-full rounded-md" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </form>
    </Card>
  );
}
