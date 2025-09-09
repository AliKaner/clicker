"use client";

import React from "react";
import { motion } from "framer-motion";
import { calculateButtonStyle, formatNumber } from "@/utils/gameCalculations";
import styles from "./ClickButton.module.scss";

interface ClickButtonProps {
  clickLevel: number;
  clickPower: number;
  gold: number;
  upgradeCost: number;
  onClick: () => void;
  onUpgrade: () => void;
  style?: React.CSSProperties;
}

const ClickButton: React.FC<ClickButtonProps> = ({
  clickLevel,
  clickPower,
  gold,
  upgradeCost,
  onClick,
  onUpgrade,
  style,
}) => {
  const [isClicked, setIsClicked] = React.useState(false);
  const buttonStyle = calculateButtonStyle(clickLevel);
  const canUpgrade = gold >= upgradeCost;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();

    // Trigger click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400);
  };

  const handleUpgrade = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canUpgrade) {
      onUpgrade();
    }
  };

  return (
    <motion.div
      className={`${styles.clickButton} ${isClicked ? styles.clicked : ""}`}
      style={{
        ...style,
        ...buttonStyle,
      }}
      onClick={handleClick}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 25px rgba(255, 215, 0, 0.4)",
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <div className={styles.content}>
        <div className={styles.powerDisplay}>
          💰 +{formatNumber(clickPower)}
        </div>

        <div className={styles.levelDisplay}>Level {clickLevel}</div>

        <motion.button
          className={`${styles.upgradeBtn} ${
            canUpgrade ? styles.canUpgrade : styles.cantUpgrade
          }`}
          onClick={handleUpgrade}
          disabled={!canUpgrade}
          whileHover={canUpgrade ? { scale: 1.05 } : {}}
          whileTap={canUpgrade ? { scale: 0.95 } : {}}
        >
          Upgrade ({formatNumber(upgradeCost)})
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClickButton;
