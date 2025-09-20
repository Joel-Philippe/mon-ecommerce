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
    if (percentage >= 60) return 'linear-gradient(90deg, rgb(45 113 5), rgba(36, 152, 7, 1))';
    if (percentage <= 50) return 'linear-gradient(90deg,rgb(188, 0, 0),rgb(246, 0, 0))';
    return 'linear-gradient(90deg,rgb(255, 174, 0),rgb(246, 139, 0))';
  };

  return (
    <div ref={inViewRef} style={{ marginTop: '8px' }}>
            <div style={{
        marginTop: '4px',
        fontSize: '0.85rem',
        textAlign: 'right',
        color: percentage < 30 ? '#cc0000' : '#6ba001ff',
        fontWeight: 500,
      }}>
        {isAnimated ? `${percentage}%` : '0%'} Disponible
      </div>
      <div
        style={{
          background: '#e0e0e0',
          borderRadius: '50px',
          height: '7px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        <div
          style={{
            width: isAnimated ? `${percentage}%` : '0%',
            height: '100%',
            background: getGradient(),
            transition: 'width 1s ease-out',
            borderRadius: '50px',
          }}
        />
      </div>

    </div>
  );
};

export default StockProgressBar;
