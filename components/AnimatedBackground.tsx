'use client';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles'; // or 'tsparticles/load' if you prefer
import type { Engine } from 'tsparticles';

export default function AnimatedBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
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
            value: "#blanchedalmond", // Match the div background
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
              mode: "repulse", // Repel on hover
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
            value: ["#f87e12", "#e63199", "#07f916"], // Stylish colors
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: false, // No lines between particles
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true, // Enable collisions
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1, // Slower, fluid movement
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80, // Number of particles
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
            type: ["circle", "triangle", "square", "star"], // Stylish shapes
            options: {
              polygon: {
                sides: 5,
              },
            },
          },
          size: {
            value: { min: 5, max: 15 }, // Varied sizes
            random: true,
            anim: {
              enable: true,
              speed: 4,
              size_min: 0.1,
              sync: false,
            },
          },
          rotate: { // Add rotation
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