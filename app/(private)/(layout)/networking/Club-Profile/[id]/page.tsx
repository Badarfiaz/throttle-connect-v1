"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { clubs } from "@/dummydata/networking";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  MapPin,
  ShieldCheck,
  Info,
  CalendarDays,
  Trophy,
  Car,
  Bike,
} from "lucide-react";

export default function ClubProfile() {
  const { id } = useParams();
  const club = useMemo(() => clubs.find((c) => c.id === id), [id]);

  if (!club) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="p-8 text-center">
          <CardTitle className="text-lg text-muted-foreground">
            Club not found 😢
          </CardTitle>
        </Card>
      </div>
    );
  }

  const renderBadge = (
    Icon: any,
    label: string,
    variant: "outline" | "secondary" = "outline"
  ) => (
    <Badge variant={variant} className="flex items-center gap-2">
      <Icon className="w-4 h-4" /> {label}
    </Badge>
  );

  const members = useMemo(() => Array.from({ length: 4 }, (_, i) => i + 1), []);
  const events = useMemo(() => Array.from({ length: 3 }, (_, i) => i + 1), []);
  const achievements = useMemo(() => [Trophy, Car, Bike], []);

  const renderMembers = () => (
    <Card className="bg-background/60 backdrop-blur-md border rounded-xl">
      <CardHeader>
        <CardTitle>Featured Members</CardTitle>
        <CardDescription>Meet the passionate team</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-6 justify-center">
        {members.map((n) => (
          <div key={n} className="flex flex-col items-center space-y-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`/images/avatar-${n}.jpg`} />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium text-foreground">Member {n}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderEvents = () => (
    <Card className="bg-background/60 backdrop-blur-md border rounded-xl">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Ride outs, meetups & track days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((n) => (
          <div
            key={n}
            className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent/20 transition"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Ride Event {n}</p>
                <p className="text-sm text-muted-foreground">
                  Islamabad · 12th Nov 2025
                </p>
              </div>
            </div>
            <Button size="sm" variant="secondary">
              Details
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAchievements = () => (
    <Card className="bg-background/60 backdrop-blur-md border rounded-xl">
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Celebrating milestones and victories</CardDescription>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((Icon, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent/20 transition"
          >
            <Icon className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">Achievement {i + 1}</p>
              <p className="text-sm text-muted-foreground">
                Outstanding performance & dedication
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* 🔹 Hero Section */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl">
        <Image
          src={club.image}
          alt={club.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {club.name}
          </h1>
          <p className="text-sm mt-1 opacity-90">{club.categoryType}</p>
        </div>
      </div>

      {/* 🔹 Overview Section */}
      <Card className="bg-white/80 backdrop-blur-md border border-border/30 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Club Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            A brief look into what makes {club.name} special.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {renderBadge(MapPin, club.location, "secondary")}
            {renderBadge(Users, `${club.memberCount} Members`)}
            {renderBadge(ShieldCheck, `Created by ${club.createdBy}`)}
          </div>
          <Separator />
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 mt-1 text-primary" />
            <p className="text-muted-foreground leading-relaxed">
              {club.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Tabs Section */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="flex flex-wrap justify-center mb-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="members">{renderMembers()}</TabsContent>
        <TabsContent value="events">{renderEvents()}</TabsContent>
        <TabsContent value="achievements">{renderAchievements()}</TabsContent>
      </Tabs>

      {/* 🔹 CTA Section */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-primary">
          Ready to ride with {club.name}?
        </h3>
        <Button
          size="lg"
          className="bg-primary hover:bg-secondary text-white transition-all duration-300"
        >
          Join Club
        </Button>
      </div>
    </section>
  );
}
