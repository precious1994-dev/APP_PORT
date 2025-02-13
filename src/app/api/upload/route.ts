import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  try {
    // Log environment variables (without secrets)
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    });

    const session = await getServerSession();
    if (!session) {
      console.log('Auth failed: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File details:', {
      type: file.type,
      size: file.size,
      name: file.name
    });

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File size too large' }, { status: 400 });
    }

    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log('Attempting Cloudinary upload...');
    // Upload to Cloudinary with unique filename
    const timestamp = Date.now();
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'portfolio',
      public_id: `upload_${timestamp}`,
      overwrite: true
    });
    console.log('Upload successful:', result.secure_url);

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error?.message || 'Unknown error',
      name: error?.name || 'Error',
      stack: error?.stack || ''
    });
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
} 