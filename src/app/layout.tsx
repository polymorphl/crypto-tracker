import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { ThemeProvider } from '@/app/theme-provider';
import Navbar from '@/components/layout/navbar';
import './globals.css';

import { cn } from '@/lib/utils';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Crypto Tracker',
};

const sidebarNavItems = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Assets',
    path: '/assets',
  },
  {
    title: 'Providers',
    path: '/providers',
  },
  {
    title: 'Transactions',
    path: '/transactions',
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar items={sidebarNavItems} />
          <div className="space-y-4 p-8 pb-16 md:block">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <div className="flex-1">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
