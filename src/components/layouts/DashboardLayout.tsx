import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import ProfileSetupModal from "@/components/ProfileSetupModal";

// Helper function to get page title based on current route
const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    "/app/dashboard": "Dashboard",
    "/app/create-invoice": "Create Invoice",
    "/app/invoices": "Invoices",
    "/app/clients": "Clients",
    "/app/templates": "Templates",
    "/app/profile": "Profile",
  };

  return routes[pathname] || "Dashboard";
};

export const DashboardLayout = () => {
  const location = useLocation();
  const currentPageTitle = getPageTitle(location.pathname);
  const { user } = useAuth();
  const { profile, hasCompleteProfile, profileLoading } = useProfile(
    user?.id || null
  );
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Show profile modal when user is authenticated but doesn't have a complete profile
  useEffect(() => {
    // Only make decisions after profile loading is complete
    if (!profileLoading) {
      if (user && !hasCompleteProfile) {
        setShowProfileModal(true);
      } else if (user && hasCompleteProfile) {
        // Close modal if profile becomes complete
        setShowProfileModal(false);
      }
    }
  }, [user, hasCompleteProfile, profileLoading]);

  // No need for handleProfileCreated since modal just navigates to profile page

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="sticky top-0 h-16 border-b border-border/60 bg-card/95 backdrop-blur-md shadow-lg flex items-center px-4 lg:px-6 relative z-50">
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
                  {location.pathname === "/app/dashboard" &&
                    "Overview of your invoice management"}
                  {location.pathname === "/app/create-invoice" &&
                    "Create a new professional invoice"}
                  {location.pathname === "/app/invoices" &&
                    "Manage all your invoices"}
                  {location.pathname === "/app/clients" &&
                    "Manage your client database"}
                  {location.pathname === "/app/templates" &&
                    "Customize your invoice templates"}
                  {location.pathname === "/app/profile" &&
                    "Manage your account settings"}
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {/* User Profile */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-auto px-2 rounded-lg overflow-hidden"
                >
                  {profile?.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt="Profile Logo"
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
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

      {/* Profile Setup Modal */}
      {user && (
        <ProfileSetupModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </SidebarProvider>
  );
};
