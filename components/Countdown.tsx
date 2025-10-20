'use client';
import { useEffect, useState } from 'react';
import { calculateCountdown } from '../utils/countdown';

interface CountdownProps {
  endDate: Date | string;
  onExpired: (title: string) => void;
  title: string;
  color?: string; // Prop de couleur optionnelle
}

const Countdown: React.FC<CountdownProps> = ({ endDate, onExpired, title, color }) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
  }, [endDate, onExpired, title]);

  // Déterminer la couleur en fonction du temps restant
  const getTextColor = () => {
    if (color) return color; // Priorité à la couleur passée en prop

    if (countdown.days > 7) {
      return 'green'; // Vert pour plus de 7 jours
    } else if (countdown.days > 3) {
      return 'orange'; // Orange pour plus de 3 jours
    } else {
      return 'red'; // Rouge pour 3 jours ou moins
    }
  };

  const textColor = getTextColor();
  const blinkStyle = countdown.days < 1 ? { animation: 'blink 1s infinite' } : {};

  return (
    <div className="time_card" style={{ color: textColor, ...blinkStyle }}>
      {countdown.days > 0
        ? ` ${countdown.days} jour${countdown.days > 1 ? 's' : ''}, ${countdown.hours}h:${countdown.minutes}m:${countdown.seconds}s`
        : countdown.hours > 0
        ? ` ${countdown.hours}h:${countdown.minutes}m:${countdown.seconds}s`
        : countdown.minutes > 0
        ? `${countdown.minutes}m:${countdown.seconds}s`
        : ` Fini`}

      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default Countdown;