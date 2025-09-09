// Hook for managing passive income generation

import { useEffect, useRef } from 'react';
import { useGameStore } from './gameStore';
import { PASSIVE_INCOME_UPDATE_INTERVAL } from '../utils/constants';

/**
 * Hook that manages passive income generation from colored cells
 * Updates gold every 100ms based on total passive income
 */
export function usePassiveIncome() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  
  const getTotalPassiveIncome = useGameStore(state => state.getTotalPassiveIncome);
  const addPassiveIncome = useGameStore(state => state.addPassiveIncome);

  useEffect(() => {
    const updatePassiveIncome = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000; // Convert to seconds
      const totalIncomePerSecond = getTotalPassiveIncome();
      
      if (totalIncomePerSecond > 0) {
        const incomeToAdd = totalIncomePerSecond * deltaTime;
        addPassiveIncome(incomeToAdd);
      }
      
      lastUpdateRef.current = now;
    };

    // Start the passive income timer
    intervalRef.current = setInterval(updatePassiveIncome, PASSIVE_INCOME_UPDATE_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getTotalPassiveIncome, addPassiveIncome]);

  // Return current passive income rate for display purposes
  return getTotalPassiveIncome();
}

/**
 * Hook that provides formatted passive income display
 */
export function usePassiveIncomeDisplay() {
  const passiveIncome = usePassiveIncome();
  
  // Format the income for display
  const formatIncome = (income: number): string => {
    if (income === 0) return '0/sec';
    if (income < 1) return `${income.toFixed(2)}/sec`;
    if (income < 1000) return `${income.toFixed(1)}/sec`;
    if (income < 1000000) return `${(income / 1000).toFixed(1)}K/sec`;
    return `${(income / 1000000).toFixed(1)}M/sec`;
  };

  return {
    passiveIncome,
    formattedIncome: formatIncome(passiveIncome),
    hasPassiveIncome: passiveIncome > 0
  };
}