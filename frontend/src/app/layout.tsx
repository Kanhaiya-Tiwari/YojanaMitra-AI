import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'YojanaMitra AI – Find Government Schemes You Are Eligible For',
  description:
    'YojanaMitra AI helps every Indian citizen discover benefits, subsidies, scholarships, and financial schemes in seconds using AI-powered guidance.',
  keywords: ['government schemes', 'yojana', 'India', 'subsidies', 'scholarship', 'AI'],
  openGraph: {
    title: 'YojanaMitra AI',
    description: 'Find Government Schemes You Are Eligible For',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-orange-50 dark:bg-gray-950 antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
