# GitHub Copilot Instructions - Stafford Thai Boxing Gym

## Project Overview
This is a Vue 3 + TypeScript web application for Stafford Thai Boxing Gym in the UK. The project serves as both a member portal and public website that handles gym information, class timetables, member authentication, and subscription management with full UK/GDPR compliance.

## Tech Stack & Architecture
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **State Management**: Pinia stores with Composition API
- **Authentication**: Supabase Auth (EU region)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Payments**: Stripe UK configuration with VAT handling
- **Storage**: Supabase Storage for gallery images
- **Testing**: Vitest (unit) + Cypress (E2E)
- **Deployment**: Cloudflare Pages with GitHub integration

## Core Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── AppHeader.vue   # Main navigation
│   ├── AppFooter.vue   # Site footer
│   ├── Modal.vue       # Global modal system
│   └── base/           # Base UI components
├── pages/              # Route-level components
│   ├── Home.vue        # Public landing page
│   ├── MemberDashboard.vue # Protected member area
│   └── SubscriptionCheckout.vue # Payment flow
├── stores/             # Pinia state management
│   └── auth.ts         # Authentication store
├── services/           # API integration layer
│   ├── api.ts          # Supabase API calls
│   └── galleryUpload.ts # Image upload service
├── lib/                # Core utilities
│   └── supabase.ts     # Supabase client config
├── types/              # TypeScript definitions
│   └── index.ts        # Application type definitions
├── router/             # Vue Router configuration
├── composables/        # Vue 3 composables
│   ├── useDarkMode.ts  # Theme management
│   └── useModal.ts     # Modal state
└── assets/             # Static assets and styles
```

## Key Development Conventions

### Component Architecture
- Use PascalCase for component files: `MemberDashboard.vue`
- Implement `<script setup>` with TypeScript
- Prefix reusable components with `Base`: `BaseButton.vue`
- Keep components focused and single-responsibility
- Use props and emits with proper TypeScript definitions

### Authentication Pattern
```typescript
// Standard auth check pattern
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Route protection
{
  path: '/member/dashboard',
  component: MemberDashboard,
  meta: { requiresAuth: true }
}
```

### API Integration Standards
```typescript
// Follow this Supabase pattern
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('user_id', auth.user.id)
  .order('created_at', { ascending: false })

if (error) {
  console.error('Database error:', error.message)
  throw new Error(`Failed to fetch data: ${error.message}`)
}
```

### Error Handling Strategy
```typescript
// Consistent error handling
try {
  const result = await apiCall()
  return result
} catch (error: any) {
  console.error('Operation failed:', error.message)
  // Show user-friendly error message
  modal.showError('Something went wrong. Please try again.')
}
```

## Database Schema (Supabase PostgreSQL)

### Core Tables
- **profiles**: User profile data extending auth.users
- **classes**: Gym class definitions and schedules
- **class_bookings**: Member class reservations
- **subscription_plans**: Available membership tiers
- **user_subscriptions**: Active member subscriptions
- **contact_submissions**: Public contact form data
- **gallery_images**: Photo gallery metadata

### Key Relationships
- Users have Profiles (1:1 via auth.users.id)
- Users can have multiple Subscriptions over time (1:many)
- Users book Classes through Bookings (many:many)
- Classes have capacity limits and scheduling

### Row Level Security (RLS)
All tables use RLS policies:
- Users can only access their own data
- Public data (classes, plans) visible to all
- Admin operations require elevated permissions

## UK-Specific Implementation Requirements

### GDPR Compliance
- **Data Storage**: Supabase EU region (Ireland) only
- **User Consent**: Track and respect user preferences
- **Right to Deletion**: Implement complete data removal
- **Privacy Policy**: Clear data usage documentation
- **Cookie Management**: Minimal cookies with consent

### UK Business Logic
- **Timezone**: GMT/BST automatic detection and conversion
- **Currency**: All amounts in pence (4999 = £49.99)
- **VAT**: 20% UK VAT included in displayed prices
- **Addresses**: UK postcode validation and formatting
- **Phone Numbers**: UK format validation (+44)

### Payment Processing (Stripe UK)
```typescript
// UK Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// VAT-inclusive pricing
const priceInPence = plan.price_monthly // Already includes VAT
```

## State Management Patterns

### Pinia Store Structure
```typescript
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  
  // Getters
  const isAuthenticated = computed(() => !!user.value)
  
  // Actions
  const login = async (credentials: LoginCredentials) => {
    // Implementation
  }
  
  return { user, isLoading, isAuthenticated, login }
})
```

### Data Flow
1. Component calls store action
2. Store makes Supabase API call
3. Store updates reactive state
4. Component reactively updates UI

## Security Implementation

### Authentication Guard
```typescript
// Router beforeEach guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/member'
  }
})
```

### API Security
- All database access through RLS policies
- User context automatically applied
- No direct database credentials in frontend
- Environment variables for sensitive config

## Testing Strategy

### Unit Testing (Vitest)
- Test store actions and getters
- Test utility functions
- Test composables in isolation
- Mock Supabase client for testing

### E2E Testing (Cypress)
- Test complete user journeys
- Focus on authentication flows
- Test payment processes
- Verify responsive design

### Testing Patterns
```typescript
// Store testing example
describe('Auth Store', () => {
  it('should authenticate user', async () => {
    const store = useAuthStore()
    await store.login({ email: 'test@example.com', password: 'password' })
    expect(store.isAuthenticated).toBe(true)
  })
})
```

## Performance Optimization

### Code Splitting
- Lazy load route components
- Dynamic imports for heavy features
- Separate vendor chunks

### Image Optimization
- Supabase Storage with CDN
- WebP format with fallbacks
- Responsive image sizing

### UK-Specific Performance
- Cloudflare UK edge locations
- Mobile-first approach (high UK mobile usage)
- Core Web Vitals optimization

## Environment Configuration

### Required Variables
```bash
# Supabase (EU region)
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Stripe UK
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional
VITE_ENVIRONMENT=production
```

### Development Setup
1. Clone repository
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. Configure Supabase credentials
5. `npm run dev`

## Deployment Pipeline

### Cloudflare Pages
- Automatic deploys from GitHub main branch
- Preview deployments for pull requests
- Environment variables managed in dashboard
- Custom domain with SSL certificate

### Build Configuration
```bash
# Build command
npm run build

# Output directory
dist/

# Environment
Node.js 18+
```

## Migration Context

This project was migrated from AWS to Supabase:
- **Previous**: AWS Cognito, DynamoDB, S3, Lambda
- **Current**: Supabase (all-in-one solution)
- **Benefits**: Simplified architecture, EU hosting, better DX

The Vue 3 component structure was preserved during migration, with only the backend integration layer updated.

## Business Context

### Stafford Thai Boxing Gym
- **Location**: Stafford, Staffordshire, UK
- **Focus**: Traditional Muay Thai and martial arts
- **Model**: Subscription-based memberships
- **Target**: Local community fitness and martial arts

### Key Features
- Public website for gym information
- Member portal with authentication
- Class scheduling and booking
- Subscription management
- Contact form and inquiries
- Photo gallery showcase

## Common Development Tasks

### Adding New API Endpoint
1. Define TypeScript types in `src/types/`
2. Add service function in `src/services/api.ts`
3. Create/update Pinia store action
4. Implement in component with error handling

### Creating Protected Route
1. Add route with `meta: { requiresAuth: true }`
2. Implement component with auth check
3. Handle loading and error states
4. Test authentication flow

### Database Changes
1. Update schema in `docs/database-schema.sql`
2. Apply changes to Supabase project
3. Update TypeScript types
4. Update API service functions

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No implicit any
- Proper interface definitions
- Generic types where appropriate

### Vue 3 Best Practices
- Composition API preferred
- `<script setup>` syntax
- Proper reactivity patterns
- Type-safe props and emits

### CSS/Styling
- Tailwind CSS utilities
- Consistent spacing scale
- Mobile-first responsive design
- Dark mode support

## Troubleshooting Common Issues

### Authentication Problems
- Check Supabase project URL and keys
- Verify RLS policies are correct
- Ensure EU region configuration

### Database Issues
- Check RLS policies for access
- Verify user context in queries
- Review error logs in Supabase dashboard

### Build/Deploy Issues
- Verify environment variables
- Check Node.js version compatibility
- Review build logs for specific errors

---

This project represents a modern, UK-compliant web application for a local martial arts gym, balancing public marketing needs with secure member services. All development should prioritize user experience, data security, and UK regulatory compliance.
