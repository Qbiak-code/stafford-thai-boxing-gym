<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-12">Gallery</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-300">Loading gallery images...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-8 max-w-2xl mx-auto">
      <p><strong>Error:</strong> {{ error }}</p>
      <button @click="loadImages" class="mt-2 text-sm underline hover:no-underline">
        Try again
      </button>
    </div>

    <!-- Content when not loading -->
    <div v-if="!loading && !error">
      <!-- Featured Images Section -->
      <div v-if="featuredImages.length > 0" class="mb-16">
        <h2 class="text-3xl font-bold text-center mb-8">Featured</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="image in featuredImages"
            :key="image.id"
            class="group cursor-pointer"
            @click="openModal(image)"
          >
            <div class="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div class="relative">
                <img
                  :src="image.image_url"
                  :alt="image.alt_text || image.title || 'Gallery image'"
                  class="w-full h-80 object-cover bg-gray-200"
                  loading="lazy"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </div>
                </div>
                <!-- Featured badge -->
                <div class="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              </div>
              <div class="p-6 text-center">
                <h3 class="text-xl font-bold mb-2">{{ image.title || 'Untitled' }}</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ image.description || 'No description available' }}
                </p>
                <div class="mt-3">
                  <span class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm capitalize">
                    {{ image.category || 'General' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Filter -->
      <div v-if="allImages.length > 0" class="text-center mb-8">
        <h2 class="text-3xl font-bold mb-6">Training Gallery</h2>
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            {{ category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1) }}
            <span class="ml-1 text-xs opacity-75">
              ({{ category === 'all' ? allImages.length : getImagesByCategory(category).length }})
            </span>
          </button>
        </div>
      </div>

      <!-- All Gallery Images -->
      <div v-if="filteredImages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="image in filteredImages"
          :key="image.id"
          class="group cursor-pointer"
          @click="openModal(image)"
        >
          <div class="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <div class="relative">
              <img
                :src="image.image_url"
                :alt="image.alt_text || image.title || 'Gallery image'"
                class="w-full h-80 object-cover bg-gray-200"
                loading="lazy"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold mb-2">{{ image.title || 'Untitled' }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ image.description || 'No description available' }}
              </p>
              <div class="mt-3">
                <span class="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm capitalize">
                  {{ image.category || 'General' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="allImages.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Images Yet</h3>
        <p class="text-gray-600 dark:text-gray-300">
          We're building our gallery. Check back soon for training photos and gym highlights!
        </p>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" @click="closeModal">
      <div class="relative max-w-4xl max-h-full" @click.stop>
        <!-- Close button -->
        <button @click="closeModal" class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Image -->
        <img
          :src="selectedImage.image_url"
          :alt="selectedImage.alt_text || selectedImage.title || 'Gallery image'"
          class="max-w-full max-h-full object-contain rounded-lg"
        />

        <!-- Image info -->
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
          <h4 class="font-bold text-lg mb-1">{{ selectedImage.title || 'Untitled' }}</h4>
          <p class="text-sm opacity-90" v-if="selectedImage.description">
            {{ selectedImage.description }}
          </p>
          <div class="mt-2">
            <span class="inline-block px-2 py-1 bg-white bg-opacity-20 rounded text-xs capitalize">
              {{ selectedImage.category || 'General' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { galleryAPI } from '@/services/api'
import type { GalleryImage } from '@/types'

// State
const allImages = ref<GalleryImage[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedImage = ref<GalleryImage | null>(null)
const selectedCategory = ref<string>('all')

// Computed properties
const featuredImages = computed(() =>
  allImages.value.filter(image => image.is_featured)
)

const categories = computed(() => {
  const cats = ['all', ...new Set(allImages.value.map(img => img.category || 'general'))]
  return cats.sort()
})

const filteredImages = computed(() => {
  if (selectedCategory.value === 'all') {
    return allImages.value
  }
  return allImages.value.filter(image =>
    (image.category || 'general') === selectedCategory.value
  )
})

// Methods
const loadImages = async () => {
  loading.value = true
  error.value = null
  console.log('🔄 Starting to load images...')

  try {
    const response = await galleryAPI.getImages()
    console.log('📡 API Response:', response)

    if (response.success && response.data) {
      allImages.value = response.data
      console.log('✅ Images loaded:', allImages.value.length, 'items')
      console.log('🖼️ Sample image:', allImages.value[0])
      console.log('⭐ Featured images:', featuredImages.value.length)
    } else {
      throw new Error(response.error || 'Failed to load gallery images')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load gallery images'
    error.value = errorMessage
    console.error('❌ Error loading gallery images:', err)
  } finally {
    loading.value = false
    console.log('🏁 Loading finished. Images count:', allImages.value.length)
  }
}

const getImagesByCategory = (category: string): GalleryImage[] => {
  if (category === 'all') return allImages.value
  return allImages.value.filter(image => (image.category || 'general') === category)
}

const openModal = (image: GalleryImage) => {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedImage.value = null
  document.body.style.overflow = 'auto'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error('Image failed to load:', img.src)
  img.src = 'https://via.placeholder.com/800x600/6B7280/FFFFFF?text=Image+Not+Found'
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log('Image loaded successfully:', img.src)
}

// Handle escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedImage.value) {
    closeModal()
  }
}

// Initialize
onMounted(() => {
  loadImages()
  document.addEventListener('keydown', handleKeyDown)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* Custom scrollbar for modal if needed */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
