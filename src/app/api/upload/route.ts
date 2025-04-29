import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData();
  const file = form.get('file') as File;
  
  if (!file) {
    return NextResponse.json(
      { error: 'File is required' },
      { status: 400 }
    );
  }

  try {
    // Generate a unique filename with original extension
    const filename = `${crypto.randomUUID()}-${file.name}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Return the URL and other metadata
    return NextResponse.json({
      url: blob.url,
      success: true
    });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error },
      { status: 500 }
    );
  }
}
