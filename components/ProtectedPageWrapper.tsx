'use client';

import React, { useState } from "react"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Shield, Clock, Wifi } from 'lucide-react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProtectedPageWrapperProps {
  children: React.ReactNode;
  title: string;
}

const mobileNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Activities', href: '/activities', icon: Tent },
  { name: 'Accommodations', href: '/accommodations', icon: Home },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reviews', href: '/reviews', icon: Star },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
] as const;

// Helper functions for dynamic content
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getStatusColor = (role?: string) => {
  if (role?.toLowerCase().includes('super')) return 'bg-purple-500';
  if (role?.toLowerCase().includes('admin')) return 'bg-blue-500';
  return 'bg-green-500';
};

const formatRole = (role: string) => {
  if (role === 'SUPERADMIN') return 'Super Admin';
  if (role === 'SUPER_ADMIN') return 'Super Admin';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

const getCurrentTime = () => {
  return new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }).toLowerCase();
};

export function ProtectedPageWrapper({ children, title }: ProtectedPageWrapperProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 ml-0">

        <div className="flex items-center justify-between border-b border-border bg-linear-to-r from-card to-card/90 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Logo/Initials - Hidden on mobile */}
            {/* <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80">
              <span className="font-bold text-primary-foreground text-sm">PA</span>
            </div> */}
            
            <div>
              {/* Dynamic greeting based on time */}
              <h2 className="text-lg font-semibold text-foreground">
                {getGreeting()}, {user?.firstName || 'Admin'}
              </h2>
              
              {/* User info with role badge */}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  {/* <span className={`h-2 w-2 rounded-full ${getStatusColor(user?.role)}`}></span> */}
                  <span className="text-sm font-medium capitalize text-foreground/90">
                    {formatRole(user?.role || 'Admin')}
                  </span>
                </span>
                
                <span className="hidden sm:inline text-muted-foreground">•</span>
                
                <span className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={12} />
                  {getCurrentTime()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification/Status indicators - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4">
              {/* Online status */}
              <div className="flex items-center gap-2 text-sm">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  {/* <div className="absolute h-2 w-2 animate-ping rounded-full bg-green-500"></div> */}
                </div>
                <span className="text-muted-foreground">Online</span>
              </div>
              
              {/* Separator */}
              <div className="h-6 w-px bg-border"></div>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 hover:bg-muted/50 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X size={22} className="text-foreground" />
              ) : (
                <Menu size={22} className="text-foreground" />
              )}
            </button>
            
            {/* Logout button with better styling */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="group flex items-center gap-2 border-border/50 bg-transparent hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200"
              size="sm"
            >
              <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-border bg-card">
            <nav className="space-y-1 px-3 py-4">
              {mobileNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}