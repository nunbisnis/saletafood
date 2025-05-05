"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { updateCTASettings } from "@/actions/settings-actions";
import {
  ctaSettingsSchema,
  type CTASettingsFormData,
} from "@/lib/schemas/settings-schema";

interface CTASettingsFormProps {
  initialData: CTASettingsFormData;
}

export function CTASettingsForm({ initialData }: CTASettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<CTASettingsFormData>({
    resolver: zodResolver(ctaSettingsSchema),
    defaultValues: initialData,
  });

  // Handle form submission
  const onSubmit = async (data: CTASettingsFormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateCTASettings(data);

      if (result.success) {
        toast({
          title: "Berhasil!",
          description: "Pengaturan CTA section berhasil diperbarui.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input
                  placeholder="Judul CTA Section"
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
                  placeholder="Deskripsi CTA Section"
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

        {/* Button Text Field */}
        <FormField
          control={form.control}
          name="buttonText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teks Tombol</FormLabel>
              <FormControl>
                <Input
                  placeholder="Teks Tombol"
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

        {/* Button URL Field */}
        <FormField
          control={form.control}
          name="buttonUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Tombol</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
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
