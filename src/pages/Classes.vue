<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-12">Our Classes</h1>

    <!-- Classes Hero Section -->
    <div class="flex flex-col md:flex-row items-center gap-12 mb-20">
      <div class="md:w-1/2">
        <img
          src="https://picsum.photos/id/211/800/600"
          alt="Muay Thai Class"
          class="w-full rounded-lg shadow-2xl mb-4"
        />
      </div>
      <div class="md:w-1/2">
        <h2 class="text-3xl font-bold mb-6">Train With Us</h2>
        <p class="text-lg leading-relaxed">
          We offer a variety of Muay Thai classes suitable for all fitness levels and experience.
          Whether you're a complete beginner or an experienced fighter, our expert instructors will
          guide you on your martial arts journey.
        </p>
      </div>
    </div>

    <!-- Class Types -->
    <h2 class="text-4xl font-bold text-center mb-12">Class Types</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="classType in classes"
        :key="classType.id"
        class="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <img :src="classType.img" :alt="classType.name" class="w-full h-60 object-cover" />
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">{{ classType.name }}</h3>
          <p class="text-sm font-semibold mb-3 text-blue-600">{{ classType.level }}</p>
          <p class="leading-relaxed mb-4">{{ classType.description }}</p>
          <div class="text-sm">
            <p><strong>Duration:</strong> {{ classType.duration }}</p>
            <p><strong>Schedule:</strong> {{ classType.schedule }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="text-center mt-16">
      <h3 class="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
      <p class="text-lg mb-8">Join us for a trial class and experience the art of Muay Thai</p>
      <router-link
        to="/contact"
        class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Book Your Trial Class
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const classes = [
  {
    id: 1,
    name: "Beginner Muay Thai",
    level: "Beginner",
    description:
      "Perfect for those new to Muay Thai. Learn basic techniques, stance, and conditioning in a supportive environment.",
    duration: "60 minutes",
    schedule: "Mon, Wed, Fri - 6:00 PM",
    img: "https://picsum.photos/id/1005/400/300",
  },
  {
    id: 2,
    name: "Intermediate Training",
    level: "Intermediate",
    description:
      "Build on your foundation with advanced combinations, sparring drills, and intensive conditioning.",
    duration: "75 minutes",
    schedule: "Tue, Thu - 7:00 PM",
    img: "https://picsum.photos/id/1011/400/300",
  },
  {
    id: 3,
    name: "Advanced Fighter Training",
    level: "Advanced",
    description:
      "High-intensity training for experienced practitioners. Includes sparring, competition prep, and advanced techniques.",
    duration: "90 minutes",
    schedule: "Sat - 10:00 AM",
    img: "https://picsum.photos/id/1025/400/300",
  },
  {
    id: 4,
    name: "Kids Muay Thai",
    level: "Ages 8-16",
    description:
      "Fun and safe introduction to Muay Thai for young athletes. Focus on discipline, fitness, and basic techniques.",
    duration: "45 minutes",
    schedule: "Sat - 2:00 PM",
    img: "https://picsum.photos/id/1015/400/300",
  },
  {
    id: 5,
    name: "Fitness Kickboxing",
    level: "All Levels",
    description:
      "High-energy cardio workout using Muay Thai techniques. Great for fitness without the contact.",
    duration: "50 minutes",
    schedule: "Mon, Wed, Fri - 8:00 AM",
    img: "https://picsum.photos/id/1020/400/300",
  },
  {
    id: 6,
    name: "Private Training",
    level: "All Levels",
    description: "One-on-one instruction tailored to your specific goals and skill level.",
    duration: "Flexible",
    schedule: "By Appointment",
    img: "https://picsum.photos/id/1030/400/300",
  },
]
</script>
