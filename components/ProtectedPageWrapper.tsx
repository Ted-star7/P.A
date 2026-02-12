'use client';

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Tent,
  Home,
  Users,
  Settings,
  Star,
  Bell,
  ClipboardList,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProtectedPageWrapperProps {
  children: React.ReactNode;
  title: string;
}

const mobileNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  // Bookings with sub-items shown as main nav items for mobile
  { name: 'All Bookings', href: '/bookings', icon: ClipboardList },
  { name: 'Direct Bookings', href: '/bookings/direct', icon: Calendar },
  { name: 'Walk-In Bookings', href: '/bookings/walk-in', icon: UserPlus },
  { name: 'Activities', href: '/activities', icon: Tent },
  { name: 'Accommodations', href: '/accommodations', icon: Home },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;

// Helper functions
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatRole = (role: string) => {
  if (!role) return 'Admin';
  if (role === 'SUPERADMIN' || role === 'SUPER_ADMIN') return 'Super Admin';
  if (role === 'ADMIN') return 'Admin';
  if (role === 'EDITOR') return 'Editor';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

export function ProtectedPageWrapper({ children, title }: ProtectedPageWrapperProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Initialize time and greeting on client side only
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase());
    setGreeting(getGreeting());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }).toLowerCase());
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, isMobile]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 transform transition-transform duration-300 ease-in-out lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <div className="absolute inset-0 bg-linear-to-br from-slate-700 to-slate-900 rounded-lg p-0.5">
                <div className="absolute inset-0 bg-slate-900 rounded-lg p-1.5">
                  <span className="text-white font-bold text-lg flex items-center justify-center h-full w-full">
                    PA
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Pergola Africa</h2>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = 
              item.href === '/bookings' 
                ? pathname === '/bookings' || pathname?.startsWith('/bookings/')
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/80'
                )}
              >
                <Icon size={20} className="shrink-0 text-slate-400" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile User Info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName || user?.email?.split('@')[0] || 'Admin User'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {formatRole(user?.role || 'Admin')}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 ml-0 w-full">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-2 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu size={22} className="text-slate-700" />
            </button>
            
            <div className="min-w-0">
              {/* Page Title - Mobile */}
              <h1 className="text-lg font-semibold text-foreground lg:hidden truncate">
                {title}
              </h1>
              
              {/* Greeting - Desktop */}
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-foreground">
                  {greeting}, {user?.firstName || 'Admin'}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatRole(user?.role || 'Admin')}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-sm text-muted-foreground">
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="hidden lg:flex items-center gap-2 border-border/50 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200"
            size="sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>

          {/* Mobile User Avatar & Logout */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-9 w-9 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-white">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Page Title & Time Bar */}
        <div className="block lg:hidden px-4 py-2 bg-slate-50 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                {greeting}, {user?.firstName || 'Admin'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">
                  {formatRole(user?.role || 'Admin')}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="text-xs text-muted-foreground">
                  {currentTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <div className="lg:hidden mb-4">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}