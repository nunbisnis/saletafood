import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getProductBySlug,
  getProductsByCategory,
} from "@/actions/product-actions";
import {
  ProductBreadcrumb,
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  RelatedProducts,
} from "@/components";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product, error } = await getProductBySlug(slug);

  if (error || !product) {
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Pass true to increment the view count when fetching the product
  const { product, error } = await getProductBySlug(slug, true);

  if (error || !product) {
    notFound();
  }

  // Get related products from the same category
  const { products: categoryProducts } = await getProductsByCategory(
    product.category.slug,
    5
  );

  // Filter out the current product and limit to 4 items
  const relatedProducts = categoryProducts
    ? categoryProducts.filter((p) => p.id !== product.id).slice(0, 4)
    : [];

  // Product price is already serialized in the getProductBySlug function

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductBreadcrumb product={product} />

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <ProductImageGallery product={product} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      {relatedProducts.length > 0 && (
        <RelatedProducts product={product} relatedProducts={relatedProducts} />
      )}
    </div>
  );
}
