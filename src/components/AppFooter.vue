<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <h3 class="brand-text">Stafford Thaiboxing Gym</h3>
          <p class="tagline">The Art of Eight Limbs</p>
        </div>
        <div class="footer-text">
          <p class="copyright">
            &copy; {{ new Date().getFullYear() }} Stafford Thaiboxing Gym. All Rights Reserved.
          </p>
          <p class="credit">
            Built with <span class="text-gold">Vue.js</span> & <span class="text-red">Tailwind CSS</span>
          </p>
        </div>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Facebook">
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 2.457c3.297 0 3.688.013 4.99.072 1.201.055 1.953.25 2.373.416.596.23 1.021.505 1.468.952.447.447.722.872.952 1.468.166.42.361 1.172.416 2.373.059 1.302.072 1.693.072 4.99s-.013 3.688-.072 4.99c-.055 1.201-.25 1.953-.416 2.373-.23.596-.505 1.021-.952 1.468-.447.447-.872.722-1.468.952-.42.166-1.172.361-2.373.416-1.302.059-1.693.072-4.99.072s-3.688-.013-4.99-.072c-1.201-.055-1.953-.25-2.373-.416-.596-.23-1.021-.505-1.468-.952-.447-.447-.722-.872-.952-1.468-.166-.42-.361-1.172-.416-2.373C2.47 15.705 2.457 15.314 2.457 12.017s.013-3.688.072-4.99c.055-1.201.25-1.953.416-2.373.23-.596.505-1.021.952-1.468.447-.447.872-.722 1.468-.952.42-.166 1.172-.361 2.373-.416 1.302-.059 1.693-.072 4.99-.072zm0-2.457c-3.351 0-3.771.014-5.088.072-1.312.06-2.207.264-2.99.561-.81.316-1.496.74-2.179 1.424-.683.683-1.108 1.369-1.424 2.179-.297.783-.501 1.678-.561 2.99C.014 8.246 0 8.666 0 12.017s.014 3.771.072 5.088c.06 1.312.264 2.207.561 2.99.316.81.74 1.496 1.424 2.179.683.683 1.369 1.108 2.179 1.424.783.297 1.678.501 2.99.561 1.317.058 1.737.072 5.088.072s3.771-.014 5.088-.072c1.312-.06 2.207-.264 2.99-.561.81-.316 1.496-.74 2.179-1.424.683-.683 1.108-1.369 1.424-2.179.297-.783.501-1.678.561-2.99.058-1.317.072-1.737.072-5.088s-.014-3.771-.072-5.088c-.06-1.312-.264-2.207-.561-2.99-.316-.81-.74-1.496-1.424-2.179-.683-.683-1.369-1.108-2.179-1.424-.783-.297-1.678-.501-2.99-.561C15.788.014 15.368 0 12.017 0z" />
              <path d="M12.017 5.838a6.179 6.179 0 1 0 0 12.358 6.179 6.179 0 0 0 0-12.358zm0 10.178a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998z" />
              <circle cx="18.406" cy="5.594" r="1.44" />
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="YouTube">
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  padding: 2rem 0 1rem;
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: center;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    text-align: left;
  }

  .footer-text {
    text-align: center;
  }

  .social-links {
    justify-self: end;
  }
}

/* Brand Section */
.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 768px) {
  .footer-brand {
    align-items: flex-start;
  }
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
  font-style: italic;
}

/* Footer Text */
.footer-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.copyright {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.credit {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.text-gold {
  color: var(--accent-gold);
}

.text-red {
  color: var(--accent-red);
}

/* Social Links */
.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-decoration: none;
}

.social-link:hover {
  background-color: var(--hover-bg);
  color: var(--accent-gold);
  border-color: var(--accent-gold);
  transform: translateY(-1px);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
