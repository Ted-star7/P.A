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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SUPERADMIN':
        return 'bg-[#7A0F14] text-[#F5F1EA]'; // Deep Burgundy on Cream
      case 'ADMIN':
        return 'bg-[#2F5E3F] text-[#F5F1EA]'; // Forest Green on Cream
      case 'EDITOR':
        return 'bg-[#F26A2E] text-[#4A2C2A]'; // Burnt Orange on Dark Brown
      default:
        return 'bg-[#4A2C2A] text-[#F5F1EA]'; // Dark Brown on Cream
    }
  };


  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'SUPERADMIN':
        return <Shield size={14} className="text-[#F5F1EA]" />;
      case 'ADMIN':
        return <UserCog size={14} className="text-[#F5F1EA]" />;
      default:
        return <User size={14} className="text-[#F5F1EA]" />;
    }
  };


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
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-[#F5F1EA] border-r border-[#4A2C2A]/20 text-[#4A2C2A] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-[#4A2C2A]/10 bg-linear-to-r from-[#F5F1EA] to-[#F5F1EA]">
        <div className="relative h-10 w-10 shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-[#7A0F14] to-[#F26A2E] rounded-lg p-0.5">
            <div className="absolute inset-0 bg-[#F5F1EA] rounded-lg p-1.5">
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
          <h1 className="text-base font-semibold text-[#4A2C2A] truncate">
            Pergola Africa
          </h1>
          <p className="text-xs text-[#4A2C2A]/60 truncate">
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
                "hover:bg-[#7A0F14]/10",
                pathname?.startsWith('/bookings')
                  ? "bg-[#7A0F14] text-[#F5F1EA]"
                  : "text-[#4A2C2A]"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Calendar size={18} className={cn(
                  "shrink-0",
                  pathname?.startsWith('/bookings') ? "text-[#F5F1EA]" : "text-[#F26A2E]"
                )} />
                <span className="truncate">Bookings</span>
              </div>
              <ChevronRight
                size={16}
                className={cn(
                  "shrink-0 transition-transform duration-200",
                  openDropdown === 'bookings' ? "rotate-90" : "",
                  pathname?.startsWith('/bookings') ? "text-[#F5F1EA]" : "text-[#F26A2E]"
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
              <div className="ml-6 pl-3 border-l border-[#F26A2E]/30 space-y-0.5 py-1">
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
      <div className="px-3 py-4 border-t border-[#4A2C2A]/10 bg-[#F5F1EA]">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-8 w-8 shrink-0 rounded-full flex items-center justify-center",
            (user?.role === 'SUPER_ADMIN' || user?.role === 'SUPERADMIN') && "bg-linear-to-br from-[#7A0F14] to-[#F26A2E]",
            user?.role === 'ADMIN' && "bg-linear-to-br from-[#2F5E3F] to-[#7A0F14]",
            !user?.role && "bg-linear-to-br from-[#4A2C2A] to-[#2F5E3F]"
          )}>
            <span className="text-sm font-semibold text-[#F5F1EA]">
              {getUserInitials()}
            </span>
          </div>
          
          {/* User Info - Email and Role Badge on same line */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <p className="text-xs text-[#4A2C2A]/70 truncate">
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
            className="p-1.5 hover:bg-[#7A0F14]/10 rounded-lg transition-colors shrink-0 group"
            title="Sign Out"
          >
            <LogOut size={14} className="text-[#4A2C2A]/40 group-hover:text-[#7A0F14] transition-colors" />
          </button>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-[#4A2C2A]/30 text-center mt-3">
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
        "hover:bg-[#7A0F14]/10",
        active
          ? "bg-[#7A0F14] text-[#F5F1EA]"
          : "text-[#4A2C2A]"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={cn(
          "shrink-0",
          active ? "text-[#F5F1EA]" : "text-[#F26A2E]"
        )}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge && (
        <span className="shrink-0 px-1.5 py-0.5 rounded-full text-xs font-medium bg-[#F26A2E] text-[#4A2C2A]">
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
        "hover:bg-[#7A0F14]/10",
        active
          ? "bg-[#7A0F14] text-[#F5F1EA]"
          : "text-[#4A2C2A]"
      )}
    >
      {icon && (
        <span className={cn(
          "shrink-0",
          active ? "text-[#F5F1EA]" : "text-[#F26A2E]"
        )}>
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </Link>
  );
}