"use client";

import React from "react";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { MarketplaceStore } from "@/types/marketplace";
import ContactButton from "./ContactButton";

type SellerProfileCardProps = {
  store?: MarketplaceStore | null;
  itemName?: string;
  itemType?: "product" | "service";
  showMetadata?: boolean;
  showStoreLink?: boolean;
  className?: string;
  children?: React.ReactNode;
  /** Called when the buyer taps any contact button — used to record leads */
  onContact?: () => void;
};

export default function SellerProfileCard({
  store,
  itemName,
  itemType = "product",
  showMetadata = true,
  showStoreLink = true,
  className,
  children,
  onContact,
}: SellerProfileCardProps) {
  if (!store) return null;

  const locationText = [
    store.location?.area,
    store.location?.city,
    store.location?.province,
  ]
    .filter(Boolean)
    .join(", ");

  const whatsappMessage = itemName
    ? `Hi, I am interested in your ${itemType}: "${itemName}" on Throttle Connect.`
    : `Hi, I am interested in your listings on Throttle Connect.`;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800 p-6 space-y-6 ${className || ""}`}>
      {/* Provider Header */}
      <Link
        href={store.slugUrl ? `/marketplace/storeProfile/${store.slugUrl}` : "#"}
        className="flex items-center gap-3.5 group"
      >
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#19376D] to-[#0B2447] flex items-center justify-center shrink-0 shadow-md">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.title || "Store"}
              className="w-full h-full object-cover"
            />
          ) : (
            <Store size={26} className="text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
            {itemType === "service" ? "Service Provider" : "Seller Profile"}
          </p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate flex items-center gap-1">
            {store.title || "Independent Provider"}
            {store.completed && (
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </p>
        </div>
        {showStoreLink && (
          <ChevronLeft
            size={18}
            className="text-slate-400 rotate-180 shrink-0 group-hover:translate-x-0.5 transition-transform"
          />
        )}
      </Link>

      {showMetadata && (
        <>
          <Separator className="dark:bg-slate-800" />
          {/* Provider Metadata */}
          <div className="space-y-3.5 text-xs font-bold text-slate-600 dark:text-slate-350">
            {locationText && (
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{locationText}</span>
              </div>
            )}

            {store.phone && (
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{store.phone}</span>
              </div>
            )}

            {store.email && (
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{store.email}</span>
              </div>
            )}
          </div>
        </>
      )}

      <Separator className="dark:bg-slate-800" />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
          {/* Provider Contact Buttons (Call & Menu) */}
          <ContactButton
            phone={store.phone}
            email={store.email}
            preferredMethod="phone"
            menuIcon={true}
            detailPage={true}
            onContactClick={onContact}
          />

          {/* Instant Inquiry Button (WhatsApp Icon) */}
          {store.phone && (
            <a
              href={`https://wa.me/${store.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              onClick={() => onContact?.()}
            >
              <Button
                className="h-11 w-11 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl flex items-center justify-center shadow-sm cursor-pointer border-0"
                size="icon"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
              </Button>
            </a>
          )}
        </div>

        {/* Custom children (e.g. Add to Cart) */}
        {children}

        {/* View Store Profile Link */}
        {showStoreLink && store.slugUrl && (
          <Link
            href={`/marketplace/storeProfile/${store.slugUrl}`}
            className="flex items-center justify-center gap-1.5 w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            <Store size={14} />
            View Store Profile
          </Link>
        )}
      </div>
    </div>
  );
}
