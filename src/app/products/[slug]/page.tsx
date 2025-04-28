import { redirect } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { use } from "react";

export default function ProductRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (product) {
    // Redirect to the new URL format
    redirect(`/${product.category.toLowerCase()}/${product.slug}`);
  } else {
    // If product not found, redirect to the products page
    redirect("/produk");
  }
}
