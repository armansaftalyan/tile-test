import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
export const metadata: Metadata = {
  title: 'The Artisan Kiln | Ceramic Tile Order Form',
  description:
    'Choose handcrafted ceramic tiles, create your own 7×7 pattern and try our demo checkout. A Tile.Expert frontend assignment.',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
