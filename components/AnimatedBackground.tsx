'use client';
import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log("Particles Engine Initializing...");
    await loadSlim(engine);
    console.log("Particles Engine Initialized!");
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log("Particles container loaded", container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit} // Re-added init prop
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "#FF0000", // Temporarily change background to red for maximum visibility
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: "#FFFFFF", // White particles
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },
          number: {
            value: 20, // Fewer particles for basic test
          },
          size: {
            value: { min: 5, max: 10 },
            random: true,
          },
          opacity: {
            value: 0.5,
            random: true,
          },
          shape: {
            type: "circle", // Simple shape
          },
        },
        detectRetina: true,
      }}
    />
  );
}
