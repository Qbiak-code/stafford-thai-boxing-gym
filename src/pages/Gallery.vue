<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-12">Gallery</h1>

    <!-- Main Gallery Section -->
    <div class="flex flex-col md:flex-row items-center gap-12 mb-20">
      <div class="md:w-1/2">
        <img
          src="https://picsum.photos/id/211/800/600"
          alt="Gym Interior"
          class="w-full rounded-lg shadow-2xl mb-4"
        />
      </div>
      <div class="md:w-1/2">
        <h2 class="text-3xl font-bold mb-6">Our Training Space</h2>
        <p class="text-lg leading-relaxed">
          Our state-of-the-art facility provides the perfect environment for Muay Thai training.
          From traditional heavy bags to modern equipment, every corner of our gym is designed to
          help you achieve your fitness and martial arts goals.
        </p>
      </div>
    </div>

    <!-- Photo Gallery -->
    <h2 class="text-4xl font-bold text-center mb-12">Training Gallery</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <img :src="photo.img" :alt="photo.title" class="w-full h-80 object-cover" />
        <div class="p-6 text-center">
          <h3 class="text-xl font-bold mb-2">{{ photo.title }}</h3>
          <p class="leading-relaxed">{{ photo.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const photos = [
  {
    id: 1,
    title: "Heavy Bag Training",
    description: "Develop power and technique with our professional heavy bags.",
    img: "https://picsum.photos/id/1005/400/400",
  },
  {
    id: 2,
    title: "Pad Work Sessions",
    description: "One-on-one training with experienced instructors.",
    img: "https://picsum.photos/id/1011/400/400",
  },
  {
    id: 3,
    title: "Sparring Practice",
    description: "Safe and controlled sparring sessions for all levels.",
    img: "https://picsum.photos/id/1025/400/400",
  },
  {
    id: 4,
    title: "Group Classes",
    description: "Train together in our motivating group environment.",
    img: "https://picsum.photos/id/1015/400/400",
  },
  {
    id: 5,
    title: "Strength Training",
    description: "Build the conditioning needed for Muay Thai.",
    img: "https://picsum.photos/id/1020/400/400",
  },
  {
    id: 6,
    title: "Technique Focus",
    description: "Perfect your form with detailed instruction.",
    img: "https://picsum.photos/id/1030/400/400",
  },
]
</script>

<style scoped>
/* Add any additional styles here */
</style>
