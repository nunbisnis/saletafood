import { Metadata } from "next";
import { AdminHeader } from "@/components/pages/admin";

export const metadata: Metadata = {
  title: "Admin - SaletaFood",
  description: "Dashboard admin untuk SaletaFood",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We'll rely on middleware.ts for authentication protection
  // and simply render the header for all admin pages
  return (
    <div className="flex min-h-screen flex-col w-full">
      <AdminHeader />
      <div className="flex w-full items-center justify-center">{children}</div>
    </div>
  );
}
