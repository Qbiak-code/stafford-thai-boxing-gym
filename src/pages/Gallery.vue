<template>
  <div class="gallery-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Gallery</h1>
        <p>Explore our training environment and community in action</p>

        <!-- Upload button for authenticated users -->
        <button
          v-if="authStore.isAuthenticated"
          @click="showUploadModal = true"
          class="btn btn-primary upload-btn"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Upload Images
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading gallery images...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p><strong>Error:</strong> {{ error }}</p>
        <button @click="loadImages" class="btn btn-ghost btn-sm">Try again</button>
      </div>

      <!-- Gallery Content -->
      <div v-if="!loading && !error">
        <!-- Featured Images Section -->
        <div v-if="featuredImages.length > 0" class="featured-section">
          <div class="section-header">
            <h2>Featured</h2>
            <p>Highlights from our training sessions and events</p>
          </div>

          <div class="featured-grid">
            <div
              v-for="image in featuredImages"
              :key="image.id"
              class="featured-card"
              @click="openModal(image)"
            >
              <div class="image-container">
                <img
                  :src="getImageUrl(image)"
                  :alt="image.alt_text || image.title || 'Gallery image'"
                  class="gallery-image"
                  loading="lazy"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <div class="image-overlay">
                  <div class="overlay-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      ></path>
                    </svg>
                  </div>
                </div>

                <!-- Featured badge -->
                <div class="featured-badge">
                  <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    ></path>
                  </svg>
                  Featured
                </div>

                <!-- Delete button for authenticated users -->
                <button
                  v-if="authStore.isAuthenticated"
                  @click.stop="deleteImage(image.id)"
                  class="delete-btn"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>

              <div class="image-info">
                <h3>{{ image.title || "Untitled" }}</h3>
                <p>{{ image.description || "No description available" }}</p>
                <span class="category-tag">{{ image.category || "General" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div v-if="allImages.length > 0" class="filter-section">
          <h2>Training Gallery</h2>
          <div class="category-filters">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="['filter-btn', { active: selectedCategory === category }]"
            >
              {{
                category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)
              }}
              <span class="filter-count">
                ({{ category === "all" ? allImages.length : getImagesByCategory(category).length }})
              </span>
            </button>
          </div>
        </div>

        <!-- All Gallery Images -->
        <div v-if="filteredImages.length > 0" class="gallery-grid">
          <div
            v-for="image in filteredImages"
            :key="image.id"
            class="gallery-card"
            @click="openModal(image)"
          >
            <div class="image-container">
              <img
                :src="getImageUrl(image)"
                :alt="image.alt_text || image.title || 'Gallery image'"
                class="gallery-image"
                loading="lazy"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div class="image-overlay">
                <div class="overlay-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- Delete button for authenticated users -->
              <button
                v-if="authStore.isAuthenticated"
                @click.stop="deleteImage(image.id)"
                class="delete-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="image-info">
              <h4>{{ image.title || "Untitled" }}</h4>
              <span class="category-tag">{{ image.category || "General" }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="allImages.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <h3>No Images Yet</h3>
          <p>We're building our gallery. Check back soon for training photos and gym highlights!</p>
          <button
            v-if="authStore.isAuthenticated"
            @click="showUploadModal = true"
            class="btn btn-primary"
          >
            Upload First Images
          </button>
        </div>
      </div>

      <!-- Image Modal -->
      <div v-if="selectedImage" class="image-modal" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Close button -->
          <button @click="closeModal" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <!-- Image -->
          <img
            :src="getImageUrl(selectedImage)"
            :alt="selectedImage.alt_text || selectedImage.title || 'Gallery image'"
            class="modal-image"
          />

          <!-- Image info -->
          <div class="modal-info">
            <h4>{{ selectedImage.title || "Untitled" }}</h4>
            <p v-if="selectedImage.description">{{ selectedImage.description }}</p>
            <span class="modal-category">{{ selectedImage.category || "General" }}</span>
          </div>
        </div>
      </div>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="upload-modal">
        <div class="upload-modal-content">
          <div class="upload-header">
            <h3>Upload Images</h3>
            <button @click="closeUploadModal" class="modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="upload-body">
            <!-- File Drop Zone -->
            <div
              @dragover.prevent
              @drop.prevent="handleFileDrop"
              @click="triggerFileInput"
              class="drop-zone"
            >
              <div class="drop-zone-content">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p class="drop-title">Drop images here or click to browse</p>
                <p class="drop-subtitle">PNG, JPG, WebP up to 5MB each</p>
              </div>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                class="file-input"
              />
            </div>

            <!-- Upload Actions -->
            <div class="upload-actions">
              <button @click="closeUploadModal" class="btn btn-ghost">Cancel</button>
              <button @click="uploadImages" class="btn btn-primary">Upload Images</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { galleryAPI } from "@/services/api"
import { useAuthStore } from "@/stores/auth"
import { useModal } from "@/composables/useModal"
import type { GalleryImage } from "@/types"

const authStore = useAuthStore()
const { confirmDelete, alert } = useModal()

// State
const allImages = ref<GalleryImage[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedImage = ref<GalleryImage | null>(null)
const selectedCategory = ref<string>("all")

// Upload state
const showUploadModal = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Computed properties
const featuredImages = computed(() => allImages.value.filter((image) => image.is_featured))

const categories = computed(() => {
  const cats = ["all", ...new Set(allImages.value.map((img) => img.category || "general"))]
  return cats.sort()
})

const filteredImages = computed(() => {
  if (selectedCategory.value === "all") {
    return allImages.value
  }
  return allImages.value.filter((image) => (image.category || "general") === selectedCategory.value)
})

// Methods
const loadImages = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await galleryAPI.getImages()

    if (response.success && response.data) {
      allImages.value = response.data
    } else {
      throw new Error(response.error || "Failed to load gallery images")
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to load gallery images"
    error.value = errorMessage
    console.error("Error loading gallery images:", err)
  } finally {
    loading.value = false
  }
}

const getImagesByCategory = (category: string): GalleryImage[] => {
  if (category === "all") return allImages.value
  return allImages.value.filter((image) => (image.category || "general") === category)
}

const getImageUrl = (image: GalleryImage): string => {
  if (image.storage_path) {
    return `https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images/${image.storage_path}`
  }
  return image.image_url || "https://via.placeholder.com/800x600/6B7280/FFFFFF?text=Image+Not+Found"
}

const openModal = (image: GalleryImage) => {
  selectedImage.value = image
  document.body.style.overflow = "hidden"
}

const closeModal = () => {
  selectedImage.value = null
  document.body.style.overflow = "auto"
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = "https://via.placeholder.com/800x600/6B7280/FFFFFF?text=Image+Not+Found"
}

const handleImageLoad = (event: Event) => {
  // Image loaded successfully
}

// Upload methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    console.log("Files selected:", target.files.length)
  }
}

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files) {
    console.log("Files dropped:", event.dataTransfer.files.length)
  }
}

const uploadImages = async () => {
  console.log("Upload images clicked - functionality coming soon")
  closeUploadModal()
}

const closeUploadModal = () => {
  showUploadModal.value = false
}

const deleteImage = async (imageId: string) => {
  const confirmed = await confirmDelete(
    "Are you sure you want to delete this image? This action cannot be undone.",
  )
  if (!confirmed) return

  try {
    const response = await galleryAPI.deleteImage(imageId)
    if (response.success) {
      allImages.value = allImages.value.filter((img) => img.id !== imageId)
      await alert("Image deleted successfully!", "Success")
    } else {
      throw new Error(response.error || "Failed to delete image")
    }
  } catch (error) {
    console.error("Delete error:", error)
    await alert("Failed to delete image. Please try again.", "Error")
  }
}

// Handle escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    if (selectedImage.value) {
      closeModal()
    } else if (showUploadModal.value) {
      closeUploadModal()
    }
  }
}

// Initialize
onMounted(() => {
  loadImages()
  document.addEventListener("keydown", handleKeyDown)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown)
  document.body.style.overflow = "auto"
})
</script>

<style scoped>
.gallery-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.page-header h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 3rem 0;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  background-color: rgba(178, 34, 34, 0.1);
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--text-secondary);
}

/* Featured Section */
.featured-section {
  margin-bottom: 4rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .featured-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.featured-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-strong);
}

/* Filter Section */
.filter-section {
  margin-bottom: 3rem;
  text-align: center;
}

.filter-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.category-filters {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
  border-color: var(--accent-gold);
}

.filter-btn.active {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
  border-color: var(--accent-gold);
}

.filter-count {
  font-size: 0.75rem;
  opacity: 0.75;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gallery-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* Image Container */
.image-container {
  position: relative;
  height: 12rem;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .gallery-image,
.gallery-card:hover .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.featured-card:hover .image-overlay,
.gallery-card:hover .image-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}

.overlay-icon {
  width: 3rem;
  height: 3rem;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-card:hover .overlay-icon,
.gallery-card:hover .overlay-icon {
  opacity: 1;
}

.featured-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: var(--accent-gold);
  color: var(--bg-primary);
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.delete-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: var(--accent-red);
  color: white;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
}

.featured-card:hover .delete-btn,
.gallery-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background-color: #991b1b;
}

.delete-btn svg {
  width: 1rem;
  height: 1rem;
}

/* Image Info */
.image-info {
  padding: 1rem;
}

.featured-card .image-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.gallery-card .image-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.image-info p {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: capitalize;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: var(--text-muted);
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Image Modal */
.image-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  z-index: 10;
}

.modal-close:hover {
  color: var(--accent-gold);
}

.modal-image {
  max-width: 100%;
  max-height: calc(90vh - 6rem);
  object-fit: contain;
  border-radius: 0.5rem;
}

.modal-info {
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: 0 0 0.5rem 0.5rem;
  border-top: 1px solid var(--border-color);
}

.modal-info h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-info p {
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.modal-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-gold);
  color: var(--bg-primary);
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: capitalize;
}

/* Upload Modal */
.upload-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.upload-modal-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.upload-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.upload-body {
  padding: 1.5rem;
}

.drop-zone {
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
}
</style>
