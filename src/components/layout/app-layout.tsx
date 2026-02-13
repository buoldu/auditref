'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const AUTO_HIDE_DELAY = 3000;

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const autoHideTimer = useRef<NodeJS.Timeout | null>(null);
  const sidebarHovered = useRef(false);

  const startAutoHideTimer = useCallback(() => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    autoHideTimer.current = setTimeout(() => {
      if (!sidebarHovered.current) {
        setSidebarCollapsed(true);
      }
    }, AUTO_HIDE_DELAY);
  }, []);

  useEffect(() => {
    startAutoHideTimer();
    return () => {
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, [startAutoHideTimer]);

  const handleSidebarMouseEnter = () => {
    sidebarHovered.current = true;
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
  };

  const handleSidebarMouseLeave = () => {
    sidebarHovered.current = false;
    startAutoHideTimer();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col z-30 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            if (sidebarCollapsed) startAutoHideTimer();
          }} 
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
