import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/pages/admin";
import { getProducts } from "@/actions/product-actions";

// Function to map database product status to UI status
function mapProductStatus(status: string): string {
  switch (status) {
    case "AVAILABLE":
      return "Tersedia";
    case "LOW_STOCK":
      return "Stok Menipis";
    case "OUT_OF_STOCK":
      return "Habis";
    default:
      return "Tersedia";
  }
}

export default async function AdminDashboardPage() {
  // Check if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    redirect("/admin/login");
  }

  // Get user details
  const userDetails = await currentUser();

  // Extract only the necessary user information
  const user = userDetails
    ? {
        firstName: userDetails.firstName,
      }
    : null;

  // Fetch products from the database
  const { products: dbProducts } = await getProducts();

  // Map database products to the format expected by the components
  const products = dbProducts
    ? dbProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        category: product.category.name,
        status: mapProductStatus(product.status),
        slug: product.slug,
      }))
    : [];

  return <AdminDashboardClient initialProducts={products} user={user} />;
}
