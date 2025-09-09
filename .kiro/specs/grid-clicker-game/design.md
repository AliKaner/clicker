# Design Document

## Overview

The Grid Clicker Game is a Next.js 14 application that implements an incremental clicker game with a dynamic grid system. The architecture follows React best practices with TypeScript for type safety, SCSS modules for styling, Zustand for state management, and Framer Motion for animations. The game features a central click button, upgradeable grid cells with color mechanics, passive income generation, and a color collection system.

## Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: SCSS modules for component-scoped styles
- **State Management**: Zustand for global game state
- **Animations**: Framer Motion for smooth interactions
- **Build Tool**: Built-in Next.js bundling and optimization

### Project Structure
```
src/
├── app/
│   ├── globals.scss          # Global styles and CSS reset
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main game page
├── components/
│   ├── Grid/
│   │   ├── Grid.tsx         # Main grid container
│   │   ├── Grid.module.scss # Grid styling
│   │   ├── Cell.tsx         # Individual cell component
│   │   └── Cell.module.scss # Cell styling
│   ├── ClickButton/
│   │   ├── ClickButton.tsx  # Central click button
│   │   └── ClickButton.module.scss
│   ├── UpgradePanel/
│   │   ├── UpgradePanel.tsx # Bottom upgrade controls
│   │   └── UpgradePanel.module.scss
│   ├── CollectionPanel/
│   │   ├── CollectionPanel.tsx # Color collection modal
│   │   └── CollectionPanel.module.scss
│   └── ColorAssignPopup/
│       ├── ColorAssignPopup.tsx # Color assignment popup
│       └── ColorAssignPopup.module.scss
├── store/
│   └── gameStore.ts         # Zustand game state
├── utils/
│   ├── colorUtils.ts        # Color blending and utilities
│   ├── gameCalculations.ts  # Game math and formulas
│   └── constants.ts         # Game constants
└── types/
    └── game.ts              # TypeScript type definitions
```

## Components and Interfaces

### Core Types
```typescript
interface Cell {
  id: string;
  color?: string;
  level: number;
  x: number;
  y: number;
}

interface GameState {
  gold: number;
  clickLevel: number;
  clickPower: number;
  cells: Cell[];
  discoveredColors: string[];
  colorUpgradeLevels: Record<string, number>;
  gridSize: { width: number; height: number };
}

interface ColorUpgrade {
  color: string;
  level: number;
  cost: number;
  multiplier: number;
}
```

### Component Architecture

#### Grid Component
- **Responsibility**: Renders the main game grid and handles cell interactions
- **Props**: Grid dimensions, cell data, interaction handlers
- **Features**: 
  - CSS Grid layout with dynamic sizing
  - Drag and drop functionality for color fusion
  - Hover effects and click handling
  - Central button positioning (2x2 area)

#### Cell Component
- **Responsibility**: Individual grid cell rendering and interactions
- **Props**: Cell data, position, event handlers
- **Features**:
  - Dynamic styling based on color and level
  - Hover state management
  - Click popup triggering
  - Drag source functionality

#### ClickButton Component
- **Responsibility**: Central upgradeable click button
- **Props**: Click level, gold amount, upgrade handler
- **Features**:
  - Click animation and feedback
  - Dynamic visual scaling based on level
  - Upgrade cost calculation and display
  - Power level visualization

#### UpgradePanel Component
- **Responsibility**: Bottom panel with upgrade controls
- **Props**: Game state, upgrade handlers
- **Features**:
  - Click button upgrade interface
  - Per-color upgrade options
  - Cost calculations and affordability checks
  - Responsive layout for different screen sizes

#### CollectionPanel Component
- **Responsibility**: Modal displaying discovered colors
- **Props**: Discovered colors, cell counts, modal state
- **Features**:
  - Grid layout of color swatches
  - Color count display
  - Locked color placeholders
  - Modal animations and overlay

## Data Models

### Game State Management
The game uses Zustand for centralized state management with the following structure:

```typescript
interface GameStore extends GameState {
  // Actions
  clickButton: () => void;
  upgradeClickButton: () => void;
  assignColorToCell: (cellId: string, color: string) => void;
  upgradeCell: (cellId: string) => void;
  fuseCells: (cell1Id: string, cell2Id: string) => void;
  upgradeColor: (color: string) => void;
  
  // Computed values
  getClickUpgradeCost: () => number;
  getCellAssignCost: (level: number) => number;
  getCellUpgradeCost: (cellId: string) => number;
  getColorUpgradeCost: (color: string) => number;
  getTotalPassiveIncome: () => number;
}
```

### Passive Income System
- **Timer**: useEffect hook with setInterval for continuous gold generation
- **Calculation**: Sum of all colored cells' GPS (2^(level-1) * colorMultiplier)
- **Update Frequency**: 100ms intervals for smooth gold counter updates
- **Performance**: Memoized calculations to prevent unnecessary recalculations

### Color System
- **Storage**: Hex color codes as strings
- **Blending**: RGB averaging algorithm for color fusion
- **Discovery**: Automatic addition to discoveredColors array
- **Validation**: Color format validation and sanitization

## Error Handling

### Input Validation
- **Color Codes**: Validate hex format and convert to standard format
- **Numeric Inputs**: Ensure positive numbers for costs and levels
- **Cell Operations**: Validate cell existence and state before operations
- **Drag Operations**: Validate source and target cells for fusion

### State Consistency
- **Gold Validation**: Prevent negative gold amounts
- **Level Bounds**: Ensure levels stay within reasonable limits
- **Cell Integrity**: Maintain cell position and state consistency
- **Upgrade Validation**: Check affordability before applying upgrades

### Error Recovery
- **Graceful Degradation**: Continue game operation if non-critical features fail
- **State Restoration**: Implement state persistence to localStorage
- **User Feedback**: Clear error messages for invalid operations
- **Fallback Values**: Default values for corrupted or missing data

## Testing Strategy

### Unit Testing
- **Utility Functions**: Test color blending, cost calculations, and game math
- **State Management**: Test Zustand store actions and state updates
- **Component Logic**: Test component behavior and prop handling
- **Type Safety**: Ensure TypeScript compilation without errors

### Integration Testing
- **Component Interactions**: Test drag-and-drop between cells
- **State Synchronization**: Verify UI updates reflect state changes
- **Animation Timing**: Test Framer Motion animation sequences
- **Responsive Behavior**: Test grid layout on different screen sizes

### Performance Testing
- **Passive Income**: Verify smooth gold generation without lag
- **Large Grids**: Test performance with many colored cells
- **Animation Performance**: Ensure 60fps during interactions
- **Memory Usage**: Monitor for memory leaks in long gaming sessions

### User Experience Testing
- **Accessibility**: Keyboard navigation and screen reader support
- **Visual Feedback**: Confirm all interactions provide clear feedback
- **Mobile Responsiveness**: Touch interactions and mobile layout
- **Game Balance**: Verify progression feels rewarding and balanced

## Visual Design System

### Color Palette
- **Background**: #111 (dark theme)
- **Borders**: rgba(255,255,255,0.1) (subtle glow)
- **Gold**: #FFD700 (currency and upgrades)
- **Success**: #4CAF50 (positive actions)
- **Warning**: #FF9800 (costs and limitations)

### Typography
- **Primary**: System font stack for performance
- **Sizes**: Responsive scaling based on viewport
- **Weights**: Bold for important numbers, regular for text

### Spacing and Layout
- **Grid Gap**: 2px consistent spacing
- **Margins**: 2rem container margin
- **Padding**: 1rem standard component padding
- **Border Radius**: 4px for subtle rounded corners

### Animation Principles
- **Duration**: 200ms for quick feedback, 300ms for transitions
- **Easing**: ease-out for natural feel
- **Scale Effects**: 0.95 → 1.0 for button presses
- **Opacity**: 0 → 1 for fade-ins, with stagger for lists