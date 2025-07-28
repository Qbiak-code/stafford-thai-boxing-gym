<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Logo/Brand -->
        <div class="footer-brand">
          <img src="/logo.png" alt="Logo" class="footer-logo" />
        </div>

        <!-- Main Content -->
        <div class="footer-main">
          <p class="footer-title">
            &copy; {{ new Date().getFullYear() }} Stafford Thaiboxing Gym. The Art of Eight Limbs.
            All Rights Reserved.
          </p>
          <p class="footer-subtitle">Built by Qbiak.</p>
        </div>

        <!-- Social Links -->
        <div class="social-links">
          <a href="#" class="social-link facebook-link" aria-label="Facebook">
            <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </a>
          <a href="#" class="social-link instagram-link" aria-label="Instagram">
            <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>
          <a href="#" class="social-link youtube-link" aria-label="YouTube">
            <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </a>
          <WhatsAppButton
            variant="icon"
            :show-text="false"
            phone-number="+447813449416"
            message="Hi! I'd like to know more about Stafford Thai Boxing Gym."
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import WhatsAppButton from './WhatsAppButton.vue'
</script>

<style scoped>
.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: auto;
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
}

/* Logo */
.footer-brand {
  display: flex;
  justify-content: center;
}

.footer-logo {
  height: 3.75rem;
  transition: opacity 0.3s ease;
  opacity: 0.9;
  filter: brightness(0.9);
}

/* Main Content */
.footer-main {
  max-width: 32rem;
}

.footer-title {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.footer-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.social-link:hover {
  color: var(--text-primary);
  background-color: var(--hover-bg);
  transform: translateY(-1px);
}

/* Brand-specific hover colors */
.facebook-link:hover {
  color: #1877F2;
  background-color: rgba(24, 119, 242, 0.1);
}

.instagram-link:hover {
  color: #E4405F;
  background-color: rgba(228, 64, 95, 0.1);
}

.youtube-link:hover {
  color: #FF0000;
  background-color: rgba(255, 0, 0, 0.1);
}

.social-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .footer-main {
    max-width: none;
    flex: 1;
    margin: 0 2rem;
  }
}
</style>
