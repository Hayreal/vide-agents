import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIDE - Retro Games",
  description: "A retro pixel-art gaming experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="min-h-full flex flex-col scanlines">
        {children}
      </body>
    </html>
  );
}
