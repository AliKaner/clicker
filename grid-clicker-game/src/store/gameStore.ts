// Zustand game store for state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cell } from '../types/game';
import { 
  INITIAL_GOLD, 
  INITIAL_CLICK_LEVEL, 
  INITIAL_CLICK_POWER,
  DEFAULT_GRID_SIZE,
  STORAGE_KEYS 
} from '../utils/constants';
import {
  calculateClickPower,
  calculateClickUpgradeCost,
  calculateCellAssignCost,
  calculateCellUpgradeCost,
  calculateTotalPassiveIncome,
  calculateColorUpgradeCost,
  generateCellId
} from '../utils/gameCalculations';

interface GameStoreState {
  // Core game state
  gold: number;
  clickLevel: number;
  clickPower: number;
  cells: Cell[];
  discoveredColors: string[];
  colorUpgradeLevels: Record<string, number>;
  gridSize: { width: number; height: number };
  
  // UI state
  isCollectionModalOpen: boolean;
  selectedCellId: string | null;
  
  // Actions
  clickButton: () => void;
  upgradeClickButton: () => void;
  assignColorToCell: (cellId: string, color: string) => void;
  upgradeCell: (cellId: string) => void;
  fuseCells: (cell1Id: string, cell2Id: string) => void;
  upgradeColor: (color: string) => void;
  
  // UI actions
  openCollectionModal: () => void;
  closeCollectionModal: () => void;
  selectCell: (cellId: string | null) => void;
  
  // Computed getters
  getClickUpgradeCost: () => number;
  getCellAssignCost: (level?: number) => number;
  getCellUpgradeCost: (cellId: string) => number;
  getColorUpgradeCost: (color: string) => number;
  getTotalPassiveIncome: () => number;
  getCellById: (cellId: string) => Cell | undefined;
  getColorCellCount: (color: string) => number;
  
  // Utility actions
  initializeGrid: () => void;
  addPassiveIncome: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      gold: INITIAL_GOLD,
      clickLevel: INITIAL_CLICK_LEVEL,
      clickPower: INITIAL_CLICK_POWER,
      cells: [],
      discoveredColors: [],
      colorUpgradeLevels: {},
      gridSize: DEFAULT_GRID_SIZE,
      isCollectionModalOpen: false,
      selectedCellId: null,

      // Core actions
      clickButton: () => {
        const { clickPower } = get();
        set((state) => ({
          gold: state.gold + clickPower
        }));
      },

      upgradeClickButton: () => {
        const state = get();
        const cost = state.getClickUpgradeCost();
        
        if (state.gold >= cost) {
          const newLevel = state.clickLevel + 1;
          set({
            gold: state.gold - cost,
            clickLevel: newLevel,
            clickPower: calculateClickPower(newLevel)
          });
        }
      },

      assignColorToCell: (cellId: string, color: string) => {
        const state = get();
        const cost = state.getCellAssignCost();
        
        if (state.gold >= cost) {
          set((prevState) => {
            const updatedCells = prevState.cells.map(cell => 
              cell.id === cellId 
                ? { ...cell, color, level: 1 }
                : cell
            );
            
            const updatedDiscoveredColors = prevState.discoveredColors.includes(color)
              ? prevState.discoveredColors
              : [...prevState.discoveredColors, color];

            return {
              gold: prevState.gold - cost,
              cells: updatedCells,
              discoveredColors: updatedDiscoveredColors
            };
          });
        }
      },

      upgradeCell: (cellId: string) => {
        const state = get();
        const cost = state.getCellUpgradeCost(cellId);
        const cell = state.getCellById(cellId);
        
        if (cell && cell.color && state.gold >= cost) {
          set((prevState) => ({
            gold: prevState.gold - cost,
            cells: prevState.cells.map(c => 
              c.id === cellId 
                ? { ...c, level: c.level + 1 }
                : c
            )
          }));
        }
      },

      fuseCells: (sourceId: string, targetId: string) => {
        const state = get();
        const sourceCell = state.getCellById(sourceId);
        const targetCell = state.getCellById(targetId);
        
        if (sourceCell?.color && targetCell?.color && sourceId !== targetId) {
          // Import blendColors dynamically to avoid circular dependency
          import('../utils/colorUtils').then(({ blendColors }) => {
            const blendedColor = blendColors(sourceCell.color!, targetCell.color!);
            const combinedLevel = sourceCell.level + targetCell.level; // Merge levels
            
            set((prevState) => {
              const updatedCells = prevState.cells.map(cell => {
                if (cell.id === targetId) {
                  // New color goes to target cell (where dropped)
                  return { ...cell, color: blendedColor, level: combinedLevel };
                }
                if (cell.id === sourceId) {
                  // Source cell becomes empty
                  return { ...cell, color: undefined, level: 0 };
                }
                return cell;
              });
              
              const updatedDiscoveredColors = prevState.discoveredColors.includes(blendedColor)
                ? prevState.discoveredColors
                : [...prevState.discoveredColors, blendedColor];

              return {
                cells: updatedCells,
                discoveredColors: updatedDiscoveredColors
              };
            });
          });
        }
      },

      upgradeColor: (color: string) => {
        const state = get();
        const currentLevel = state.colorUpgradeLevels[color] || 0;
        const cost = state.getColorUpgradeCost(color);
        
        if (state.gold >= cost) {
          set((prevState) => ({
            gold: prevState.gold - cost,
            colorUpgradeLevels: {
              ...prevState.colorUpgradeLevels,
              [color]: currentLevel + 1
            }
          }));
        }
      },

      // UI actions
      openCollectionModal: () => set({ isCollectionModalOpen: true }),
      closeCollectionModal: () => set({ isCollectionModalOpen: false }),
      selectCell: (cellId: string | null) => set({ selectedCellId: cellId }),

      // Computed getters
      getClickUpgradeCost: () => {
        const { clickLevel } = get();
        return calculateClickUpgradeCost(clickLevel);
      },

      getCellAssignCost: (level: number = 0) => {
        return calculateCellAssignCost(level);
      },

      getCellUpgradeCost: (cellId: string) => {
        const cell = get().getCellById(cellId);
        return cell ? calculateCellUpgradeCost(cell) : 0;
      },

      getColorUpgradeCost: (color: string) => {
        const { colorUpgradeLevels } = get();
        const currentLevel = colorUpgradeLevels[color] || 0;
        return calculateColorUpgradeCost(currentLevel);
      },

      getTotalPassiveIncome: () => {
        const { cells, colorUpgradeLevels } = get();
        return calculateTotalPassiveIncome(cells, colorUpgradeLevels);
      },

      getCellById: (cellId: string) => {
        const { cells } = get();
        return cells.find(cell => cell.id === cellId);
      },

      getColorCellCount: (color: string) => {
        const { cells } = get();
        return cells.filter(cell => cell.color === color).length;
      },

      // Utility actions
      initializeGrid: () => {
        const { gridSize } = get();
        const cells: Cell[] = [];
        
        for (let y = 0; y < gridSize.height; y++) {
          for (let x = 0; x < gridSize.width; x++) {
            cells.push({
              id: generateCellId(x, y),
              x,
              y,
              level: 0
            });
          }
        }
        
        set({ cells });
      },

      addPassiveIncome: (amount: number) => {
        set((state) => ({
          gold: state.gold + amount
        }));
      },

      resetGame: () => {
        set({
          gold: INITIAL_GOLD,
          clickLevel: INITIAL_CLICK_LEVEL,
          clickPower: INITIAL_CLICK_POWER,
          cells: [],
          discoveredColors: [],
          colorUpgradeLevels: {},
          isCollectionModalOpen: false,
          selectedCellId: null
        });
        get().initializeGrid();
      }
    }),
    {
      name: STORAGE_KEYS.GAME_STATE,
      partialize: (state) => ({
        gold: state.gold,
        clickLevel: state.clickLevel,
        clickPower: state.clickPower,
        cells: state.cells,
        discoveredColors: state.discoveredColors,
        colorUpgradeLevels: state.colorUpgradeLevels,
        gridSize: state.gridSize
      })
    }
  )
);

// Initialize grid on first load - client side only
let isInitialized = false;

export const initializeGameStore = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    const store = useGameStore.getState();
    if (store.cells.length === 0) {
      store.initializeGrid();
    }
    isInitialized = true;
  }
};