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
  ChevronRight,
  Calendar,
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

  const [clubAchievements, setClubAchievements] = useState<any[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

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

  // Fetch club achievements
  useEffect(() => {
    if (!id) return;
    setLoadingAchievements(true);
    const q = query(
      collection(db, "networkingStores", id as string, "achievements")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a: any, b: any) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
      setClubAchievements(list);
      setLoadingAchievements(false);
    }, (error) => {
      console.error("Error fetching club achievements:", error);
      setLoadingAchievements(false);
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

  const renderMembers = () => (
    <Card className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-slate-100">
        <CardTitle className="text-base font-extrabold text-slate-900">Featured Members</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-medium">Enthusiasts registered in this club</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {loadingMembers ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-2 animate-pulse font-semibold">Loading members...</p>
          </div>
        ) : clubMembers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
            <Users className="size-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">No members listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {clubMembers.map((m) => {
              const initials = m.name
                ?.split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w: string) => w[0]?.toUpperCase())
                .join("") || "M";

              return (
                <div key={m.id} className="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition bg-slate-50/20">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-md rounded-2xl overflow-hidden shrink-0">
                    {m.profileImage ? (
                      <AvatarImage src={m.profileImage} className="object-cover rounded-2xl" />
                    ) : (
                      <AvatarFallback className="bg-[#19376D]/10 text-[#19376D] font-black text-lg rounded-2xl">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className="text-xs font-bold text-slate-950 truncate w-full mt-3">{m.name || "Member"}</p>
                  {m.vehicle?.brand ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-primary/5 text-primary border border-primary/5 mt-1 truncate max-w-full">
                      🚗 {m.vehicle.brand} {m.vehicle.model}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 mt-1">Rider</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEvents = () => (
    <Card className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-slate-100">
        <CardTitle className="text-base font-extrabold text-slate-900">Upcoming Events</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-medium">Ride outs, breakfast runs, track days, and meetups</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {loadingEvents ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-2 animate-pulse font-semibold">Loading events...</p>
          </div>
        ) : clubEvents.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
            <CalendarDays className="size-8 text-slate-350 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">No upcoming events scheduled.</p>
          </div>
        ) : (
          clubEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-150 rounded-2xl p-4 hover:border-slate-300 hover:shadow-xs transition bg-slate-50/10 cursor-pointer group"
              onClick={() => {
                setSelectedEvent(event);
                setIsDetailsOpen(true);
              }}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="p-3.5 bg-slate-100 text-slate-700 rounded-xl shrink-0 group-hover:bg-[#19376D]/10 group-hover:text-[#19376D] transition duration-200">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h4 className="font-bold text-slate-900 group-hover:text-primary transition truncate">{event.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 bg-slate-100/60 px-1.5 py-0.5 rounded-md text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(event.startDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100/60 px-1.5 py-0.5 rounded-md text-slate-500 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{event.location?.name || event.city}</span>
                    </span>
                    <Badge className="bg-slate-100 hover:bg-slate-150 text-slate-600 font-bold px-2 py-0.5 capitalize text-[9px] border border-slate-200 rounded-md shrink-0">
                      {event.eventType?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                <span className="text-xs font-semibold text-slate-500">
                  {event.participantCount || 0} enthusiasts registered
                </span>
                <Button size="sm" variant="outline" className="rounded-xl font-bold text-xs h-9 bg-white cursor-pointer hover:bg-slate-50">
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
    <Card className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-slate-100">
        <CardTitle className="text-base font-extrabold text-slate-900">Achievements & Milestones</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-medium">Celebrating club awards, ride milestones, and credentials</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {loadingAchievements ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground mt-2 animate-pulse font-semibold">Loading awards...</p>
          </div>
        ) : clubAchievements.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
            <Trophy className="size-8 text-slate-350 mx-auto mb-2 animate-bounce" />
            <p className="text-sm text-slate-500 font-medium">No achievements celebrations posted yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {clubAchievements.map((ach) => {
              const Icon = ach.awardType === "car" ? Car : ach.awardType === "bike" ? Bike : Trophy;
              return (
                <div
                  key={ach.id}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-slate-150 hover:border-slate-250 transition bg-slate-50/20"
                >
                  <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900 truncate">{ach.title}</p>
                      {ach.date && (
                        <span className="text-[9px] font-bold text-slate-400 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          {new Date(ach.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderGallery = () => {
    const galleryList = dbClub?.gallery || [];
    return (
      <Card className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-slate-100">
          <CardTitle className="text-base font-extrabold text-slate-900">Club Moments</CardTitle>
          <CardDescription className="text-xs text-slate-400 font-medium">Pictures and moments captured on runs and meets (limit 10)</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {galleryList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
              <Calendar className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">No moments uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {galleryList.map((url: string, idx: number) => (
                <div 
                  key={idx} 
                  className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200/60 bg-white shadow-xs group cursor-pointer animate-in fade-in duration-200" 
                  onClick={() => window.open(url, "_blank")}
                >
                  <img
                    src={url}
                    alt={`Club Moment ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 🔹 Hero Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 bg-slate-900">
        <Image
          src={club.image || "/images/category/offroad.webp"}
          alt={club.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex items-center gap-4 text-white">
            {dbClub?.logoUrl ? (
              <img
                src={dbClub.logoUrl}
                alt={`${club.name} Logo`}
                className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 bg-slate-950/40 backdrop-blur-md shadow-xl shrink-0"
              />
            ) : (
              <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 border-white/20 shadow-xl shrink-0">
                {club.name.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "AC"}
              </div>
            )}
            <div className="space-y-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/10 backdrop-blur-md text-white">
                {club.categoryType.replace("-", " ")}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-xs">
                {club.name}
              </h1>
              <p className="text-xs sm:text-sm opacity-90 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-550 shrink-0" />
                {club.location}
              </p>
            </div>
          </div>

          {/* Action buttons embedded inside Hero right-corner */}
          <div className="shrink-0 max-w-xs w-full sm:w-auto">
            {loadingRequest ? (
              <Button disabled className="w-full bg-white/15 text-white/50 border border-white/5 backdrop-blur-md rounded-xl font-bold h-11">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Checking Status...
              </Button>
            ) : myRequest ? (
              <div className="flex flex-col gap-2">
                {myRequest.status === "pending" && (
                  <Button disabled className="w-full bg-amber-505 text-white font-bold cursor-not-allowed px-6 h-11 rounded-xl shadow-md border border-amber-400/20">
                    Request Pending Approval
                  </Button>
                )}
                {myRequest.status === "approved" && (
                  <Button
                    onClick={handleLeaveClub}
                    disabled={submitting}
                    variant="outline"
                    className="w-full border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-600 hover:text-white font-bold h-11 px-6 rounded-xl transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Leaving...
                      </>
                    ) : (
                      "Leave Club"
                    )}
                  </Button>
                )}
                {myRequest.status === "rejected" && (
                  <Button disabled className="w-full bg-red-600/80 text-white font-bold cursor-not-allowed px-6 h-11 rounded-xl">
                    Request Rejected
                  </Button>
                )}
              </div>
            ) : user?.profileData?.clubId === id ? (
              <Button
                onClick={handleLeaveClub}
                disabled={submitting}
                variant="outline"
                className="w-full border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-600 hover:text-white font-bold h-11 px-6 rounded-xl transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Leaving...
                  </>
                ) : (
                  "Leave Club"
                )}
              </Button>
            ) : user?.profileData?.clubId != null ? (
              <Button disabled className="w-full bg-white/10 text-white/50 border border-white/5 backdrop-blur-md rounded-xl font-bold h-11 cursor-not-allowed">
                Already Member of Another Club
              </Button>
            ) : dbClub?.ownerUid === user?.userId ? (
              <Button disabled className="w-full bg-white/10 text-white/50 border border-white/5 backdrop-blur-md rounded-xl font-bold h-11 cursor-not-allowed">
                You own this club
              </Button>
            ) : (
              <Button
                onClick={handleJoinRequest}
                disabled={submitting}
                className="w-full bg-white hover:bg-slate-50 text-[#0B2447] font-bold shadow-lg transition-all h-11 px-6 rounded-xl cursor-pointer"
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
        </div>
      </div>

      {/* Grid Layout: Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Details & Tabs Content (Main column) */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-slate-100/80 p-1 rounded-xl mb-6">
              <TabsTrigger value="members" className="rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer">Members</TabsTrigger>
              <TabsTrigger value="events" className="rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer">Events</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer">Awards</TabsTrigger>
              <TabsTrigger value="gallery" className="rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="focus-visible:outline-none">{renderMembers()}</TabsContent>
            <TabsContent value="events" className="focus-visible:outline-none">{renderEvents()}</TabsContent>
            <TabsContent value="achievements" className="focus-visible:outline-none">{renderAchievements()}</TabsContent>
            <TabsContent value="gallery" className="focus-visible:outline-none">{renderGallery()}</TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Statistics, Overview Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <Users className="size-6 text-[#19376D] mb-1.5 shrink-0" />
              <span className="text-2xl font-black text-slate-900 leading-none">{club.memberCount}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Members</span>
            </div>
            
            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <CalendarDays className="size-6 text-emerald-600 mb-1.5 shrink-0" />
              <span className="text-2xl font-black text-slate-900 leading-none">{clubEvents.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Events</span>
            </div>
          </div>

          {/* Overview Info Card */}
          <Card className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
              <CardTitle className="text-md font-bold text-slate-900 flex items-center gap-2">
                <Info className="size-4.5 text-[#0B2447]" />
                Club Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-6 space-y-5">
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <Badge variant="outline" className="flex items-center gap-1.5 border-slate-200 bg-slate-50 text-slate-600 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> {club.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1.5 border-slate-200 bg-slate-50 text-slate-600 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Owner: {club.createdBy.split("@")[0]}
                  </Badge>
                </div>
                <Separator className="bg-slate-100" />
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {club.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🔹 Event Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
              Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-5 overflow-y-auto pr-1 py-3 max-h-[70vh]">
              {selectedEvent.coverImage ? (
                <div className="w-full h-52 relative rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <img
                    src={selectedEvent.coverImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-slate-900/80 text-white backdrop-blur-sm capitalize text-xs px-2.5 py-1 border border-white/10 font-semibold rounded-lg shadow-sm">
                      {selectedEvent.eventType?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="w-full h-52 bg-slate-50 rounded-xl flex items-center justify-center relative border border-dashed border-slate-200">
                  <CalendarDays className="h-12 w-12 text-slate-300" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-slate-900/80 text-white backdrop-blur-sm capitalize text-xs px-2.5 py-1 border border-white/10 font-semibold rounded-lg shadow-sm">
                      {selectedEvent.eventType?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">{selectedEvent.title}</h3>
                
                {/* Event Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date & Time</p>
                      <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">
                        {new Date(selectedEvent.startDateTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                      <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">
                        {selectedEvent.location?.name || selectedEvent.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl sm:col-span-2">
                    <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendance</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {selectedEvent.participantCount || 0} Enthusiasts Joined {selectedEvent.maxParticipants ? `(Limit: ${selectedEvent.maxParticipants})` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About the Event</h5>
                <p className="text-sm text-slate-655 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 font-medium">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Organizer Card */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organized By</h5>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/40 shadow-xs">
                  <div className="flex items-center gap-3">
                    {dbClub?.logoUrl ? (
                      <img
                        src={dbClub.logoUrl}
                        alt={dbClub.clubName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-md font-bold border shrink-0">
                        {club.name?.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "C"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{club.name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-655" />
                        Verified Automotive Club
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button variant="ghost" className="rounded-xl text-slate-500 hover:text-slate-700 font-semibold cursor-pointer" type="button" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {isRegistered ? (
                  <Button
                    onClick={handleLeaveEvent}
                    disabled={submittingJoin}
                    className="bg-red-50 hover:bg-red-100 text-red-655 hover:text-red-750 font-bold border border-red-200/50 rounded-xl px-5 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {submittingJoin ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
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
                    className="bg-[#0B2447] hover:bg-[#19376D] text-white font-semibold rounded-xl px-6 flex items-center gap-1.5 transition-all cursor-pointer"
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
