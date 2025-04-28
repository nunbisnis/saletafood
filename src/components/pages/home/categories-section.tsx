import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Burger",
    image:
      "https://cdn.pixabay.com/photo/2022/01/17/19/24/burger-6945571_1280.jpg",
  },
  {
    id: 2,
    name: "Pizza",
    image:
      "https://cdn.pixabay.com/photo/2017/02/15/10/57/pizza-2068272_1280.jpg",
  },
  {
    id: 3,
    name: "Salad",
    image:
      "https://cdn.pixabay.com/photo/2016/08/18/18/40/salad-1603608_1280.jpg",
  },
  {
    id: 4,
    name: "Dessert",
    image:
      "https://cdn.pixabay.com/photo/2018/05/01/18/21/eclair-3366430_1280.jpg",
  },
  {
    id: 5,
    name: "Minuman",
    image:
      "https://cdn.pixabay.com/photo/2016/10/22/20/34/wine-1761613_1280.jpg",
  },
  {
    id: 6,
    name: "Camilan",
    image:
      "https://cdn.pixabay.com/photo/2016/11/11/02/05/potato-chips-1815760_1280.jpg",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Jelajahi Kategori
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu/${category.name.toLowerCase()}`}
            >
              <div className="group relative h-40 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors z-10" />
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
