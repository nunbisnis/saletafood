import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData();
  const file = form.get("file") as File;
  const folder = (form.get("folder") as string) || ""; // Get folder path if provided

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  try {
    // Generate a unique filename with original extension
    const uniqueId = crypto.randomUUID();

    // Create path with folder if provided
    let filePath = "";

    if (folder) {
      // Sanitize folder name to prevent path traversal
      const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_/]/g, "");
      // Ensure folder path ends with a slash
      const folderPath = sanitizedFolder.endsWith("/")
        ? sanitizedFolder
        : `${sanitizedFolder}/`;
      filePath = `${folderPath}${uniqueId}-${file.name}`;
    } else {
      filePath = `${uniqueId}-${file.name}`;
    }

    // Upload to Vercel Blob
    const blob = await put(filePath, file, {
      access: "public",
    });

    // Return the URL and other metadata
    return NextResponse.json({
      url: blob.url,
      path: filePath,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error },
      { status: 500 }
    );
  }
}
