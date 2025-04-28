import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import {
  ProductBreadcrumb,
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
} from "@/components/pages/product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan - SaletaFood",
    };
  }

  return {
    title: `${product.name} - SaletaFood`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Verify that the product is in the correct category
  const categoryParam = decodeURIComponent(category).toLowerCase();
  const productCategory = product.category.toLowerCase();

  if (categoryParam !== productCategory) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductBreadcrumb product={product} />

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <ProductImageGallery product={product} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      <RelatedProducts product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
