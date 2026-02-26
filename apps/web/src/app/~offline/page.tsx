import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline | VisitBorsa',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl" aria-hidden="true">
        &#128225;
      </div>
      <h1 className="mb-4 font-display text-3xl font-bold text-gray-900">
        Nu esti conectat la internet
      </h1>
      <p className="mb-2 text-lg text-gray-600">
        Pagina pe care incerci sa o accesezi nu este disponibila offline.
      </p>
      <p className="mb-8 text-sm text-gray-400">
        You are currently offline. This page is not available.
      </p>
      <a
        href="/"
        className="rounded-lg bg-[#1e3a5f] px-6 py-3 text-white transition hover:bg-[#2a4d7a]"
      >
        Inapoi la pagina principala
      </a>
    </div>
  );
}
