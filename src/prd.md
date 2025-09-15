# DA Teens - MVP Product Requirements Document

## Core Purpose & Success

**Mission Statement**: Create a safe, engaging digital wellness platform that helps teenagers (13-18) develop emotional resilience, healthy relationships, and life skills through structured 3-week group cohorts with expert guidance.

**Success Indicators**: 
- 80%+ completion rate for 3-week modules
- Daily check-in engagement >70%
- Positive feedback from curators on group dynamics
- Measurable improvement in self-reported anxiety/confidence scores

**Experience Qualities**: Calming, Supportive, Empowering

## Project Classification & Approach

**Complexity Level**: Light Application (multiple features with persistent state)
**Primary User Activity**: Creating (journaling, reflecting) + Interacting (group sessions, peer support)

## Thought Process for Feature Selection

**Core Problem Analysis**: Teenagers need accessible mental health support in a familiar environment (Telegram) with peer connection and professional guidance.

**User Context**: Daily 3-5 minute check-ins, weekly group video sessions, homework assignments between sessions.

**Critical Path**: Telegram auth → Join cohort → Complete daily check-ins → Attend weekly sessions → Submit reflections → Earn badges → Progress to next module

**Key Moments**: 
1. First group session connection
2. Daily mood tracking breakthrough
3. Crisis support activation (SOS)

## Essential Features

### Module System (12 modules × 3 weeks each)
- **What it does**: Structured curriculum covering confidence, friendships, stress management, etc.
- **Why it matters**: Provides clear progression and achievable goals
- **Success criteria**: >75% weekly completion rate

### Daily Check-ins 
- **What it does**: Quick mood/anxiety/sleep tracking with optional reflection
- **Why it matters**: Builds self-awareness and routine
- **Success criteria**: 7-day streaks maintained by >60% of users

### Group Cohorts
- **What it does**: 8-12 teens grouped by age, 3 weekly video sessions per module
- **Why it matters**: Peer support and shared accountability
- **Success criteria**: >80% attendance at weekly sessions

### SOS/Crisis Support
- **What it does**: Immediate escalation to curator/mental health professional
- **Why it matters**: Safety net for vulnerable population
- **Success criteria**: <2 hour response time for crisis flags

### Badge System
- **What it does**: Recognition for milestones, streaks, and module completion
- **Why it matters**: Positive reinforcement and progress visualization
- **Success criteria**: Average 3+ badges earned per user per module

## Design Direction

### Visual Tone & Identity
**Emotional Response**: Calm confidence, supported growth, gentle progress
**Design Personality**: Warm minimalism - approachable yet sophisticated
**Visual Metaphors**: Journey/path imagery, growth/plant metaphors, gentle weather/nature elements
**Simplicity Spectrum**: Minimal interface with purposeful moments of warmth

### Color Strategy
**Color Scheme Type**: Analogous with warm accent
**Primary Color**: Deep teal (oklch(0.45 0.15 200)) - trust, stability, depth
**Secondary Colors**: Soft blue-grays for supporting elements
**Accent Color**: Warm orange (oklch(0.7 0.15 45)) - encouragement, progress, positive actions
**Color Psychology**: Teal creates sense of safety; orange provides gentle motivation without pressure
**Color Accessibility**: All combinations meet WCAG AA standards (4.5:1 contrast)

**Foreground/Background Pairings**:
- Background (light blue-white) + Foreground (deep blue-gray): 8.2:1 contrast ✓
- Primary (deep teal) + Primary-foreground (white): 6.8:1 contrast ✓
- Accent (warm orange) + Accent-foreground (deep blue): 5.1:1 contrast ✓
- Card (pure white) + Card-foreground (deep blue-gray): 8.9:1 contrast ✓

### Typography System
**Font Pairing Strategy**: Single family (Inter) with varied weights for hierarchy
**Typographic Hierarchy**: Bold headings (600-700), medium subheads (500), regular body (400)
**Font Personality**: Clean, friendly, highly legible - conveys trustworthiness without clinical coldness
**Readability Focus**: 1.5x line height, generous paragraph spacing, max 65 characters per line
**Which fonts**: Inter (primary) - excellent for both digital displays and accessibility
**Legibility Check**: Inter tested at all sizes 14px+ for optimal teen readability

### Visual Hierarchy & Layout
**Attention Direction**: Large CTAs, progress indicators, gentle color coding for urgency levels
**White Space Philosophy**: Generous breathing room reduces anxiety, allows focus on one task at a time
**Grid System**: 4-column mobile grid, 12-column desktop with consistent 24px gutters
**Responsive Approach**: Mobile-first with progressive enhancement for tablet/desktop
**Content Density**: Low density prioritizes comprehension over information volume

### Animations
**Purposeful Meaning**: Gentle transitions reinforce progress and connection
**Hierarchy of Movement**: Progress bars animate, mood selections provide tactile feedback
**Contextual Appropriateness**: Subtle, supportive - never flashy or attention-seeking

### UI Elements & Component Selection
**Component Usage**: 
- Cards for module/week content grouping
- Progress components for journey visualization  
- Gentle buttons with satisfying hover states
- Input fields with inline validation and encouragement

**Component Customization**: Increased border radius (0.75rem) for friendlier feel
**Component States**: Clear focus states for accessibility, disabled states with explanatory text
**Icon Selection**: Phosphor icons - consistent, friendly, accessible
**Mobile Adaptation**: Touch-friendly sizing (44px minimum), swipe gestures for navigation

### Accessibility & Readability
**Contrast Goal**: Exceed WCAG AA (minimum 4.5:1) for all text, aim for AAA (7:1) where possible

## Edge Cases & Problem Scenarios

**Potential Obstacles**: 
- Crisis situations requiring immediate intervention
- Group dynamic issues (bullying, exclusion)
- Low engagement/motivation dips
- Technical barriers for less tech-savvy teens

**Edge Case Handling**:
- Multiple SOS escalation paths
- Curator tools for group management
- Gentle re-engagement strategies
- Simplified onboarding with video tutorials

## Implementation Considerations

**Scalability Needs**: Multi-language support, multiple cohort scheduling, expert content management
**Testing Focus**: Crisis response times, group session connection quality, mobile performance
**Critical Questions**: How do we measure real mental health improvement vs. engagement metrics?

## Reflection

This approach uniquely combines the accessibility of Telegram with structured mental health programming and peer support. The biggest assumption is that teens will engage consistently with daily check-ins - this needs early validation. Success depends on balancing professional mental health support with peer connection in a safe digital environment.