"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import Image from "next/image";

interface MultipleImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  defaultImages?: string[];
  className?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  onImagesUploaded,
  defaultImages = [],
  className = "",
  maxImages = 5,
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Log for debugging
  console.log("MultipleImageUpload defaultImages:", defaultImages);
  console.log("MultipleImageUpload initial images state:", images);

  // Update images when defaultImages changes
  useEffect(() => {
    console.log("defaultImages changed:", defaultImages);
    if (defaultImages && Array.isArray(defaultImages)) {
      console.log("Setting images to:", defaultImages);
      setImages([...defaultImages]);
    }
  }, [defaultImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if maximum number of images is reached
    if (images.length >= maxImages) {
      setError(`Maksimal ${maxImages} gambar diperbolehkan`);
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      const newImages = [...images, data.url];
      setImages(newImages);
      onImagesUploaded(newImages);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="multiple-image-upload"
      />

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative rounded-md border border-gray-200 p-2"
            >
              <div className="relative">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  width={150}
                  height={150}
                  className="object-contain w-full h-32"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            {images.length === 0
              ? "Unggah gambar produk (JPG, PNG, WebP)"
              : `Tambahkan gambar lainnya (${images.length}/${maxImages})`}
          </p>
          <Label
            htmlFor="multiple-image-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
          >
            {isUploading ? "Mengunggah..." : "Pilih Gambar"}
            {images.length === 0 ? (
              <Upload className="ml-2 h-4 w-4" />
            ) : (
              <Plus className="ml-2 h-4 w-4" />
            )}
          </Label>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
