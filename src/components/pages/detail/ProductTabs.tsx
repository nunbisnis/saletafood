import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { HtmlContent } from "@/components/ui/html-content";

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
          <div className="space-y-6 prose prose-sm md:prose max-w-none">
            {product.furtherDetails.map((detail, index) => (
              <div
                key={`detail-${index}`}
                className="pb-4 border-b last:border-b-0 last:pb-0"
              >
                <HtmlContent html={detail} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Tidak ada informasi tambahan yang tersedia untuk produk ini.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
