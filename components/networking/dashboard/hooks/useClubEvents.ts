"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot, doc, runTransaction } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { readImagePreview, uploadImage } from "@/ulity/imageUpload";

export type EventFormValues = {
  title: string;
  description: string;
  eventType: string;
  status: string;
  city: string;
  locationName: string;
  locationCity: string;
  latitude: string;
  longitude: string;
  startDateTime: string;
  endDateTime: string;
  maxParticipants: string;
  visibility: string;
  coverImage?: string;
};

export function useClubEvents(
  club: any,
  user: any
) {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  // Participants state
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [participantsList, setParticipantsList] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  // Event cover image state
  const eventCoverInputRef = useRef<HTMLInputElement>(null);
  const [eventCoverUploading, setEventCoverUploading] = useState(false);
  const [eventCoverPreview, setEventCoverPreview] = useState<string | null>(null);

  const eventForm = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      eventType: "ride",
      status: "upcoming",
      city: "",
      locationName: "",
      locationCity: "",
      latitude: "",
      longitude: "",
      startDateTime: "",
      endDateTime: "",
      maxParticipants: "",
      visibility: "public",
      coverImage: "",
    }
  });

  // Fetch events
  useEffect(() => {
    if (!club?.id) return;

    setLoadingEvents(true);
    const q = query(
      collection(db, "events"),
      where("clubId", "==", club.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventsList(list);
      setLoadingEvents(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoadingEvents(false);
    });

    return () => unsubscribe();
  }, [club?.id]);

  // Fetch participants
  useEffect(() => {
    if (!selectedEvent?.id || !isParticipantsModalOpen) return;

    setLoadingParticipants(true);
    const q = query(
      collection(db, "eventParticipants"),
      where("eventId", "==", selectedEvent.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipantsList(list);
      setLoadingParticipants(false);
    }, (error) => {
      console.error("Error fetching participants:", error);
      setLoadingParticipants(false);
    });

    return () => unsubscribe();
  }, [selectedEvent?.id, isParticipantsModalOpen]);

  // Reset form when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      eventForm.reset({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        eventType: editingEvent.eventType || "ride",
        status: editingEvent.status || "upcoming",
        city: editingEvent.city || "",
        locationName: editingEvent.location?.name || "",
        locationCity: editingEvent.location?.city || "",
        latitude: editingEvent.location?.latitude?.toString() || "",
        longitude: editingEvent.location?.longitude?.toString() || "",
        startDateTime: editingEvent.startDateTime || "",
        endDateTime: editingEvent.endDateTime || "",
        maxParticipants: editingEvent.maxParticipants?.toString() || "",
        visibility: editingEvent.visibility || "public",
        coverImage: editingEvent.coverImage || "",
      });
      setEventCoverPreview(editingEvent.coverImage || null);
    } else {
      eventForm.reset({
        title: "",
        description: "",
        eventType: "ride",
        status: "upcoming",
        city: club?.city || "",
        locationName: "",
        locationCity: club?.city || "",
        latitude: "",
        longitude: "",
        startDateTime: "",
        endDateTime: "",
        maxParticipants: "",
        visibility: "public",
        coverImage: "",
      });
      setEventCoverPreview(null);
    }
  }, [editingEvent, club, eventForm]);

  const handleEventCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;
    setEventCoverUploading(true);
    try {
      const { url } = await uploadImage(file, {
        ownerId: user.userId,
        folder: "eventCover",
        basePath: "events",
      });
      const preview = await readImagePreview(file);
      setEventCoverPreview(preview);
      eventForm.setValue("coverImage", url);
      toast.success("Event cover image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Cover image upload failed");
    } finally {
      setEventCoverUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveEvent = eventForm.handleSubmit(async (values) => {
    if (!club?.id || !user?.userId) return;
    setSavingEvent(true);
    try {
      const isEdit = !!editingEvent;
      const eventRef = isEdit ? doc(db, "events", editingEvent.id) : doc(collection(db, "events"));
      const eventId = eventRef.id;
      const clubRef = doc(db, "networkingStores", club.id);

      const eventData = {
        id: eventId,
        title: values.title.trim(),
        description: values.description.trim(),
        eventType: values.eventType,
        status: values.status || "upcoming",
        clubId: club.id,
        clubName: club.clubName || "Unnamed Club",
        clubLogo: club.logoUrl || "",
        organizerUid: user.userId,
        city: values.city.trim(),
        coverImage: values.coverImage || "",
        location: {
          name: values.locationName.trim(),
          city: values.locationCity.trim(),
          latitude: values.latitude ? parseFloat(values.latitude) : null,
          longitude: values.longitude ? parseFloat(values.longitude) : null,
        },
        startDateTime: values.startDateTime,
        endDateTime: values.endDateTime,
        maxParticipants: values.maxParticipants ? parseInt(values.maxParticipants) : null,
        participantCount: isEdit ? (editingEvent.participantCount || 0) : 0,
        visibility: values.visibility || "public",
        updatedAt: new Date().toISOString(),
        createdAt: isEdit ? (editingEvent.createdAt || new Date().toISOString()) : new Date().toISOString(),
      };

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }

        if (isEdit) {
          transaction.update(eventRef, eventData);
        } else {
          transaction.set(eventRef, eventData);
          const clubData = clubDoc.data();
          const currentUpcomingCount = clubData.upcomingEventsCount || 0;
          transaction.update(clubRef, {
            upcomingEventsCount: currentUpcomingCount + 1,
            latestEventId: eventId,
          });
        }
      });

      toast.success(isEdit ? "Event Updated" : "Event Created", {
        description: isEdit ? "Your event has been updated successfully." : "Your event has been created successfully."
      });
      
      setIsEventModalOpen(false);
      setEditingEvent(null);
    } catch (e: any) {
      console.error("Error saving event", e);
      toast.error(e.message || "Failed to save event");
    } finally {
      setSavingEvent(false);
    }
  });

  const handleDeleteEvent = async (eventId: string) => {
    if (!club?.id) return;
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    try {
      const eventRef = doc(db, "events", eventId);
      const clubRef = doc(db, "networkingStores", club.id);

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }
        
        const clubData = clubDoc.data();
        const upcomingCount = clubData.upcomingEventsCount || 0;
        
        transaction.delete(eventRef);
        transaction.update(clubRef, {
          upcomingEventsCount: Math.max(0, upcomingCount - 1)
        });
      });

      toast.success("Event Deleted", {
        description: "Event has been deleted successfully."
      });
    } catch (e: any) {
      console.error("Error deleting event", e);
      toast.error(e.message || "Failed to delete event");
    }
  };

  return {
    eventsList,
    loadingEvents,
    isEventModalOpen,
    setIsEventModalOpen,
    editingEvent,
    setEditingEvent,
    savingEvent,
    handleSaveEvent,
    handleDeleteEvent,
    eventForm,
    eventCoverUploading,
    eventCoverPreview,
    eventCoverInputRef,
    handleEventCoverUpload,
    selectedEvent,
    setSelectedEvent,
    participantsList,
    loadingParticipants,
    isParticipantsModalOpen,
    setIsParticipantsModalOpen,
  };
}
