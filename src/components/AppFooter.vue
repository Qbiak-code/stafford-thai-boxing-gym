<template>
  <footer class="bg-gray-50 dark:bg-gray-800 py-8 mt-auto border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="flex flex-col items-center text-center">
        <div class="mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            class="h-15 mx-auto transition-opacity duration-300 opacity-90 dark:opacity-75 dark:brightness-90"
          />
        </div>
        <div class="max-w-2xl">
          <p class="text-gray-800 dark:text-gray-200 transition-colors">
            &copy; {{ new Date().getFullYear() }} Stafford Thaiboxing Gym. The Art of Eight Limbs. All
            Rights Reserved.
          </p>
          <p class="mt-2 text-gray-600 dark:text-gray-400 transition-colors">
            Built by Fil. Powered by Vue.js & Tailwind CSS.
          </p>
        </div>
        <div class="mt-4 flex space-x-4">
          <a
            href="#"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label="Facebook"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </a>
          <a
            href="#"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-200"
            aria-label="Instagram"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.297c.925.875 1.418 2.026 1.418 3.323s-.493 2.448-1.418 3.323c-.875.925-2.026 1.297-3.323 1.297z"
              />
            </svg>
          </a>
          <a
            href="#"
            class="p-2 text-gray-600 dark:text-gray-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-200"
            aria-label="YouTube"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
