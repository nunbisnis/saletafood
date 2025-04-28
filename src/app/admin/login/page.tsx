import { SignIn } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
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
          redirectUrl="/admin/dashboard"
        />
      </Card>
    </div>
  );
}
