'use client';

import React from 'react';
import type { Cell as CellType } from '@/types/game';
import { calculateCellStyle } from '@/utils/gameCalculations';
import styles from './Cell.module.scss';

interface CellProps {
  cell: CellType;
  isSelected?: boolean;
  onClick: () => void;
  onDragStart: (cellId: string) => void;
  onDrop: (cellId: string) => void;
  style?: React.CSSProperties;
}

const Cell: React.FC<CellProps> = ({
  cell,
  isSelected = false,
  onClick,
  onDragStart,
  onDrop,
  style
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const cellStyle = React.useMemo(() => {
    if (!cell.color) return {};
    return calculateCellStyle(cell.color, cell.level);
  }, [cell.color, cell.level]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!cell.color) return;
    
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', cell.id);
    onDragStart(cell.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId && sourceId !== cell.id) {
      onDrop(sourceId);
    }
  };  
const cellClasses = [
    styles.cell,
    cell.color ? styles.colored : styles.empty,
    isSelected ? styles.selected : '',
    isDragging ? styles.dragging : '',
    isDragOver ? styles.dragOver : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cellClasses}
      style={{
        ...style,
        ...cellStyle
      }}
      onClick={onClick}
      draggable={!!cell.color}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {cell.color && cell.level > 1 && (
        <div className={styles.levelIndicator}>
          {cell.level}
        </div>
      )}
      
      {!cell.color && (
        <div className={styles.emptyIndicator}>
          +
        </div>
      )}
    </div>
  );
};

export default Cell;