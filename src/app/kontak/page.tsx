import { Metadata } from "next";
import { ContactBreadcrumb, GoogleMap, ContactInfo } from "@/components/pages/contact";

export const metadata: Metadata = {
  title: "Kontak Kami - SaletaFood",
  description: "Hubungi SaletaFood untuk informasi lebih lanjut tentang produk kami",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <ContactBreadcrumb />
      
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Kontak Kami</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Kami siap membantu Anda dengan pertanyaan, pesanan, atau informasi lebih lanjut
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Information */}
        <ContactInfo />

        {/* Google Map */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Lokasi Kami</h2>
          <GoogleMap 
            latitude={-7.4207643} 
            longitude={109.2478781} 
            zoom={15}
            height="400px"
          />
        </div>
      </div>
    </div>
  );
}
