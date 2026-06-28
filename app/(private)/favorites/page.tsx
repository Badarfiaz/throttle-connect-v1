"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2, Compass, ExternalLink, Tag, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { auth, db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAppSelector } from "@/app/redux/hooks";
import FavoriteButton from "@/components/shared/FavoriteButton";

interface FavoriteItem {
  id: string;
  userId: string;
  itemId: string;
  itemType: "product" | "service" | "club" | "store";
  title: string;
  image: string;
  details: string;
  link: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const currentUser = auth.currentUser;
  const userId = currentUser?.uid || reduxUser?.userId;

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  const fetchFavorites = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const favRef = collection(db, "favorites");
      const q = query(favRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const items: FavoriteItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as FavoriteItem);
      });

      // Sort by newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setFavorites(items);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  // Filter items based on active tab
  const filteredFavorites = favorites.filter((item) => {
    if (activeTab === "all") return true;
    return item.itemType === activeTab;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "service":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "club":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "store":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your saved items...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign In Required</h2>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6 leading-relaxed">
          Please sign in to view and manage your favorited items.
        </p>
        <Link href="/login">
          <Button className="rounded-xl">Go to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              My Favorites
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Browse and manage the items you&apos;ve saved across the platform.
            </p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted p-1 rounded-xl flex flex-wrap h-auto gap-1 sm:inline-flex">
                <TabsTrigger value="all" className="rounded-lg py-1.5 px-3 text-xs font-semibold">
                  All ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="product" className="rounded-lg py-1.5 px-3 text-xs font-semibold">
                  Products ({favorites.filter((f) => f.itemType === "product").length})
                </TabsTrigger>
                <TabsTrigger value="service" className="rounded-lg py-1.5 px-3 text-xs font-semibold">
                  Services ({favorites.filter((f) => f.itemType === "service").length})
                </TabsTrigger>
                <TabsTrigger value="club" className="rounded-lg py-1.5 px-3 text-xs font-semibold">
                  Clubs ({favorites.filter((f) => f.itemType === "club").length})
                </TabsTrigger>
                <TabsTrigger value="store" className="rounded-lg py-1.5 px-3 text-xs font-semibold">
                  Stores ({favorites.filter((f) => f.itemType === "store").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Favorites Grid */}
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFavorites.map((item) => (
                  <Card
                    key={item.id}
                    className="group relative overflow-hidden border border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl flex flex-col h-full"
                  >
                    {/* Favorite Button (Unfavorite Action) */}
                    <div className="absolute right-3 top-3 z-20">
                      <FavoriteButton
                        itemId={item.itemId}
                        itemType={item.itemType}
                        itemData={{
                          title: item.title,
                          image: item.image,
                          details: item.details,
                          link: item.link,
                        }}
                        className="bg-black/40 hover:bg-black/60 text-white hover:text-white border-none"
                      />
                    </div>

                    {/* Card Image */}
                    <div className="relative aspect-video w-full bg-muted overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground/30">
                          <Compass className="h-12 w-12" />
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <CardContent className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`capitalize border py-0.5 px-2 text-[10px] font-bold rounded-md ${getTypeColor(item.itemType)}`}>
                            {item.itemType}
                          </Badge>
                          {item.details && (
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {item.details}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                      </div>

                      {/* Action Button */}
                      <Link href={item.link} className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1.5 rounded-xl border-border hover:bg-muted text-xs font-semibold"
                        >
                          View Details
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[30vh] flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-2xl bg-muted/10">
                <Compass className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-semibold text-muted-foreground">No saved {activeTab}s</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  You don&apos;t have any favorited {activeTab}s.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-dashed border-2 border-border bg-card/50 backdrop-blur-xs shadow-md rounded-3xl overflow-hidden max-w-xl mx-auto my-12">
            <CardContent className="p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
                <Heart className="h-8 w-8 animate-pulse text-rose-500 fill-rose-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Your favorites list is empty
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Start exploring the marketplace, clubs, and services, and click the heart icon to save items for quick access later!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/marketplace">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 py-2 shadow-md">
                    Explore Marketplace
                  </Button>
                </Link>
                <Link href="/networking">
                  <Button variant="outline" className="border-border hover:bg-muted font-semibold rounded-xl px-5 py-2">
                    Explore Clubs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
