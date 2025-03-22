'use client';

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';
import { toast } from '@/components/ui/use-toast';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string, path: string) => void;
  bucket: 'home' | 'projects' | 'about-me';
  path: string;
  variant?: 'about' | 'hero';
  defaultImage?: string;
}

export function ImageUpload({ 
  onUploadComplete, 
  bucket, 
  path,
  variant = 'about',
  defaultImage
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  // Set aspect ratio and circular crop based on variant
  const aspectRatio = variant === 'hero' ? 1 : 16/9;
  const circularCrop = variant === 'hero';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !completedCrop || !imageRef.current) {
      return;
    }

    if (!isSupabaseAvailable() || !supabase) {
      toast({
        title: "Error",
        description: "Storage service not available",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Get the cropped image blob
      const croppedBlob = await getCroppedImg(imageRef.current, completedCrop);
      
      // Create a new file from the blob
      const fileName = `${path}_${Math.random().toString(36).substring(2, 15)}.jpg`;
      const filePath = `${path}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, croppedBlob, {
          contentType: 'image/*',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL - ensure we're using the correct path format
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Make sure we're passing the complete URL
      const publicUrl = data.publicUrl;
      console.log('Generated public URL:', publicUrl);

      // Pass the public URL
      onUploadComplete(publicUrl, filePath);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Select Image</Label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image')?.click()}
        >
          Choose File
        </Button>
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <ReactCrop
            crop={crop}
            onChange={(c: Crop) => setCrop(c)}
            onComplete={(c: PixelCrop) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={circularCrop}
          >
            <div className="relative w-full h-[400px]">
              <Image
                ref={imageRef}
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </ReactCrop>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!completedCrop || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      )}
    </div>
  );
} 