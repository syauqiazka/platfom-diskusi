'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMaterial(file: File, classId?: string) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve) => {
      cloudinary.uploader.upload_stream(
        {
          folder: classId ? `materials/${classId}` : 'materials/global',
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error) {
            resolve({ ok: false, error: 'Gagal upload file' });
          } else {
            resolve({ ok: true, data: { url: result.secure_url, publicId: result.public_id } });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('upload error:', error);
    return { ok: false, error: 'Gagal upload file' };
  }
}

export async function uploadAvatar(file: File, userId: string) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `avatars/${userId}`,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error: any, result: any) => {
          if (error) {
            resolve({ ok: false, error: 'Gagal upload avatar' });
          } else {
            resolve({ ok: true, data: { url: result.secure_url } });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('avatar upload error:', error);
    return { ok: false, error: 'Gagal upload avatar' };
  }
}
