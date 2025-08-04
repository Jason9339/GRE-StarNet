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
- **Styling**: Tailwind CSS
- **Visualization**: Cytoscape.js for interactive star map
- **State Management**: Zustand for global state
- **Data Storage**: localStorage with JSON export/import functionality

### Component Structure

#### Main Components
- `src/App.jsx` - Main application entry point, renders all major components
- `src/main.jsx` - React root mounting point

#### Core Features (currently placeholder components)
- `StarMap.jsx` - Interactive constellation visualization using Cytoscape.js
- `RestoreMission.jsx` - Input-based challenge mode where users type synonym equivalents
- `StarObservatory.jsx` - Learning mode for viewing definitions and notes (doesn't affect star brightness)
- `StarNotebook.jsx` - Collection of user-marked difficult words

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

### Design Documentation
Refer to `GRE-StarNet_Design_v6.md` for detailed feature specifications, visual design rules, and development roadmap. The design follows a storytelling approach where users are "Star Speakers" restoring a damaged constellation of memory stars.

### Memories
- to memorize