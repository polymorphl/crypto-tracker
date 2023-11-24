import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { SidebarNav } from '@/components/layout/sidebar';
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
    href: '/',
  },
  {
    title: 'Assets',
    href: '/assets',
  },
  {
    title: 'Providers',
    href: '/providers',
  },
  {
    title: 'Transactions',
    href: '/transactions',
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
          <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SidebarNav items={sidebarNavItems}></SidebarNav>
              </aside>
              <div className="flex-1 lg:max-w-4xl">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
