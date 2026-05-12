import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diggers Bar Stock Control',
  description: 'MVP scaffold for Diggers Bar & Restaurant stock control web app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
