"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useClubAnalytics } from "@/hooks/useClubAnalytics";

type Props = {
  clubId: string | undefined;
};

export default function AnalyticsTab({ clubId }: Props) {
  const { data, loading, fetchAnalytics, dailyAggregate } = useClubAnalytics(clubId);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Club Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Profile views and listing clicks from members and visitors
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Profile Views"
          value={loading ? null : (data?.totalViews ?? 0)}
          icon={<Eye className="h-5 w-5 text-blue-500" />}
          color="blue"
        />
        <StatCard
          label="Total Listing Clicks"
          value={loading ? null : (data?.totalClicks ?? 0)}
          icon={<MousePointerClick className="h-5 w-5 text-emerald-500" />}
          color="emerald"
        />
      </div>

      {/* Daily Views Chart */}
      <Card className="border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Profile Views — Last 7 Days
          </CardTitle>
          <CardDescription className="text-xs">
            How many people visited your club profile each day
          </CardDescription>
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

      {/* Empty state when no data at all */}
      {!loading && !data?.totalViews && !data?.totalClicks && (
        <div className="flex flex-col items-center gap-3 py-10 text-slate-400 dark:text-slate-600">
          <Users className="h-10 w-10" strokeWidth={1.2} />
          <p className="text-sm font-medium text-center">
            No analytics yet — share your club page link to start collecting data
          </p>
        </div>
      )}
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
  color: "blue" | "emerald";
}) {
  const bgMap = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20",
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
