# Implementation Plan

- [x] 1. Initialize Next.js 14 project with TypeScript and dependencies



  - Create Next.js 14 project with TypeScript template
  - Install required dependencies: zustand, framer-motion, sass
  - Configure TypeScript strict mode and path aliases
  - Set up project structure with components, store, utils, and types directories
  - _Requirements: 7.1, 7.3_

- [x] 2. Create core type definitions and constants



  - Define Cell, GameState, and GameStore interfaces in types/game.ts
  - Create game constants file with initial values (starting costs, formulas)
  - Define ColorUpgrade and other supporting types



  - _Requirements: 1.4, 2.4, 3.4_

- [ ] 3. Implement utility functions for game calculations
  - Create colorUtils.ts with blendColors function using RGB averaging



  - Implement gameCalculations.ts with cost formulas and power calculations
  - Add color validation and hex format conversion utilities
  - Write unit tests for color blending and calculation functions
  - _Requirements: 5.2, 2.3, 3.3, 4.2_




- [ ] 4. Set up Zustand game store with core state management
  - Create gameStore.ts with initial state and basic actions
  - Implement clickButton action that awards gold based on click power



  - Add upgradeClickButton action with cost doubling and power calculation
  - Implement state persistence to localStorage
  - _Requirements: 1.1, 2.1, 2.2, 2.3_




- [ ] 5. Create global styles and layout foundation
  - Set up globals.scss with body overflow hidden and CSS reset
  - Configure SCSS modules and global styling variables
  - Create root layout.tsx with proper metadata and font configuration
  - Implement responsive viewport-filling container with 2rem margin
  - _Requirements: 7.1, 7.3, 7.4_

- [ ] 6. Build Grid component with CSS Grid layout
  - Create Grid.tsx component with dynamic CSS Grid sizing
  - Implement perfectly square cells with 2px gaps using CSS Grid
  - Add Grid.module.scss with dark background and glowing borders
  - Position central 2x2 area for click button placement
  - _Requirements: 7.1, 7.2, 7.4, 1.4_

- [ ] 7. Implement Cell component with basic interactions
  - Create Cell.tsx component with hover effects and click handling
  - Add Cell.module.scss with hover state that lightens background
  - Implement cell click handler that triggers color assignment popup
  - Add dynamic styling based on cell color and level using getCellStyle formula
  - _Requirements: 3.1, 8.4, 3.5, 4.3_

- [ ] 8. Create ClickButton component with upgrade mechanics
  - Build ClickButton.tsx with click handling and visual feedback
  - Implement getButtonStyle function for dynamic border and glow scaling
  - Add click animation using Framer Motion scale effect (0.95 → 1.0)
  - Connect to Zustand store for click power and upgrade functionality
  - _Requirements: 1.1, 1.3, 2.5, 8.1_

- [ ] 9. Implement ColorAssignPopup component for cell coloring
  - Create ColorAssignPopup.tsx with color picker interface
  - Add fade-in animation using Framer Motion
  - Implement assignColorToCell store action with cost deduction
  - Connect popup to cell click events and handle color assignment
  - _Requirements: 3.1, 3.2, 3.3, 8.2_

- [ ] 10. Add cell upgrade functionality and visual scaling
  - Extend Cell component with upgrade click handling
  - Implement upgradeCell store action with cost and GPS doubling
  - Add dynamic border width and glow effects based on cell level
  - Create upgrade cost calculation using doubling formula
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 11. Implement drag-and-drop color fusion system
  - Add drag source functionality to Cell component using HTML5 drag API
  - Implement drop target handling for cell-to-cell fusion
  - Create fuseCells store action that blends colors and removes original cells
  - Add new blended colors to discoveredColors array automatically
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 12. Build passive income generation system
  - Implement useEffect hook with setInterval for continuous gold generation
  - Create getTotalPassiveIncome calculation summing all cell GPS
  - Add real-time gold counter updates every 100ms
  - Optimize performance with memoized calculations
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 13. Create CollectionPanel component and modal system
  - Build CollectionPanel.tsx with discovered colors display
  - Implement modal with slide-in animation using Framer Motion
  - Add color swatch rendering and cell count display
  - Show locked placeholders with "?" for undiscovered colors
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 14. Implement UpgradePanel with per-color upgrades
  - Create UpgradePanel.tsx positioned at bottom-center
  - Add click button upgrade interface with cost display
  - Implement per-color upgrade options for discovered colors
  - Create upgradeColor store action affecting all cells of same color
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 15. Add comprehensive error handling and validation
  - Implement input validation for color codes and numeric values
  - Add state consistency checks for gold amounts and levels
  - Create graceful error recovery with user feedback messages
  - Add fallback values for corrupted or missing data
  - _Requirements: All requirements - error handling_

- [ ] 16. Optimize performance and add responsive design
  - Implement memoization for expensive calculations
  - Add responsive grid sizing for different screen sizes
  - Optimize animation performance for 60fps interactions
  - Test and fix memory leaks in passive income system
  - _Requirements: 7.1, 8.5, 9.4_

- [ ] 17. Create main page component integrating all systems
  - Build page.tsx that combines Grid, ClickButton, UpgradePanel, and CollectionPanel
  - Wire up all component interactions and state management
  - Add proper component positioning and layout
  - Test complete game flow from clicking to upgrading to color fusion
  - _Requirements: All requirements - integration_

- [ ] 18. Add final polish and animations
  - Implement all Framer Motion animations for smooth interactions
  - Add CSS transitions for hover effects and visual feedback
  - Fine-tune animation timing and easing for natural feel
  - Test animation performance across different devices
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_