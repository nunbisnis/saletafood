import { Metadata } from "next";
import Image from "next/image";
import { Building2, Target, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AboutBreadcrumb } from "@/components/pages/tentang-kami";

export const metadata: Metadata = {
  title: "Tentang Kami - SaletaFood",
  description:
    "Penyedia bahan baku makanan dan minuman berkualitas tinggi untuk industri HORECA",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <AboutBreadcrumb />

      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto"></p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* About Text */}
        <div className="space-y-6">
          <p className="text-lg">
            Bisnis kami adalah penyedia bahan baku makanan dan minuman
            berkualitas tinggi yang melayani kebutuhan industri Hotel, Restoran,
            dan Catering (HORECA) di seluruh Indonesia. Selain melayani pasar
            domestik, kami juga berperan sebagai agen dan perantara perdagangan
            ekspor, menghubungkan produsen lokal dengan pembeli internasional
            dari berbagai negara.
          </p>
          <p className="text-lg">
            Didukung oleh jaringan produsen terpercaya di seluruh nusantara,
            kami memastikan produk yang kami suplai memenuhi standar kualitas,
            keamanan, dan kehalalan yang diakui secara internasional.
          </p>
        </div>

        {/* About Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="SaletaFood Warehouse"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Visi & Misi</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Vision */}
          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Visi</h3>
              </div>
              <p className="text-muted-foreground">
                Menjadi mitra terpercaya dalam rantai pasok makanan dan minuman
                domestik dan internasional yang mengedepankan keberlanjutan dan
                kualitas.
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Misi</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Mendistribusikan produk pangan berkualitas untuk sektor
                    HORECA
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Membuka akses pasar ekspor bagi UMKM produsen lokal
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Membangun kemitraan jangka panjang dengan prinsip kejujuran
                    dan profesionalisme
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Nilai Perusahaan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quality */}
          <div className="text-center p-6 bg-background rounded-lg border hover:shadow-md transition-shadow">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Kualitas</h3>
            <p className="text-muted-foreground">
              Kami berkomitmen untuk menyediakan produk berkualitas tinggi yang
              memenuhi standar keamanan pangan.
            </p>
          </div>

          {/* Integrity */}
          <div className="text-center p-6 bg-background rounded-lg border hover:shadow-md transition-shadow">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Integritas</h3>
            <p className="text-muted-foreground">
              Kami menjalankan bisnis dengan kejujuran, transparansi, dan etika
              yang tinggi.
            </p>
          </div>

          {/* Partnership */}
          <div className="text-center p-6 bg-background rounded-lg border hover:shadow-md transition-shadow">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Kemitraan</h3>
            <p className="text-muted-foreground">
              Kami membangun hubungan jangka panjang yang saling menguntungkan
              dengan semua pemangku kepentingan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
