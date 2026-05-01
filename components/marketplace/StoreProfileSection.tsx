"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Share2, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContactButton from "./ContactButton";
import type { MarketplaceStore } from "@/types/marketplace";

interface StoreProfilePageProps {
  store: MarketplaceStore | null;
  loading?: boolean;
}

export default function StoreProfilePage({
  store,
  loading = false,
}: StoreProfilePageProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store profile...</p>
        </div>
      </div>
    );
  }

  if (!store || !store.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const businessTypeLabels: Record<string, string> = {
    "spare-parts": "Spare Parts",
    accessories: "Accessories",
    "car-care": "Car Care",
    detailing: "Detailing",
    maintenance: "Maintenance",
    performance: "Performance",
    tuning: "Tuning",
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section with Logo */}
      <div className="relative h-64 md:h-80 bg-linear-to-r from-slate-900 to-slate-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>

        {/* Logo Container */}
        <div className="relative h-full flex items-center justify-center">
          {store.logoUrl ? (
            <Image
              src={store.logoUrl}
              alt={store.title || "Store"}
              width={150}
              height={150}
              className="rounded-lg shadow-2xl object-cover bg-white p-2"
            />
          ) : (
            <div className="w-40 h-40 rounded-lg bg-white/20 flex items-center justify-center text-white text-6xl font-bold">
              {store.title?.charAt(0) || "S"}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-12 relative z-10">
        {/* Store Header Card */}
        <Card className="mb-8 shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {store.title || "Untitled Store"}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {store.businessType?.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {businessTypeLabels[type] || type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={
                    isFavorited ? "bg-red-50 text-red-600" : "text-gray-600"
                  }
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                </Button>
                <Button variant="outline" size="icon" className="text-gray-600">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Location and Status */}
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600">
              {store.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>
                    {store.location.area}, {store.location.city},{" "}
                    {store.location.province}
                  </span>
                </div>
              )}
              {store.createdAt && (
                <span className="text-xs text-muted-foreground">
                  Joined{" "}
                  {new Date(store.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Contact Buttons */}
          <Separator />
          <div className="p-6 md:p-8 bg-linear-to-r from-slate-50 to-slate-100">
            <ContactButton
              phone={store.phone}
              email={store.email}
              preferredMethod={store.contactMethod}
            />
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews" className="hidden md:inline-flex">
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">About {store.title}</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {store.overview || "No description provided."}
                </p>
              </div>

              {/* Quick Facts */}
              <Separator className="my-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {store.businessType && store.businessType.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-muted-foreground font-semibold uppercase">
                      Categories
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {store.businessType.length} Category
                      {store.businessType.length !== 1 ? "ies" : ""}
                    </p>
                  </div>
                )}
                {store.address && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-muted-foreground font-semibold uppercase">
                      Address
                    </p>
                    <p className="text-sm font-medium mt-1 line-clamp-2">
                      {store.address}
                    </p>
                  </div>
                )}
                {store.completed && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-semibold uppercase">
                      Status
                    </p>
                    <p className="text-sm font-medium mt-1 text-green-700">
                      ✓ Verified
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

              {/* Primary Contact Button */}
              <div className="mb-8 p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm text-muted-foreground font-semibold uppercase mb-3">
                  Preferred Contact Method
                </p>
                <ContactButton
                  phone={store.phone}
                  email={store.email}
                  preferredMethod={store.contactMethod}
                />
              </div>

              <Separator className="my-6" />

              {/* Detailed Contact Information */}
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-4">
                {store.phone && (
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="p-2 bg-green-100 rounded-lg shrink-0">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">
                        Phone
                      </p>
                      <a
                        href={`tel:${store.phone}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary mt-1 block"
                      >
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}

                {store.email && (
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">
                        Email
                      </p>
                      <a
                        href={`mailto:${store.email}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary mt-1 block break-all"
                      >
                        {store.email}
                      </a>
                    </div>
                  </div>
                )}

                {store.address && (
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="p-2 bg-red-100 rounded-lg shrink-0">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {store.address}
                      </p>
                      {store.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {store.location.area}, {store.location.city},{" "}
                          {store.location.province}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Products & Services</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Store products will be displayed here</p>
                <Button variant="outline">View All Products</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Reviews coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mb-8 bg-linear-to-r from-blue-600 to-blue-700 border-0">
          <div className="p-6 md:p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to shop?</h3>
            <p className="mb-6 opacity-90">
              Explore all products from this amazing store
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Browse All Products
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
