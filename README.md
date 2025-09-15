# DA Teens - Teen Wellness Platform MVP

A comprehensive Telegram WebApp for teen mental health and wellness, featuring structured 12-module curriculum, group cohorts, and crisis support.

## 🎯 Overview

DA Teens is a digital wellness platform specifically designed for teenagers (13-18) that combines:
- **Structured Learning**: 12 modules × 3 weeks each covering confidence, friendships, stress management, etc.
- **Group Support**: Small cohorts (8-12 teens) with weekly video sessions and peer chat
- **Daily Check-ins**: Mood, anxiety, and sleep tracking with personalized insights
- **Crisis Support**: SOS button with immediate escalation to mental health professionals
- **Gamification**: Badge system and progress tracking to maintain engagement
- **Safety First**: Content moderation, crisis detection, and parental consent features

## 🏗️ Architecture

### Frontend (Telegram WebApp)
- **Framework**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Phosphor Icons
- **State Management**: React hooks + useKV for persistence
- **Responsive**: Mobile-first design optimized for Telegram

### Key Features Implemented
✅ **Module System**: 12-module curriculum with weekly structure  
✅ **Daily Check-ins**: Mood/anxiety/sleep tracking with insights  
✅ **Badge System**: 9+ achievement badges with progress tracking  
✅ **Group Schedule**: Cohort sessions and assignment management  
✅ **SOS Support**: Multi-level crisis support with escalation  
✅ **Progress Tracking**: Comprehensive stats and trend analysis  
✅ **Responsive Design**: Mobile-optimized with dark theme support  

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd da-teens-webapp
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open in browser**
```
http://localhost:5173
```

### Environment Setup

Create `.env.local` file:
```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/telegram

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/da_teens

# Security
JWT_SECRET=your-secret-key-here

# External Services
STRIPE_SECRET_KEY=sk_test_...
TELEGRAM_STARS_TOKEN=your_stars_token
```

## 📱 Usage

### For Teens (Primary Users)

1. **Getting Started**
   - Join via Telegram bot (@da_teens_bot)
   - Complete age verification and consent
   - Get assigned to age-appropriate cohort

2. **Daily Routine**
   - Complete daily check-in (30 seconds)
   - Practice mindfulness exercises (5-10 minutes)
   - Participate in group chat discussions

3. **Weekly Activities**
   - Attend cohort video session (45 minutes)
   - Complete module assignments
   - Submit reflections and practice logs

4. **Crisis Support**
   - Use SOS button for immediate help
   - Access 24/7 crisis resources
   - Connect with curator or mental health professional

### For Curators/Mentors

1. **Group Management**
   - Monitor cohort progress and engagement
   - Review crisis flags and respond appropriately
   - Provide feedback on assignments

2. **Content Moderation**
   - Review flagged content for safety
   - Escalate serious concerns to mental health professionals
   - Maintain safe, supportive group environment

## 🎨 Design System

### Color Palette
- **Primary**: Deep teal (trust, stability) - `oklch(0.45 0.15 200)`
- **Secondary**: Soft blue-gray - `oklch(0.92 0.05 220)`
- **Accent**: Warm orange (encouragement) - `oklch(0.7 0.15 45)`
- **Destructive**: Crisis red - `oklch(0.65 0.2 25)`

### Typography
- **Font**: Inter (clean, highly legible)
- **Hierarchy**: Bold headings (600-700), medium subheads (500), regular body (400)
- **Scale**: Consistent mathematical relationships for visual harmony

### Accessibility
- **Contrast**: Exceeds WCAG AA standards (4.5:1 minimum)
- **Focus States**: Clear keyboard navigation indicators
- **Touch Targets**: Minimum 44px for all interactive elements
- **Screen Readers**: Semantic HTML and ARIA labels

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ModuleGrid.tsx  # 12-module overview
│   ├── CheckInPanel.tsx # Daily mood tracking
│   ├── BadgeGrid.tsx   # Achievement system
│   └── SOSButton.tsx   # Crisis support
├── lib/
│   ├── types.ts        # TypeScript definitions
│   ├── moduleData.ts   # Curriculum content
│   └── utils/          # Helper functions
└── App.tsx             # Main application
```

### Key Components

#### ModuleGrid
Displays all 12 modules with progress tracking:
- Module 1: Confidence & Self-Discovery
- Module 2: Healthy Friendships  
- Module 3: Communication Skills
- Module 4: Stress Management
- Module 5: Body Image & Self-Acceptance
- Module 6: Time Management & Focus
- Module 7: Financial Literacy
- Module 8: Career Exploration
- Module 9: Digital Wellness
- Module 10: Healthy Lifestyle
- Module 11: Decision Making
- Module 12: Resilience & Growth

#### CheckInPanel
Daily wellness tracking with:
- Mood scale (1-5 with emoji selection)
- Anxiety level (0-10 slider)
- Sleep hours tracking
- Optional reflection notes
- Crisis detection and recommendations

#### BadgeGrid
Achievement system with 9 badges:
- **First Step**: Complete first week
- **Weekly Warrior**: 7-day check-in streak
- **Monthly Champion**: 30-day check-in streak
- **Module Master**: Complete full 3-week module
- **Courage to Ask**: Use SOS or reach out for help
- **Team Player**: Attend 5 group sessions
- **Practice Makes Progress**: Complete 20 practices
- **Deep Thinker**: Submit 10 quality reflections
- **Year-Long Explorer**: Complete all 12 modules

### Data Persistence

Uses `useKV` hook for persistent storage:
```typescript
// User progress
const [userProfile, setUserProfile] = useKV('user-profile', defaultProfile)

// Daily check-ins  
const [lastCheckIn, setLastCheckIn] = useKV('last-checkin', null)

// Achievement progress
const [userBadges, setUserBadges] = useKV('user-badges', [])
```

### Safety Features

#### Crisis Detection
Automatic monitoring for:
- Very high anxiety levels (8+/10)
- Very low mood (1-2/5)
- Severely disrupted sleep (<4 hours)
- Concerning language in reflections
- Combination risk factors

#### Content Moderation
- Real-time message scanning for crisis keywords
- Automated flagging system for human review
- Immediate escalation protocols for high-risk situations

## 🎯 Future Enhancements

### Phase 2: Backend Integration
- [ ] Prisma database schema implementation
- [ ] API endpoints for data persistence
- [ ] Telegram bot with webhook integration
- [ ] Real-time notifications and reminders

### Phase 3: Advanced Features
- [ ] Video session integration (Zoom/Meet)
- [ ] AI-powered crisis detection
- [ ] Multilingual support (Spanish, etc.)
- [ ] Parent/guardian portal
- [ ] Analytics dashboard for administrators

### Phase 4: Platform Expansion
- [ ] iOS/Android native apps
- [ ] Integration with school counseling services
- [ ] White-label solution for partners
- [ ] Advanced personalization algorithms

## 🔒 Privacy & Safety

### Data Protection
- Minimal data collection (only essential for safety/functionality)
- Encrypted storage for sensitive information
- GDPR/COPPA compliance features
- User data export and deletion capabilities

### Crisis Response
- Multi-level escalation (low/medium/high/critical)
- Integration with local crisis hotlines
- Automated notifications to mental health professionals
- Emergency contact system for parents/guardians

### Content Safety
- Age-appropriate content filters
- Peer interaction monitoring
- Professional content review process
- Clear community guidelines and enforcement

## 🤝 Contributing

This MVP demonstrates the core functionality and user experience. For production deployment, additional security hardening, testing, and compliance features would be essential.

### Development Guidelines
1. Follow TypeScript strict mode
2. Use semantic commit messages
3. Write tests for critical user flows
4. Ensure accessibility standards compliance
5. Document component props and complex logic

## 📞 Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Important**: This is an MVP demonstration. For production use with real teenagers, additional safety measures, professional oversight, and regulatory compliance would be required.