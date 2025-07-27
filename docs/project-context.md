# Project Context - Stafford Thaiboxing Gym

## Business Requirements Summary

### Target Users
1. **Prospective Members**: Browsing gym info, classes, timetables
2. **Current Members**: Managing profiles, booking classes, subscription management
3. **Gym Administrators**: Managing content, viewing member data, updating schedules

### Core Features
- **Public Portal**: Gym information, class timetables, events, gallery, contact
- **Member Portal**: Authentication, profile management, class booking, subscription management
- **Admin Dashboard**: Content management, member oversight, analytics

### UK Market Context
- **Location**: Stafford, Staffordshire, England
- **Target Audience**: Local martial arts enthusiasts, fitness seekers
- **Legal Requirements**: GDPR compliance, UK business regulations
- **Payment Culture**: Contactless payments, direct debit subscriptions common

## Technical Migration Context

### Previous Architecture (AWS-based)
- Authentication: AWS Cognito
- Database: DynamoDB
- Storage: S3
- API: API Gateway + Lambda
- Issues: High costs, complexity, maintenance overhead

### Current Architecture (Supabase-based)
- Authentication: Supabase Auth
- Database: Supabase PostgreSQL
- Storage: Supabase Storage
- API: Supabase REST API + Edge Functions
- Benefits: Lower cost, simpler maintenance, better DX

### Migration Status
- ✅ Frontend codebase cleaned of AWS dependencies
- ✅ Vue 3 + TypeScript foundation solid
- ✅ Component architecture preserved
- ✅ Mock authentication removed
- 🔄 Supabase integration in progress

## Data Model Overview

### User Journey
1. **Discovery**: Public pages (home, about, classes, gallery)
2. **Inquiry**: Contact form submission
3. **Registration**: Account creation + profile setup
4. **Subscription**: Payment processing via Stripe
5. **Usage**: Class booking, profile management
6. **Retention**: Ongoing engagement, subscription management

### Key Entities
- **User Profile**: Personal details, emergency contacts, preferences
- **Membership**: Subscription plans, billing, status tracking
- **Classes**: Scheduled sessions, instructor info, capacity
- **Bookings**: User-class reservations, attendance tracking
- **Content**: Gallery images, announcements, events

## UK Compliance Requirements

### GDPR (Data Protection)
- **Lawful Basis**: Legitimate interest (gym operation) + consent (marketing)
- **Data Minimization**: Collect only necessary information
- **Right to Access**: Users can view their data
- **Right to Rectification**: Users can update their data
- **Right to Erasure**: Users can request deletion
- **Data Portability**: Users can export their data

### Business Compliance
- **VAT Registration**: 20% VAT on services over threshold
- **Accessibility**: WCAG 2.1 AA compliance preferred
- **Terms of Service**: UK contract law applicable
- **Health & Safety**: Gym operation regulations

## Payment Processing (UK)

### Stripe UK Configuration
- **Account**: Stripe UK entity required
- **Payment Methods**: Cards, Apple Pay, Google Pay, bank transfers
- **VAT Handling**: Automatic VAT calculation and reporting
- **Strong Customer Authentication**: SCA compliance for EU customers

### Subscription Model
- **Monthly Plans**: £39-79/month typical range
- **Annual Discounts**: 10-15% savings
- **Trial Periods**: 7-14 day free trials
- **Cancellation**: Easy online cancellation required

## UI/UX Considerations

### Mobile-First Design
- **Usage Pattern**: 70%+ mobile traffic expected
- **Touch Interfaces**: Large tap targets, swipe gestures
- **Performance**: Fast loading on 4G networks
- **Offline**: Basic offline functionality for member cards

### Accessibility
- **Screen Readers**: Proper ARIA labels, semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA contrast ratios
- **Text Scaling**: Responsive to user font size preferences

### Local Expectations
- **Loading Speed**: <3 seconds expected
- **Trust Signals**: SSL certificates, privacy badges, testimonials
- **Contact Options**: Phone numbers, postcode, local landmarks
- **Social Proof**: Google reviews integration, member testimonials

## Content Strategy

### SEO Keywords (Local)
- "Muay Thai Stafford"
- "Martial arts gym Staffordshire"
- "Thaiboxing classes near me"
- "Self defense training Stafford"

### Content Types
- **Class Descriptions**: Detailed explanations, difficulty levels
- **Instructor Profiles**: Experience, qualifications, specialties
- **Member Stories**: Success stories, transformation journeys
- **Technique Videos**: Training clips, form demonstrations

## Analytics & Metrics

### Key Performance Indicators
- **Conversion Rate**: Visitor to trial signup
- **Retention Rate**: Monthly subscription renewals
- **Class Utilization**: Booking rates per class
- **Member Satisfaction**: Net Promoter Score (NPS)

### Tracking Requirements
- **Privacy-Compliant**: Cookie consent, minimal tracking
- **Business Intelligence**: Member demographics, popular classes
- **Financial Metrics**: Monthly recurring revenue (MRR), churn rate
- **Operational Data**: Class attendance, peak usage times

## Integration Requirements

### Essential Third-Party Services
- **Email Marketing**: Mailchimp or ConvertKit for newsletters
- **Calendar Integration**: Google Calendar sync for class schedules
- **Social Media**: Instagram feed integration for gallery
- **Review Management**: Google Business Profile integration

### Future Considerations
- **Mobile App**: Progressive Web App (PWA) foundation
- **Wearable Integration**: Class check-ins via Apple Watch/Fitbit
- **Automated Marketing**: Retention campaigns, win-back sequences
- **Multi-Location**: Framework for potential expansion

## Support & Maintenance

### Content Management
- **Admin Training**: Simple interface for non-technical staff
- **Regular Updates**: Class schedules, event announcements
- **Backup Procedures**: Automated database backups
- **Security Updates**: Regular dependency updates

### Monitoring
- **Uptime Monitoring**: 99.9% availability target
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Automatic error reporting and alerts
- **User Feedback**: Built-in feedback collection system