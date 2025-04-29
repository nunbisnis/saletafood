import Link from "next/link";

interface ProductBreadcrumbProps {
  product: any;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex mb-8 text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-primary">
            Beranda
          </Link>
        </li>
        <li className="text-muted-foreground">/</li>
        <li>
          <Link
            href="/produk"
            className="text-muted-foreground hover:text-primary"
          >
            Produk
          </Link>
        </li>
        <li className="text-muted-foreground">/</li>
        <li>
          <Link
            href={`/produk/${product.category.slug}`}
            className="text-muted-foreground hover:text-primary"
          >
            {product.category.name}
          </Link>
        </li>
        <li className="text-muted-foreground">/</li>
        <li className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}
