"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, LogOut } from "lucide-react";
import SharedButton from "@/components/shared/SharedButton";

export default function Profile() {
  const profileData = {
    userId: "675ae15cf34e1d8a12ffb33d",
    lastActive: "2025-10-26T18:00:00Z",
    createdAt: "2025-05-20T14:30:00Z",
    updatedAt: "2025-10-20T11:00:00Z",
    socialLinks: {
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      youtube: "https://youtube.com/",
    },
    registeredClubs: [
      {
        id: "1",
        title: "Elicte Angles",
        image: "/images/category/hatchback.webp",
        hostedBy: "Badar Fayyaz",
        slotsAvailable: 5,
        totalSlots: 50,
        date: "2025-11-12",
        startTime: "10:00 AM",
        description: "Weekly ride and networking event for passionate bikers.",
        category: "Biking",
        rating: 4.8,
        location: "Lahore, Pakistan",
        status: "Active",
        role: "Member",
      },
    ],
    joinedEvents: [
      { eventId: "event_123", status: "Completed", ratingGiven: 5 },
      { eventId: "event_456", status: "Upcoming", ratingGiven: 0 },
    ],
  };

  const handleLeaveClub = (clubId: string) => {
    if (confirm("Are you sure you want to leave this club?")) {
      console.log(`Leaving club with ID: ${clubId}`);
      // Backend logic or state update here
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/10 shadow-lg">
        <img
          src="/images/category/sedan.webp"
          alt="Profile Banner"
          className="w-full h-60 object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-6 flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md">
            <AvatarImage src="/images/profile.jpg" alt="User Avatar" />
            <AvatarFallback>BF</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">User Profile</h1>
            <p className="text-sm text-white/80">
              Last Active:{" "}
              {new Date(profileData.lastActive).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <Card className="shadow-sm border border-border/30 bg-gradient-to-br from-background to-secondary/10">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Profile Info
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              ID: {profileData.userId}
            </p>
            <div className="flex justify-center">
              <SharedButton
                label="Edit Profile"
                variant="default"
                className="px-8"
                rounded="2xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(profileData.socialLinks).map(([key, value]) => (
              <a
                key={key}
                href={value as string}
                target="_blank"
                className="transition hover:scale-105"
              >
                <Badge variant="outline" className="capitalize cursor-pointer">
                  {key}
                </Badge>
              </a>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Registered Club */}
      <Card className="shadow-md border border-border/40">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Registered Club
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Each user can only be registered to one club at a time.
            </p>
          </div>
          {profileData.registeredClubs.length > 0 && (
            <Badge variant="secondary">1 / 1 Club Registered</Badge>
          )}
        </CardHeader>

        <CardContent>
          {profileData.registeredClubs.length > 0 ? (
            profileData.registeredClubs.map((club) => (
              <Card
                key={club.id}
                ispadding={false}
                className="border border-border/40 hover:shadow-lg transition duration-200 overflow-hidden"
              >
                <img
                  src={club.image}
                  alt={club.title}
                  className="w-full h-40 object-cover"
                />

                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg text-primary">
                        {club.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Hosted by {club.hostedBy}
                      </p>
                    </div>
                    <Badge
                      variant={
                        club.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {club.status}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm leading-tight">
                    {club.description}
                  </p>

                  <Separator />

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {club.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {club.startTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {club.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {club.slotsAvailable}/{club.totalSlots} Slots
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <SharedButton
                      label="Leave Club"
                      variant="destructive"
                      size="sm"
                      iconLeft={<LogOut size={14} />}
                      onClick={() => handleLeaveClub(club.id)}
                      className="mt-2"
                      rounded="xl"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-6">
              You’re not registered to any club yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Joined Events */}
      <Card className="shadow-sm border border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Joined Events
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Events you’ve participated in or upcoming ones.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {profileData.joinedEvents.map((event, index) => (
              <div
                key={index}
                className="border border-border/40 p-3 rounded-xl flex justify-between items-center hover:shadow-sm transition"
              >
                <div>
                  <p className="font-semibold text-primary">
                    Event ID: {event.eventId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {event.status}
                  </p>
                </div>
                <Badge
                  variant={event.status === "Completed" ? "default" : "outline"}
                >
                  Rating: {event.ratingGiven}/5
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>
          Account Created: {new Date(profileData.createdAt).toLocaleString()}
        </p>
        <p>Last Updated: {new Date(profileData.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
