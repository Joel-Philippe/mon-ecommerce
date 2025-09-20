'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundSVG() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'blanchedalmond',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          {/* gradient for points */}
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#f87e12" />
            <stop offset="1" stopColor="#e63199" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0" stopColor="#07f916" />
            <stop offset="1" stopColor="#f8ede9" />
          </linearGradient>

          {/* subtle blur for depth */}
          <filter id="fBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Large soft blobs for depth (subtle, blurred) */}
        <motion.g
          opacity="0.12"
          filter="url(#fBlur)"
          animate={{
            x: [0, 10, 0],
            y: [0, 5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ellipse cx="300" cy="180" rx="380" ry="140" fill="#e63198" />
          <ellipse cx="1600" cy="900" rx="420" ry="160" fill="#07f916" />
        </motion.g>

        {/* multiple wavy strokes with different thickness and opacities */}
        <g stroke="#e63198" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95">
          <motion.path
            d="M-50 200 C 200 80, 420 360, 800 220 S 1500 140, 2000 220"
            strokeWidth="6"
            opacity="0.9"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M-50 300 C 180 200, 420 500, 820 360 S 1520 280, 2020 360"
            strokeWidth="12"
            opacity="0.75"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          />
          <motion.path
            d="M-100 420 C 250 320, 600 680, 1000 480 S 1600 340, 2200 420"
            strokeWidth="3.5"
            opacity="0.9"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 1 }}
          />
          <motion.path
            d="M-120 540 C 260 500, 560 920, 960 700 S 1540 560, 2100 640"
            strokeWidth="18"
            opacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 1.5 }}
          />
          <motion.path
            d="M-200 760 C 180 660, 520 1000, 1000 820 S 1680 740, 2200 760"
            strokeWidth="9"
            opacity="0.65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 2 }}
          />
        </g>

        {/* thinner accent strokes (lighter) */}
        <g stroke="#e63198" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5">
          <motion.path
            d="M50 100 C 360 40, 700 240, 1080 160 S 1560 80, 2100 160"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 0.2 }}
          />
          <motion.path
            d="M30 860 C 380 760, 700 980, 1100 820 S 1600 680, 2120 760"
            strokeWidth="1.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 13, repeat: Infinity, ease: 'linear', delay: 0.7 }}
          />
        </g>

        {/* Points / dots with gradients and size variations */}
        <motion.g
          transform="translate(0,0)"
          opacity="0.95"
          animate={{
            x: [0, -5, 0, 5, 0],
            y: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1, 0.95, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <circle cx="220" cy="140" r="8" fill="url(#g1)" />
          <circle cx="420" cy="320" r="5" fill="url(#g2)" />
          <circle cx="760" cy="200" r="12" fill="url(#g1)" />
          <circle cx="1120" cy="260" r="6" fill="url(#g2)" />
          <circle cx="1480" cy="120" r="18" fill="url(#g1)" />
          <circle cx="1700" cy="420" r="10" fill="url(#g2)" />
          <circle cx="200" cy="720" r="14" fill="url(#g1)" />
          <circle cx="520" cy="860" r="9" fill="url(#g2)" />
          <circle cx="980" cy="720" r="20" fill="url(#g1)" />
          <circle cx="1500" cy="920" r="7" fill="url(#g2)" />
        </motion.g>

        {/* tiny speckles for texture */}
        <motion.g
          opacity="0.8"
          fill="#e63198"
          animate={{
            x: [0, 2, 0, -2, 0],
            y: [0, -2, 0, 2, 0],
            opacity: [0.8, 0.9, 0.8, 0.7, 0.8],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <circle cx="60" cy="60" r="2" />
          <circle cx="300" cy="40" r="1.6" />
          <circle cx="520" cy="180" r="1.2" />
          <circle cx="880" cy="140" r="1.8" />
          <circle cx="1300" cy="60" r="2.4" />
          <circle cx="1750" cy="200" r="1.6" />
        </motion.g>

        {/* subtle vignette to keep content readable */}
        <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      </svg>
    </div>
  );
}