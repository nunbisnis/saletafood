import { SignIn } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  // Check if user is already authenticated
  const { userId } = await auth();

  // If user is authenticated, redirect to dashboard
  if (userId) {
    redirect("/admin/dashboard");
  }

  // If user is not authenticated, show login form
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login Admin</h1>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2",
              formFieldInput:
                "border border-input bg-background rounded-md px-3 py-2",
              card: "shadow-none",
              footer: "hidden",
            },
          }}
          routing="path"
          path="/admin/login"
          forceRedirectUrl="/admin/dashboard"
        />
      </Card>
    </div>
  );
}
