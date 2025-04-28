import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample food data
const featuredItems = [
  {
    id: 1,
    name: "Burger Ayam Pedas",
    description: "Patty ayam juicy dengan saus pedas dan sayuran segar",
    price: 89.99,
    image:
      "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
  },
  {
    id: 2,
    name: "Pizza Sayur Supreme",
    description: "Dipenuhi dengan sayuran segar dan keju premium",
    price: 129.99,
    image:
      "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
  },
  {
    id: 3,
    name: "Burger Sapi Klasik",
    description: "Patty daging sapi premium dengan keju dan saus spesial",
    price: 99.99,
    image:
      "https://cdn.pixabay.com/photo/2019/01/29/18/05/burger-3962996_1280.jpg",
  },
  {
    id: 4,
    name: "Salmon Panggang",
    description: "Fillet salmon segar dengan rempah dan lemon",
    price: 159.99,
    image:
      "https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_1280.jpg",
  },
];

export function FeaturedItems() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Menu Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <span className="text-lg font-bold">
                  Rp{item.price.toFixed(3)}
                </span>
                <Button size="sm">Tambah ke Keranjang</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/menu">Lihat Semua Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
