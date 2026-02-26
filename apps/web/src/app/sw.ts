import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, ExpirationPlugin, NetworkFirst, Serwist, StaleWhileRevalidate } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Cloudinary images: cache-first (CDN with content-hash URLs)
    {
      matcher({ url }) {
        return url.hostname === 'res.cloudinary.com';
      },
      handler: new CacheFirst({
        cacheName: 'cloudinary-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
        ],
      }),
    },
    // Local static images: cache-first
    {
      matcher({ url, sameOrigin }) {
        return sameOrigin && url.pathname.startsWith('/images/');
      },
      handler: new CacheFirst({
        cacheName: 'local-images',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 90 * 24 * 60 * 60, // 90 days
          }),
        ],
      }),
    },
    // API GET requests: network-first (fresh when online, cached when offline)
    {
      matcher({ url, sameOrigin, request }) {
        return sameOrigin && url.pathname.startsWith('/api/') && request.method === 'GET';
      },
      handler: new NetworkFirst({
        cacheName: 'api-responses',
        networkTimeoutSeconds: 5,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    // Google Fonts stylesheets
    {
      matcher({ url }) {
        return url.hostname === 'fonts.googleapis.com';
      },
      handler: new StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
      }),
    },
    // Google Fonts webfont files (immutable)
    {
      matcher({ url }) {
        return url.hostname === 'fonts.gstatic.com';
      },
      handler: new CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          }),
        ],
      }),
    },
    // Serwist's built-in Next.js defaults (RSC, pages, static JS/CSS)
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
