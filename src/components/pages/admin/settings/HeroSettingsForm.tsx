"use client";

import { useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import { Loader2, ImageIcon } from "lucide-react";
import { updateHeroSettings } from "@/actions/settings-actions";
import {
  heroSettingsSchema,
  type HeroSettingsFormData,
} from "@/lib/schemas/settings-schema";
import { uploadFile, validateImageFile } from "@/lib/upload-utils";

interface HeroSettingsFormProps {
  initialData: HeroSettingsFormData;
}

export function HeroSettingsForm({ initialData }: HeroSettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState(initialData.imageUrl);
  const [imageError, setImageError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  // Process files for upload
  const processFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // We only need one image for hero section, so just use the first file
      const file = files[0];

      // Validate the file
      const validationError = validateImageFile(file, 2); // Max 2MB
      if (validationError) {
        toast({
          title: "Error",
          description: validationError,
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Update progress
      setUploadProgress(50);

      // Upload the file to the settings/hero folder
      const imageUrl = await uploadFile(file, "settings/hero");

      // Update the form data
      form.setValue("imageUrl", imageUrl);

      // Update preview
      setPreviewImage(imageUrl);
      setImageError(false);

      // Update progress
      setUploadProgress(100);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
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

        {/* Image Upload */}
        <div className="space-y-4">
          <div>
            <Label>Unggah Gambar Hero</Label>
            <div
              className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary/50"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="hero-image-upload"
              />
              <div className="space-y-2">
                <div className="flex justify-center">
                  <ImageIcon
                    className={`h-12 w-12 ${
                      isDragging ? "text-primary" : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <label
                    htmlFor="hero-image-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                  >
                    <span>Klik untuk unggah</span>
                  </label>{" "}
                  atau seret dan lepas
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF hingga 2MB
                </p>
                {isUploading && (
                  <div className="w-full mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">ATAU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

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
        </div>

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
