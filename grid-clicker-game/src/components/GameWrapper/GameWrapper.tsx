'use client';

import React from 'react';
import { useGameStore, initializeGameStore } from '@/store/gameStore';
import { usePassiveIncome } from '@/store/usePassiveIncome';
import Grid from '../Grid/Grid';
import CollectionModal from '../CollectionModal/CollectionModal';
import { formatNumber } from '@/utils/gameCalculations';

const GameWrapper: React.FC = () => {
  const { 
    gold, 
    isCollectionModalOpen, 
    openCollectionModal,
    closeCollectionModal,
    getTotalPassiveIncome,
    discoveredColors,
    getColorUpgradeCost,
    upgradeColor
  } = useGameStore();
  
  // Initialize store and start passive income
  React.useEffect(() => {
    initializeGameStore();
  }, []);
  
  // Start passive income generation
  usePassiveIncome();
  
  const passiveIncome = getTotalPassiveIncome();

  return (
    <div className="game-container">
      {/* Top panel wrapper with gold and collection */}
      <div className="top-panel-wrapper">
        <div className="gold-display">
          <span className="gold-amount">{formatNumber(Math.floor(gold))}</span>
          <span className="gold-icon">💰</span>
        </div>
        <button className="collection-btn" onClick={openCollectionModal}>
          <span className="collection-icon">📦</span>
        </button>
      </div>

      <header style={{ textAlign: 'center', padding: '1rem 0' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Color Clicker</h1>
        <p style={{ opacity: 0.7 }}>
          Click click and fusion colors 
          {passiveIncome > 0 && (
            <span style={{ color: '#4CAF50', marginLeft: '1rem' }}>
              +{formatNumber(passiveIncome)}/sec
            </span>
          )}
        </p>
      </header>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        minHeight: '300px'
      }}>
        <Grid />
      </main>

      {/* Upgrade panel - single 3D wrapper */}
      <div className="upgrade-panel-wrapper">
        <button 
          className="btn color-upgrade"
          onClick={() => {
            // Upgrade all colors at once
            discoveredColors.forEach(color => {
              const cost = getColorUpgradeCost(color);
              if (gold >= cost) {
                upgradeColor(color);
              }
            });
          }}
          disabled={discoveredColors.length === 0}
        >
          🎨 Upgrade All Colors ({formatNumber(
            discoveredColors.reduce((total, color) => total + getColorUpgradeCost(color), 0)
          )})
        </button>
      </div>
      
      <CollectionModal 
        isOpen={isCollectionModalOpen}
        onClose={closeCollectionModal}
      />
    </div>
  );
};

export default GameWrapper;