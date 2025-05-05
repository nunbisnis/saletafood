import Link from "next/link";

export function ContactBreadcrumb() {
  return (
    <nav className="flex mb-8 text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Beranda
          </Link>
        </li>
        <li className="text-muted-foreground">/</li>
        <li className="text-foreground font-medium">Kontak Kami</li>
      </ol>
    </nav>
  );
}
