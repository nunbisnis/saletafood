import { z } from "zod";

// Define the hero section settings schema
export const heroSettingsSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  imageUrl: z.string().url("URL gambar tidak valid"),
});

// Define the CTA section settings schema
export const ctaSettingsSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  buttonText: z.string().min(1, "Teks tombol harus diisi"),
  buttonUrl: z.string().url("URL tombol tidak valid"),
});

export type HeroSettingsFormData = z.infer<typeof heroSettingsSchema>;
export type CTASettingsFormData = z.infer<typeof ctaSettingsSchema>;
