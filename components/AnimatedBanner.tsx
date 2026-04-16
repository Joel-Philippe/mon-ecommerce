// components/AnimatedBanner.tsx
'use client';
import React from 'react';
import '../app/video-banner.css';

interface AnimatedBannerProps {
  onEnd: () => void;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = ({ onEnd }) => {
  return (
    <div className="animated-video-container">
      <video
        autoPlay
        muted
        playsInline
        onEnded={onEnd} // Ensure the callback is triggered when video finishes
        className="animated-video"
        style={{ backgroundColor: '#f6eee2' }}
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="animated-video-overlay" />
    </div>
  );
};

export default AnimatedBanner;
