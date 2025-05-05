"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/saletafood-logo-nav3.png"
                alt="SaletaFood Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              Beranda
            </Link>
            <Link
              href="/produk"
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              Produk
            </Link>
            <Link
              href="/kategori"
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              Kategori
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              Kontak
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart button
            <Link
              href="/cart"
              className="relative p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-xs text-white flex items-center justify-center">
                0
              </span>
            </Link> */}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4 px-2 pt-2 pb-3">
              <Link
                href="/"
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/produk"
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Produk
              </Link>
              <Link
                href="/kategori"
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Kategori
              </Link>
              <Link
                href="/about"
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang Kami
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
