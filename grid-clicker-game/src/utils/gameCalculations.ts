// Game calculation utilities and formulas

import { BALANCE } from './constants';
import type { Cell } from '../types/game';

/**
 * Calculates click power based on click level
 * @param level Current click level
 * @returns Click power (2^level)
 */
export function calculateClickPower(level: number): number {
  return BALANCE.getClickPower(level);
}

/**
 * Calculates the cost to upgrade click button
 * @param currentLevel Current click level
 * @returns Upgrade cost
 */
export function calculateClickUpgradeCost(currentLevel: number): number {
  return BALANCE.getClickUpgradeCost(currentLevel);
}

/**
 * Calculates the cost to assign a color to a cell
 * @param cellLevel Level of the cell (0 for new assignment)
 * @returns Assignment cost
 */
export function calculateCellAssignCost(cellLevel: number = 0): number {
  return BALANCE.getCellAssignCost(cellLevel);
}

/**
 * Calculates the cost to upgrade a specific cell
 * @param cell Cell to upgrade
 * @returns Upgrade cost
 */
export function calculateCellUpgradeCost(cell: Cell): number {
  if (!cell.color) return 0;
  return BALANCE.getCellUpgradeCost(cell.level);
}

/**
 * Calculates passive income for a single cell
 * @param cell Cell to calculate income for
 * @param colorMultiplier Multiplier from color upgrades
 * @returns Gold per second for this cell
 */
export function calculateCellPassiveIncome(cell: Cell, colorMultiplier: number = 1): number {
  if (!cell.color) return 0;
  const baseIncome = BALANCE.getCellPassiveIncome(cell.level);
  return baseIncome * colorMultiplier;
}

/**
 * Calculates total passive income from all cells
 * @param cells Array of all cells
 * @param colorUpgradeLevels Record of color upgrade levels
 * @returns Total gold per second
 */
export function calculateTotalPassiveIncome(
  cells: Cell[], 
  colorUpgradeLevels: Record<string, number>
): number {
  return cells.reduce((total, cell) => {
    if (!cell.color) return total;
    
    const colorLevel = colorUpgradeLevels[cell.color] || 0;
    const colorMultiplier = Math.pow(2, colorLevel);
    const cellIncome = calculateCellPassiveIncome(cell, colorMultiplier);
    
    return total + cellIncome;
  }, 0);
}

/**
 * Calculates the cost to upgrade a specific color
 * @param colorLevel Current level of the color upgrade
 * @returns Upgrade cost
 */
export function calculateColorUpgradeCost(colorLevel: number): number {
  return BALANCE.getColorUpgradeCost(colorLevel);
}

/**
 * Generates a unique cell ID based on position
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Unique cell ID
 */
export function generateCellId(x: number, y: number): string {
  return `cell-${x}-${y}`;
}

/**
 * Parses cell coordinates from cell ID
 * @param cellId Cell ID in format "cell-x-y"
 * @returns Object with x and y coordinates
 */
export function parseCellId(cellId: string): { x: number; y: number } {
  const parts = cellId.split('-');
  return {
    x: parseInt(parts[1], 10),
    y: parseInt(parts[2], 10)
  };
}

/**
 * Checks if a position is within the click button area
 * @param x X coordinate
 * @param y Y coordinate
 * @param buttonPosition Click button position configuration
 * @returns True if position is within button area
 */
export function isPositionInClickButton(
  x: number, 
  y: number, 
  buttonPosition: { startX: number; startY: number; width: number; height: number }
): boolean {
  return (
    x >= buttonPosition.startX &&
    x < buttonPosition.startX + buttonPosition.width &&
    y >= buttonPosition.startY &&
    y < buttonPosition.startY + buttonPosition.height
  );
}

/**
 * Calculates visual styling values for buttons based on level
 * @param level Current level
 * @returns Object with border width, glow size, and opacity
 */
export function calculateButtonStyle(level: number) {
  return {
    borderWidth: `${Math.min(2 + level, 6)}px`,
    boxShadow: `0 0 ${8 + level * 4}px rgba(255,215,0,${0.4 + level * 0.1})`
  };
}

/**
 * Calculates visual styling values for cells based on color and level
 * @param color Cell color
 * @param level Cell level
 * @returns Object with styling properties
 */
export function calculateCellStyle(color: string, level: number) {
  return {
    backgroundColor: color,
    border: `${Math.min(2 + level, 6)}px solid ${color}`,
    boxShadow: `0 0 ${6 + level * 3}px ${color}80`
  };
}

/**
 * Formats large numbers for display (e.g., 1.2K, 3.4M)
 * @param num Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Calculates the next level requirements and benefits
 * @param currentLevel Current level
 * @param type Type of upgrade ('click' | 'cell' | 'color')
 * @returns Object with cost, current benefit, and next benefit
 */
export function calculateUpgradePreview(
  currentLevel: number, 
  type: 'click' | 'cell' | 'color'
) {
  switch (type) {
    case 'click':
      return {
        cost: calculateClickUpgradeCost(currentLevel),
        currentPower: calculateClickPower(currentLevel),
        nextPower: calculateClickPower(currentLevel + 1)
      };
    case 'cell':
      return {
        cost: BALANCE.getCellUpgradeCost(currentLevel),
        currentIncome: BALANCE.getCellPassiveIncome(currentLevel),
        nextIncome: BALANCE.getCellPassiveIncome(currentLevel + 1)
      };
    case 'color':
      return {
        cost: calculateColorUpgradeCost(currentLevel),
        currentMultiplier: Math.pow(2, currentLevel),
        nextMultiplier: Math.pow(2, currentLevel + 1)
      };
    default:
      throw new Error(`Unknown upgrade type: ${type}`);
  }
}