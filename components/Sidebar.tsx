'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Tent,
  Home,
  Star,
  Bell,
  Settings,
  ChevronRight,
  Users,
  ClipboardList,
  LogOut,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith('/bookings')) {
      setOpenDropdown('bookings');
    }
  }, [pathname]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-100">
      
      {/* Header - Dark theme */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-800">
        <div className="relative h-10 w-10 shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900 rounded-lg p-0.5">
            <div className="absolute inset-0 bg-slate-900 rounded-lg p-1.5">
              <Image
                src="/pergola-logo.png"
                alt="Pergola Africa Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-base font-semibold text-white truncate">
            Pergola Africa
          </h1>
          <p className="text-xs text-slate-400 truncate">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex flex-col h-[calc(100vh-180px)] px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="space-y-1">
          {/* Main Section */}
          <div className="space-y-1">
            <NavItem
              href="/"
              label="Dashboard"
              icon={<LayoutDashboard size={18} />}
              active={pathname === '/'}
            />

            {/* Bookings Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown('bookings')}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-slate-800/80",
                  pathname?.startsWith('/bookings')
                    ? "bg-slate-800 text-white"
                    : "text-slate-300"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Calendar size={18} className={cn(
                    "shrink-0",
                    pathname?.startsWith('/bookings') ? "text-white" : "text-slate-400"
                  )} />
                  <span className="truncate">Bookings</span>
                </div>
                <ChevronRight
                  size={16}
                  className={cn(
                    "shrink-0 transition-transform duration-200",
                    openDropdown === 'bookings' ? "rotate-90" : "",
                    pathname?.startsWith('/bookings') ? "text-white" : "text-slate-400"
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  openDropdown === 'bookings' ? "max-h-40" : "max-h-0"
                )}
              >
                <div className="ml-6 pl-3 border-l border-slate-700 space-y-0.5 py-1">
                  <SubItem
                    href="/bookings"
                    label="All Bookings"
                    icon={<ClipboardList size={14} />}
                    active={pathname === '/bookings'}
                  />
                  <SubItem
                    href="/bookings/direct"
                    label="Direct Bookings"
                    icon={<Calendar size={14} />}
                    active={pathname === '/bookings/direct'}
                  />
                  <SubItem
                    href="/bookings/walk-in"
                    label="Walk-In Bookings"
                    icon={<Users size={14} />}
                    active={pathname === '/bookings/walk-in'}
                  />
                </div>
              </div>
            </div>

            <NavItem
              href="/activities"
              label="Activities"
              icon={<Tent size={18} />}
              active={pathname === '/activities'}
            />

            <NavItem
              href="/accommodations"
              label="Accommodations"
              icon={<Home size={18} />}
              active={pathname === '/accommodations'}
            />

            <NavItem
              href="/reviews"
              label="Reviews"
              icon={<Star size={18} />}
              active={pathname === '/reviews'}
            />

            <NavItem
              href="/notifications"
              label="Notifications"
              icon={<Bell size={18} />}
              active={pathname === '/notifications'}
              badge="3"
            />

            <NavItem
              href="/settings"
              label="Settings"
              icon={<Settings size={18} />}
              active={pathname === '/settings'}
            />
          </div>
        </div>
      </div>

      {/* Footer - User Profile */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 rounded-full bg-slate-800 flex items-center justify-center">
            <UserCog size={18} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@pergola.africa</p>
          </div>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors shrink-0">
            <LogOut size={16} className="text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Components ---------- */
function NavItem({
  href,
  icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        "hover:bg-slate-800/80",
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={cn(
          "shrink-0",
          active ? "text-white" : "text-slate-400"
        )}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="shrink-0 px-1.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SubItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all duration-200",
        "hover:bg-slate-800",
        active
          ? "bg-slate-800 text-white"
          : "text-slate-400"
      )}
    >
      {icon && (
        <span className={cn(
          "shrink-0",
          active ? "text-white" : "text-slate-500"
        )}>
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}