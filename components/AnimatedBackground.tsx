'use client';
import { useCallback, useEffect, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export default function AnimatedBackground() {
  console.log("AnimatedBackground component rendered");
  const [engineLoaded, setEngineLoaded] = useState(false);

  useEffect(() => {
    const loadParticlesEngine = async () => {
      console.log("Particles Engine Initializing from useEffect...");
      const engine = await loadSlim(null); // Pass null as engine is not yet available
      console.log("Particles Engine Initialized from useEffect!", engine);
      setEngineLoaded(true);
    };

    if (!engineLoaded) {
      loadParticlesEngine();
    }
  }, [engineLoaded]);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log("Particles container loaded", container);
  }, []);

  if (!engineLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <Particles
      id="tsparticles"
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