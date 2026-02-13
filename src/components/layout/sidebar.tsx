'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Table, 
  Network,
  X,
  ChevronLeft,
  ChevronRight,
  FolderTree
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Kategoriler',
    href: '/kategoriler',
    icon: FolderTree,
  },
  {
    name: 'Basit Liste',
    href: '/basit-liste',
    icon: FileText,
  },
  {
    name: 'Tüm Veri',
    href: '/tum-veri',
    icon: Table,
  },
  {
    name: 'Gelişmiş Analiz',
    href: '/gelismis-mevzuat-analizi',
    icon: Network,
  },
];

export function Sidebar({ isOpen, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-full bg-slate-900 text-slate-100",
      "w-64 border-r border-slate-800"
    )}>
      {/* Logo Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AR</span>
            </div>
            <span className="font-semibold text-lg">AuditRef</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">AR</span>
          </div>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        {onToggleCollapse && !onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex text-slate-400 hover:text-slate-100"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg transition-colors",
                  "text-sm font-medium",
                  collapsed ? "justify-center px-3 py-2.5" : "space-x-3 px-3 py-2.5",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <>
            <Separator className="my-4 bg-slate-800" />

            {/* Footer Info */}
            <div className="px-3 py-2 text-xs text-slate-500">
              <p>Version 1.0</p>
              <p className="mt-1">© 2026 AuditRef</p>
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}
