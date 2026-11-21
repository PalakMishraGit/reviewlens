import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PulseLens.ai — Enterprise AI Review Intelligence',
  description:
    'Turn customer feedback into strategic product decisions. Enterprise-grade sentiment engineering, RFC 4180 ingestion, prompt injection defense, and automated merchant replies.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo-icon.png', type: 'image/png' },
    ],
    apple: [{ url: '/logo-icon.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-canvas text-ink antialiased selection:bg-ink selection:text-canvas transition-colors font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
