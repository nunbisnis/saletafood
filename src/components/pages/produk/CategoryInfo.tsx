interface CategoryInfoProps {
  name: string;
  productCount: number;
}

export function CategoryInfo({ name, productCount }: CategoryInfoProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Produk {name}</h2>
      <p className="text-muted-foreground">
        Menampilkan {productCount} item
      </p>
    </div>
  );
}
