import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'VIDE - Pixel Video Player',
  description: 'A pixel-art styled video player experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main style={{ paddingTop: 'var(--header-height)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
