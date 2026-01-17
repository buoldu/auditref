'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Database, List } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">AuditRef</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-indigo-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Ana Sayfa
              </Link>
              <Link
                href="/tum-veri"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/tum-veri')
                    ? 'border-indigo-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <Database className="w-4 h-4 mr-2" />
                Tüm Veri
              </Link>
              <Link
                href="/basit-liste"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/basit-liste')
                    ? 'border-indigo-500 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Basit Liste
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
