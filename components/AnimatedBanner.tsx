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
        className="animated-video"
        style={{ backgroundColor: '#f6eee2', objectFit: 'cover', width: '100%', height: '100%' }}
      >
        <source src="/video-family.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="animated-video-overlay" />
    </div>
  );
};

export default AnimatedBanner;
