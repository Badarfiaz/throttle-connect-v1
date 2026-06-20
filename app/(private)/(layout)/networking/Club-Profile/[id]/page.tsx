"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { clubs } from "@/dummydata/networking";
import { db } from "@/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, runTransaction, getDocs, limit } from "firebase/firestore";
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
  Clock,
  Trophy,
  Car,
  Bike,
  Loader2,
} from "lucide-react";
import SharedButton from "@/components/shared/SharedButton";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { fetchUserProfileData } from "@/app/redux/features/authSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function ClubProfile() {
  const { id } = useParams();
  const [dbClub, setDbClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [myRequest, setMyRequest] = useState<any>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [submittingJoin, setSubmittingJoin] = useState(false);


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

  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoadingMembers(true);
    const q = query(
      collection(db, "users"),
      where("clubId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClubMembers(list);
      setLoadingMembers(false);
    }, (error) => {
      console.error("Error fetching club members:", error);
      setLoadingMembers(false);
    });

    return () => unsubscribe();
  }, [id]);

  // Fetch club events
  useEffect(() => {
    if (!id) return;
    setLoadingEvents(true);
    const q = query(
      collection(db, "events"),
      where("clubId", "==", id),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      list.sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));
      setClubEvents(list);
      setLoadingEvents(false);
    }, (error) => {
      console.error("Error fetching club events:", error);
      setLoadingEvents(false);
    });
    return () => unsubscribe();
  }, [id]);

  // Listen to registration status for the selected event
  useEffect(() => {
    if (!selectedEvent?.id || !user?.userId) {
      setIsRegistered(false);
      return;
    }
    const participantDocId = `${selectedEvent.id}_${user.userId}`;
    const participantRef = doc(db, "eventParticipants", participantDocId);
    
    const unsubscribe = onSnapshot(participantRef, (docSnap) => {
      setIsRegistered(docSnap.exists());
    });
    return () => unsubscribe();
  }, [selectedEvent?.id, user?.userId]);

  const handleJoinEvent = async () => {
    if (!selectedEvent) return;
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please sign in to join the event.",
      });
      return;
    }
    
    const participantDocId = `${selectedEvent.id}_${user.userId}`;
    const participantRef = doc(db, "eventParticipants", participantDocId);
    const eventRef = doc(db, "events", selectedEvent.id);

    setSubmittingJoin(true);
    try {
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error("Event does not exist.");
        }
        
        const eventData = eventDoc.data();
        
        if (eventData.maxParticipants && eventData.participantCount >= eventData.maxParticipants) {
          throw new Error("This event is fully booked.");
        }

        const participantDoc = await transaction.get(participantRef);
        if (participantDoc.exists()) {
          throw new Error("You are already registered for this event.");
        }

        const participantData = {
          id: participantDocId,
          eventId: selectedEvent.id,
          userId: user.userId,
          userName: user.name || user.email?.split("@")[0] || "Rider",
          profileImage: user.profileData?.profileImage || (user as any).profileImage || "",
          status: "registered",
          registeredAt: new Date().toISOString(),
        };

        transaction.set(participantRef, participantData);
        transaction.update(eventRef, {
          participantCount: (eventData.participantCount || 0) + 1
        });
      });

      toast.success("Joined Event", {
        description: "You have successfully registered for the event!"
      });
    } catch (e: any) {
      console.error("Error joining event:", e);
      toast.error(e.message || "Failed to join event");
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!selectedEvent || !user) return;

    const participantDocId = `${selectedEvent.id}_${user.userId}`;
    const participantRef = doc(db, "eventParticipants", participantDocId);
    const eventRef = doc(db, "events", selectedEvent.id);

    setSubmittingJoin(true);
    try {
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error("Event does not exist.");
        }
        
        const eventData = eventDoc.data();

        const participantDoc = await transaction.get(participantRef);
        if (!participantDoc.exists()) {
          throw new Error("You are not registered for this event.");
        }

        transaction.delete(participantRef);
        transaction.update(eventRef, {
          participantCount: Math.max(0, (eventData.participantCount || 0) - 1)
        });
      });

      toast.success("Left Event", {
        description: "Your registration has been cancelled successfully."
      });
    } catch (e: any) {
      console.error("Error leaving event:", e);
      toast.error(e.message || "Failed to leave event");
    } finally {
      setSubmittingJoin(false);
    }
  };


  const handleLeaveClub = async () => {
    if (!user || !id) return;

    setSubmitting(true);
    try {
      const userRef = doc(db, "users", user.userId);
      const clubRef = doc(db, "networkingStores", id as string);
      
      const q = query(
        collection(db, "membershipRequests"),
        where("userId", "==", user.userId),
        where("clubId", "==", id)
      );
      const querySnap = await getDocs(q);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const clubDoc = await transaction.get(clubRef);

        if (!userDoc.exists() || !clubDoc.exists()) {
          throw new Error("User or Club document does not exist.");
        }

        const userData = userDoc.data();
        const clubData = clubDoc.data();

        if (userData.clubId !== id) {
          throw new Error("You are not a member of this club.");
        }

        transaction.update(userRef, {
          clubId: null,
          membershipStatus: "none",
        });

        const currentMemberCount = clubData.memberCount || 0;
        transaction.update(clubRef, {
          memberCount: Math.max(0, currentMemberCount - 1),
        });

        querySnap.forEach((doc) => {
          transaction.delete(doc.ref);
        });
      });

      toast.success("Left Club", {
        description: "You have successfully left the club.",
      });
      dispatch(fetchUserProfileData(user.userId));
    } catch (e: any) {
      console.error("Error leaving club:", e);
      toast.error(e.message || "Failed to leave club");
    } finally {
      setSubmitting(false);
    }
  };

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

  const events = Array.from({ length: 3 }, (_, i) => i + 1);
  const achievements = [Trophy, Car, Bike];

  const renderMembers = () => (
    <Card className="bg-background/60 backdrop-blur-md border rounded-xl">
      <CardHeader>
        <CardTitle>Featured Members</CardTitle>
        <CardDescription>Meet the passionate team</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-6 justify-center p-6">
        {loadingMembers ? (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-1">Loading members...</p>
          </div>
        ) : clubMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">No active members in this club yet.</p>
        ) : (
          clubMembers.map((m) => {
            const initials = m.name
              ?.split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w: string) => w[0]?.toUpperCase())
              .join("") || "M";

            return (
              <div key={m.id} className="flex flex-col items-center space-y-2 w-24">
                <Avatar className="w-16 h-16 border border-slate-200 shadow-xs rounded-xl">
                  {m.profileImage ? (
                    <AvatarImage src={m.profileImage} className="object-cover rounded-xl" />
                  ) : (
                    <AvatarFallback className="bg-slate-100 text-[#19376D] font-bold rounded-xl">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="text-xs font-semibold text-foreground text-center truncate w-full">{m.name || "Member"}</p>
                {m.vehicle?.brand && (
                  <p className="text-[10px] text-slate-400 text-center truncate w-full">
                    {m.vehicle.brand} {m.vehicle.model}
                  </p>
                )}
              </div>
            );
          })
        )}
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
        {loadingEvents ? (
          <div className="flex flex-col items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-1 animate-pulse font-medium">Loading events...</p>
          </div>
        ) : clubEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No events scheduled for this club yet.</p>
        ) : (
          clubEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer group"
              onClick={() => {
                setSelectedEvent(event);
                setIsDetailsOpen(true);
              }}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-3 bg-slate-100 rounded-xl text-primary shrink-0 group-hover:bg-primary/10 transition">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition truncate">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(event.startDateTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="truncate">{event.location?.name}, {event.location?.city}</span>
                    <span>•</span>
                    <Badge className="bg-slate-100 hover:bg-slate-150 text-slate-600 font-semibold py-0 px-2 capitalize text-[9px] border border-slate-200">
                      {event.eventType?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-xs font-semibold text-slate-500">
                  {event.participantCount || 0} joined
                </span>
                <Button size="sm" variant="outline" className="rounded-lg font-semibold text-xs py-1 h-8">
                  Details
                </Button>
              </div>
            </div>
          ))
        )}
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
              <div className="space-y-2">
                <Button disabled className="w-full bg-emerald-600 text-white font-semibold cursor-not-allowed">
                  Approved (Member)
                </Button>
                <Button
                  onClick={handleLeaveClub}
                  disabled={submitting}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold py-4 rounded-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Leaving Club...
                    </>
                  ) : (
                    "Leave Club"
                  )}
                </Button>
              </div>
            )}
            {myRequest.status === "rejected" && (
              <Button disabled className="w-full bg-red-600 text-white font-semibold cursor-not-allowed">
                Rejected
              </Button>
            )}
          </div>
        ) : user?.profileData?.clubId === id ? (
          <div className="space-y-2">
            <Button disabled className="w-full bg-emerald-600 text-white font-semibold cursor-not-allowed">
              Approved (Member)
            </Button>
            <Button
              onClick={handleLeaveClub}
              disabled={submitting}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold py-4 rounded-xl"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Leaving Club...
                </>
              ) : (
                "Leave Club"
              )}
            </Button>
          </div>
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

      {/* 🔹 Event Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg rounded-2xl bg-white p-6 shadow-xl border overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4 overflow-y-auto pr-1 py-1 max-h-[75vh]">
              {selectedEvent.coverImage ? (
                <div className="w-full h-48 relative rounded-xl overflow-hidden border">
                  <img
                    src={selectedEvent.coverImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-slate-900/80 text-white backdrop-blur-xs capitalize text-xs">
                      {selectedEvent.eventType?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-slate-50 rounded-xl flex items-center justify-center relative border border-dashed">
                  <CalendarDays className="h-12 w-12 text-slate-300" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-slate-900/80 text-white backdrop-blur-xs capitalize text-xs">
                      {selectedEvent.eventType?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedEvent.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {new Date(selectedEvent.startDateTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedEvent.location?.name}, {selectedEvent.location?.city}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {selectedEvent.participantCount || 0} Joined {selectedEvent.maxParticipants ? `/ ${selectedEvent.maxParticipants}` : ""}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About the Event</h5>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedEvent.description}</p>
              </div>

              {/* Organizer Card */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organizer Information</h5>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white shadow-xs">
                  <div className="flex items-center gap-3">
                    {dbClub?.logoUrl ? (
                      <img
                        src={dbClub.logoUrl}
                        alt={dbClub.clubName}
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-lg font-bold border">
                        {club.name?.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "C"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{club.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        Verified Networking Club
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="ghost" type="button" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {isRegistered ? (
                  <Button
                    onClick={handleLeaveEvent}
                    disabled={submittingJoin}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-6 flex items-center gap-1.5"
                  >
                    {submittingJoin ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Leaving...
                      </>
                    ) : (
                      "Leave Event"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleJoinEvent}
                    disabled={submittingJoin || (selectedEvent.maxParticipants && selectedEvent.participantCount >= selectedEvent.maxParticipants)}
                    className="bg-[#19376D] hover:bg-[#0B2447] text-white font-semibold rounded-xl px-6 flex items-center gap-1.5"
                  >
                    {submittingJoin ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Joining...
                      </>
                    ) : selectedEvent.maxParticipants && selectedEvent.participantCount >= selectedEvent.maxParticipants ? (
                      "Event Full"
                    ) : (
                      "Join Event"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

