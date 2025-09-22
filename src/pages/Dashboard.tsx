import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  TrendingUp,
  Plus,
  Eye,
  User,
  Layout,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data - in a real app, this would come from your backend
  const stats = {
    totalInvoices: 24,
    totalClients: 8,
    growth: {
      invoices: 12,
      clients: 25,
    },
  };

  const recentInvoices = [
    {
      id: "INV-001",
      client: "Acme Corp",
      amount: 1500,
      date: "2024-01-15",
      trend: "up",
    },
    {
      id: "INV-002",
      client: "Tech Solutions",
      amount: 2300,
      date: "2024-01-12",
      trend: "up",
    },
    {
      id: "INV-003",
      client: "Design Studio",
      amount: 850,
      date: "2024-01-08",
      trend: "down",
    },
    {
      id: "INV-004",
      client: "StartupXYZ",
      amount: 3200,
      date: "2024-01-10",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-primary-gradient bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back! Here's your business overview.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/app/create-invoice">
            <Button className="bg-primary-gradient hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card-gradient shadow-medium hover:shadow-large transition-all duration-300 border-0 animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoices
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalInvoices}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-sm font-medium text-success">
                +{stats.growth.invoices}%
              </span>
              <span className="text-xs text-muted-foreground">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-card-gradient shadow-medium hover:shadow-large transition-all duration-300 border-0 animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Clients
            </CardTitle>
            <div className="p-2 bg-info/10 rounded-lg">
              <Users className="h-5 w-5 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.totalClients}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-sm font-medium text-success">
                +{stats.growth.clients}%
              </span>
              <span className="text-xs text-muted-foreground">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Invoices - Takes up 2 columns */}
        <Card className="xl:col-span-2 bg-card-gradient shadow-medium border-0 overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Recent Invoices
              </div>
              <Link to="/app/invoices">
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentInvoices.map((invoice, index) => (
                <div
                  key={invoice.id}
                  className="p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        {invoice.trend === "up" && (
                          <TrendingUp className="w-3 h-3 text-success absolute -top-1 -right-1 bg-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {invoice.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.client}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${invoice.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Sidebar */}
        <Card className="bg-card-gradient shadow-medium border-0">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Link to="/app/create-invoice" className="block group">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-all hover:scale-105 group-hover:bg-primary/5"
                >
                  <div className="p-1 bg-primary/10 rounded mr-3">
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                  Create New Invoice
                </Button>
              </Link>
              <Link to="/app/clients" className="block group">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-all hover:scale-105 group-hover:bg-info/5"
                >
                  <div className="p-1 bg-info/10 rounded mr-3">
                    <Users className="h-4 w-4 text-info" />
                  </div>
                  Manage Clients
                </Button>
              </Link>
              <Link to="/app/templates" className="block group">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-all hover:scale-105 group-hover:bg-success/5"
                >
                  <div className="p-1 bg-success/10 rounded mr-3">
                    <Layout className="h-4 w-4 text-success" />
                  </div>
                  Templates
                </Button>
              </Link>
              <Link to="/app/profile" className="block group">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 shadow-sm hover:shadow-md transition-all hover:scale-105 group-hover:bg-warning/5"
                >
                  <div className="p-1 bg-warning/10 rounded mr-3">
                    <User className="h-4 w-4 text-warning" />
                  </div>
                  Update Profile
                </Button>
              </Link>
            </div>

            {/* Premium Feature Highlight */}
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <span className="font-semibold text-foreground">
                  AI Features
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Generate invoices automatically with AI assistance
              </p>
              <Button
                size="sm"
                className="w-full bg-primary-gradient hover:shadow-md transition-shadow"
              >
                Try AI Generation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
