'use client';
import { useEffect, useState } from 'react';
import { calculateCountdown } from '../utils/countdown';

interface CountdownProps {
  endDate: Date | string;
  onExpired: (title: string) => void;
  title: string;
  color?: string; // New optional color prop
}

const Countdown: React.FC<CountdownProps> = ({ endDate, onExpired, title, color }) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const parseDate = (date: any) => {
    if (!date) return null;
    const parsedDate = date instanceof Date ? date : new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  useEffect(() => {
    const parsedEndDate = parseDate(endDate);
    if (!parsedEndDate) return;

    let timer: NodeJS.Timeout;

    const updateCountdown = () => {
      const { days, hours, minutes, seconds } = calculateCountdown(parsedEndDate);
      setCountdown({ days, hours, minutes, seconds });

      if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        clearInterval(timer);
        onExpired(title);
      }
    };

    updateCountdown();
    timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpired]);

  // 💡 Détection écran < 900px
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 🎨 Couleur du texte selon le countdown + taille écran
  let textColor = color || '#000'; // Use prop color if provided

  if (!color) { // Only apply dynamic color if no prop color is provided
    if (isSmallScreen) {
      if (countdown.days > 10) {
        textColor = 'white';
      } else if (countdown.days <= 10 && countdown.days > 5) {
        textColor = 'white';
      } else if (countdown.days <= 5 && countdown.days > 2) {
        textColor = 'white';
      } else if (countdown.days <= 2) {
        textColor = 'white';
      }
    } else {
      if (countdown.days > 10) {
        textColor = 'white';
      } else if (countdown.days <= 10 && countdown.days > 5) {
        textColor = 'white';
      } else if (countdown.days <= 5 && countdown.days > 2) {
        textColor = 'white';
      } else if (countdown.days <= 2) {
        textColor = 'white';
      }
    }
  }

  const blinkStyle = countdown.days <= 2 ? { animation: 'blink 1s infinite' } : {};

  return (
    <div className="time_card" style={{ color: textColor, ...blinkStyle }}>
      {countdown.days > 0
        ? `Expire dans ${countdown.days} jour${countdown.days > 1 ? 's' : ''}, ${countdown.hours}h:${countdown.minutes}m:${countdown.seconds}s`
        : countdown.hours > 0
        ? `Expire dans ${countdown.hours}h:${countdown.minutes}m:${countdown.seconds}s`
        : countdown.minutes > 0
        ? `Expire dans ${countdown.minutes}m:${countdown.seconds}s`
        : `❌ Expiré`}
    </div>
  );
};

export default Countdown;
