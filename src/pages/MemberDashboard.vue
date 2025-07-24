<template>
  <div class="member-dashboard-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Member Dashboard</h1>
    </div>

    <section class="section dashboard-content">
      <p>Welcome, {{ userName }}!</p>
      <p v-if="loadingUser" class="status-message">Loading user info...</p>
      <p v-if="loadingProfile" class="status-message">Loading profile...</p>
      <p v-if="error" class="error-message">Error: {{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <form @submit.prevent="saveProfile" v-if="user && !loadingProfile">
        <h2>Your Profile & Medical Info</h2>
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" v-model="profile.name" required />
        </div>
        <div class="form-group">
          <label for="email">Email (Cannot be changed here)</label>
          <input type="email" id="email" v-model="profile.email" disabled />
        </div>
        <div class="form-group">
          <label for="contactNumber">Contact Number</label>
          <input type="tel" id="contactNumber" v-model="profile.contactNumber" />
        </div>
        <div class="form-group">
          <label for="emergencyContactName">Emergency Contact Name</label>
          <input type="text" id="emergencyContactName" v-model="profile.emergencyContactName" />
        </div>
        <div class="form-group">
          <label for="emergencyContactNumber">Emergency Contact Number</label>
          <input type="tel" id="emergencyContactNumber" v-model="profile.emergencyContactNumber" />
        </div>
        <div class="form-group">
          <label for="medicalConditions">Medical Conditions</label>
          <textarea id="medicalConditions" v-model="profile.medicalConditions" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="allergies">Allergies</label>
          <textarea id="allergies" v-model="profile.allergies" rows="3"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="savingProfile">
          {{ savingProfile ? "Saving..." : "Save Profile" }}
        </button>
      </form>

      <button @click="signOutUser" class="btn btn-secondary sign-out-btn">Sign Out</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { getCurrentUser, signOut, fetchUserAttributes, type AuthUser } from "aws-amplify/auth"
import { get, put } from "aws-amplify/api"
import { useRouter } from "vue-router"

// Define an interface for your member profile data
interface MemberProfileData {
  userId: string
  name: string
  email: string
  contactNumber: string | null
  emergencyContactName: string | null
  emergencyContactNumber: string | null
  medicalConditions: string | null
  allergies: string | null
}

// Reactive state
const user = ref<AuthUser | null>(null)
const userName = ref<string>("")
const loadingUser = ref(true)
const loadingProfile = ref(true)
const savingProfile = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Initialize profile with default values matching the interface
const profile: MemberProfileData = reactive({
  userId: "",
  name: "",
  email: "",
  contactNumber: null,
  emergencyContactName: null,
  emergencyContactNumber: null,
  medicalConditions: null,
  allergies: null,
})

const router = useRouter()

// Fetch current authenticated user (Gen 2 syntax)
const fetchUser = async () => {
  loadingUser.value = true
  try {
    const cognitoUser: AuthUser = await getCurrentUser()
    user.value = cognitoUser
    userName.value = cognitoUser.username || cognitoUser.userId // AuthUser has username and userId directly

    // Get attributes separately using fetchUserAttributes()
    const attributes = (await fetchUserAttributes()) as Record<string, string> // Cast to Record<string, string>

    profile.userId = cognitoUser.userId // Set userId from AuthUser
    profile.email = attributes.email || "" // Access email from attributes fetched explicitly

    await fetchMemberProfile()
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error fetching user or attributes:", e)
      error.value = "Failed to load user information. Please sign in again. " + e.message
    } else {
      console.error("Unknown error fetching user:", e)
      error.value = "An unknown error occurred loading user information."
    }
    router.push("/member")
  } finally {
    loadingUser.value = false
  }
}

// Fetch member profile from backend API (Gen 2 syntax)
const fetchMemberProfile = async () => {
  loadingProfile.value = true
  error.value = null
  try {
    const client = get({ apiName: "memberProfile", path: `/${profile.userId}` })
    const apiResponse = await client.response

    if (apiResponse.statusCode === 200) {
      const data: MemberProfileData | { message?: string } = await apiResponse.body.json() // Union type for possible message in 200 response

      // Check if it's a success message or actual profile data
      if ("message" in data && typeof data.message === "string") {
        // This case indicates a non-profile-data 200 OK, like from a PUT
        // But for GET, we expect profile data, so handle accordingly
        console.warn("Unexpected message in GET profile response:", data.message)
      } else {
        // Assume it's profile data
        profile.name = (data as MemberProfileData).name || ""
        profile.contactNumber = (data as MemberProfileData).contactNumber || null
        profile.emergencyContactName = (data as MemberProfileData).emergencyContactName || null
        profile.emergencyContactNumber = (data as MemberProfileData).emergencyContactNumber || null
        profile.medicalConditions = (data as MemberProfileData).medicalConditions || null
        profile.allergies = (data as MemberProfileData).allergies || null
      }
    } else if (apiResponse.statusCode === 404) {
      console.log("Member profile not found, will create on save.")
      // Pre-populate name if available from attributes
      // Access attributes from `fetchUserAttributes()` if needed, not user.value.attributes
      const currentAttributes = await fetchUserAttributes()
      if (currentAttributes.name) {
        profile.name = currentAttributes.name
      }
    } else {
      let errorMessage = "Failed to fetch profile with unexpected status."
      try {
        const errorData: { message?: string } | null = await apiResponse.body.json()
        if (errorData && typeof errorData.message === "string") {
          errorMessage = errorData.message
        }
      } catch (jsonError) {
        console.warn("Could not parse error JSON from API response:", jsonError)
      }
      throw new Error(errorMessage)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error fetching member profile:", e)
      error.value = e.message || "Failed to load profile. Please try again."
    } else {
      console.error("Unknown error fetching member profile:", e)
      error.value = "An unknown error occurred loading profile."
    }
  } finally {
    loadingProfile.value = false
  }
}

// Save/Update member profile via backend API (Gen 2 syntax)
const saveProfile = async () => {
  savingProfile.value = true
  error.value = null
  successMessage.value = null
  try {
    const client = put({
      apiName: "memberProfile",
      path: `/${profile.userId}`,
      options: {
        body: profile as Record<string, unknown>,
      },
    })
    const response = await client.response

    if (response.statusCode === 200) {
      const data: { message?: string } = await response.body.json()
      successMessage.value = data.message || "Profile saved successfully!"
    } else {
      let errorMessage = "Failed to save profile with unexpected status."
      try {
        const errorData: { message?: string } | null = await response.body.json()
        if (errorData && typeof errorData.message === "string") {
          errorMessage = errorData.message
        }
      } catch (jsonError) {
        console.warn("Could not parse error JSON from API response:", jsonError)
      }
      throw new Error(errorMessage)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error saving profile:", e)
      error.value = e.message || "Failed to save profile. Please try again."
    } else {
      console.error("Unknown error saving profile:", e)
      error.value = "An unknown error occurred saving profile."
    }
  } finally {
    savingProfile.value = false
    setTimeout(() => (successMessage.value = null), 3000)
  }
}

// Sign out user (Gen 2 syntax)
const signOutUser = async () => {
  try {
    await signOut()
    router.push("/member")
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error signing out:", e)
    } else {
      console.error("Unknown error signing out:", e)
    }
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
/* Your existing scoped styles */
.member-dashboard-page {
  padding: 40px 20px;
  text-align: center;
  background-color: #1a1a1a;
  min-height: calc(100vh - 150px);
}
.dashboard-content {
  background-color: #2c2c2c;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  max-width: 800px;
  margin: 30px auto;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: white;
}
.form-group input,
.form-group textarea {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #e74c3c;
  outline: none;
}
.btn-primary {
  /* Inherits from global styles, adjust if needed */
}
.success-message {
  color: #27ae60;
  margin-top: 15px;
  font-weight: bold;
}
.error-message {
  color: #e74c3c;
  margin-top: 15px;
  font-weight: bold;
}
.sign-out-btn {
  margin-top: 20px;
} /* Added margin for sign-out button */
</style>
