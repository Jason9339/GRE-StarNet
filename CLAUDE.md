# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Note: Tests are not yet implemented. ESLint is configured as dev dependency but no lint script exists.

## Project Architecture

This is a React + Vite application for GRE vocabulary learning through an interactive star map visualization.

### Core Concept
The app uses a "star map" metaphor where:
- Each vocabulary word is a "star" 
- Synonyms form "constellations" (connected groups)
- User familiarity is represented by star brightness
- Users can mark difficult words with a "memory marking gun"

### Key Technologies
- **Frontend**: React 18 with Vite build system
- **Styling**: Tailwind CSS with custom storybook theme
- **UI Framework**: Custom component library with storybook aesthetics
- **Fonts**: Inter (body text) + Fredoka One (headings) for modern + playful combination
- **Animation**: Framer Motion with custom keyframe animations
- **Visualization**: Custom SVG-based star map (moved away from Cytoscape.js)
- **State Management**: Zustand for global state
- **Data Storage**: localStorage with JSON export/import functionality
- **Icons**: Lucide React and Heroicons
- **Notifications**: React Hot Toast with glass morphism styling

### Component Structure

#### Main Components
- `src/App.jsx` - Main application with sidebar layout, integrates all UI components
- `src/main.jsx` - React root mounting point

#### Core Features
- `StarMap.jsx` - Interactive constellation visualization with custom SVG rendering
- `RestoreMission.jsx` - Input-based challenge mode where users type synonym equivalents
- `StarObservatory.jsx` - Learning mode for viewing definitions and notes
- `StarNotebook.jsx` - Collection of user-marked difficult words

#### UI Component Library (`src/components/ui/`)
- `Button.jsx` - Multi-variant button component with storybook styling
- `Card.jsx` - Glass morphism card component with multiple variants
- `Progress.jsx` - Animated progress bars with shimmer effects
- `Badge.jsx` - Status badges with glow effects
- `index.js` - Component exports

#### Storybook Components (`src/components/storybook/`)
- `StarField.jsx` - Animated background star field effect
- `CharacterAvatar.jsx` - Character avatars (Starnamer & Glyphox) with mood states

#### Custom Hooks (`src/hooks/`)
- `useStarAnimation.js` - Star animation state management
- `useReducedMotion.js` - Accessibility hook for reduced motion preferences

#### Data Structure
- `src/data/star_data.json` - Vocabulary data in format: `{"word": "mitigate", "meaning": "緩和", "synonyms": ["abate", "curtail", "temper", "ameliorate"]}`
- Additional vocabulary files: `voc1.txt` through `voc5.txt`
- Store: `src/store/useStarStore.js` - Zustand store with persist middleware for user progress tracking

### User Progress System
- Star brightness represents familiarity (updated based on quiz performance)
- Red markers indicate user-flagged difficult words
- Progress stored in localStorage with JSON export/import capability
- No backend required - fully client-side application

### Store Architecture
The Zustand store (`src/store/useStarStore.js`) manages:
- `starData`: Vocabulary from JSON file
- `starProgress`: User progress tracking (brightness, marked status, attempts, correct answers)
- `currentMission`: Active challenge state
- `selectedStar`: UI selection state
- Persistence via localStorage with JSON import/export functionality

Key store actions include progress tracking, mission management, marking difficult words, and data export/import.

### Recent Updates (Latest)

**🎨 Storybook Style UI Overhaul (v1.2):**
- **Sidebar Layout**: Moved header, navigation, and settings to left sidebar for better space utilization
- **Glass Morphism Design**: Implemented backdrop blur effects and translucent backgrounds
- **Custom Color Palette**: Added story-themed colors (night, twilight, star, aurora, dream, ocean, forest)
- **Typography Upgrade**: Inter + Fredoka One font combination for modern readability
- **Animation System**: Custom Tailwind keyframes for twinkle, float, card entrance, button pulse effects
- **Component Library**: Built reusable UI components (Button, Card, Progress, Badge)
- **Accessibility**: Added reduced motion support and improved focus states
- **Fixed Layout**: Removed floating animations for stars and text positioning

**Improved RestoreMission Component:**
- Multi-input system: Each synonym gets its own input field
- First letter hints: Shows initial letter and word length (e.g., "A__ (8 letters)")
- Real-time validation: Instant feedback with color coding (green/red)
- Progress tracking: Visual progress bar and completion percentage
- Hint toggle: Option to show/hide additional hints

**Redesigned StarMap Component:**
- Pagination system: Browse constellations one at a time
- Dynamic positioning: Stars arranged in circles based on constellation size
- Constellation grouping: Uses graph algorithms to find connected synonym groups
- Proper connection handling: A-B-C chain connections (A connects B, B connects C, but A doesn't directly connect C)
- Reduced visual clutter: Only shows one constellation per page
- Enhanced navigation: Page controls with current/total indicators
- **Known Issue**: StarMap rendering needs debugging (import path fixed but display issue remains)

### Design Documentation
Refer to `GRE-StarNet_Design_v6.md` for detailed feature specifications, visual design rules, and development roadmap. The design follows a storytelling approach where users are "Star Speakers" restoring a damaged constellation of memory stars.

### Development Guidelines

#### Storybook Theme Implementation
- Use custom Tailwind utilities: `.glass-effect`, `.glass-dark`, `.text-gradient`
- Apply story color palette: `story-night`, `story-twilight`, `story-star`, etc.
- Maintain consistent spacing: `space-y-6` for major sections, `space-y-3` for subsections
- Use `font-storybook` (Fredoka One) for headings, `font-sans` (Inter) for body text

#### Animation Best Practices
- Check `useReducedMotion()` hook before applying animations
- Use semantic animation classes: `animate-float-gentle`, `animate-card-entrance`, `animate-button-pulse`
- Prefer CSS transitions over JavaScript animations for performance

#### Accessibility Considerations
- All interactive elements have proper focus states
- Text contrast meets WCAG guidelines on dark backgrounds
- Motion effects respect user preferences
- Semantic HTML structure maintained

### Known Issues
- StarMap component import resolved but rendering issue persists - needs investigation
- Font loading optimization needed for better initial load performance

### Memories
- to memorize
- Fixed star positioning and removed floating animations as requested
- Improved sidebar text contrast with proper color selections
- Implemented comprehensive storybook aesthetic with glass morphism