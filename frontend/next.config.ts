// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Ajoutez ici uniquement les hôtes distants réellement utilisés.
      // Par défaut, aucune image distante n’est nécessaire.
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // optimizeCss: true,  // Nécessite le paquet critters. À réactiver une fois installé.
}

export default nextConfig