"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { DashboardContent } from "@/components/DashboardContent";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar - Fixed width matches sidebar width */}
      <Sidebar />

      {/* Main content - Correct margin to avoid overlap */}
      <main className="flex-1 lg:ml-64 ml-0 min-w-0">
        {/* Top bar - Clean white design that matches your components */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Welcome back, {user?.firstName || 'Admin'}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role?.replace('_', ' ') || 'Administrator'}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-border hover:bg-secondary/20"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>

        {/* Dashboard content with proper padding */}
        <div className="p-6">
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}