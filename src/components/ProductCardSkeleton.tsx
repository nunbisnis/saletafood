import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border/40">
      {/* Image skeleton */}
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <CardHeader className="pb-2">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        
        {/* Rating skeleton */}
        <div className="flex items-center mt-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full mr-1" />
            ))}
          </div>
          <Skeleton className="h-4 w-16 ml-2" />
        </div>

        {/* Description skeleton */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>

      <CardFooter className="flex justify-between pt-0">
        {/* Price skeleton */}
        <Skeleton className="h-6 w-20" />
        
        {/* Button skeleton */}
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}
