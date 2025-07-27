# GitHub Copilot Instructions - Stafford Thaiboxing Gym

## Project Overview
This is a Vue 3 + TypeScript web application for Stafford Thaiboxing Gym in the UK. The project is a member portal and public website that handles gym information, class timetables, member authentication, and subscription management.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **State Management**: Pinia
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (EU region for GDPR compliance)
- **Payments**: Stripe (UK configuration)
- **Hosting**: Cloudflare Pages
- **Testing**: Vitest + Cypress

## Architecture Principles
- Clean separation of concerns (stores, services, components, pages)
- TypeScript-first development
- Composition API pattern
- Reactive state management with Pinia
- REST API integration via Supabase client
- UK/GDPR compliant data handling

## Project Structure
```
src/
├── components/         # Reusable Vue components
├── pages/             # Page-level components
├── stores/            # Pinia stores (auth, etc.)
├── services/          # API integration layer
├── lib/               # Supabase client and utilities
├── types/             # TypeScript type definitions
├── router/            # Vue Router configuration
└── assets/            # Static assets
```

## Key Conventions

### Component Naming
- Use PascalCase for component files: `MemberDashboard.vue`
- Use kebab-case in templates: `<member-dashboard>`
- Prefix reusable UI components with `Base`: `BaseButton.vue`

### API Integration
- All database interactions go through Supabase client
- Use the existing API service layer pattern in `src/services/api.ts`
- Follow the established error handling patterns
- Always handle loading states and errors

### Authentication
- Use the centralized auth store: `useAuthStore()`
- Protected routes use `meta: { requiresAuth: true }`
- User data structure follows the established `User` type
- Session management handled automatically by Supabase

### State Management
- Use Pinia stores for global state
- Follow the composition API pattern with `defineStore()`
- Return reactive refs and computed properties
- Group related actions together

## Database Schema (Supabase)

### Core Tables
- `profiles`: User profiles extending auth.users
- `classes`: Gym class definitions
- `class_bookings`: User class reservations
- `subscription_plans`: Available membership plans
- `user_subscriptions`: Active user subscriptions
- `contact_submissions`: Contact form submissions
- `gallery_images`: Image gallery content

### Key Relationships
- `profiles.id` → `auth.users.id` (1:1)
- `user_subscriptions.user_id` → `profiles.id` (1:many)
- `class_bookings.user_id` → `profiles.id` (1:many)
- `class_bookings.class_id` → `classes.id` (many:1)

## UK-Specific Requirements

### GDPR Compliance
- Data stored in Supabase EU region (Ireland)
- User consent tracking required
- Right to deletion functionality
- Privacy policy compliance
- Cookie consent management

### Payment Processing
- Stripe UK account configuration
- VAT handling (20% UK VAT)
- UK payment methods support
- Amounts stored in pence (e.g., 4999 = £49.99)

### Localization
- GMT/BST timezone handling
- UK address formats
- UK phone number validation
- Postcode validation

## Code Style Guidelines

### TypeScript
- Strict mode enabled
- Use interface definitions for complex objects
- Prefer type safety over `any`
- Use generic types where appropriate

### Vue 3 Patterns
- Composition API preferred over Options API
- Use `<script setup>` syntax
- Reactive destructuring with proper refs
- Consistent prop and emit definitions

### Error Handling
```typescript
// Standard error handling pattern
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  return data
} catch (err: any) {
  console.error('Operation failed:', err.message)
  // Handle error appropriately
}
```

### API Calls
```typescript
// Follow this pattern for Supabase calls
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('filter_column', value)
  .order('created_at', { ascending: false })
```

## Environment Variables
```bash
# Supabase
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Stripe UK
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional
VITE_API_BASE_URL=https://project.supabase.co/functions/v1
```

## Common Patterns

### Authentication Check
```typescript
const authStore = useAuthStore()
await authStore.checkAuthStatus()
if (authStore.isAuthenticated) {
  // User is logged in
}
```

### Route Protection
```typescript
// In router configuration
{
  path: '/member/dashboard',
  component: MemberDashboard,
  meta: { requiresAuth: true }
}
```

### Data Fetching
```typescript
// In composables or components
const { data: classes, error } = await supabase
  .from('classes')
  .select('*')
  .eq('is_active', true)
  .order('day_of_week')
```

## Testing Approach
- Unit tests with Vitest for utilities and stores
- Component tests with Vue Test Utils
- E2E tests with Cypress for critical user flows
- Focus on authentication and payment flows

## Deployment
- Frontend: Cloudflare Pages (connects to GitHub)
- Database: Supabase (managed)
- Functions: Supabase Edge Functions (Deno runtime)

## Business Context
- Single gym location in Stafford, UK
- Mixed martial arts focus (Muay Thai)
- Public website + member portal
- Subscription-based membership model
- Class booking system
- Contact and inquiry handling

## Performance Considerations
- Mobile-first approach (high UK mobile usage)
- Image optimization for gallery
- Lazy loading for non-critical components
- Core Web Vitals optimization
- UK CDN delivery via Cloudflare

## Security Guidelines
- Row Level Security (RLS) enabled on all tables
- User data access restricted to own records
- Admin functions require elevated permissions
- Sensitive operations require re-authentication
- API keys stored securely in environment variables

## Migration Notes
This project was migrated from AWS (Cognito, S3, DynamoDB) to Supabase. The existing Vue 3 components and structure were preserved, with only the backend integration layer changed. Mock authentication was replaced with real Supabase Auth.

## Current Status
- ✅ Base Vue 3 application structure
- ✅ Supabase integration setup
- ✅ Authentication system migrated
- 🔄 API service layer migration in progress
- ⏳ Payment integration pending
- ⏳ Production deployment pending