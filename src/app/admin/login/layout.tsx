import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin - SaletaFood",
  description: "Halaman login admin untuk SaletaFood",
};

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
