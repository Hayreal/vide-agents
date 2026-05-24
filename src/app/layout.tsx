import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/nav.css';

export const metadata: Metadata = {
  title: 'Vide Agents — Pixel Art',
  description: 'A pixel-art single-page application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
