import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReviewLens — AI Review Insights for E-Commerce',
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
