"use client";

import React, { useEffect, useState } from "react";
import { MarketplaceService } from "@/types/marketplace";
import { useMarketplaceServices } from "@/hooks/useMarketplaceServices";
import ServiceCard from "./ServiceCard";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { CENTER_TEXT } from "@/types/main";
import { mobileResponsiveCount } from "@/types/CommonType";

export default function FeaturedServicesSection() {
  const { fetchFeaturedServices } = useMarketplaceServices();
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
console.log('services', services)
  useEffect(() => {
    let mounted = true;
    fetchFeaturedServices(20)
      .then((data) => {
        if (mounted) setServices(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [fetchFeaturedServices]);

  if (!loading && services.length === 0) return null;

  return (
    <SectionWrapper
      bg="#D8E7ED"
      title="Vehicle Services"
      description="Mechanics, electricians, body shops & more — trusted professionals near you."
    >
      <div className="pt-4">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 h-[340px] w-[252px] shrink-0 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <PrimaryCarousel
            items={services}
            responsive={{
              mobile: mobileResponsiveCount,
              tablet: 2,
              desktop: 4,
            }}
            className="w-full"
            renderItem={(service) => (
              <ServiceCard key={service.id} service={service} />
            )}
          />
        )}
      </div>
    </SectionWrapper>
  );
}
