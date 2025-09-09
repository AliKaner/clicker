// Unit tests for game calculations

import { 
  calculateClickPower, 
  calculateClickUpgradeCost, 
  calculateCellPassiveIncome,
  calculateTotalPassiveIncome,
  generateCellId,
  parseCellId,
  formatNumber
} from '../gameCalculations';
import type { Cell } from '../../types/game';

describe('gameCalculations', () => {
  describe('calculateClickPower', () => {
    it('should calculate power as 2^level', () => {
      expect(calculateClickPower(0)).toBe(1);
      expect(calculateClickPower(1)).toBe(2);
      expect(calculateClickPower(2)).toBe(4);
      expect(calculateClickPower(3)).toBe(8);
    });
  });

  describe('calculateClickUpgradeCost', () => {
    it('should calculate cost as 100 * 2^level', () => {
      expect(calculateClickUpgradeCost(0)).toBe(100);
      expect(calculateClickUpgradeCost(1)).toBe(200);
      expect(calculateClickUpgradeCost(2)).toBe(400);
    });
  });

  describe('calculateCellPassiveIncome', () => {
    const testCell: Cell = {
      id: 'test-cell',
      color: '#ff0000',
      level: 1,
      x: 0,
      y: 0
    };

    it('should return 0 for cells without color', () => {
      const cellWithoutColor = { ...testCell, color: undefined };
      expect(calculateCellPassiveIncome(cellWithoutColor)).toBe(0);
    });

    it('should calculate income as 2^(level-1)', () => {
      expect(calculateCellPassiveIncome({ ...testCell, level: 1 })).toBe(1);
      expect(calculateCellPassiveIncome({ ...testCell, level: 2 })).toBe(2);
      expect(calculateCellPassiveIncome({ ...testCell, level: 3 })).toBe(4);
    });

    it('should apply color multiplier', () => {
      const income = calculateCellPassiveIncome(testCell, 2);
      expect(income).toBe(2); // 1 * 2
    });
  });

  describe('calculateTotalPassiveIncome', () => {
    const cells: Cell[] = [
      { id: 'cell-1', color: '#ff0000', level: 1, x: 0, y: 0 },
      { id: 'cell-2', color: '#00ff00', level: 2, x: 1, y: 0 },
      { id: 'cell-3', color: undefined, level: 1, x: 2, y: 0 }, // No color
    ];

    it('should sum income from all colored cells', () => {
      const colorUpgrades = {};
      const total = calculateTotalPassiveIncome(cells, colorUpgrades);
      expect(total).toBe(3); // 1 + 2 + 0
    });

    it('should apply color upgrade multipliers', () => {
      const colorUpgrades = { '#ff0000': 1 }; // 2x multiplier
      const total = calculateTotalPassiveIncome(cells, colorUpgrades);
      expect(total).toBe(4); // (1*2) + 2 + 0
    });
  });

  describe('generateCellId and parseCellId', () => {
    it('should generate and parse cell IDs correctly', () => {
      const id = generateCellId(5, 3);
      expect(id).toBe('cell-5-3');
      
      const parsed = parseCellId(id);
      expect(parsed).toEqual({ x: 5, y: 3 });
    });
  });

  describe('formatNumber', () => {
    it('should format small numbers as-is', () => {
      expect(formatNumber(123)).toBe('123');
      expect(formatNumber(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(12345)).toBe('12.3K');
    });

    it('should format millions with M suffix', () => {
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(12345678)).toBe('12.3M');
    });

    it('should format billions with B suffix', () => {
      expect(formatNumber(1500000000)).toBe('1.5B');
    });
  });
});