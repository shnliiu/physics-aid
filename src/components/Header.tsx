'use client';

import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface HeaderProps {
  title?: string;
  showNav?: boolean;
}

export function Header({ title = 'Physics 4C TA', showNav = true }: HeaderProps) {
  const router = useRouter();
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg
                          flex items-center justify-center text-white font-bold text-xl
                          group-hover:scale-110 transition-transform">
              P4C
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600
                         dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h1>
          </div>

          {/* Navigation */}
          {showNav && user && (
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push('/problems/new')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                         font-medium transition-colors shadow-sm hover:shadow-md"
              >
                + New Problem
              </button>
              <button
                onClick={() => router.push('/problems')}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100
                         dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Browse
              </button>
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100
                         dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Admin
              </button>
              <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user.signInDetails?.loginId || 'User'}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400
                           hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          )}

          {/* Mobile menu button */}
          {showNav && user && (
            <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100
                             dark:hover:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
