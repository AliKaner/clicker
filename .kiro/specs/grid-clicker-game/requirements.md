# Requirements Document

## Introduction

This feature implements a dynamic grid clicker game built with Next.js 14, TypeScript, and SCSS modules. The game features a central upgradeable click button, colorable grid cells with passive income generation, color fusion mechanics through drag-and-drop, and a collection system for discovered colors. The game emphasizes visual feedback with dynamic styling based on upgrade levels and smooth animations.

## Requirements

### Requirement 1

**User Story:** As a player, I want to click a central button to earn gold, so that I can progress in the game and purchase upgrades.

#### Acceptance Criteria

1. WHEN the player clicks the central button THEN the system SHALL award gold equal to the current click power
2. WHEN the button is clicked THEN the system SHALL display a visual feedback animation (scale effect)
3. IF the button has been upgraded THEN the system SHALL display enhanced visual effects (border width and glow intensity based on level)
4. WHEN the page loads THEN the central button SHALL be positioned in the center 2x2 area of the grid

### Requirement 2

**User Story:** As a player, I want to upgrade my click button to increase gold per click, so that I can earn gold more efficiently.

#### Acceptance Criteria

1. WHEN the player has sufficient gold THEN the system SHALL allow upgrading the click button
2. WHEN the click button is upgraded THEN the system SHALL double the upgrade cost for the next level
3. WHEN the click button is upgraded THEN the system SHALL set click power to 2^clickLevel
4. WHEN the upgrade cost is calculated THEN the system SHALL start at 100 gold and double each level
5. WHEN the button level increases THEN the system SHALL update visual styling with border width of min(2 + level, 6)px and glow shadow scaling

### Requirement 3

**User Story:** As a player, I want to assign colors to grid cells to generate passive income, so that I can earn gold automatically over time.

#### Acceptance Criteria

1. WHEN the player clicks an empty grid cell THEN the system SHALL display a color assignment popup
2. WHEN the player assigns a color to a cell THEN the system SHALL deduct the assignment cost from gold
3. WHEN a cell is assigned a color THEN the system SHALL set its level to 1 and passive income to 2^(level-1) gold per second
4. WHEN the assignment cost is calculated THEN the system SHALL start at 50 gold and double per level
5. WHEN a cell has a color assigned THEN the system SHALL apply dynamic styling with background color, border, and glow effects

### Requirement 4

**User Story:** As a player, I want to upgrade colored cells to increase their passive income, so that I can maximize my gold generation.

#### Acceptance Criteria

1. WHEN the player upgrades a colored cell THEN the system SHALL double both the upgrade cost and gold per second
2. WHEN a cell is upgraded THEN the system SHALL increase its level by 1
3. WHEN a cell level increases THEN the system SHALL update visual styling with border width of min(2 + level, 6)px and enhanced glow effects
4. WHEN calculating cell styling THEN the system SHALL use the cell's color for border and shadow with opacity based on level

### Requirement 5

**User Story:** As a player, I want to drag one colored cell onto another to create color fusion, so that I can discover new colors and optimize my grid layout.

#### Acceptance Criteria

1. WHEN the player drags a colored cell onto another colored cell THEN the system SHALL blend the two colors using RGB averaging
2. WHEN color fusion occurs THEN the system SHALL remove both original cells and replace with one blended color cell
3. WHEN a new color is created through fusion THEN the system SHALL add it to the discovered colors collection if not already present
4. WHEN fusion is completed THEN the system SHALL maintain the higher level of the two original cells for the new cell

### Requirement 6

**User Story:** As a player, I want to view my collection of discovered colors, so that I can track my progress and see all colors I've found.

#### Acceptance Criteria

1. WHEN the player clicks the "Collection" button THEN the system SHALL display a modal with all discovered colors
2. WHEN displaying discovered colors THEN the system SHALL show a color swatch and count of cells on grid for each color
3. WHEN displaying undiscovered colors THEN the system SHALL show locked placeholders with "?" symbols
4. WHEN the collection modal is opened THEN the system SHALL animate the modal appearance with slide-in effect

### Requirement 7

**User Story:** As a player, I want the game to have a responsive grid layout that fills the viewport, so that I can enjoy the game on different screen sizes.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL create a CSS Grid that covers the entire viewport with 2rem margin
2. WHEN rendering grid cells THEN the system SHALL maintain perfectly square cells with 2px gaps
3. WHEN the page is displayed THEN the system SHALL disable scrolling globally with body overflow hidden
4. WHEN cells are rendered THEN the system SHALL apply dark background (#111) and light glowing borders (rgba(255,255,255,0.1))

### Requirement 8

**User Story:** As a player, I want smooth animations and visual feedback, so that the game feels responsive and engaging.

#### Acceptance Criteria

1. WHEN the player interacts with buttons THEN the system SHALL provide scale animation feedback (0.95 → 1.0)
2. WHEN popups appear THEN the system SHALL animate them with fade-in effects
3. WHEN modals open THEN the system SHALL animate them with slide transitions
4. WHEN cells are hovered THEN the system SHALL lighten the background without changing size
5. WHEN visual effects are applied THEN the system SHALL use CSS transitions for smooth glow changes

### Requirement 9

**User Story:** As a player, I want the game to automatically generate passive income from colored cells, so that I can progress even when not actively clicking.

#### Acceptance Criteria

1. WHEN colored cells are present on the grid THEN the system SHALL continuously generate gold per second based on cell levels
2. WHEN calculating passive income THEN the system SHALL use the formula 2^(level-1) for each cell
3. WHEN gold is generated passively THEN the system SHALL update the gold counter in real-time
4. WHEN the game is running THEN the system SHALL maintain consistent timing for passive income generation

### Requirement 10

**User Story:** As a player, I want per-color upgrade options that affect all cells of the same color, so that I can strategically enhance my color-based income streams.

#### Acceptance Criteria

1. WHEN the player selects a per-color upgrade THEN the system SHALL apply the upgrade to all cells of that specific color
2. WHEN a per-color upgrade is purchased THEN the system SHALL double both the cost and GPS for all cells of that color
3. WHEN calculating per-color upgrade costs THEN the system SHALL base costs purely on level mathematics without hardcoded values
4. WHEN per-color upgrades are displayed THEN the system SHALL show upgrade options for each discovered color in the upgrade panel