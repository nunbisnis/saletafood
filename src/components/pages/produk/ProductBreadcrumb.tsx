import Link from "next/link";

interface ProductBreadcrumbProps {
  category?: string;
}

export function ProductBreadcrumb({ category }: ProductBreadcrumbProps) {
  return (
    <nav className="flex mb-8 text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Beranda
          </Link>
        </li>
        <li className="text-muted-foreground">/</li>
        {category ? (
          <>
            <li>
              <Link
                href="/produk"
                className="text-muted-foreground hover:text-primary"
              >
                Produk
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li className="text-foreground font-medium">{category}</li>
          </>
        ) : (
          <li className="text-foreground font-medium">Produk</li>
        )}
      </ol>
    </nav>
  );
}
