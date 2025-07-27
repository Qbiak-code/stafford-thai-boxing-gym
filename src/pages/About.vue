<template>
  <div class="container mx-auto px-4 py-16 transition-colors duration-200">
    <h1 class="text-4xl font-bold text-center mb-12">About Our Gym</h1>

    <!-- Our Story Section -->
    <div class="flex flex-col md:flex-row items-center gap-12 mb-20">
      <div class="md:w-1/2">
        <img
          src="https://picsum.photos/id/211/800/600"
          alt="Gym Interior"
          class="w-full rounded-lg shadow-2xl mb-4"
        />
      </div>
      <div class="md:w-1/2">
        <h2 class="text-3xl font-bold mb-6">Our Story</h2>
        <p class="text-lg leading-relaxed">
          Founded in [Year], Stafford Thaiboxing Gym was born from a passion for the sport and a desire
          to build a strong, supportive community. We believe that Muay Thai is for everyone,
          regardless of age, gender, or fitness level. Our mission is to provide the highest quality
          instruction in a safe and welcoming environment.
        </p>
      </div>
    </div>

    <!-- Meet The Coaches Section -->
    <h2 class="text-4xl font-bold text-center mb-12">Meet The Coaches</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="coach in coaches"
        :key="coach.name"
        class="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <img :src="coach.img" :alt="coach.name" class="w-full h-80 object-cover" />
        <div class="p-6 text-center">
          <h3 class="text-xl font-bold mb-2">{{ coach.name }}</h3>
          <h4 class="text-blue-600 dark:text-blue-400 font-semibold mb-3">{{ coach.title }}</h4>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ coach.bio }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const coaches = [
  {
    name: "Head Coach Name",
    title: "Head Coach & Founder",
    bio: "A brief bio about the coach, their experience, and their passion.",
    img: "https://picsum.photos/id/1005/400/400",
  },
  {
    name: "Assistant Coach",
    title: "Muay Thai Instructor",
    bio: "Specialises in beginner techniques and fitness conditioning.",
    img: "https://picsum.photos/id/1011/400/400",
  },
  {
    name: "Strength Coach",
    title: "Strength & Conditioning",
    bio: "Focuses on building the power and endurance needed for combat sports.",
    img: "https://picsum.photos/id/1025/400/400",
  },
]
</script>
