import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const burgerCategory = await prisma.category.upsert({
    where: { slug: "burger" },
    update: {},
    create: {
      name: "Burger",
      description: "Berbagai macam burger lezat",
      slug: "burger",
      image:
        "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
    },
  });

  const pizzaCategory = await prisma.category.upsert({
    where: { slug: "pizza" },
    update: {},
    create: {
      name: "Pizza",
      description: "Pizza dengan berbagai topping",
      slug: "pizza",
      image:
        "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
    },
  });

  const pastaCategory = await prisma.category.upsert({
    where: { slug: "pasta" },
    update: {},
    create: {
      name: "Pasta",
      description: "Pasta Italia dengan berbagai saus",
      slug: "pasta",
      image:
        "https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_1280.jpg",
    },
  });

  const dessertCategory = await prisma.category.upsert({
    where: { slug: "dessert" },
    update: {},
    create: {
      name: "Dessert",
      description: "Hidangan penutup yang manis dan lezat",
      slug: "dessert",
      image:
        "https://cdn.pixabay.com/photo/2018/05/01/18/21/eclair-3366430_1280.jpg",
    },
  });

  // Create products
  // Burger Category
  await prisma.product.upsert({
    where: { slug: "burger-ayam-pedas" },
    update: {},
    create: {
      name: "Burger Ayam Pedas",
      description:
        "Patty ayam juicy dengan saus pedas dan sayuran segar. Dibuat dengan bahan-bahan berkualitas tinggi.",
      price: 45000.0,
      images: [
        "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/01/29/18/05/burger-3962996_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "burger-ayam-pedas",
      categoryId: burgerCategory.id,
      tags: ["Pedas", "Ayam", "Burger"],
    },
  });

  await prisma.product.upsert({
    where: { slug: "burger-sapi-keju" },
    update: {},
    create: {
      name: "Burger Sapi Keju",
      description:
        "Patty daging sapi premium dengan keju cheddar meleleh, selada segar, tomat, dan saus spesial.",
      price: 55000.0,
      images: [
        "https://cdn.pixabay.com/photo/2020/10/05/19/55/hamburger-5630646_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "burger-sapi-keju",
      categoryId: burgerCategory.id,
      tags: ["Sapi", "Keju", "Burger"],
    },
  });

  // Pizza Category
  await prisma.product.upsert({
    where: { slug: "pizza-margherita" },
    update: {},
    create: {
      name: "Pizza Margherita",
      description:
        "Pizza klasik Italia dengan saus tomat, keju mozzarella, dan daun basil segar.",
      price: 85000.0,
      images: [
        "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "pizza-margherita",
      categoryId: pizzaCategory.id,
      tags: ["Italia", "Vegetarian", "Pizza"],
    },
  });

  await prisma.product.upsert({
    where: { slug: "pizza-pepperoni" },
    update: {},
    create: {
      name: "Pizza Pepperoni",
      description:
        "Pizza dengan topping pepperoni gurih, keju mozzarella berlimpah, dan saus tomat spesial.",
      price: 95000.0,
      images: [
        "https://cdn.pixabay.com/photo/2017/12/05/20/10/pizza-3000285_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/12/05/20/10/pizza-3000274_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "pizza-pepperoni",
      categoryId: pizzaCategory.id,
      tags: ["Pepperoni", "Daging", "Pizza"],
    },
  });

  // Pasta Category
  await prisma.product.upsert({
    where: { slug: "spaghetti-carbonara" },
    update: {},
    create: {
      name: "Spaghetti Carbonara",
      description:
        "Spaghetti al dente dengan saus krim telur, keju parmesan, pancetta renyah, dan lada hitam.",
      price: 65000.0,
      images: [
        "https://cdn.pixabay.com/photo/2018/07/18/19/12/pasta-3547078_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/04/08/13/13/pasta-712664_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "spaghetti-carbonara",
      categoryId: pastaCategory.id,
      tags: ["Pasta", "Italia", "Carbonara"],
    },
  });

  await prisma.product.upsert({
    where: { slug: "fettuccine-alfredo" },
    update: {},
    create: {
      name: "Fettuccine Alfredo",
      description:
        "Fettuccine dengan saus krim mentega dan keju parmesan yang kaya. Hidangan pasta klasik yang creamy.",
      price: 68000.0,
      images: [
        "https://cdn.pixabay.com/photo/2020/03/17/17/41/pasta-4941216_1280.jpg",
        "https://cdn.pixabay.com/photo/2014/04/22/02/56/pasta-329522_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "fettuccine-alfredo",
      categoryId: pastaCategory.id,
      tags: ["Pasta", "Italia", "Creamy"],
    },
  });

  // Dessert Category
  await prisma.product.upsert({
    where: { slug: "tiramisu" },
    update: {},
    create: {
      name: "Tiramisu",
      description:
        "Dessert Italia klasik dengan lapisan biskuit lady finger yang dicelupkan ke dalam kopi dan mascarpone cream.",
      price: 35000.0,
      images: [
        "https://cdn.pixabay.com/photo/2017/03/19/18/22/italian-food-2157246_1280.jpg",
        "https://cdn.pixabay.com/photo/2018/04/18/17/22/dessert-3331009_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "tiramisu",
      categoryId: dessertCategory.id,
      tags: ["Dessert", "Italia", "Kopi"],
    },
  });

  await prisma.product.upsert({
    where: { slug: "chocolate-lava-cake" },
    update: {},
    create: {
      name: "Chocolate Lava Cake",
      description:
        "Kue cokelat hangat dengan bagian tengah yang meleleh saat dipotong. Disajikan dengan es krim vanilla.",
      price: 38000.0,
      images: [
        "https://cdn.pixabay.com/photo/2014/11/28/08/03/brownie-548591_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/01/23/15/59/cake-3950200_1280.jpg",
      ],
      status: "AVAILABLE",
      slug: "chocolate-lava-cake",
      categoryId: dessertCategory.id,
      tags: ["Dessert", "Cokelat", "Hangat"],
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
