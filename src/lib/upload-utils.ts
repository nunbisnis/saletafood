/**
 * Uploads a file to the server using the upload API
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Validates if a file is an image and within size limits
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns An error message if validation fails, or null if validation passes
 */
export function validateImageFile(file: File, maxSizeMB = 5): string | null {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return 'File harus berupa gambar (JPG, PNG, GIF, dll)';
  }

  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Ukuran file tidak boleh lebih dari ${maxSizeMB}MB`;
  }

  return null;
}
