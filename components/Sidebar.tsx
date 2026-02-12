'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  Shield,
  User,
  PenTool,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith('/bookings')) {
      setOpenDropdown('bookings');
    }
  }, [pathname]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get role badge color based on role (UPPERCASE roles)
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SUPERADMIN':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'ADMIN':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'EDITOR':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30';
    }
  };

  // Get role icon based on role (UPPERCASE roles)
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SUPERADMIN':
        return <Shield size={14} className="text-purple-300" />;
      case 'ADMIN':
        return <UserCog size={14} className="text-blue-300" />;
      case 'EDITOR':
        return <PenTool size={14} className="text-green-300" />;
      default:
        return <User size={14} className="text-slate-300" />;
    }
  };

  // Format role name for display
  const formatRole = (role: string) => {
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get user initials from email
  const getUserInitials = () => {
    return user?.email?.charAt(0).toUpperCase() || 'A';
  };

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col">
      
      {/* Header */}
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

      {/* Navigation - No scrollbar, fixed height */}
      <div className="flex-1 px-3 py-4">
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

            {/* Dropdown Menu - No scroll */}
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

          {/* Settings - Only Super Admin and Admin can see */}
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'ADMIN') && (
            <NavItem
              href="/settings"
              label="Settings"
              icon={<Settings size={18} />}
              active={pathname === '/settings'}
            />
          )}
        </div>
      </div>

      {/* Footer - User Profile - Aligned properly */}
      <div className="px-3 py-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <div className={cn(
            "h-8 w-8 shrink-0 rounded-full flex items-center justify-center",
            (user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN') && "bg-linear-to-br from-purple-600 to-purple-800",
            user?.role === 'ADMIN' && "bg-linear-to-br from-blue-600 to-blue-800",
            // user?.role === 'EDITOR' && "bg-linear-to-br from-green-600 to-green-800",
            !user?.role && "bg-linear-to-br from-slate-700 to-slate-900"
          )}>
            <span className="text-sm font-semibold text-white">
              {getUserInitials()}
            </span>
          </div>
          
          {/* User Info - Email and Role Badge on same line */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <p className="text-xs text-slate-400 truncate">
              {user?.email || 'admin@pergola.africa'}
            </p>
            
            {/* Role Badge */}
            {user?.role && (
              <div className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 shrink-0",
                getRoleBadgeColor(user.role)
              )}>
                {getRoleIcon(user.role)}
                <span>{formatRole(user.role)}</span>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors shrink-0 group"
            title="Sign Out"
          >
            <LogOut size={14} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
          </button>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-slate-600 text-center mt-3">
          © 2026 Pergola Africa
        </p>
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