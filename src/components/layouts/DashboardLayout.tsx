import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Premium Header */}
          <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-sm shadow-sm flex items-center px-6 relative overflow-hidden">
            {/* Header background pattern */}
            <div className="absolute inset-0 bg-hero-gradient opacity-50" />
            
            <div className="relative flex items-center w-full">
              <SidebarTrigger className="mr-4 hover:bg-muted/80 transition-colors" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                  Invoice Pro
                </h1>
                <p className="text-xs text-muted-foreground">Professional Invoice Management</p>
              </div>
              
              {/* Header actions */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                </div>
              </div>
            </div>
          </header>

          {/* Enhanced Main Content */}
          <main className="flex-1 p-6 bg-background relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent_50%)] pointer-events-none" />
            
            <div className="relative animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};