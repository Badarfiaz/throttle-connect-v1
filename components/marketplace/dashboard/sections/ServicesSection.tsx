"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Wrench, Plus, CheckCircle2, XCircle } from "lucide-react";
import { MarketplaceService, SERVICE_TYPES } from "@/types/marketplace";

type ServicesSectionProps = {
  services: MarketplaceService[];
  loading?: boolean;
  error?: string | null;
  onAddService: () => void;
  onEditService: (service: MarketplaceService) => void;
  onDeleteService: (storeId: string, serviceId: string) => void;
  deleting?: boolean;
};

const getServiceTypeLabel = (value: string) =>
  SERVICE_TYPES.find((t) => t.value === value)?.label ?? value;

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-3.5 w-3.5 ${
          star <= Math.round(rating)
            ? "fill-amber-400 text-amber-400"
            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
        }`}
      />
    ))}
  </div>
);

const ServicesSection = ({
  services,
  loading,
  error,
  onAddService,
  onEditService,
  onDeleteService,
  deleting,
}: ServicesSectionProps) => {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (service: MarketplaceService) => {
    const confirmed = window.confirm(
      `Remove "${service.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    setDeletingId(service.id);
    try {
      await onDeleteService(service.storeId, service.id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Vehicle Services
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage the services you offer — mechanics, electricians, detailing, and more.
          </p>
        </div>
        <Button onClick={onAddService} className="shrink-0">
          <Plus className="mr-1.5 h-4 w-4" /> Add Service
        </Button>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading services...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <Wrench className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No services listed yet</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add your first service offering so customers can find and review you.
          </p>
          <Button onClick={onAddService} size="sm" className="mt-4">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add First Service
          </Button>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
            >
              {/* Left: image + details */}
              <div className="flex items-start gap-4">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="size-16 rounded-xl border border-slate-200 object-cover shrink-0 dark:border-slate-700"
                  />
                ) : (
                  <div className="size-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Wrench className="h-6 w-6 text-slate-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {service.title}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {getServiceTypeLabel(service.serviceType)}
                    </Badge>
                    {service.isAvailable ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                        <XCircle className="h-3 w-3" /> Unavailable
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {service.description ?? "No description provided."}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {service.price != null ? (
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        PKR {service.price.toLocaleString()}
                        {service.priceUnit && service.priceUnit !== "fixed"
                          ? ` · ${service.priceUnit.replace(/-/g, " ")}`
                          : ""}
                      </span>
                    ) : (
                      <span className="italic">Price on quote</span>
                    )}
                    {(service.reviewCount ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <StarRating rating={service.averageRating ?? 0} />
                        <span>
                          {(service.averageRating ?? 0).toFixed(1)} ({service.reviewCount} review
                          {(service.reviewCount ?? 0) !== 1 ? "s" : ""})
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditService(service)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === service.id || deleting}
                  onClick={() => handleDelete(service)}
                >
                  {deletingId === service.id ? "Removing..." : "Remove"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesSection;
