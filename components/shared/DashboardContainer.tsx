"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type DashboardNavItem = {
  id: string;
  label: string;
  description?: string;
  badge?: string;
};

type DashboardContainerProps = {
  title: string;
  subtitle?: string;
  navItems: DashboardNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export const DashboardContainer = ({
  title,
  subtitle,
  navItems,
  activeId,
  onNavigate,
  actions,
  children,
}: DashboardContainerProps) => {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff,_#eef2f7_55%,_#e8edf5_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Dashboard
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex items-center gap-3">{actions}</div>
            ) : null}
          </div>

          <div className="flex flex-col lg:flex-row">
            <aside className="border-b border-slate-200 bg-slate-50/70 p-4 lg:w-64 lg:border-b-0 lg:border-r">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white shadow"
                          : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-200 text-slate-600",
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <span
                          className={cn(
                            "text-xs",
                            isActive ? "text-slate-200" : "text-slate-500",
                          )}
                        >
                          {item.description}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </section>
  );
};
