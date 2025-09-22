import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Layout,
  Plus,
  User,
  Building2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Invoice",
    url: "/create-invoice",
    icon: Plus,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: Layout,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary/10 text-primary font-medium shadow-sm"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar border-sidebar-border shadow-sm">
        {/* Premium Logo Section */}
        <div
          className={`border-b border-sidebar-border/30 bg-gradient-to-r from-primary/5 to-transparent ${
            state === "collapsed" ? "p-3" : "p-6"
          }`}
        >
          <div
            className={`flex items-center ${
              state === "collapsed" ? "justify-center" : "gap-3"
            }`}
          >
            <div
              className={`bg-primary-gradient rounded-xl flex items-center justify-center shadow-soft ${
                state === "collapsed" ? "w-8 h-8" : "w-10 h-10"
              }`}
            >
              <Building2
                className={`text-white ${
                  state === "collapsed" ? "h-4 w-4" : "h-5 w-5"
                }`}
              />
            </div>
            {state !== "collapsed" && (
              <div className="flex flex-col">
                <span className="font-bold text-sidebar-foreground text-lg">
                  Invoice Pro
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  Professional Edition
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={`py-6 ${state === "collapsed" ? "px-2" : "px-3"}`}>
          <SidebarGroup>
            {state !== "collapsed" && (
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider font-medium px-3 mb-4">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu
                className={`space-y-2 ${
                  state === "collapsed" ? "items-center" : ""
                }`}
              >
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={state === "collapsed" ? item.title : undefined}
                      className={state === "collapsed" ? "justify-center" : ""}
                    >
                      <NavLink
                        to={item.url}
                        end
                        className={`${getNavCls({
                          isActive: isActive(item.url),
                        })} transition-all duration-200 rounded-lg group ${
                          state === "collapsed"
                            ? "mx-0 justify-center items-center"
                            : "mx-2"
                        }`}
                      >
                        <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        {state !== "collapsed" && (
                          <span className="font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
