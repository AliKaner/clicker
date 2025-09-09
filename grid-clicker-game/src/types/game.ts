// Core game type definitions

export interface Cell {
  id: string;
  color?: string;
  level: number;
  x: number;
  y: number;
}

export interface GameState {
  gold: number;
  clickLevel: number;
  clickPower: number;
  cells: Cell[];
  discoveredColors: string[];
  colorUpgradeLevels: Record<string, number>;
  gridSize: { width: number; height: number };
}

export interface ColorUpgrade {
  color: string;
  level: number;
  cost: number;
  multiplier: number;
}

export interface GameStore extends GameState {
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

// UI Component Props
export interface GridProps {
  gridSize: { width: number; height: number };
  cells: Cell[];
  onCellClick: (cellId: string) => void;
  onCellDrop: (sourceId: string, targetId: string) => void;
}

export interface CellProps {
  cell: Cell;
  onClick: () => void;
  onDragStart: (cellId: string) => void;
  onDrop: (cellId: string) => void;
}

export interface ClickButtonProps {
  clickLevel: number;
  clickPower: number;
  gold: number;
  upgradeCost: number;
  onClick: () => void;
  onUpgrade: () => void;
}

export interface UpgradePanelProps {
  clickLevel: number;
  clickUpgradeCost: number;
  discoveredColors: string[];
  colorUpgradeLevels: Record<string, number>;
  onClickUpgrade: () => void;
  onColorUpgrade: (color: string) => void;
  getColorUpgradeCost: (color: string) => number;
}

export interface CollectionPanelProps {
  isOpen: boolean;
  discoveredColors: string[];
  cellCounts: Record<string, number>;
  onClose: () => void;
}

// Drag and Drop types
export interface DragData {
  cellId: string;
  cellColor?: string;
}