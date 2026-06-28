"use client";
import { useEffect } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { useAdminAnalytics } from "@/hooks/admin/useAdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Store,
  Package,
  Wrench,
  Users2,
  Calendar,
  Eye,
  MousePointerClick,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const mockGrowthData = [
  { month: "Jan", users: 12, stores: 3, clubs: 2, events: 5 },
  { month: "Feb", users: 19, stores: 5, clubs: 3, events: 8 },
  { month: "Mar", users: 28, stores: 8, clubs: 5, events: 12 },
  { month: "Apr", users: 35, stores: 10, clubs: 7, events: 15 },
  { month: "May", users: 48, stores: 14, clubs: 9, events: 20 },
  { month: "Jun", users: 62, stores: 18, clubs: 12, events: 28 },
];

const mockActivityData = [
  { day: "Mon", views: 240, clicks: 80 },
  { day: "Tue", views: 380, clicks: 130 },
  { day: "Wed", views: 290, clicks: 90 },
  { day: "Thu", views: 430, clicks: 160 },
  { day: "Fri", views: 510, clicks: 190 },
  { day: "Sat", views: 620, clicks: 240 },
  { day: "Sun", views: 480, clicks: 180 },
];

const recentActivity = [
  { text: "New club created: Speed Kings", time: "2 min ago", color: "bg-blue-500" },
  { text: "New marketplace store registered", time: "15 min ago", color: "bg-emerald-500" },
  { text: "Store became featured: AutoZone PK", time: "1 hour ago", color: "bg-amber-500" },
  { text: "New event published: Karachi Drift Night", time: "3 hours ago", color: "bg-purple-500" },
  { text: "New product added: Michelin Tires Set", time: "5 hours ago", color: "bg-rose-500" },
  { text: "User role updated to Super Admin", time: "Yesterday", color: "bg-slate-500" },
];

export default function AdminOverviewPage() {
  const { stats, loading, fetchStats } = useAdminAnalytics();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform-wide metrics and activity for ThrottleConnect.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatsCard title="Total Users" value={stats.totalUsers} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-500/10" loading={loading} />
          <AdminStatsCard title="Total Stores" value={stats.totalStores} icon={Store} iconColor="text-emerald-600" iconBg="bg-emerald-500/10" loading={loading} />
          <AdminStatsCard title="Total Products" value={stats.totalProducts} icon={Package} iconColor="text-violet-600" iconBg="bg-violet-500/10" loading={loading} />
          <AdminStatsCard title="Total Services" value={stats.totalServices} icon={Wrench} iconColor="text-orange-600" iconBg="bg-orange-500/10" loading={loading} />
          <AdminStatsCard title="Total Clubs" value={stats.totalClubs} icon={Users2} iconColor="text-pink-600" iconBg="bg-pink-500/10" loading={loading} />
          <AdminStatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} iconColor="text-teal-600" iconBg="bg-teal-500/10" loading={loading} />
          <AdminStatsCard title="Platform Views" value={stats.totalViews} icon={Eye} iconColor="text-indigo-600" iconBg="bg-indigo-500/10" loading={loading} />
          <AdminStatsCard title="Platform Clicks" value={stats.totalClicks} icon={MousePointerClick} iconColor="text-cyan-600" iconBg="bg-cyan-500/10" loading={loading} />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-sm font-bold">Platform Growth</CardTitle>
              </div>
              <CardDescription className="text-xs">Users, stores, clubs and events over 6 months</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockGrowthData}>
                  <defs>
                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="storesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#usersGrad)" name="Users" />
                  <Area type="monotone" dataKey="stores" stroke="#10b981" strokeWidth={2} fill="url(#storesGrad)" name="Stores" />
                  <Area type="monotone" dataKey="clubs" stroke="#8b5cf6" strokeWidth={2} fill="none" name="Clubs" />
                  <Area type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={2} fill="none" name="Events" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Activity */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-bold">Weekly Activity</CardTitle>
              </div>
              <CardDescription className="text-xs">Views and clicks over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
            <CardTitle className="text-sm font-bold">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Latest platform events</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.text}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
