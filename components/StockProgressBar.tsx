'use client';
import React, { useEffect, useState } from 'react';
import { calculateStockRemainingPercentage } from '@/utils/calculateStockPercentage';
import { useInView } from 'react-intersection-observer';

interface StockProgressBarProps {
  stock: number;
  stock_reduc: number;
}

const StockProgressBar: React.FC<StockProgressBarProps> = ({ stock, stock_reduc }) => {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsAnimated(true);
    }
  }, [inView]);

  const percentage = calculateStockRemainingPercentage(stock, stock_reduc);

  const getGradient = () => {
    if (percentage >= 60) return 'rgb(109, 252, 243)';
    if (percentage <= 50) return 'rgb(109, 252, 243)';
    return 'rgb(109, 252, 243)';
  };

  return (
    <div ref={inViewRef} style={{ position: 'relative', width: '100%', height: '12px' }}>
      {/* Background bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
      </div>

      {/* Filled portion of the bar */}
      <div
        style={{
          width: isAnimated ? `${percentage}%` : '0%',
          height: '100%',
          background: getGradient(),
          transition: 'width 1s ease-out',
          borderRadius: '50px',
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'hidden', // Hide the part of the text that overflows
        }}
      >
        {/* Contrasting text visible only on the filled part */}
        <span style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '12px', // Match the height
          color: '#028175', // Contrasting color
          fontSize: '0.5rem',
          fontWeight: '900',
          letterSpacing: '0.5px',
        }}>
          {percentage}% STOCK
        </span>
      </div>

      {/* Background text (always visible) */}
      <span style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        lineHeight: '12px', // Match the height
        color: 'rgba(255, 255, 255, 0.8)', // Base text color
        fontSize: '0.6rem',
        fontWeight: '900',
        letterSpacing: '0.5px',
        zIndex: -1, // Place it behind the filled bar
      }}>
        {percentage}% STOCK
      </span>
    </div>
  );
};

export default StockProgressBar;
