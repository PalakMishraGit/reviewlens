import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'PulseLens.ai — AI Review Intelligence for E-Commerce',
  description:
    'Turn messy product reviews into actionable merchant insights in one screen using intelligent sentiment analysis, topic extraction, and prompt injection defense.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-canvas text-ink antialiased selection:bg-ink selection:text-canvas transition-colors">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
