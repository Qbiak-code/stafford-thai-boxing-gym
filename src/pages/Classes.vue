<template>
  <div class="classes-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Our Classes</h1>
        <p>Discover the perfect training program for your martial arts journey</p>
      </div>

      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h2>Train With Us</h2>
            <p>
              We offer a variety of Muay Thai classes suitable for all fitness levels and experience.
              Whether you're a complete beginner or an experienced fighter, our expert instructors will
              guide you on your martial arts journey.
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">6</span>
                <span class="stat-label">Class Types</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">3</span>
                <span class="stat-label">Skill Levels</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">20+</span>
                <span class="stat-label">Weekly Sessions</span>
              </div>
            </div>
          </div>
          <div class="hero-image">
            <img
              src="https://picsum.photos/id/211/800/600"
              alt="Muay Thai Training"
              class="featured-image"
            />
          </div>
        </div>
      </div>

      <!-- Class Types -->
      <div class="classes-section">
        <div class="section-header">
          <h2>Class Types</h2>
          <p>Choose the training style that matches your goals and experience level</p>
        </div>

        <div class="classes-grid">
          <div
            v-for="classType in classes"
            :key="classType.id"
            class="class-card"
          >
            <div class="class-image">
              <img :src="classType.img" :alt="classType.name" />
              <div class="class-level-badge" :class="getLevelClass(classType.level)">
                {{ classType.level }}
              </div>
            </div>

            <div class="class-content">
              <h3 class="class-name">{{ classType.name }}</h3>
              <p class="class-description">{{ classType.description }}</p>

              <div class="class-details">
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="detail-info">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">{{ classType.duration }}</span>
                  </div>
                </div>

                <div class="detail-item">
                  <div class="detail-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="detail-info">
                    <span class="detail-label">Schedule</span>
                    <span class="detail-value">{{ classType.schedule }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="cta-section">
        <div class="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join us for a trial class and experience the art of Muay Thai</p>
          <div class="cta-buttons">
            <router-link to="/contact" class="btn btn-primary btn-lg">
              Book Trial Class
            </router-link>
            <router-link to="/timetable" class="btn btn-ghost btn-lg">
              View Timetable
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const classes = [
  {
    id: 1,
    name: "Beginner Muay Thai",
    level: "Beginner",
    description: "Perfect for those new to Muay Thai. Learn basic techniques, stance, and conditioning in a supportive environment.",
    duration: "60 minutes",
    schedule: "Mon, Wed, Fri - 6:00 PM",
    img: "https://picsum.photos/id/1005/400/300",
  },
  {
    id: 2,
    name: "Intermediate Training",
    level: "Intermediate",
    description: "Build on your foundation with advanced combinations, sparring drills, and intensive conditioning.",
    duration: "75 minutes",
    schedule: "Tue, Thu - 7:00 PM",
    img: "https://picsum.photos/id/1011/400/300",
  },
  {
    id: 3,
    name: "Advanced Fighter Training",
    level: "Advanced",
    description: "High-intensity training for experienced practitioners. Includes sparring, competition prep, and advanced techniques.",
    duration: "90 minutes",
    schedule: "Sat - 10:00 AM",
    img: "https://picsum.photos/id/1025/400/300",
  },
  {
    id: 4,
    name: "Kids Muay Thai",
    level: "Ages 8-16",
    description: "Fun and safe introduction to Muay Thai for young athletes. Focus on discipline, fitness, and basic techniques.",
    duration: "45 minutes",
    schedule: "Sat - 2:00 PM",
    img: "https://picsum.photos/id/1015/400/300",
  },
  {
    id: 5,
    name: "Fitness Kickboxing",
    level: "All Levels",
    description: "High-energy cardio workout using Muay Thai techniques. Great for fitness without the contact.",
    duration: "50 minutes",
    schedule: "Mon, Wed, Fri - 8:00 AM",
    img: "https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images//roman-aguila-nfZKyKlGujs-unsplash.jpg",
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

const getLevelClass = (level: string) => {
  if (level.includes('Beginner')) return 'level-beginner'
  if (level.includes('Intermediate')) return 'level-intermediate'
  if (level.includes('Advanced')) return 'level-advanced'
  if (level.includes('Ages')) return 'level-kids'
  return 'level-all'
}
</script>

<style scoped>
.classes-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
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
}

/* Hero Section */
.hero-section {
  margin-bottom: 4rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-content {
    grid-template-columns: 1.2fr 1fr;
  }
}

.hero-text h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero-text p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.hero-image {
  position: relative;
}

.featured-image {
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: var(--shadow-strong);
}

/* Classes Section */
.classes-section {
  margin-bottom: 4rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.classes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .classes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .classes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Class Cards */
.class-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.class-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-strong);
}

.class-image {
  position: relative;
  height: 12rem;
  overflow: hidden;
}

.class-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.class-card:hover .class-image img {
  transform: scale(1.05);
}

.class-level-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-beginner {
  background-color: #22c55e;
  color: white;
}

.level-intermediate {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
}

.level-advanced {
  background-color: var(--accent-red);
  color: white;
}

.level-kids {
  background-color: #8b5cf6;
  color: white;
}

.level-all {
  background-color: #6b7280;
  color: white;
}

.class-content {
  padding: 1.5rem;
}

.class-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.class-description {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.class-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-icon {
  width: 2rem;
  height: 2rem;
  background-color: var(--bg-tertiary);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon svg {
  width: 1rem;
  height: 1rem;
  color: var(--accent-gold);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
}

.cta-content h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.cta-content p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
