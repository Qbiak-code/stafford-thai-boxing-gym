// src/services/galleryUpload.ts
import { supabase } from "@/lib/supabase"
import type { GalleryImage } from "@/types"

export interface UploadedFile {
  file: File
  preview: string
}

export interface UploadResult {
  success: boolean
  imageId?: string
  url?: string
  error?: string
}

class GalleryUploadService {
  private readonly BUCKET_NAME = "gallery-images"
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private readonly ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "File type not supported. Please use JPEG, PNG, WebP, or GIF.",
      }
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "File too large. Maximum size is 5MB.",
      }
    }

    return { valid: true }
  }

  /**
   * Generate unique filename with timestamp
   */
  private generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const extension = originalName.split(".").pop()
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "-")
    return `${timestamp}-${sanitizedName}.${extension}`
  }

  /**
   * Upload single image to Supabase Storage
   */
  async uploadImage(
    file: File,
    metadata: {
      title?: string
      description?: string
      category?: string
      is_featured?: boolean
    },
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.name)
      const filePath = `uploads/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath)

      if (!urlData.publicUrl) {
        throw new Error("Failed to get public URL")
      }

      // Create database record
      const { data: imageData, error: dbError } = await supabase
        .from("gallery_images")
        .insert({
          title: metadata.title || file.name,
          description: metadata.description || null,
          category: metadata.category || "general",
          image_url: urlData.publicUrl,
          thumbnail_url: urlData.publicUrl, // Use same URL for now
          storage_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          is_featured: metadata.is_featured || false,
          sort_order: 0,
        })
        .select()
        .single()

      if (dbError) throw dbError

      return {
        success: true,
        imageId: imageData.id,
        url: urlData.publicUrl,
      }
    } catch (error) {
      console.error("Upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: UploadedFile[],
    defaultMetadata: {
      category?: string
      is_featured?: boolean
    } = {},
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (const uploadedFile of files) {
      const result = await this.uploadImage(uploadedFile.file, {
        title: uploadedFile.file.name,
        category: defaultMetadata.category,
        is_featured: defaultMetadata.is_featured,
      })
      results.push(result)
    }

    return results
  }

  /**
   * Delete image from storage and database
   */
  async deleteImage(imageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get image data first
      const { data: image, error: fetchError } = await supabase
        .from("gallery_images")
        .select("storage_path")
        .eq("id", imageId)
        .single()

      if (fetchError) throw fetchError

      // Delete from storage
      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove([image.storage_path])

        if (storageError) {
          console.warn("Storage deletion failed:", storageError)
          // Continue with database deletion even if storage fails
        }
      }

      // Delete from database
      const { error: dbError } = await supabase.from("gallery_images").delete().eq("id", imageId)

      if (dbError) throw dbError

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Deletion failed",
      }
    }
  }

  /**
   * Create preview URL for uploaded file
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  /**
   * Clean up preview URLs to prevent memory leaks
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
}

export const galleryUploadService = new GalleryUploadService()
export default galleryUploadService
