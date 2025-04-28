import { redirect } from "next/navigation";
import { getProductBySlug } from "@/data/products";

type Props = {
  params: {
    slug: string;
  };
};

export default function ProductRedirect({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (product) {
    // Redirect to the new URL format
    redirect(`/${product.category.toLowerCase()}/${product.slug}`);
  } else {
    // If product not found, redirect to the products page
    redirect("/produk");
  }
}
