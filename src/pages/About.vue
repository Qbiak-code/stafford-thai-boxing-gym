<template>
  <div class="about-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>About Our Gym</h1>
        <p>Discover the story behind Stafford's premier Muay Thai training facility</p>
      </div>

      <!-- Our Story Section -->
      <div class="story-section">
        <div class="story-content">
          <div class="story-text">
            <h2>Our Story</h2>
            <p class="lead-text">
              Founded with a passion for the sport and a desire to build a strong, supportive
              community, Stafford Thaiboxing Gym has become the heart of martial arts training in
              Staffordshire.
            </p>
            <p class="supporting-text">
              We believe that Muay Thai is for everyone, regardless of age, gender, or fitness
              level. Our mission is to provide the highest quality instruction in a safe and
              welcoming environment where every member can achieve their personal goals.
            </p>

            <!-- Story Stats -->
            <div class="story-stats">
              <div class="stat-card">
                <div class="stat-number">5+</div>
                <div class="stat-label">Years Training</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">200+</div>
                <div class="stat-label">Active Members</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">100%</div>
                <div class="stat-label">Commitment</div>
              </div>
            </div>
          </div>

          <div class="story-image">
            <img
              src="https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images//7a8800a5-5f14-486c-b790-93bc4bd4054f.JPG"
              alt="Gym Interior"
              class="featured-image"
            />
          </div>
        </div>
      </div>

      <!-- Meet The Coaches Section -->
      <div class="coaches-section">
        <div class="section-header">
          <h2>Meet The Coaches</h2>
          <p>Learn from experienced professionals dedicated to your success</p>
        </div>

        <div class="coaches-grid">
          <div v-for="coach in coaches" :key="coach.name" class="coach-card">
            <div class="coach-image">
              <img :src="coach.img" :alt="coach.name" />
            </div>

            <div class="coach-content">
              <h3 class="coach-name">{{ coach.name }}</h3>
              <p class="coach-title">{{ coach.title }}</p>
              <p class="coach-bio">{{ coach.bio }}</p>

              <div class="coach-specialties">
                <h4>Specialties:</h4>
                <div class="specialty-tags">
                  <span
                    v-for="specialty in coach.specialties"
                    :key="specialty"
                    class="specialty-tag"
                  >
                    {{ specialty }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="values-section">
        <div class="section-header">
          <h2>Our Values</h2>
          <p>The principles that guide everything we do</p>
        </div>

        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3>Community</h3>
            <p>Building lasting friendships and supporting each other's growth</p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3>Excellence</h3>
            <p>Striving for the highest standards in training and technique</p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3>Respect</h3>
            <p>Honoring the traditions of Muay Thai and treating everyone with dignity</p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3>Safety</h3>
            <p>Creating a secure environment where everyone can train confidently</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <div class="cta-content">
          <h2>Ready to Join Our Community?</h2>
          <p>Experience the Stafford Thaiboxing difference for yourself</p>
          <div class="cta-buttons">
            <router-link to="/contact" class="btn btn-primary btn-lg">
              Book Trial Class
            </router-link>
            <router-link to="/timetable" class="btn btn-ghost btn-lg"> View Classes </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const coaches = [
  {
    name: "John Wincott",
    title: "Head Coach & Founder",
    bio:
      "With over 27 years of experience in Muay Thai, I’ve dedicated my life to mastering and sharing the art of eight limbs. As a former professional fighter ranked in the top ten in Britain and a past champion, I bring both competitive pedigree and a deep passion for the sport to every session.\n" +
      "\n" +
      "I originally took over the gym as a non-profit, community-focused space, driven by the desire to give back to the sport that shaped me. Over time, I realised that doing what I love full-time was the only path forward. Today, Stafford Thaiboxing Gym is my business, my passion, and my mission.\n" +
      "\n" +
      "We’ve built an incredible team and a welcoming environment where everyone—from total beginners to aspiring fighters—can thrive. Whether you’re here to get fit, build confidence, or step into the ring, you’ll be coached with care, discipline, and genuine experience.\n" +
      "\n" +
      "We welcome juniors aged 8–15 and adults of all levels. Whatever your goals, we’ll help you reach them.",
    img: "https://picsum.photos/id/1005/400/400",
    specialties: [
      "Beginner Training",
      "Women's Classes",
      "Fitness Conditioning",
      "Competition Prep",
      "Technique Development",
    ],
  },
]
</script>

<style scoped>
.about-page {
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
  margin-bottom: 4rem;
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

/* Story Section */
.story-section {
  margin-bottom: 5rem;
}

.story-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .story-content {
    grid-template-columns: 1.2fr 1fr;
  }
}

.story-text h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.lead-text {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.supporting-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.story-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent-gold);
  display: block;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.story-image {
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

/* Section Headers */
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

/* Coaches Section */
.coaches-section {
  margin-bottom: 5rem;
}

.coaches-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .coaches-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 1024px) {
  .coaches-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.coach-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.coach-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-strong);
}

.coach-image {
  height: 16rem;
  overflow: hidden;
}

.coach-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.coach-card:hover .coach-image img {
  transform: scale(1.05);
}

.coach-content {
  padding: 1.5rem;
}

.coach-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.coach-title {
  color: var(--accent-gold);
  font-weight: 500;
  margin-bottom: 1rem;
}

.coach-bio {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.coach-specialties h4 {
  font-size: 0.875rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.specialty-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.specialty-tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  font-size: 0.75rem;
}

/* Values Section */
.values-section {
  margin-bottom: 4rem;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .values-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.value-card {
  text-align: center;
  padding: 2rem 1.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.value-icon {
  width: 3rem;
  height: 3rem;
  background-color: var(--accent-gold);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.value-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--bg-primary);
}

.value-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.value-card p {
  color: var(--text-secondary);
  line-height: 1.5;
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
