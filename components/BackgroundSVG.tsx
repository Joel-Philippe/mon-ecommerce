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
      >
        <defs>
          <linearGradient id="grad1" x1="0" x2="1">
            <stop offset="0" stopColor="#f87e12" />
            <stop offset="1" stopColor="#e63199" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" x2="1">
            <stop offset="0" stopColor="#07f916" />
            <stop offset="1" stopColor="#f8ede9" />
          </linearGradient>
        </defs>

        {/* --- CHAUSETTES --- */}
        <motion.g
          animate={{
            x: [200, 220, 190, 215, 200], // Initial x + floating
            y: [300, 285, 310, 295, 300], // Initial y + floating
            rotate: [0, 360],
            scale: [1.5, 1.55, 1.5],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        >
          <path
            d="M50 10 v100 q0 30 30 30 h40 q30 0 30 -30 v-40 q0 -20 -20 -20 h-20 v-40 q0 -20 -20 -20 z"
            fill="url(#grad1)"
            stroke="#e63198"
            strokeWidth="6"
            opacity="0.85"
          />
        </motion.g>
        <motion.g
          animate={{
            x: [1500, 1475, 1515, 1490, 1500],
            y: [200, 220, 190, 215, 200],
            rotate: [0, -360],
            scale: [0.8, 0.75, 0.8],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <path
            d="M50 10 v100 q0 30 30 30 h40 q30 0 30 -30 v-40 q0 -20 -20 -20 h-20 v-40 q0 -20 -20 -20 z"
            fill="url(#grad2)"
            stroke="#e63198"
            strokeWidth="4"
            opacity="0.7"
          />
        </motion.g>

        {/* --- CHAPEAUX --- */}
        <motion.g
          animate={{
            x: [400, 430, 380, 425, 400],
            y: [700, 680, 715, 690, 700],
            rotate: [0, 360],
            scale: [1.2, 1.25, 1.2],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <path
            d="M50 60 q50 -80 100 0 z"
            fill="url(#grad2)"
            stroke="#e63198"
            strokeWidth="6"
          />
          <ellipse cx="100" cy="70" rx="80" ry="20" fill="url(#grad1)" opacity="0.7" />
        </motion.g>
        <motion.g
          animate={{
            x: [1200, 1185, 1210, 1190, 1200],
            y: [500, 518, 488, 515, 500],
            rotate: [0, -360],
            scale: [0.7, 0.65, 0.7],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3.5,
          }}
        >
          <path
            d="M50 60 q50 -80 100 0 z"
            fill="#e63198"
            opacity="0.8"
          />
          <ellipse cx="100" cy="70" rx="80" ry="20" fill="url(#grad2)" />
        </motion.g>

        {/* --- VERRES À COCKTAIL --- */}
        <motion.g
          animate={{
            x: [800, 825, 785, 820, 800],
            y: [300, 280, 315, 290, 300],
            rotate: [0, 360],
            scale: [1.5, 1.58, 1.5],
          }}
          transition={{
            duration: 27,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.8,
          }}
        >
          <polygon
            points="0,0 100,0 50,120"
            fill="url(#grad1)"
            stroke="#e63198"
            strokeWidth="5"
            opacity="0.85"
          />
          <rect x="45" y="120" width="10" height="60" fill="url(#grad2)" />
          <circle cx="50" cy="-10" r="12" fill="#e63198" />
        </motion.g>
        <motion.g
          animate={{
            x: [1700, 1682, 1712, 1695, 1700],
            y: [600, 622, 585, 618, 600],
            rotate: [0, -360],
            scale: [0.9, 0.85, 0.9],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4.5,
          }}
        >
          <polygon
            points="0,0 100,0 50,120"
            fill="url(#grad2)"
            stroke="#e63198"
            strokeWidth="3"
          />
          <rect x="45" y="120" width="10" height="50" fill="url(#grad1)" />
        </motion.g>

        {/* --- LUNETTES --- */}
        <motion.g
          animate={{
            x: [600, 620, 590, 615, 600],
            y: [900, 885, 910, 895, 900],
            rotate: [0, 360],
            scale: [1.4, 1.45, 1.4],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        >
          <circle cx="40" cy="40" r="40" fill="none" stroke="url(#grad1)" strokeWidth="8" />
          <circle cx="140" cy="40" r="40" fill="none" stroke="url(#grad2)" strokeWidth="8" />
          <rect x="80" y="30" width="20" height="20" fill="#e63198" />
        </motion.g>
        <motion.g
          animate={{
            x: [1400, 1388, 1408, 1390, 1400],
            y: [850, 865, 840, 858, 850],
            rotate: [0, -360],
            scale: [0.8, 0.78, 0.8],
          }}
          transition={{
            duration: 29,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        >
          <circle cx="40" cy="40" r="40" fill="none" stroke="#e63198" strokeWidth="6" />
          <circle cx="140" cy="40" r="40" fill="none" stroke="url(#grad1)" strokeWidth="6" />
          <rect x="80" y="30" width="20" height="20" fill="url(#grad2)" />
        </motion.g>
      </svg>
    </div>
  );
}