import Image from "next/image";

interface ProductImageGalleryProps {
  product: any;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  return (
    <div className="relative">
      <div className="relative h-[400px] rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        {product.status === "LOW_STOCK" && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Stok Menipis
          </div>
        )}
        {product.status === "OUT_OF_STOCK" && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Habis
          </div>
        )}
      </div>
    </div>
  );
}
