"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { updateHeroSettings } from "@/actions/settings-actions";
import {
  heroSettingsSchema,
  type HeroSettingsFormData,
} from "@/lib/schemas/settings-schema";

interface HeroSettingsFormProps {
  initialData: HeroSettingsFormData;
}

export function HeroSettingsForm({ initialData }: HeroSettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialData.imageUrl);
  const [imageError, setImageError] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<HeroSettingsFormData>({
    resolver: zodResolver(heroSettingsSchema),
    defaultValues: initialData,
  });

  // Handle form submission
  const onSubmit = async (data: HeroSettingsFormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateHeroSettings(data);

      if (result.success) {
        toast({
          title: "Berhasil!",
          description: "Pengaturan hero section berhasil diperbarui.",
        });
        router.refresh();
      } else {
        toast({
          title: "Gagal!",
          description:
            result.error || "Terjadi kesalahan saat memperbarui pengaturan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Terjadi kesalahan saat memperbarui pengaturan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image URL change for preview
  const handleImageUrlChange = (url: string) => {
    setPreviewImage(url);
    setImageError(false); // Reset error state when URL changes
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Preview */}
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full h-[200px] mb-4 overflow-hidden rounded-md">
              {imageError ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                  <p>Invalid image URL</p>
                </div>
              ) : (
                <Image
                  src={previewImage}
                  alt="Hero Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Preview gambar hero section
            </p>
          </CardContent>
        </Card>

        {/* Image URL Field */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleImageUrlChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input
                  placeholder="Judul Hero Section"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi Hero Section"
                  className="resize-none"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </form>
    </Form>
  );
}
