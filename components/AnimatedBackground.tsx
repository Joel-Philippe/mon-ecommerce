'use client';
import { useCallback } from 'react';
import Particles from '@tsparticles/react'; // Updated import
import { loadSlim } from '@tsparticles/slim'; // Updated import
import type { Engine } from '@tsparticles/engine'; // Updated import

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // Updated to loadSlim
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log("Particles container loaded", container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "#blanchedalmond",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#f87e12", "#e63199", "#07f916"],
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: false,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "triangle", "square", "star"],
            options: {
              polygon: {
                sides: 5,
              },
            },
          },
          size: {
            value: { min: 5, max: 15 },
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.1,
              sync: false,
            },
          },
          rotate: {
            value: 0,
            animation: {
              enable: true,
              speed: 5,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}