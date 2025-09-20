'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundSVG() { // Renamed from GeometricBackground to match existing file
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
          <linearGradient id="grad1" x1="0" x2="1">
            <stop offset="0" stopColor="#f87e12" />
            <stop offset="1" stopColor="#e63199" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" x2="1">
            <stop offset="0" stopColor="#07f916" />
            <stop offset="1" stopColor="#f8ede9" />
          </linearGradient>
        </defs>

        {/* Triangles */}
        <motion.polygon
          points="200,100 250,200 150,200"
          fill="url(#grad1)"
          opacity="0.8"
          animate={{
            x: [0, 10, 0, -10, 0],
            y: [0, -5, 0, 5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.polygon
          points="600,300 700,500 500,500"
          stroke="#e63198"
          strokeWidth="12"
          fill="none"
          animate={{
            x: [0, -15, 0, 15, 0],
            y: [0, 10, 0, -10, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.polygon
          points="1400,200 1500,400 1300,400"
          fill="url(#grad2)"
          opacity="0.7"
          animate={{
            x: [0, 20, 0, -20, 0],
            y: [0, -10, 0, 10, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Cercles */}
        <motion.circle
          cx="400"
          cy="600"
          r="80"
          fill="url(#grad2)"
          opacity="0.9"
          animate={{
            x: [0, 12, 0, -12, 0],
            y: [0, -8, 0, 8, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        <motion.circle
          cx="900"
          cy="400"
          r="50"
          stroke="#e63198"
          strokeWidth="8"
          fill="none"
          animate={{
            x: [0, -8, 0, 8, 0],
            y: [0, 12, 0, -12, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
        <motion.circle
          cx="1600"
          cy="700"
          r="100"
          fill="url(#grad1)"
          opacity="0.6"
          animate={{
            x: [0, 18, 0, -18, 0],
            y: [0, -15, 0, 15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
        />

        {/* Carrés */}
        <motion.rect
          x="200"
          y="800"
          width="120"
          height="120"
          fill="url(#grad1)"
          opacity="0.9"
          animate={{
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, 10, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        />
        <motion.rect
          x="800"
          y="700"
          width="150"
          height="150"
          stroke="#e63198"
          strokeWidth="10"
          fill="none"
          animate={{
            x: [0, -12, 0, 12, 0],
            y: [0, 10, 0, -10, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.5,
          }}
        />
        <motion.rect
          x="1300"
          y="850"
          width="100"
          height="100"
          fill="url(#grad2)"
          opacity="0.8"
          animate={{
            x: [0, 15, 0, -15, 0],
            y: [0, -12, 0, 12, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
        />

        {/* Petits éléments dispersés */}
        <motion.circle
          cx="300"
          cy="300"
          r="12"
          fill="#e63198"
          animate={{
            x: [0, 5, 0, -5, 0],
            y: [0, -3, 0, 3, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />
        <motion.rect
          x="1100"
          y="150"
          width="40"
          height="40"
          fill="url(#grad2)"
          animate={{
            x: [0, -7, 0, 7, 0],
            y: [0, 4, 0, -4, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        />
        <motion.polygon
          points="1700,150 1750,230 1650,230"
          fill="url(#grad1)"
          animate={{
            x: [0, 8, 0, -8, 0],
            y: [0, -6, 0, 6, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.6,
          }}
        />
      </svg>
    </div>
  );
}