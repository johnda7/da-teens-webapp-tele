# DA Teens - Replit Configuration

## Project Overview
A Telegram WebApp for teen mental wellness programs (ages 13-18). Built with React, TypeScript, and Vite.

**Last Updated**: October 5, 2025

## Recent Changes
- **2025-10-05**: Initial Replit environment setup
  - Configured Vite to bind to 0.0.0.0:5000 for Replit compatibility
  - Updated tsconfig.json to include vite.config.ts and proper type resolution
  - Set up Server workflow for development

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Icons**: Phosphor Icons
- **State Management**: localStorage (KV) persistent storage
- **Charts**: Recharts for data visualization

## Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ModuleGrid.tsx   # 12 wellness modules display
│   ├── ModuleDetail.tsx # Weekly module content
│   ├── CheckInPanel.tsx # Daily mood/anxiety/sleep tracking
│   ├── CohortSchedule.tsx # Group schedule & sessions
│   ├── SOSButton.tsx    # Emergency crisis support
│   ├── BadgeGrid.tsx    # Achievement system
│   └── ProgressStats.tsx # User progress analytics
├── data/                # Module content and seed data
├── lib/                 # Utilities and types
└── App.tsx              # Main application component
```

## Development
- **Start Server**: The workflow is already configured. Click "Run" or the server restarts automatically
- **Port**: 5000 (configured for Replit)
- **Hot Reload**: Enabled via Vite

## Key Features
1. **12 Wellness Modules**: 3-week structured programs (confidence, friendship, stress management, etc.)
2. **Daily Check-ins**: Mood, anxiety, and sleep tracking with trend visualization
3. **Group Cohorts**: Age-based groups with curators and scheduled sessions
4. **Achievement System**: Gamification with badges and streaks
5. **SOS Crisis Support**: Emergency connection to mental health professionals
6. **Telegram Integration**: Designed as WebApp with bot notifications

## Configuration Notes
- **Vite Server**: Configured to allow all hosts (required for Replit iframe proxy)
- **Port 5000**: Only port not firewalled in Replit
- **TypeScript**: Uses bundler module resolution with path aliases (@/)

## Safety & Privacy
- Content designed for vulnerable teen audience (13-18)
- SOS escalation protocols for crisis situations
- Minimal data collection with encryption
- Parental consent tracking
- Curator moderation system

## User Preferences
None specified yet.

## Architecture Decisions
- Using localStorage KV for persistent state management
- Client-side only (no backend API in MVP)
- Mobile-first responsive design for Telegram WebApp
- Calming color scheme (deep teal, soft blues) for anxiety reduction
