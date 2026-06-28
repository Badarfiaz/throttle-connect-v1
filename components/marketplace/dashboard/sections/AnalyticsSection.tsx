"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MousePointerClick, TrendingUp, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useProductAnalytics } from "@/hooks/useProductAnalytics";

type Props = {
  products: { id: string; productName: string }[];
};

export default function AnalyticsSection({ products }: Props) {
  const { entries, loading, fetchAnalytics, totalViews, totalClicks, dailyAggregate } =
    useProductAnalytics();

  useEffect(() => {
    fetchAnalytics(products);
  }, [products.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Views and contact clicks across your listings
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Views"
          value={loading ? null : totalViews}
          icon={<Eye className="h-5 w-5 text-blue-500" />}
          color="blue"
        />
        <StatCard
          label="Total Clicks"
          value={loading ? null : totalClicks}
          icon={<MousePointerClick className="h-5 w-5 text-emerald-500" />}
          color="emerald"
        />
        <StatCard
          label="Products Listed"
          value={loading ? null : products.length}
          icon={<Package className="h-5 w-5 text-purple-500" />}
          color="purple"
        />
      </div>

      {/* Daily Views Chart */}
      <Card className="border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Views — Last 7 Days
          </CardTitle>
          <CardDescription className="text-xs">Daily page views across all your products</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={dailyAggregate} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 10, fontSize: 12, border: "1px solid #e2e8f0" }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Per-Product Table */}
      <Card className="border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
            Per-Product Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
              <Package className="h-8 w-8" strokeWidth={1.2} />
              <p className="text-sm font-medium">No analytics yet — share your listings to start collecting data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Product
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Views
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.productId}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                        {entry.productName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full">
                          <Eye className="h-3 w-3" /> {entry.totalViews}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
                          <MousePointerClick className="h-3 w-3" /> {entry.totalClicks}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | null;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "purple";
}) {
  const bgMap = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
  };
  return (
    <Card className="border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${bgMap[color]}`}>{icon}</div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
            {value === null ? (
              <Skeleton className="h-7 w-14 rounded mt-0.5" />
            ) : (
              <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
