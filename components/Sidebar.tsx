'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Tent,
  Home,
  DollarSign,
  Users,
  Settings,
  CreditCard,
  Star,
  BarChart3,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Activities', href: '/activities', icon: Tent },
  { name: 'Accommodations', href: '/accommodations', icon: Home },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Guides', href: '/guides', icon: Users },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 h-screen border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 z-40',
        expanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-6">
        {expanded && (
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">PA</span>
            </div>
            <div>
              <h1 className="text-sm font-bold">Pergola</h1>
              <p className="text-xs text-sidebar-accent">Africa</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronDown
            size={18}
            className={cn('transition-transform', !expanded && 'rotate-90')}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              title={!expanded ? item.name : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {expanded && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {expanded && (
        <div className="border-t border-sidebar-border px-4 py-4">
          <p className="text-xs text-sidebar-foreground/60">
            © 2024 Pergola Africa. All rights reserved.
          </p>
        </div>
      )}
    </aside>
  );
}
