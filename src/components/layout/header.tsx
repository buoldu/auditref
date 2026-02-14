'use client';

import { Search, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuditItem, auditDataService } from '@/lib/audit-data';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<AuditItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Load data on first focus
  const ensureDataLoaded = useCallback(async () => {
    if (!dataLoaded) {
      await auditDataService.loadData();
      setDataLoaded(true);
    }
  }, [dataLoaded]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowDropdown(false);
      router.push(`/basit-liste?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleInputChange = async (value: string) => {
    setSearchValue(value);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    await ensureDataLoaded();
    const results = auditDataService.search(value).slice(0, 8);
    setSuggestions(results);
    setShowDropdown(results.length > 0);
  };

  const handleSuggestionClick = (item: AuditItem) => {
    setSearchValue(item.madde);
    setShowDropdown(false);
    router.push(`/basit-liste?q=${encodeURIComponent(item.madde)}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95 dark:supports-[backdrop-filter]:bg-slate-900/60 dark:border-slate-800">
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              ref={inputRef}
              type="search"
              value={searchValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onFocus={() => { ensureDataLoaded(); if (suggestions.length > 0) setShowDropdown(true); }}
              placeholder="Mevzuat, madde veya soru ara..."
              className="h-9 pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
            />

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{item.madde}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.mevzuat} · {item.rehberRef}</p>
                  </button>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-left px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-xs text-blue-600 dark:text-blue-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  &quot;{searchValue}&quot; için tüm sonuçları gör →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-600 dark:text-slate-400"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
