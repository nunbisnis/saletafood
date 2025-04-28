"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    // { href: "/admin/dashboard/products", label: "Produk", icon: Package },
    // { href: "/admin/dashboard/orders", label: "Pesanan", icon: ShoppingCart },
    // { href: "/admin/dashboard/customers", label: "Pelanggan", icon: Users },
    // { href: "/admin/dashboard/settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <header className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">SaletaFood Admin</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-4">
          <div className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80 flex items-center gap-1.5",
                  item.active ? "text-foreground" : "text-foreground/60"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="hidden sm:flex text-sm font-medium transition-colors hover:text-primary items-center gap-1.5"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Lihat Situs</span>
          </Link>
          <UserButton />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted",
                  item.active ? "text-foreground" : "text-foreground/60"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ExternalLink className="h-4 w-4" />
              Lihat Situs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
