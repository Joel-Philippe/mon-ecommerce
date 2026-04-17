/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.experiments = { ...config.experiments, asyncWebAssembly: true };
        config.module.rules.push({
            test: /\.wasm$/,
            type: "webassembly/async",
        });
        
        // Optimisation pour limiter l'usage de la mémoire sur Render
        if (!isServer) {
          config.optimization.splitChunks = {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
          };
        }
        
        return config;
    },
    productionBrowserSourceMaps: false, // Désactive les source maps pour un build plus rapide
    swcMinify: true, // Utilise SWC pour la minification (plus rapide que Terser)
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    },
    images: {
      unoptimized: true,
      remotePatterns: [
        { protocol: 'https', hostname: 'i.pinimg.com' },
        { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
        { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        { protocol: 'https', hostname: 'images.pexels.com' },
        { protocol: 'https', hostname: 's.oneroof.co.nz' },
        { protocol: 'https', hostname: 'www.publika.com' },
        { protocol: 'https', hostname: 'static.vecteezy.com' },
        { protocol: 'https', hostname: 'th.bing.com' },
        { protocol: 'https', hostname: 'static7.depositphotos.com' },
        { protocol: 'https', hostname: 'via.placeholder.com' },
      ],
    },
  };
  
  export default nextConfig;
