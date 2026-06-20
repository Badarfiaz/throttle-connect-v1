"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, doc, runTransaction, onSnapshot, query, where, limit } from "firebase/firestore";
import { useAppSelector } from "@/app/redux/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Loader2, ShieldCheck } from "lucide-react";
import Title from "@/components/shared/Title";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UpcomingEventsSection() {
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
      setUpcomingEvents(list.slice(0, 20));
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
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border border-slate-200/80 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between h-full bg-white rounded-xl overflow-hidden cursor-pointer group" onClick={() => handleOpenEventDetails(event)}>
                <div>
                  {event.coverImage ? (
                    <div className="w-full h-44 relative overflow-hidden">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-slate-900/80 text-white backdrop-blur-xs capitalize text-[10px] py-1 px-2.5 font-medium border border-white/15">
                          {event.eventType?.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-44 bg-slate-50 flex items-center justify-center relative">
                      <Calendar className="h-10 w-10 text-slate-300 group-hover:scale-110 transition duration-500" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-slate-900/80 text-white backdrop-blur-xs capitalize text-[10px] py-1 px-2.5 font-medium border border-white/15">
                          {event.eventType?.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{event.city}</span>
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition line-clamp-1">{event.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{event.description}</p>
                    
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {event.clubLogo ? (
                          <img
                            src={event.clubLogo}
                            alt={event.clubName}
                            className="w-6 h-6 rounded-md object-cover border shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {event.clubName?.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "C"}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-700 truncate">{event.clubName}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400 shrink-0">
                        {event.participantCount || 0} registered
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-slate-500 text-sm">No upcoming events scheduled at the moment.</p>
          </div>
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
                  <Calendar className="h-12 w-12 text-slate-300" />
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
                    {selectedEvent.clubLogo ? (
                      <img
                        src={selectedEvent.clubLogo}
                        alt={selectedEvent.clubName}
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-lg font-bold border">
                        {selectedEvent.clubName?.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("") || "C"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedEvent.clubName}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        Verified Networking Club
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" type="button" onClick={() => window.location.href = `/networking/Club-Profile/${selectedEvent.clubId}`}>
                    View Club
                  </Button>
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
    </div>
  );
}
