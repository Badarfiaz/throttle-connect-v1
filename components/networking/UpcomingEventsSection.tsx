"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, doc, runTransaction, onSnapshot, query, where, limit } from "firebase/firestore";
import { useAppSelector } from "@/app/redux/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Loader2, ShieldCheck, ChevronRight } from "lucide-react";
import Title from "@/components/shared/Title";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UpcomingEventsSection({ displayLimit = 20 }: { displayLimit?: number } = {}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [submittingJoin, setSubmittingJoin] = useState(false);

  // Fetch upcoming events
  useEffect(() => {
    const q = query(
      collection(db, "events"),
      where("status", "==", "upcoming"),
      limit(40)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      list.sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));
      setUpcomingEvents(list.slice(0, displayLimit));
      setLoadingEvents(false);
    }, (error) => {
      console.error("Error fetching upcoming events:", error);
      setLoadingEvents(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleOpenEventDetails = (event: any) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

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

  return (
    <div className="bg-slate-50/50 py-12 xs:py-16 px-4 xs:px-6 border-y border-slate-100 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-6 xs:space-y-8">
        <Title
          title="Upcoming Events"
          description="Join breakfast runs, track days, meetups, and off-road adventures with other enthusiasts."
        />

        {loadingEvents ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground ml-2 animate-pulse font-medium">Loading events...</span>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.startDateTime);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleDateString([], { month: "short" }).toUpperCase();
              const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <Card
                  key={event.id}
                  className="border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full bg-white rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenEventDetails(event)}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      {/* Banner Image Section */}
                      <div className="w-full h-44 relative overflow-hidden bg-slate-50 border-b border-slate-100">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <Calendar className="h-10 w-10 text-slate-300 group-hover:scale-110 transition duration-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        
                        {/* Premium Date Overlay Badge */}
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center text-center shadow-md border border-slate-100 min-w-[48px]">
                          <span className="text-[10px] font-bold text-red-500 tracking-wider leading-none uppercase">{month}</span>
                          <span className="text-lg font-extrabold text-slate-900 leading-none mt-1">{day}</span>
                        </div>

                        {/* Event Category Tag */}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-slate-900/80 text-white backdrop-blur-sm capitalize text-[10px] py-1 px-2.5 font-semibold border border-white/15 rounded-lg shadow-sm">
                            {event.eventType?.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-semibold gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formattedTime}
                          </span>
                          <span className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[120px]">{event.city}</span>
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors duration-250 line-clamp-1 leading-snug">
                          {event.title}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Organization Banner + CTA Button */}
                    <div className="px-5 pb-5">
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {event.clubLogo ? (
                            <img
                              src={event.clubLogo}
                              alt={event.clubName}
                              className="w-6 h-6 rounded-md object-cover border border-slate-150 shrink-0"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {event.clubName?.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "C"}
                            </div>
                          )}
                          <span className="text-xs font-semibold text-slate-700 truncate">{event.clubName}</span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 rounded-lg text-xs font-bold text-primary bg-primary/5 hover:bg-primary hover:text-white border-none flex items-center gap-1 transition-all duration-300 shrink-0 cursor-pointer"
                        >
                          Details
                          <ChevronRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Calendar className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <p className="text-slate-500 text-sm font-medium">No upcoming events scheduled at the moment.</p>
          </div>
        )}
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
                  <Calendar className="h-12 w-12 text-slate-300" />
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
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/60 font-medium">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Organizer Card */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organized By</h5>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/40 shadow-xs">
                  <div className="flex items-center gap-3">
                    {selectedEvent.clubLogo ? (
                      <img
                        src={selectedEvent.clubLogo}
                        alt={selectedEvent.clubName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-md font-bold border shrink-0">
                        {selectedEvent.clubName?.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "C"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedEvent.clubName}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Verified Automotive Club
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" type="button" className="rounded-lg text-xs font-semibold h-8 bg-white" onClick={() => router.push(`/networking/Club-Profile/${selectedEvent.clubId}`)}>
                    View Club
                  </Button>
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
                    className="bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-750 font-bold border border-red-200/50 rounded-xl px-5 flex items-center gap-1.5 cursor-pointer transition-colors"
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
    </div>
  );
}
