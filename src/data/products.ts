// Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: 'Tersedia' | 'Stok Menipis' | 'Habis';
  featured?: boolean;
  rating?: number;
  reviews?: number;
  ingredients?: string[];
  nutritionFacts?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags?: string[];
  slug: string;
}

// Sample products data
export const products: Product[] = [
  {
    id: 1,
    name: "Burger Ayam Pedas",
    description: "Patty ayam juicy dengan saus pedas dan sayuran segar. Dibuat dengan bahan-bahan berkualitas tinggi dan dimasak dengan sempurna untuk memberikan pengalaman makan yang luar biasa.",
    price: 89.99,
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
    category: "Burger",
    status: "Tersedia",
    featured: true,
    rating: 4.8,
    reviews: 124,
    ingredients: ["Daging ayam", "Roti burger", "Selada", "Tomat", "Saus pedas", "Mayones"],
    nutritionFacts: {
      calories: 450,
      protein: 25,
      carbs: 35,
      fat: 22
    },
    tags: ["Pedas", "Ayam", "Burger"],
    slug: "burger-ayam-pedas"
  },
  {
    id: 2,
    name: "Pizza Sayur Supreme",
    description: "Dipenuhi dengan sayuran segar dan keju premium. Adonan tipis yang renyah dengan topping sayuran segar dan keju mozzarella yang meleleh, memberikan kombinasi rasa yang sempurna.",
    price: 129.99,
    image: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg",
    category: "Pizza",
    status: "Tersedia",
    featured: true,
    rating: 4.6,
    reviews: 98,
    ingredients: ["Adonan pizza", "Saus tomat", "Keju mozzarella", "Paprika", "Jamur", "Zaitun", "Bawang bombay"],
    nutritionFacts: {
      calories: 320,
      protein: 15,
      carbs: 40,
      fat: 12
    },
    tags: ["Vegetarian", "Pizza", "Sayuran"],
    slug: "pizza-sayur-supreme"
  },
  {
    id: 3,
    name: "Burger Sapi Klasik",
    description: "Patty daging sapi premium dengan keju dan saus spesial. Burger klasik dengan daging sapi pilihan yang juicy, dilapisi keju cheddar yang meleleh dan saus rahasia kami.",
    price: 99.99,
    image: "https://cdn.pixabay.com/photo/2019/01/29/18/05/burger-3962996_1280.jpg",
    category: "Burger",
    status: "Stok Menipis",
    featured: true,
    rating: 4.9,
    reviews: 156,
    ingredients: ["Daging sapi", "Roti burger", "Keju cheddar", "Selada", "Tomat", "Bawang bombay", "Saus spesial"],
    nutritionFacts: {
      calories: 520,
      protein: 30,
      carbs: 35,
      fat: 28
    },
    tags: ["Daging Sapi", "Burger", "Klasik"],
    slug: "burger-sapi-klasik"
  },
  {
    id: 4,
    name: "Salmon Panggang",
    description: "Fillet salmon segar dengan rempah dan lemon. Salmon premium yang dipanggang sempurna dengan bumbu rempah pilihan dan perasan lemon segar yang menyegarkan.",
    price: 159.99,
    image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/salmon-1238248_1280.jpg",
    category: "Makanan Utama",
    status: "Tersedia",
    featured: true,
    rating: 4.7,
    reviews: 87,
    ingredients: ["Fillet salmon", "Lemon", "Thyme", "Rosemary", "Bawang putih", "Minyak zaitun", "Garam laut"],
    nutritionFacts: {
      calories: 380,
      protein: 32,
      carbs: 5,
      fat: 24
    },
    tags: ["Seafood", "Sehat", "Panggang"],
    slug: "salmon-panggang"
  },
  {
    id: 5,
    name: "Brownies Coklat",
    description: "Brownies coklat lembut dengan taburan kacang. Brownies coklat yang lembut di dalam dan sedikit renyah di luar, dengan taburan kacang yang menambah tekstur.",
    price: 49.99,
    image: "https://cdn.pixabay.com/photo/2014/11/28/08/03/brownie-548591_1280.jpg",
    category: "Dessert",
    status: "Habis",
    rating: 4.5,
    reviews: 112,
    ingredients: ["Coklat dark", "Tepung", "Telur", "Gula", "Mentega", "Kacang almond"],
    nutritionFacts: {
      calories: 320,
      protein: 5,
      carbs: 42,
      fat: 18
    },
    tags: ["Dessert", "Coklat", "Manis"],
    slug: "brownies-coklat"
  },
  {
    id: 6,
    name: "Salad Caesar",
    description: "Salad segar dengan dressing caesar dan crouton. Kombinasi selada romaine yang renyah, parmesan, crouton, dan dressing caesar yang creamy.",
    price: 69.99,
    image: "https://cdn.pixabay.com/photo/2017/03/19/14/59/italian-salad-2156723_1280.jpg",
    category: "Salad",
    status: "Tersedia",
    rating: 4.3,
    reviews: 76,
    ingredients: ["Selada romaine", "Parmesan", "Crouton", "Dressing caesar", "Dada ayam panggang", "Lemon"],
    nutritionFacts: {
      calories: 280,
      protein: 18,
      carbs: 15,
      fat: 16
    },
    tags: ["Salad", "Sehat", "Ayam"],
    slug: "salad-caesar"
  },
  {
    id: 7,
    name: "Es Teh Lemon",
    description: "Teh segar dengan perasan lemon dan daun mint. Minuman menyegarkan yang sempurna untuk menemani makanan Anda.",
    price: 29.99,
    image: "https://cdn.pixabay.com/photo/2016/07/21/11/17/drink-1532300_1280.jpg",
    category: "Minuman",
    status: "Tersedia",
    rating: 4.4,
    reviews: 92,
    ingredients: ["Teh hitam", "Lemon", "Daun mint", "Gula", "Es"],
    nutritionFacts: {
      calories: 120,
      protein: 0,
      carbs: 30,
      fat: 0
    },
    tags: ["Minuman", "Segar", "Dingin"],
    slug: "es-teh-lemon"
  },
  {
    id: 8,
    name: "Kentang Goreng",
    description: "Kentang goreng renyah dengan bumbu spesial. Kentang pilihan yang digoreng hingga renyah di luar dan lembut di dalam.",
    price: 39.99,
    image: "https://cdn.pixabay.com/photo/2016/11/20/09/06/bowl-1842294_1280.jpg",
    category: "Camilan",
    status: "Tersedia",
    rating: 4.6,
    reviews: 145,
    ingredients: ["Kentang", "Minyak nabati", "Garam laut", "Bumbu rahasia"],
    nutritionFacts: {
      calories: 250,
      protein: 3,
      carbs: 35,
      fat: 12
    },
    tags: ["Camilan", "Goreng", "Kentang"],
    slug: "kentang-goreng"
  }
];

// Function to get product by ID
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

// Function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

// Function to get related products
export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

// Function to get featured products
export function getFeaturedProducts(limit: number = 4): Product[] {
  return products
    .filter(p => p.featured)
    .slice(0, limit);
}

// Function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}
