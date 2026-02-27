import type { Metadata, Viewport } from 'next';
import { Inter, DM_Serif_Display } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL('https://visitborsa.ro'),
  title: {
    default: 'VisitBorșa — Cazare Borșa, Maramureș | Pensiuni, Hoteluri, Restaurante',
    template: '%s | VisitBorșa',
  },
  description:
    'Platformă turistică pentru Borșa, Maramureș — cazări, pensiuni, hoteluri, vile, servicii turistice, restaurante și obiective turistice în inima Munților Rodnei.',
  keywords: [
    'cazare borsa', 'cazare maramures', 'pensiuni borsa', 'hoteluri borsa',
    'restaurante borsa', 'servicii turistice borsa', 'obiective turistice borsa',
    'cazare muntii rodnei', 'partia olimpica borsa', 'vacanta borsa maramures',
    'cazare romania', 'pensiuni maramures', 'vile borsa',
  ],
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'VisitBorșa',
    title: 'VisitBorșa — Cazare Borșa, Maramureș',
    description: 'Pensiuni, hoteluri, restaurante și servicii turistice în Borșa, inima Munților Rodnei.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisitBorșa — Cazare Borșa, Maramureș',
    description: 'Pensiuni, hoteluri, restaurante și servicii turistice în Borșa, inima Munților Rodnei.',
  },
  alternates: {
    canonical: 'https://visitborsa.ro',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSerif.variable} ${inter.className}`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <InstallPrompt />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
