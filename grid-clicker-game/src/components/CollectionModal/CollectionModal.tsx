'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import styles from './CollectionModal.module.scss';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ isOpen, onClose }) => {
  const { discoveredColors, cells } = useGameStore();

  const getColorCount = (color: string) => {
    return cells.filter(cell => cell.color === color).length;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2>Color Collection</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.stats}>
              <p>Discovered Colors: {discoveredColors.length}</p>
              {discoveredColors.length >= 25 && (
                <p className={styles.special}>🎉 Special colors unlocked!</p>
              )}
            </div>

            <div className={styles.colorGrid}>
              {discoveredColors.map((color) => (
                <div key={color} className={styles.colorItem}>
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color }}
                  />
                  <div className={styles.colorInfo}>
                    <div className={styles.colorCode}>{color}</div>
                    <div className={styles.colorCount}>
                      {getColorCount(color)} cells
                    </div>
                  </div>
                </div>
              ))}

              {/* Show locked slots */}
              {Array.from({ length: Math.max(0, 30 - discoveredColors.length) }).map((_, index) => (
                <div key={`locked-${index}`} className={styles.lockedItem}>
                  <div className={styles.lockedSwatch}>
                    ?
                  </div>
                  <div className={styles.colorInfo}>
                    <div className={styles.colorCode}>Locked</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CollectionModal;