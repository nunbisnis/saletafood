import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand and description */}
          <div className="md:w-1/3 space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                SaletaFood
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Makanan lezat diantar ke rumah Anda. Bahan segar, rasa luar biasa.
            </p>

            {/* Social media icons */}
            <div className="flex space-x-4 pt-2">
              <Link
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-orange-500 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-orange-500 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-orange-500 transition-colors"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Menu Cepat</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Syarat Layanan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-muted-foreground hover:text-orange-500 transition-colors"
                  >
                    Kebijakan Cookie
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} />
                  <span>Jl. Makanan No. 123, Jakarta</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={16} />
                  <span>info@saletafood.com</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={16} />
                  <span>+62 812 3456 7890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SaletaFood. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
