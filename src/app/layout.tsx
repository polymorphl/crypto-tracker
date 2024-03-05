import type { Metadata } from 'next';
import { AppProps } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/nextjs';

import { ThemeProvider } from '@/app/theme-provider';
import Navbar from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

import { cn } from '@/lib/utils';

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
  Component,
  pageProps,
  children,
}: {
  children: React.ReactNode;
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}) {
  return (
    <ClerkProvider {...pageProps}>
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
            <ClerkLoading>
              <div>Clerk is loading</div>
            </ClerkLoading>
            <ClerkLoaded>
              <Navbar />
              <div className="space-y-4 p-8 pb-16 md:block">
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                  <main className="flex-1">{children}</main>
                  <Toaster />
                </div>
              </div>
            </ClerkLoaded>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
