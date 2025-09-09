// Tests for game store

import { useGameStore } from '../gameStore';
import { INITIAL_GOLD, INITIAL_CLICK_LEVEL, INITIAL_CLICK_POWER } from '../../utils/constants';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';
import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useGameStore.getState().resetGame();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useGameStore.getState();
      
      expect(state.gold).toBe(INITIAL_GOLD);
      expect(state.clickLevel).toBe(INITIAL_CLICK_LEVEL);
      expect(state.clickPower).toBe(INITIAL_CLICK_POWER);
      expect(state.discoveredColors).toEqual([]);
      expect(state.colorUpgradeLevels).toEqual({});
      expect(state.isCollectionModalOpen).toBe(false);
      expect(state.selectedCellId).toBe(null);
    });

    it('should initialize grid with correct number of cells', () => {
      const state = useGameStore.getState();
      const expectedCellCount = state.gridSize.width * state.gridSize.height;
      
      expect(state.cells).toHaveLength(expectedCellCount);
      expect(state.cells[0]).toMatchObject({
        id: 'cell-0-0',
        x: 0,
        y: 0,
        level: 0,
        color: undefined
      });
    });
  });

  describe('clickButton action', () => {
    it('should add click power to gold', () => {
      const store = useGameStore.getState();
      const initialGold = store.gold;
      const clickPower = store.clickPower;
      
      store.clickButton();
      
      expect(useGameStore.getState().gold).toBe(initialGold + clickPower);
    });

    it('should add correct amount after multiple clicks', () => {
      const store = useGameStore.getState();
      const clickPower = store.clickPower;
      
      store.clickButton();
      store.clickButton();
      store.clickButton();
      
      expect(useGameStore.getState().gold).toBe(clickPower * 3);
    });
  });

  describe('upgradeClickButton action', () => {
    it('should upgrade when player has enough gold', () => {
      const store = useGameStore.getState();
      
      // Give player enough gold
      const upgradeCost = store.getClickUpgradeCost();
      useGameStore.setState({ gold: upgradeCost });
      
      store.upgradeClickButton();
      
      const newState = useGameStore.getState();
      expect(newState.clickLevel).toBe(1);
      expect(newState.clickPower).toBe(2); // 2^1
      expect(newState.gold).toBe(0);
    });

    it('should not upgrade when player lacks gold', () => {
      const store = useGameStore.getState();
      const initialState = { ...store };
      
      // Ensure player has insufficient gold
      useGameStore.setState({ gold: 50 }); // Less than 100 needed
      
      store.upgradeClickButton();
      
      const newState = useGameStore.getState();
      expect(newState.clickLevel).toBe(initialState.clickLevel);
      expect(newState.clickPower).toBe(initialState.clickPower);
      expect(newState.gold).toBe(50); // Unchanged
    });
  });

  describe('assignColorToCell action', () => {
    it('should assign color to cell when player has enough gold', () => {
      const store = useGameStore.getState();
      const cellId = 'cell-0-0';
      const color = '#ff0000';
      
      // Give player enough gold
      const assignCost = store.getCellAssignCost();
      useGameStore.setState({ gold: assignCost });
      
      store.assignColorToCell(cellId, color);
      
      const newState = useGameStore.getState();
      const cell = newState.getCellById(cellId);
      
      expect(cell?.color).toBe(color);
      expect(cell?.level).toBe(1);
      expect(newState.discoveredColors).toContain(color);
      expect(newState.gold).toBe(0);
    });

    it('should not assign color when player lacks gold', () => {
      const store = useGameStore.getState();
      const cellId = 'cell-0-0';
      const color = '#ff0000';
      
      // Ensure insufficient gold
      useGameStore.setState({ gold: 25 }); // Less than 50 needed
      
      store.assignColorToCell(cellId, color);
      
      const newState = useGameStore.getState();
      const cell = newState.getCellById(cellId);
      
      expect(cell?.color).toBeUndefined();
      expect(newState.discoveredColors).not.toContain(color);
      expect(newState.gold).toBe(25); // Unchanged
    });
  });

  describe('computed getters', () => {
    it('should calculate click upgrade cost correctly', () => {
      const store = useGameStore.getState();
      
      expect(store.getClickUpgradeCost()).toBe(100); // 100 * 2^0
      
      useGameStore.setState({ clickLevel: 1 });
      expect(store.getClickUpgradeCost()).toBe(200); // 100 * 2^1
      
      useGameStore.setState({ clickLevel: 2 });
      expect(store.getClickUpgradeCost()).toBe(400); // 100 * 2^2
    });

    it('should calculate total passive income correctly', () => {
      const store = useGameStore.getState();
      
      // Initially no passive income
      expect(store.getTotalPassiveIncome()).toBe(0);
      
      // Add a colored cell
      useGameStore.setState({
        cells: store.cells.map(cell => 
          cell.id === 'cell-0-0' 
            ? { ...cell, color: '#ff0000', level: 1 }
            : cell
        )
      });
      
      expect(store.getTotalPassiveIncome()).toBe(1); // 2^(1-1) = 1
    });

    it('should count cells by color correctly', () => {
      const store = useGameStore.getState();
      const color = '#ff0000';
      
      expect(store.getColorCellCount(color)).toBe(0);
      
      // Add two cells with the same color
      useGameStore.setState({
        cells: store.cells.map((cell, index) => 
          index < 2 
            ? { ...cell, color, level: 1 }
            : cell
        )
      });
      
      expect(store.getColorCellCount(color)).toBe(2);
    });
  });

  describe('UI actions', () => {
    it('should manage collection modal state', () => {
      const store = useGameStore.getState();
      
      expect(store.isCollectionModalOpen).toBe(false);
      
      store.openCollectionModal();
      expect(useGameStore.getState().isCollectionModalOpen).toBe(true);
      
      store.closeCollectionModal();
      expect(useGameStore.getState().isCollectionModalOpen).toBe(false);
    });

    it('should manage selected cell state', () => {
      const store = useGameStore.getState();
      const cellId = 'cell-5-3';
      
      expect(store.selectedCellId).toBe(null);
      
      store.selectCell(cellId);
      expect(useGameStore.getState().selectedCellId).toBe(cellId);
      
      store.selectCell(null);
      expect(useGameStore.getState().selectedCellId).toBe(null);
    });
  });
});