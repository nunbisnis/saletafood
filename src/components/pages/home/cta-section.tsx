import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCTASettings } from "@/actions/settings-actions";

export async function CTASection() {
  // Fetch CTA settings from the database
  const { title, description, buttonText, buttonUrl } = await getCTASettings();

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
        <Button size="lg" variant="secondary" asChild>
          <Link
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            {buttonText}
          </Link>
        </Button>
      </div>
    </section>
  );
}
