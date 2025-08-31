# Stafford Thai Boxing Gym - Member Portal & Website

A modern Vue 3 + TypeScript web application for Stafford Thai Boxing Gym in the UK, featuring a public website and member portal with authentication, class timetables, subscription management, and member services.

## 🥊 About

Stafford Thai Boxing Gym is located in Stafford, UK, offering traditional Muay Thai training and mixed martial arts classes. This application provides both a public-facing website for information and inquiries, and a secure member portal for existing gym members.

## ✨ Features

### Public Website
- **Home Page**: Hero section with gym introduction and featured content
- **About Page**: Gym history, trainers, and philosophy
- **Classes**: Available class types and descriptions
- **Timetable**: Interactive class schedule viewer
- **Gallery**: Photo gallery of gym facilities and training
- **Contact**: Contact form and gym location details

### Member Portal
- **Secure Authentication**: Powered by Supabase Auth
- **Member Dashboard**: Personal profile and membership overview
- **Class Booking**: Reserve spots in upcoming classes
- **Subscription Management**: View and manage membership plans
- **Profile Management**: Update personal details and emergency contacts

### Additional Features
- **Dark/Light Mode**: User preference with system detection
- **Mobile Responsive**: Optimized for all device sizes
- **UK/GDPR Compliant**: Data hosted in EU region
- **Modern UI**: Built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (EU region)
- **Testing**: Vitest + Cypress
- **Build Tool**: Vite
- **Deployment**: Cloudflare Pages (planned)

## 📁 Project Structure

```
src/
├── components/         # Reusable Vue components
│   ├── AppHeader.vue   # Navigation header
│   ├── AppFooter.vue   # Site footer
│   ├── Modal.vue       # Modal component
│   └── base/           # Base UI components
├── pages/              # Page-level components
│   ├── Home.vue        # Landing page
│   ├── About.vue       # About the gym
│   ├── Classes.vue     # Class descriptions
│   ├── ClassTimetable.vue # Schedule viewer
│   ├── Gallery.vue     # Photo gallery
│   ├── Contact.vue     # Contact form
│   ├── MemberLogin.vue # Authentication
│   ├── MemberDashboard.vue # Member portal
│   └── SubscriptionCheckout.vue # Payment flow
├── stores/             # Pinia state stores
│   ├── auth.ts         # Authentication state
│   └── counter.ts      # Example store
├── services/           # API integration layer
│   ├── api.ts          # Supabase API calls
│   └── galleryUpload.ts # Image upload service
├── lib/                # Core utilities
│   └── supabase.ts     # Supabase client config
├── types/              # TypeScript definitions
│   └── index.ts        # Application types
├── router/             # Vue Router config
│   └── index.ts        # Route definitions
├── composables/        # Vue composables
│   ├── useDarkMode.ts  # Theme management
│   └── useModal.ts     # Modal state
└── assets/             # Static assets
    ├── main.css        # Global styles
    └── images/         # Image assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (EU region recommended for GDPR)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd stafford-thai-boxing-gym
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file with your Supabase credentials:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Database Setup

The application expects certain tables in your Supabase database:
- `profiles` - User profile extensions
- `classes` - Gym class definitions  
- `class_bookings` - Member class reservations
- `subscription_plans` - Available membership plans
- `user_subscriptions` - Active member subscriptions
- `contact_submissions` - Contact form data
- `gallery_images` - Gallery photo metadata

See `docs/database-schema.sql` for the complete schema.

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# E2E tests with Cypress
npm run cypress:open
npm run cypress:run
```

## 🔧 Development

### Code Style
- Use TypeScript strict mode
- Follow Vue 3 Composition API patterns
- Use `<script setup>` syntax
- Implement proper error handling
- Follow UK/GDPR data protection requirements

### Authentication Flow
The app uses Supabase Auth with email/password authentication:
1. User signs up/logs in via Supabase Auth
2. Profile data stored in `profiles` table
3. Authentication state managed by Pinia store
4. Protected routes require authentication

### State Management
Global state is managed using Pinia stores:
- `useAuthStore()` - User authentication and profile data
- Reactive state with TypeScript support
- Persistent session handling

## 🌍 UK-Specific Features

### GDPR Compliance
- Data stored in Supabase EU region (Ireland)
- User consent tracking
- Right to deletion functionality
- Privacy policy compliance

### Localization
- GMT/BST timezone handling
- UK address and postcode formats
- UK phone number validation
- VAT-inclusive pricing display

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run cypress:open` - Open Cypress for E2E testing
- `npm run lint` - Lint and fix code
- `npm run type-check` - TypeScript type checking

## 🚀 Deployment

The application is configured for deployment on Cloudflare Pages:
1. Connect GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables
5. Deploy automatically on git push

## 🔐 Environment Variables

Required environment variables:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Stripe for payments (future)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions about the gym:
- **Website**: [Stafford Thai Boxing Gym](#)
- **Email**: info@staffordthaiboxing.co.uk
- **Phone**: +44 (0) 1785 XXX XXX
- **Address**: Stafford, Staffordshire, UK

---

Built with ❤️ for the Stafford Thai Boxing community
