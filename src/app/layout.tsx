import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'River Crossing Puzzle - Logic Game | Sheep & Lions',
    template: '%s | River Crossing Puzzle',
  },
  description:
    'Play the classic River Crossing Puzzle! Help 3 sheep and 3 lions cross the river safely. A challenging logic game with beautiful animations. Perfect for puzzle lovers!',
  keywords: [
    'river crossing puzzle',
    'logic game',
    'puzzle game',
    'brain teaser',
    'sheep and lions',
    'strategy game',
    'free online game',
    'logic puzzle',
    'thinking game',
    'educational game',
  ],
  authors: [{ name: 'River Crossing Game' }],
  creator: 'River Crossing Game',
  publisher: 'River Crossing Game',
  applicationName: 'River Crossing Puzzle',
  generator: 'Next.js',
  metadataBase: new URL('https://zeeree.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zeeree.vercel.app',
    title: 'River Crossing Puzzle - Logic Game',
    description:
      'Play the classic River Crossing Puzzle! Help 3 sheep and 3 lions cross the river safely. A challenging logic game with beautiful animations.',
    siteName: 'River Crossing Puzzle',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'River Crossing Puzzle Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'River Crossing Puzzle - Logic Game',
    description:
      'Play the classic River Crossing Puzzle! Help 3 sheep and 3 lions cross the river safely.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  category: 'games',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
