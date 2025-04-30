import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="ingredients" className="mb-16">
      <TabsList className="mb-6">
        <TabsTrigger value="ingredients">Deskripsi Lebih Lanjut</TabsTrigger>
      </TabsList>

      <TabsContent value="ingredients" className="p-6 bg-muted/30 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Deskripsi Lebih Lanjut</h3>
        {product.furtherDetails && product.furtherDetails.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {product.furtherDetails.map((detail, index) => (
              <li key={`${detail}-${index}`}>{detail}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Tidak ada informasi tambahan yang tersedia untuk produk ini.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
