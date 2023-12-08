'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { ModeToggle } from '@/app/theme-toggle';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type NavItem = {
  title: string;
  path: string;
};
const sidebarNavItems: NavItem[] = [
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
  {
    title: 'Tools',
    path: '/tools',
  },
];

export default function Navbar() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [menu, setMenu] = useState<any[]>([]);

  const currentRoute = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setMenu([
          {
            title: 'Home',
            path: '/dashboard',
          },
          ...sidebarNavItems.filter((item) => item.title !== 'Home'),
        ]);
      } else {
        setMenu(sidebarNavItems);
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <header>
      <nav className="w-full border-b md:border-0">
        <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <Link href="/">
              <h1 className="text-3xl font-bold">Crypto-Tracker</h1>
            </Link>
            <div className="md:hidden">
              <button
                className="outline-none p-2 rounded-md focus:border-gray-400 focus:border"
                onClick={() => setOpen(!open)}
              >
                <Menu />
              </button>
            </div>
          </div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              open ? 'block' : 'hidden'
            }`}
          >
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {isLoading ? (
                <div>Loading...</div>
              ) : isAuthenticated ? (
                <>
                  {menu.map((item, idx) => (
                    <li
                      key={idx}
                      className={cn(
                        'hover:text-gray-500 dark:hover:text-gray-200',
                        {
                          'underline underline-offset-2':
                            item.path === currentRoute,
                        }
                      )}
                    >
                      <Link href={item.path}>{item.title}</Link>
                    </li>
                  ))}
                  <form className="flex items-center space-x-2 p-2">
                    <Search className="h-5 w-5 flex-none text-gray-300" />
                    <Input
                      disabled
                      className="w-full outline-none appearance-none sm:w-auto disabled:cursor-not-allowed"
                      type="search"
                      placeholder="Search"
                    />
                  </form>
                  <li>
                    <Button variant={'link'}>
                      <Link href="/api/auth/logout">⬅️ Logout</Link>
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <Button variant={'ghost'}>
                    <Link href="/api/auth/login">🚪 Login</Link>
                  </Button>
                </li>
              )}
              {/* <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {menus.map((item, idx) => (
                <li
                  key={idx}
                  className={cn(
                    'hover:text-gray-500 dark:hover:text-gray-200',
                    {
                      'underline underline-offset-2':
                        item.path === currentRoute,
                    }
                  )}
                >
                  <Link href={item.path}>{item.title}</Link>
                </li>
              ))} */}
              <ModeToggle />
              {/* {isLoading ? (
                <div>Loading...</div>
              ) : isAuthenticated ? (
                <li>
                  <Link href="/api/auth/logout">⬅️ Logout</Link>
                </li>
              ) : (
                <li>
                  <Link href="/api/auth/login">🚪 Login</Link>
                </li>
              )} */}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
