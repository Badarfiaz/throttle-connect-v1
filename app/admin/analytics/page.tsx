"use client";
import { useEffect } from "react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { useAdminAnalytics } from "@/hooks/admin/useAdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users, Store, Package, Wrench, Users2, Calendar, Eye, MousePointerClick,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const mockUserGrowth = [
  { month: "Jan", users: 12 },
  { month: "Feb", users: 19 },
  { month: "Mar", users: 28 },
  { month: "Apr", users: 35 },
  { month: "May", users: 48 },
  { month: "Jun", users: 62 },
];

const mockStoreGrowth = [
  { month: "Jan", stores: 3, clubs: 1 },
  { month: "Feb", stores: 5, clubs: 2 },
  { month: "Mar", stores: 8, clubs: 4 },
  { month: "Apr", stores: 10, clubs: 6 },
  { month: "May", stores: 14, clubs: 9 },
  { month: "Jun", stores: 18, clubs: 12 },
];

const mockViewsClicks = [
  { month: "Jan", views: 1200, clicks: 380 },
  { month: "Feb", views: 1800, clicks: 540 },
  { month: "Mar", views: 2400, clicks: 720 },
  { month: "Apr", views: 3100, clicks: 960 },
  { month: "May", views: 4200, clicks: 1300 },
  { month: "Jun", views: 5600, clicks: 1750 },
];

const topStores = [
  { name: "AutoZone PK", views: 1840, clicks: 620, ctr: "33.7%" },
  { name: "Karachi Motors", views: 1420, clicks: 490, ctr: "34.5%" },
  { name: "Speed Parts", views: 1190, clicks: 380, ctr: "31.9%" },
  { name: "Tire Kings", views: 980, clicks: 310, ctr: "31.6%" },
  { name: "Detail Masters", views: 760, clicks: 240, ctr: "31.6%" },
];

const topClubs = [
  { name: "Speed Kings", views: 2400, clicks: 890, ctr: "37.1%" },
  { name: "Lahore Riders", views: 1980, clicks: 720, ctr: "36.4%" },
  { name: "Karachi Drive Club", views: 1560, clicks: 560, ctr: "35.9%" },
];

export default function AdminAnalyticsPage() {
  const { stats, loading, fetchStats } = useAdminAnalytics();

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <AdminTopNav breadcrumb="Analytics" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Comprehensive insights across ThrottleConnect.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatsCard title="Total Users" value={stats.totalUsers} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-500/10" loading={loading} />
          <AdminStatsCard title="Total Stores" value={stats.totalStores} icon={Store} iconColor="text-emerald-600" iconBg="bg-emerald-500/10" loading={loading} />
          <AdminStatsCard title="Total Products" value={stats.totalProducts} icon={Package} iconColor="text-violet-600" iconBg="bg-violet-500/10" loading={loading} />
          <AdminStatsCard title="Total Services" value={stats.totalServices} icon={Wrench} iconColor="text-orange-600" iconBg="bg-orange-500/10" loading={loading} />
          <AdminStatsCard title="Total Clubs" value={stats.totalClubs} icon={Users2} iconColor="text-pink-600" iconBg="bg-pink-500/10" loading={loading} />
          <AdminStatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} iconColor="text-teal-600" iconBg="bg-teal-500/10" loading={loading} />
          <AdminStatsCard title="Total Views" value={stats.totalViews} icon={Eye} iconColor="text-indigo-600" iconBg="bg-indigo-500/10" loading={loading} />
          <AdminStatsCard title="Total Clicks" value={stats.totalClicks} icon={MousePointerClick} iconColor="text-cyan-600" iconBg="bg-cyan-500/10" loading={loading} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-sm font-bold">User Growth</CardTitle>
              <CardDescription className="text-xs">New users per month</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={mockUserGrowth}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} fill="url(#userGrad)" name="Users" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Store & Club Growth</CardTitle>
              <CardDescription className="text-xs">New stores and clubs per month</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockStoreGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="stores" stroke="#10b981" strokeWidth={2} name="Stores" dot={false} />
                  <Line type="monotone" dataKey="clubs" stroke="#8b5cf6" strokeWidth={2} name="Clubs" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm md:col-span-2">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Views & Clicks Over Time</CardTitle>
              <CardDescription className="text-xs">Platform-wide traffic trend</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockViewsClicks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Most Viewed Stores</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y dark:divide-slate-800">
                {topStores.map((store, i) => (
                  <div key={store.name} className="flex items-center px-5 py-3 gap-4">
                    <span className="text-sm font-black text-slate-300 w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{store.name}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500 text-right">
                      <span><span className="font-bold text-slate-700 dark:text-slate-300">{store.views.toLocaleString()}</span> views</span>
                      <span><span className="font-bold text-slate-700 dark:text-slate-300">{store.clicks}</span> clicks</span>
                      <span className="font-bold text-emerald-600">{store.ctr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Most Viewed Clubs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y dark:divide-slate-800">
                {topClubs.map((club, i) => (
                  <div key={club.name} className="flex items-center px-5 py-3 gap-4">
                    <span className="text-sm font-black text-slate-300 w-5">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{club.name}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-500 text-right">
                      <span><span className="font-bold text-slate-700 dark:text-slate-300">{club.views.toLocaleString()}</span> views</span>
                      <span><span className="font-bold text-slate-700 dark:text-slate-300">{club.clicks}</span> clicks</span>
                      <span className="font-bold text-emerald-600">{club.ctr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
