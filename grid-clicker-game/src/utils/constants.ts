// Game constants and configuration

// Initial game values
export const INITIAL_GOLD = 0;
export const INITIAL_CLICK_LEVEL = 0;
export const INITIAL_CLICK_POWER = 1;

// Cost formulas
export const CLICK_UPGRADE_BASE_COST = 100;
export const CELL_ASSIGN_BASE_COST = 50;

// Grid configuration
export const DEFAULT_GRID_SIZE = { width: 20, height: 8 };
export const GRID_GAP = 2; // pixels
export const CELL_MIN_SIZE = 40; // pixels

// Click button positioning (center 2x2 area)
export const CLICK_BUTTON_GRID_POSITION = {
  startX: 7, // Center X position (16/2 - 1 = 7, spans 7-8)
  startY: 4, // Center Y position (10/2 - 1 = 4, spans 4-5)
  width: 2,  // 2x2 area
  height: 2
};

// Visual styling constants
export const MAX_BORDER_WIDTH = 6;
export const BASE_BORDER_WIDTH = 2;
export const BASE_GLOW_SIZE = 8;
export const GLOW_MULTIPLIER = 4;

// Animation durations (milliseconds)
export const BUTTON_PRESS_DURATION = 200;
export const POPUP_FADE_DURATION = 300;
export const MODAL_SLIDE_DURATION = 400;
export const HOVER_TRANSITION_DURATION = 200;

// Color system
export const DEFAULT_COLORS = [
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#45b7d1', // Blue
  '#96ceb4', // Green
  '#feca57', // Yellow
  '#ff9ff3', // Pink
  '#54a0ff', // Light Blue
  '#5f27cd', // Purple
];

export const SPECIAL_COLORS = [
  '#ffffff', // White
  '#000000', // Black
];

export const COLORS_NEEDED_FOR_SPECIAL = 25;

// Passive income update frequency
export const PASSIVE_INCOME_UPDATE_INTERVAL = 100; // milliseconds

// Local storage keys
export const STORAGE_KEYS = {
  GAME_STATE: 'grid-clicker-game-state',
  SETTINGS: 'grid-clicker-game-settings',
} as const;

// Game balance constants
export const BALANCE = {
  // Click power formula: 2^level
  getClickPower: (level: number) => Math.pow(2, level),

  // Click upgrade cost formula: base * 2^level
  getClickUpgradeCost: (level: number) => CLICK_UPGRADE_BASE_COST * Math.pow(2, level),

  // Cell assignment cost formula: base * 2^level
  getCellAssignCost: (level: number) => CELL_ASSIGN_BASE_COST * Math.pow(2, level),

  // Cell upgrade cost formula: base * 2^level
  getCellUpgradeCost: (level: number) => CELL_ASSIGN_BASE_COST * Math.pow(2, level),

  // Cell passive income formula: 2^(level-1)
  getCellPassiveIncome: (level: number) => Math.pow(2, level - 1),

  // Color upgrade cost formula: base * 2^level
  getColorUpgradeCost: (level: number) => CELL_ASSIGN_BASE_COST * 5 * Math.pow(2, level),
} as const;

// Visual effect formulas
export const VISUAL_EFFECTS = {
  // Button border width: min(2 + level, 6)
  getButtonBorderWidth: (level: number) => Math.min(BASE_BORDER_WIDTH + level, MAX_BORDER_WIDTH),

  // Button glow size: 8 + level * 4
  getButtonGlowSize: (level: number) => BASE_GLOW_SIZE + level * GLOW_MULTIPLIER,

  // Button glow opacity: 0.4 + level * 0.1
  getButtonGlowOpacity: (level: number) => Math.min(0.4 + level * 0.1, 1.0),

  // Cell border width: min(2 + level, 6)
  getCellBorderWidth: (level: number) => Math.min(BASE_BORDER_WIDTH + level, MAX_BORDER_WIDTH),

  // Cell glow size: 6 + level * 3
  getCellGlowSize: (level: number) => 6 + level * 3,
} as const;