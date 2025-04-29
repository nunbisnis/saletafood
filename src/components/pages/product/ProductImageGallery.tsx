"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/products";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine main image with additional images
  const allImages =
    product.images && product.images.length > 0
      ? [
          product.image,
          ...product.images.filter((img) => img !== product.image),
        ]
      : [product.image];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative">
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        {allImages.length > 0 && (
          <Image
            src={allImages[currentImageIndex]}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
        )}

        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {product.status === "Stok Menipis" && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Stok Menipis
          </div>
        )}
        {product.status === "Habis" && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Habis
          </div>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-auto pb-2 mt-4">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2",
                currentImageIndex === index
                  ? "border-primary"
                  : "border-transparent"
              )}
            >
              <Image
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
