import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { HeroSettingsForm } from "@/components/pages/admin/settings/HeroSettingsForm";
import { CTASettingsForm } from "@/components/pages/admin/settings/CTASettingsForm";
import { getHeroSettings, getCTASettings } from "@/actions/settings-actions";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Pengaturan Website - SaletaFood Admin",
  description: "Kelola pengaturan website SaletaFood",
};

export default async function SettingsPage() {
  // Check if user is authenticated
  const authResult = await auth();
  const user = await currentUser();

  if (!authResult.userId || !user) {
    redirect("/admin/login");
  }

  // Fetch settings
  const heroSettings = await getHeroSettings();
  const ctaSettings = await getCTASettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Kembali</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Pengaturan Website
          </h1>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Kelola konten yang ditampilkan pada hero section di halaman utama.
            </p>
            <HeroSettingsForm initialData={heroSettings} />
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">CTA Section</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Kelola konten yang ditampilkan pada CTA (Call to Action) section
              di halaman utama.
            </p>
            <CTASettingsForm initialData={ctaSettings} />
          </div>
        </div>
      </div>
    </div>
  );
}
