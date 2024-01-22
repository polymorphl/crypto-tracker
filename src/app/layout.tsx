import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { auth } from '@/auth';
import { ThemeProvider } from '@/app/theme-provider';
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Crypto Tracker',
  description:
    "Crypto Tracker is a simple app to track your crypto assets' value",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
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
            <Navbar />
            <div className="space-y-4 p-8 pb-16 md:block">
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <main className="flex-1">{children}</main>
                <Toaster />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
