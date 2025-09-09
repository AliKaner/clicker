'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { DEFAULT_COLORS, SPECIAL_COLORS, COLORS_NEEDED_FOR_SPECIAL } from '@/utils/constants';
import { formatNumber } from '@/utils/gameCalculations';
import styles from './ColorAssignPopup.module.scss';

interface ColorAssignPopupProps {
  cellId: string | null;
  onClose: () => void;
}

const ColorAssignPopup: React.FC<ColorAssignPopupProps> = ({ cellId, onClose }) => {
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const { gold, getCellAssignCost, assignColorToCell, discoveredColors } = useGameStore();
  
  const cell = useGameStore(state => 
    cellId ? state.getCellById(cellId) : null
  );
  
  const assignCost = getCellAssignCost();
  const canAfford = gold >= assignCost;
  const hasSpecialColors = discoveredColors.length >= COLORS_NEEDED_FOR_SPECIAL;
  const availableColors = hasSpecialColors ? [...DEFAULT_COLORS, ...SPECIAL_COLORS] : DEFAULT_COLORS;

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleAssign = () => {
    if (selectedColor && cellId && canAfford) {
      assignColorToCell(cellId, selectedColor);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedColor(null);
    onClose();
  };

  // Only show popup for empty cells
  if (!cellId || !cell || cell.color) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
      >
        <motion.div
          className={styles.popup}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3>Assign Color to Cell</h3>
            <button className={styles.closeBtn} onClick={handleCancel}>
              ×
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.info}>
              <p>Position: ({cell.x}, {cell.y})</p>
              <p>Cost: {formatNumber(assignCost)} gold</p>
              <p>Your Gold: {formatNumber(gold)}</p>
            </div>

            <div className={styles.colorPicker}>
              {availableColors.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorOption} ${
                    selectedColor === color ? styles.selected : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className={`${styles.assignBtn} ${
                  canAfford && selectedColor ? styles.enabled : styles.disabled
                }`}
                onClick={handleAssign}
                disabled={!canAfford || !selectedColor}
              >
                Assign Color
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorAssignPopup;