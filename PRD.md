# DA Teens - Telegram WebApp MVP

A Telegram WebApp for group teen mental wellness programs (13-18), inspired by Calm/Headspace but designed for cohort-based learning with curators and mentors.

**Experience Qualities**: 
1. Calm and supportive - creating a safe space for teens to explore wellness
2. Engaging yet focused - gamification without overwhelming complexity  
3. Community-driven - emphasizing group connection and peer support

**Complexity Level**: Light Application (multiple features with basic state)
- Manages user profiles, cohorts, modules, and check-ins with persistent data across sessions

## Essential Features

### Module Dashboard
- **Functionality**: Display 12 annual wellness modules in a clean grid layout
- **Purpose**: Provide clear overview of learning journey and progress
- **Trigger**: User opens webapp from Telegram bot
- **Progression**: View modules → Select current/next module → Enter module detail → Start weekly content
- **Success criteria**: Users can navigate modules and see clear progress indicators

### Weekly Module Content  
- **Functionality**: 3-week structured content with videos, practices, and reflections
- **Purpose**: Deliver bite-sized wellness content adapted for teens
- **Trigger**: User clicks into a specific module
- **Progression**: View 3 weeks → Select week → Complete video/practice → Submit reflection → Earn progress
- **Success criteria**: Users complete weekly content and can track their journey

### Group Cohort Integration
- **Functionality**: Show cohort schedule, live session links, chat access
- **Purpose**: Connect teens with peers and mentors in structured groups
- **Trigger**: User joins a cohort for their age group
- **Progression**: View schedule → Join live session → Participate in group chat → Complete group assignments
- **Success criteria**: Users engage with their cohort and attend scheduled sessions

### Daily Check-ins
- **Functionality**: Quick mood, anxiety, and sleep tracking with optional journal
- **Purpose**: Build self-awareness and provide data for personalized recommendations
- **Trigger**: Daily notification or user-initiated check-in
- **Progression**: Rate mood → Set anxiety level → Log sleep → Optional quick journal → View trends
- **Success criteria**: Users develop consistent check-in habits

### SOS Crisis Support
- **Functionality**: Emergency button connecting to curators/psychologists
- **Purpose**: Ensure teen safety with immediate professional support access
- **Trigger**: User presses SOS button when in distress
- **Progression**: Press SOS → Select crisis type → Connect with curator → Receive appropriate resources
- **Success criteria**: Crisis situations are escalated within 5 minutes

## Edge Case Handling
- **Content Access Control**: Users can only access modules for their enrolled cohort
- **Age Verification**: Restrict access based on 13-18 age range with parental consent tracking
- **Offline Content**: Cache essential content for situations with poor connectivity
- **Crisis Escalation**: Multiple fallback contacts if primary curator unavailable
- **Group Size Management**: Auto-create new cohorts when existing ones reach capacity

## Design Direction
The design should feel supportive and premium-modern like Calm/Headspace - professional yet approachable for teens, with generous whitespace and calming colors that reduce anxiety rather than stimulate.

## Color Selection
Analogous color scheme using calming blues and teals to create a sense of trust and tranquility.

- **Primary Color**: Deep Teal (oklch(0.45 0.15 200)) - communicates trust and stability
- **Secondary Colors**: Soft Blues (oklch(0.65 0.1 220)) for supporting elements and backgrounds  
- **Accent Color**: Warm Orange (oklch(0.7 0.15 45)) for CTAs and positive feedback
- **Foreground/Background Pairings**: 
  - Background (Light Blue oklch(0.98 0.02 220)): Dark Blue text (oklch(0.2 0.05 220)) - Ratio 15.8:1 ✓
  - Card (White oklch(1 0 0)): Dark Blue text (oklch(0.2 0.05 220)) - Ratio 16.7:1 ✓
  - Primary (Deep Teal oklch(0.45 0.15 200)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent (Warm Orange oklch(0.7 0.15 45)): Dark Blue text (oklch(0.2 0.05 220)) - Ratio 9.1:1 ✓

## Font Selection
Clean, readable sans-serif typography that feels modern yet calming, promoting focus and reducing cognitive load for teen users.

- **Typographic Hierarchy**: 
  - H1 (Module Titles): Inter Bold/24px/tight letter spacing
  - H2 (Week Headers): Inter SemiBold/20px/normal spacing  
  - H3 (Section Titles): Inter Medium/18px/normal spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Caption (Progress/Meta): Inter Regular/14px/normal spacing

## Animations
Subtle, purposeful animations that guide attention and provide feedback without being distracting or juvenile - focusing on smooth transitions and gentle micro-interactions.

- **Purposeful Meaning**: Motion reinforces the calm, supportive brand while subtly celebrating progress
- **Hierarchy of Movement**: Progress indicators and completion states get gentle celebrations, navigation is smooth but minimal

## Component Selection
- **Components**: Cards for modules/weeks, Progress bars for tracking, Dialogs for check-ins, Buttons with clear hierarchy, Badges for achievements, Sheets for quick actions
- **Customizations**: Custom mood selector with emoji, anxiety slider component, SOS emergency button with distinct styling
- **States**: Clear disabled/loading states for content not yet unlocked, hover states that feel responsive but calm
- **Icon Selection**: Phosphor icons with emphasis on wellness themes (heart, brain, users, calendar)
- **Spacing**: Generous 24px base spacing with 16px for compact areas, 32px for major sections
- **Mobile**: Mobile-first design with touch-friendly 44px minimum targets, collapsible navigation, swipe gestures for week navigation