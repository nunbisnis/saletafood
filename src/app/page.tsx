import {
  HeroSection,
  FeaturedItems,
  CategoriesSection,
  TestimonialsSection,
  CTASection,
} from "@/components/pages/home";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen ">
      <HeroSection />
      <FeaturedItems />
      <CategoriesSection />
      <CTASection />
    </div>
  );
}
