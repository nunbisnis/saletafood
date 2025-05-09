import { NextResponse } from "next/server";
import { getProducts, getProductsByCategory } from "@/actions/product-actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const categorySlug = searchParams.get("category");
    const searchQuery = searchParams.get("search") || undefined;

    let result;

    if (categorySlug) {
      result = await getProductsByCategory(categorySlug, limit);
    } else {
      result = await getProducts(limit, searchQuery);
    }

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
