"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { clubs } from "@/dummydata/networking";
import { db } from "@/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, runTransaction } from "firebase/firestore";
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
  Loader2,
} from "lucide-react";
import SharedButton from "@/components/shared/SharedButton";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { fetchUserProfileData } from "@/app/redux/features/authSlice";
import { toast } from "sonner";

export default function ClubProfile() {
  const { id } = useParams();
  const [dbClub, setDbClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [myRequest, setMyRequest] = useState<any>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchClub = async () => {
      try {
        const docRef = doc(db, "networkingStores", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDbClub(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching club profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  useEffect(() => {
    if (!id || !user?.userId) return;

    setLoadingRequest(true);
    const q = query(
      collection(db, "membershipRequests"),
      where("userId", "==", user.userId),
      where("clubId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setMyRequest(snapshot.docs[0].data());
      } else {
        setMyRequest(null);
      }
      setLoadingRequest(false);
    }, (error) => {
      console.error("Error listening to request snapshot:", error);
      setLoadingRequest(false);
    });

    return () => unsubscribe();
  }, [id, user?.userId]);

  const handleJoinRequest = async () => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please sign in to request to join a club.",
      });
      return;
    }

    if (!user.profileData?.completed) {
      toast.error("Incomplete Profile", {
        description: "Please complete your profile details in settings first.",
      });
      return;
    }

    if (user.profileData?.clubId != null) {
      toast.error("Already in a Club", {
        description: "A user can belong to only one club at a time.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const requestRef = doc(collection(db, "membershipRequests"));
      const requestId = requestRef.id;

      const requestData = {
        id: requestId,
        userId: user.userId,
        clubId: id as string,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const userRef = doc(db, "users", user.userId);
      const clubRef = doc(db, "networkingStores", id as string);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const clubDoc = await transaction.get(clubRef);

        if (!userDoc.exists()) {
          throw new Error("User document does not exist.");
        }
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }

        const userData = userDoc.data();
        const clubData = clubDoc.data();

        // Rule 1: One Club Only
        if (userData.clubId != null) {
          throw new Error("You already belong to another club.");
        }

        const currentPendingCount = clubData.pendingRequestsCount || 0;

        transaction.set(requestRef, requestData);
        transaction.update(userRef, {
          membershipStatus: "pending",
        });
        transaction.update(clubRef, {
          pendingRequestsCount: currentPendingCount + 1,
        });
      });

      toast.success("Request Sent", {
        description: "Your membership request has been submitted successfully.",
      });
      dispatch(fetchUserProfileData(user.userId));
    } catch (e: any) {
      console.error("Error submitting join request", e);
      toast.error(e.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const club = useMemo(() => {
    if (dbClub) {
      return {
        id: id as string,
        name: dbClub.clubName || "Unnamed Club",
        categoryType: (dbClub.clubType === "car" ? "sedans" : dbClub.clubType === "bike" ? "bikes" : "offroad") as any,
        image: dbClub.bannerUrl ,
        location: dbClub.city || "Unknown Location",
        memberCount: dbClub.memberCount || 0,
        description: dbClub.description || "No description provided.",
        createdBy: dbClub.email || "Owner",
      };
    }
    return clubs.find((c) => c.id === id);
  }, [dbClub, id]);

  if (loading && id && !clubs.some((c) => c.id === id)) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse space-y-4 w-full max-w-md p-6 bg-white rounded-xl shadow-xs border border-slate-100">
          <div className="h-6 bg-slate-200 rounded-sm w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-sm w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded-sm w-5/6"></div>
        </div>
      </div>
    );
  }

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

  const members = Array.from({ length: 4 }, (_, i) => i + 1);
  const events = Array.from({ length: 3 }, (_, i) => i + 1);
  const achievements = [Trophy, Car, Bike];

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
      <CardHeader className="mt-5">
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription className="mb-5">
          Ride outs, meetups & track days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 mb-5">
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
            <SharedButton label="Details" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        <div className="absolute bottom-6 left-6 flex items-center gap-4 text-white">
          {dbClub?.logoUrl ? (
            <img
              src={dbClub.logoUrl}
              alt={`${club.name} Logo`}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/80 bg-white/10 backdrop-blur-md shadow-lg shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 border-white/80 shadow-lg shrink-0">
              {club.name.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "AC"}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {club.name}
            </h1>
            <p className="text-xs sm:text-sm mt-1 opacity-90 uppercase tracking-wider font-semibold">
              {club.categoryType.replace("-", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 Overview Section */}
      <Card className="bg-white/80 backdrop-blur-md border border-border/30 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl mt-5 font-semibold text-primary">
            Club Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground p-3">
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
            <p className="text-muted-foreground mb-5 leading-relaxed">
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
      <div className="text-center space-y-4 max-w-md mx-auto pt-6 border-t border-border/20">
        <h3 className="text-lg font-semibold text-primary">
          Ready to ride with {club.name}?
        </h3>
        
        {loadingRequest ? (
          <Button disabled className="w-full bg-slate-100 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading request status...
          </Button>
        ) : myRequest ? (
          <div className="space-y-2">
            {myRequest.status === "pending" && (
              <>
                <Button disabled className="w-full bg-amber-500 text-white font-semibold cursor-not-allowed">
                  Pending Approval
                </Button>
                <p className="text-xs text-amber-600 font-medium">Request Sent</p>
              </>
            )}
            {myRequest.status === "approved" && (
              <Button disabled className="w-full bg-emerald-600 text-white font-semibold cursor-not-allowed">
                Approved (Member)
              </Button>
            )}
            {myRequest.status === "rejected" && (
              <Button disabled className="w-full bg-red-600 text-white font-semibold cursor-not-allowed">
                Rejected
              </Button>
            )}
          </div>
        ) : user?.profileData?.clubId === id ? (
          <Button disabled className="w-full bg-emerald-600 text-white font-semibold cursor-not-allowed">
            Approved (Member)
          </Button>
        ) : user?.profileData?.clubId != null ? (
          <Button disabled className="w-full bg-slate-200 text-slate-500 font-medium cursor-not-allowed">
            Already in a Club
          </Button>
        ) : dbClub?.ownerUid === user?.userId ? (
          <Button disabled className="w-full bg-slate-200 text-slate-500 font-medium cursor-not-allowed">
            You own this club
          </Button>
        ) : (
          <Button 
            onClick={handleJoinRequest} 
            disabled={submitting} 
            className="w-full bg-[#19376D] hover:bg-[#0B2447] text-white font-semibold shadow-md transition py-6 rounded-xl"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Request...
              </>
            ) : (
              "Join Club"
            )}
          </Button>
        )}
      </div>
    </section>
  );
}
