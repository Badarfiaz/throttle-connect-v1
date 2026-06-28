import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  loading?: boolean;
  trend?: string;
}

export function AdminStatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-500/10",
  loading,
  trend,
}: AdminStatsCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
              {typeof value === "number" ? value.toLocaleString() : value}
            </h3>
          )}
          {trend && (
            <span className="text-[10px] text-emerald-600 font-medium">{trend}</span>
          )}
        </div>
        <div className={cn("p-2.5 rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardContent>
    </Card>
  );
}
