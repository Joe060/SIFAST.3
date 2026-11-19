import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { QuickRoleSwitcher } from '@/components/QuickRoleSwitcher';

export const metadata: Metadata = {
  title: 'SIFAST FT — Sistem Informasi Fasilitas Fakultas Teknik UNSIL',
  description:
    'Sistem Informasi Fasilitas Fakultas Teknik Universitas Siliwangi (SIFAST FT) — Demo Interaktif Lengkap Lampiran B SRS.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppProvider>
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
            <QuickRoleSwitcher />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
