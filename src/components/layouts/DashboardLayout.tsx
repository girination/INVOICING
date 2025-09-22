import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Helper function to get page title based on current route
const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/create-invoice": "Create Invoice",
    "/invoices": "Invoices",
    "/clients": "Clients",
    "/templates": "Templates",
    "/profile": "Profile",
  };

  return routes[pathname] || "Dashboard";
};

export const DashboardLayout = () => {
  const location = useLocation();
  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="h-16 border-b border-border/60 bg-card/95 backdrop-blur-md shadow-lg flex items-center px-4 lg:px-6 relative z-10">
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />

            <div className="relative flex items-center w-full gap-4">
              {/* Sidebar Toggle */}
              <SidebarTrigger className="hover:bg-muted/80 transition-colors shrink-0" />

              {/* Page Title & Breadcrumb */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-foreground truncate">
                  {currentPageTitle}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {location.pathname === "/dashboard" &&
                    "Overview of your invoice management"}
                  {location.pathname === "/create-invoice" &&
                    "Create a new professional invoice"}
                  {location.pathname === "/invoices" &&
                    "Manage all your invoices"}
                  {location.pathname === "/clients" &&
                    "Manage your client database"}
                  {location.pathname === "/templates" &&
                    "Customize your invoice templates"}
                  {location.pathname === "/profile" &&
                    "Manage your account settings"}
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>

                {/* User Profile */}
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Enhanced Main Content */}
          <main className="flex-1 p-4 lg:p-6 bg-muted/20 relative overflow-hidden border-t border-border/20">
            {/* Enhanced background pattern with depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,hsl(var(--primary)/0.02)_50%,transparent_100%)] pointer-events-none" />

            <div className="relative">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
