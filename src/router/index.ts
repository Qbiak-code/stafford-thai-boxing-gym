import { createRouter, createWebHistory } from "vue-router"
import Home from "@/pages/Home.vue"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/pages/About.vue"),
    },
    {
      path: "/classes",
      name: "classes",
      component: () => import("@/pages/Classes.vue"),
    },
    {
      path: "/timetable",
      name: "timetable",
      component: () => import("@/pages/ClassTimetable.vue"),
    },
    {
      path: "/gallery",
      name: "gallery",
      component: () => import("@/pages/Gallery.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/pages/Contact.vue"),
    },
    {
      path: "/member",
      name: "member-login",
      component: () => import("@/pages/MemberLogin.vue"),
    },
    {
      path: "/member/dashboard",
      name: "member-dashboard",
      component: () => import("@/pages/MemberDashboard.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/subscriptions",
      name: "subscriptions",
      component: () => import("@/pages/SubscriptionCheckout.vue"),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()

    try {
      const isAuthenticated = await authStore.checkAuthStatus()
      if (isAuthenticated) {
        next()
      } else {
        console.log("No active session found, redirecting to login.")
        next("/member")
      }
    } catch (error) {
      console.log("Error checking authentication, redirecting to login:", error)
      next("/member")
    }
  } else {
    next()
  }
})

export default router
