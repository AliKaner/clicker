'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { CLICK_BUTTON_GRID_POSITION } from '@/utils/constants';

import Cell from './Cell';
import ClickButton from '../ClickButton/ClickButton';
import ColorAssignPopup from '../ColorAssignPopup/ColorAssignPopup';
import styles from './Grid.module.scss';

interface GridProps {
  className?: string;
}

const Grid: React.FC<GridProps> = ({ className }) => {
  const { 
    cells, 
    gridSize, 
    clickLevel,
    clickPower,
    gold,
    getClickUpgradeCost,
    clickButton,
    upgradeClickButton,
    selectCell,
    selectedCellId
  } = useGameStore();

  const handleCellClick = (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell) return;
    
    // If cell has no color, trigger color assignment
    if (!cell.color) {
      selectCell(cellId);
      // This will trigger a popup for color assignment
    } else {
      // If cell has color, select it for potential operations
      selectCell(selectedCellId === cellId ? null : cellId);
    }
  };

  const handleCellDragStart = (cellId: string) => {
    console.log('Drag start:', cellId);
  };

  const handleCellDrop = (sourceId: string, targetId: string) => {
    const sourceCell = cells.find(c => c.id === sourceId);
    const targetCell = cells.find(c => c.id === targetId);
    
    if (sourceCell?.color && targetCell?.color && sourceId !== targetId) {
      // Trigger color fusion
      useGameStore.getState().fuseCells(sourceId, targetId);
    }
  };

  const renderGridItems = () => {
  const items: React.ReactNode[] = [];

  // ClickButton'u grid'in ortasına konumlandır
  const clickButtonWidth = CLICK_BUTTON_GRID_POSITION.width;
  const clickButtonHeight = CLICK_BUTTON_GRID_POSITION.height;

  const startX = Math.floor((gridSize.width - clickButtonWidth) / 2);
  const startY = Math.floor((gridSize.height - clickButtonHeight) / 2);

  for (let y = 0; y < gridSize.height; y++) {
    for (let x = 0; x < gridSize.width; x++) {
      const isClickButtonArea =
        x >= startX &&
        x < startX + clickButtonWidth &&
        y >= startY &&
        y < startY + clickButtonHeight;

      if (isClickButtonArea) {
        if (x === startX && y === startY) {
          items.push(
            <ClickButton
              key={`click-button-${x}-${y}`}
              clickLevel={clickLevel}
              clickPower={clickPower}
              gold={gold}
              upgradeCost={getClickUpgradeCost()}
              onClick={clickButton}
              onUpgrade={upgradeClickButton}
              style={{
                gridColumn: `${startX + 1} / span ${clickButtonWidth}`,
                gridRow: `${startY + 1} / span ${clickButtonHeight}`,
              }}
            />
          );
        }
        continue;
      }

      // Normal hücre renderlama
      const cell = cells.find((c) => c.x === x && c.y === y);

      if (cell) {
        items.push(
          <Cell
            key={cell.id}
            cell={cell}
            isSelected={selectedCellId === cell.id}
            onClick={() => handleCellClick(cell.id)}
            onDragStart={handleCellDragStart}
            onDrop={(sourceId: string) => handleCellDrop(sourceId, cell.id)}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
          />
        );
      }
    }
  }

  return items;
};


  return (
    <>
      <div 
        className={`${styles.grid} ${className || ''}`}
        style={{
          '--grid-width': gridSize.width,
          '--grid-height': gridSize.height,
        } as React.CSSProperties}
      >
        {renderGridItems()}
      </div>
      
      <ColorAssignPopup
        cellId={selectedCellId}
        onClose={() => selectCell(null)}
      />
    </>
  );
};

export default Grid;