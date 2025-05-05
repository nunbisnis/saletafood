import { z } from "zod";

// Define the hero section settings schema
export const heroSettingsSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  imageUrl: z.string().url("URL gambar tidak valid"),
});

export type HeroSettingsFormData = z.infer<typeof heroSettingsSchema>;
