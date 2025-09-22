import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Layout,
  Plus,
  User,
  Building2
} from 'lucide-react';

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
} from '@/components/ui/sidebar';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Create Invoice',
    url: '/create-invoice',
    icon: Plus,
  },
  {
    title: 'Invoices',
    url: '/invoices',
    icon: FileText,
  },
  {
    title: 'Clients',
    url: '/clients',
    icon: Users,
  },
  {
    title: 'Templates',
    url: '/templates',
    icon: Layout,
  },
  {
    title: 'Profile',
    url: '/profile',
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
      ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium shadow-sm' 
      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground';

  return (
    <Sidebar 
      className={state === 'collapsed' ? 'w-14' : 'w-64'} 
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-sidebar-border shadow-sm">
        {/* Premium Logo Section */}
        <div className="p-6 border-b border-sidebar-border/30 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center shadow-soft">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {state !== 'collapsed' && (
              <div className="flex flex-col">
                <span className="font-bold text-sidebar-foreground text-lg">Invoice Pro</span>
                <span className="text-xs text-sidebar-foreground/60">Professional Edition</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-3 py-6">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider font-medium px-3 mb-4">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`${getNavCls({ isActive: isActive(item.url) })} transition-all duration-200 rounded-lg mx-2 group`}
                      >
                        <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                        {state !== 'collapsed' && (
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

        {/* Light themed footer */}
        {state !== 'collapsed' && (
          <div className="mt-auto p-4 border-t border-sidebar-border/30 bg-gradient-to-r from-primary/5 to-transparent">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-sidebar-foreground/80 font-medium">System Status</span>
              </div>
              <p className="text-xs text-sidebar-foreground/60">All systems operational</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}