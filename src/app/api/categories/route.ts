import { NextResponse } from "next/server";
import { getCategories } from "@/actions/category-actions";

export async function GET() {
  try {
    const result = await getCategories();

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
