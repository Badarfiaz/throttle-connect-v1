"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, runTransaction, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageSquare, 
  Calendar, 
  Plus,
  Compass,
  Edit2,
  Check,
  X,
  Users,
  ShieldCheck,
  Trash2,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNetworkingStore } from "@/hooks/useNetworkingStore";
import { setNetworkingStore } from "@/app/redux/features/authSlice";
import { readImagePreview, uploadImage } from "@/ulity/imageUpload";

type DashboardTab = "profile" | "members" | "events";

type ProfileFormValues = {
  clubName: string;
  clubType: string;
  otherClubType: string;
  description: string;
  city: string;
  phone: string;
  email: string;
  contactMethod: "whatsapp" | "call" | "email";
  socialPlatforms: {
    website: string;
    linkedin: string;
    instagram: string;
    other: string;
  };
  logoUrl?: string;
  bannerUrl?: string;
};

type EventFormValues = {
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

const networkingNavItems = [
  {
    id: "profile",
    label: "Club Profile",
    description: "Club details & settings",
  },
  {
    id: "members",
    label: "Members",
    description: "Manage club members",
    badge: "8",
  },
  {
    id: "events",
    label: "Club Events",
    description: "Organize runs & meets",
    badge: "3",
  },
];

export default function NetworkingDashboardContainer() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  const user = useAppSelector((state) => state.auth.user);
  const club = user?.networking;
  const dispatch = useAppDispatch();

  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [actioningRequests, setActioningRequests] = useState<string[]>([]);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  // Events state
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

  useEffect(() => {
    if (!club?.id) return;

    setLoadingRequests(true);
    const requestsQuery = query(
      collection(db, "membershipRequests"),
      where("clubId", "==", club.id),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(requestsQuery, async (snapshot) => {
      const requestsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch user details for each request
      const enrichedRequests = await Promise.all(
        requestsList.map(async (req: any) => {
          try {
            const userDocRef = doc(db, "users", req.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const uData = userDocSnap.data();
              return {
                ...req,
                user: {
                  name: uData.name || "Unknown User",
                  phone: uData.phone || "Not specified",
                  profileImage: uData.profileImage || "",
                }
              };
            }
          } catch (e) {
            console.error("Error fetching request user details", e);
          }
          return {
            ...req,
            user: {
              name: "Unknown User",
              phone: "Not specified",
              profileImage: "",
            }
          };
        })
      );

      setPendingRequests(enrichedRequests);
      setLoadingRequests(false);
    }, (error) => {
      console.error("Error in pending requests subscription:", error);
      setLoadingRequests(false);
    });

    return () => unsubscribe();
  }, [club?.id]);

  useEffect(() => {
    if (!club?.id) return;

    setLoadingMembers(true);
    const membersQuery = query(
      collection(db, "users"),
      where("clubId", "==", club.id)
    );

    const unsubscribe = onSnapshot(membersQuery, (snapshot) => {
      const membersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveMembers(membersList);
      setLoadingMembers(false);
    }, (error) => {
      console.error("Error in active members subscription:", error);
      setLoadingMembers(false);
    });

    return () => unsubscribe();
  }, [club?.id]);

  const handleApprove = async (requestId: string, requesterId: string) => {
    if (!club?.id || !user?.userId) return;
    setActioningRequests((prev) => [...prev, requestId]);
    try {
      const requestRef = doc(db, "membershipRequests", requestId);
      const userRef = doc(db, "users", requesterId);
      const clubRef = doc(db, "networkingStores", club.id);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const clubDoc = await transaction.get(clubRef);

        if (!userDoc.exists()) {
          throw new Error("Requester user document does not exist.");
        }
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }

        const userData = userDoc.data();
        const clubData = clubDoc.data();

        // Rule 2: Only owner can approve
        if (clubData.ownerUid !== user.userId) {
          throw new Error("Unauthorized: Only the club owner can approve requests.");
        }

        // Rule 1: One Club Only
        if (userData.clubId != null) {
          // Reject request automatically
          transaction.update(requestRef, { status: "rejected" });
          transaction.update(userRef, { membershipStatus: "rejected" });
          
          // Decrement pending requests count
          const pendingCount = clubData.pendingRequestsCount || 0;
          transaction.update(clubRef, {
            pendingRequestsCount: Math.max(0, pendingCount - 1)
          });
          
          throw new Error("User already belongs to another club. Request rejected automatically.");
        }

        // Rule 3: Approve request
        transaction.update(userRef, {
          clubId: club.id,
          membershipStatus: "active"
        });

        const currentMemberCount = clubData.memberCount || 0;
        const pendingCount = clubData.pendingRequestsCount || 0;
        transaction.update(clubRef, {
          memberCount: currentMemberCount + 1,
          pendingRequestsCount: Math.max(0, pendingCount - 1)
        });

        transaction.update(requestRef, {
          status: "approved"
        });
      });

      toast.success("Request Approved", {
        description: "User is now a member of your club."
      });
    } catch (e: any) {
      console.error("Error approving request", e);
      toast.error(e.message || "Failed to approve request");
    } finally {
      setActioningRequests((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleReject = async (requestId: string, requesterId: string) => {
    if (!club?.id || !user?.userId) return;
    setActioningRequests((prev) => [...prev, requestId]);
    try {
      const requestRef = doc(db, "membershipRequests", requestId);
      const userRef = doc(db, "users", requesterId);
      const clubRef = doc(db, "networkingStores", club.id);

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }

        const clubData = clubDoc.data();

        // Rule 2: Only owner can approve/reject
        if (clubData.ownerUid !== user.userId) {
          throw new Error("Unauthorized: Only the club owner can reject requests.");
        }

        // Reject request
        transaction.update(requestRef, { status: "rejected" });
        transaction.update(userRef, { membershipStatus: "rejected" });

        // Decrement pending requests count
        const pendingCount = clubData.pendingRequestsCount || 0;
        transaction.update(clubRef, {
          pendingRequestsCount: Math.max(0, pendingCount - 1)
        });
      });

      toast.success("Request Rejected", {
        description: "Join request has been rejected."
      });
    } catch (e: any) {
      console.error("Error rejecting request", e);
      toast.error(e.message || "Failed to reject request");
    } finally {
      setActioningRequests((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!club?.id || !user?.userId) return;
    setRemovingIds((prev) => [...prev, memberId]);
    try {
      const userRef = doc(db, "users", memberId);
      const clubRef = doc(db, "networkingStores", club.id);

      // Query request document to mark it as rejected
      const q = query(
        collection(db, "membershipRequests"),
        where("userId", "==", memberId),
        where("clubId", "==", club.id)
      );
      const querySnap = await getDocs(q);

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        const userDoc = await transaction.get(userRef);

        if (!clubDoc.exists() || !userDoc.exists()) {
          throw new Error("Club or member document does not exist.");
        }

        const clubData = clubDoc.data();
        const userData = userDoc.data();

        // Rule 2: Only owner can remove
        if (clubData.ownerUid !== user.userId) {
          throw new Error("Unauthorized: Only the club owner can remove members.");
        }

        // Update member user doc to rejected and remove from club
        transaction.update(userRef, {
          clubId: null,
          membershipStatus: "rejected",
        });

        // Decrement club memberCount
        const currentMemberCount = clubData.memberCount || 0;
        transaction.update(clubRef, {
          memberCount: Math.max(0, currentMemberCount - 1),
        });

        // Update corresponding request(s) status to rejected
        querySnap.forEach((doc) => {
          transaction.update(doc.ref, {
            status: "rejected"
          });
        });
      });

      toast.success("Member Removed", {
        description: "Rider has been removed from the club."
      });
    } catch (e: any) {
      console.error("Error removing member", e);
      toast.error(e.message || "Failed to remove member");
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== memberId));
    }
  };

  // Events and participants fetching effects
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

  
  const { updateNetworkingStore, updating, updateError } = useNetworkingStore();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;
    setLogoUploading(true);
    try {
      const { url } = await uploadImage(file, {
        ownerId: user.userId,
        folder: "logo",
        basePath: "networkingStores",
      });
      const preview = await readImagePreview(file);
      setLogoPreview(preview);
      form.setValue("logoUrl", url);
      toast.success("Logo uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Logo upload failed");
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) return;
    setBannerUploading(true);
    try {
      const { url } = await uploadImage(file, {
        ownerId: user.userId,
        folder: "banner",
        basePath: "networkingStores",
      });
      const preview = await readImagePreview(file);
      setBannerPreview(preview);
      form.setValue("bannerUrl", url);
      toast.success("Banner uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Banner upload failed");
    } finally {
      setBannerUploading(false);
      e.target.value = "";
    }
  };

  const defaultValues = useMemo<ProfileFormValues>(() => {
    return {
      clubName: club?.clubName ?? "",
      clubType: club?.clubType ?? "bike",
      otherClubType: club?.otherClubType ?? "",
      description: club?.description ?? "",
      city: club?.city ?? "",
      phone: club?.phone ?? "",
      email: club?.email ?? user?.email ?? "",
      contactMethod: (club?.contactMethod as any) ?? "email",
      socialPlatforms: {
        website: club?.socialPlatforms?.website ?? "",
        linkedin: club?.socialPlatforms?.linkedin ?? "",
        instagram: club?.socialPlatforms?.instagram ?? "",
        other: club?.socialPlatforms?.other ?? "",
      },
      logoUrl: club?.logoUrl ?? "",
      bannerUrl: club?.bannerUrl ?? "",
    };
  }, [club, user]);

  const form = useForm<ProfileFormValues>({ defaultValues });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading user session...
        </p>
      </div>
    );
  }

  const clubName = club?.clubName ?? "My Automotive Club";
  const clubType = club?.clubType ?? "General Enthusiasts";
  const city = club?.city ?? "Not specified";
  
  const initials = clubName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "AC";

  const getClubTypeLabel = (type: string) => {
    switch (type) {
      case "bike": return "Bike Club";
      case "car": return "Car Club";
      case "other": return club?.otherClubType || "Other Club";
      default: return type.replace("-", " ");
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    const clubId = club?.id || user.userId;
    if (!clubId) {
      toast.error("User ID Not Found", {
        description: "Please log in again.",
      });
      return;
    }

    const input = {
      id: clubId,
      clubName: values.clubName?.trim() ?? "",
      clubType: values.clubType ?? "bike",
      otherClubType: values.clubType === "other" ? values.otherClubType?.trim() : "",
      description: values.description?.trim() ?? "",
      city: values.city?.trim() ?? "",
      phone: values.phone?.trim() ?? "",
      email: values.email?.trim() ?? "",
      contactMethod: values.contactMethod ?? "email",
      socialPlatforms: {
        website: values.socialPlatforms?.website?.trim() ?? "",
        linkedin: values.socialPlatforms?.linkedin?.trim() ?? "",
        instagram: values.socialPlatforms?.instagram?.trim() ?? "",
        other: values.socialPlatforms?.other?.trim() ?? "",
      },
      logoUrl: values.logoUrl ?? "",
      bannerUrl: values.bannerUrl ?? "",
      completed: true,
      ownerUid: user.userId,
      onBoardType: "networking",
      pageType: "networking",
    };
console.log('input', input)
    try {
      const updated = await updateNetworkingStore(clubId, input);
      if (updated) {
        dispatch(setNetworkingStore(updated));
        setLogoPreview(null);
        setBannerPreview(null);
        toast.success("Profile Updated", {
          description: "Your club profile details have been saved successfully.",
        });
        setIsEditing(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error("Update Failed", { description: msg });
    }
  });

  const handleCancel = () => {
    form.reset(defaultValues);
    setLogoPreview(null);
    setBannerPreview(null);
    setIsEditing(false);
  };

  // Dummy member data
  const dummyMembers = [
    { name: "Ali Khan", role: "Club President", joined: "Jan 2026", avatar: "AK", active: true },
    { name: "Zainab Shah", role: "Co-Founder", joined: "Jan 2026", avatar: "ZS", active: true },
    { name: "Hamza Malik", role: "Event Coordinator", joined: "Feb 2026", avatar: "HM", active: true },
    { name: "Bilal Ahmed", role: "Ride Lead", joined: "Feb 2026", avatar: "BA", active: true },
    { name: "Sana Yusuf", role: "Marketing Lead", joined: "Mar 2026", avatar: "SY", active: true },
    { name: "Raza Ali", role: "Member (Honda Civic)", joined: "Apr 2026", avatar: "RA", active: false },
    { name: "Fatima Noor", role: "Member (Vespa)", joined: "May 2026", avatar: "FN", active: false },
    { name: "Osman Tariq", role: "Member (Ninja 650)", joined: "Jun 2026", avatar: "OT", active: false },
  ];

  // Dummy events data
  const dummyEvents = [
    {
      title: "Sunday Morning Breakfast Run",
      date: "Sunday, June 28, 2026",
      time: "06:30 AM",
      location: "McDonald's M2 Motorway, Lahore",
      type: "Ride/Drive",
      status: "Upcoming",
    },
    {
      title: "Monsoon Track Meetup",
      date: "Saturday, July 11, 2026",
      time: "04:00 PM",
      location: "Gaddafi Stadium Parking, Lahore",
      type: "Meetup",
      status: "Upcoming",
    },
    {
      title: "Car & Bike Show 2026",
      date: "Sunday, May 17, 2026",
      time: "10:00 AM",
      location: "Expo Center, Lahore",
      type: "Exhibition",
      status: "Past",
    },
  ];

  const clubTypeWatch = form.watch("clubType");

  const navItems = useMemo(() => {
    return [
      {
        id: "profile",
        label: "Club Profile",
        description: "Club details & settings",
      },
      {
        id: "members",
        label: "Members",
        description: "Manage club members",
        badge: pendingRequests.length > 0 ? String(pendingRequests.length) : undefined,
      },
      {
        id: "events",
        label: "Club Events",
        description: "Organize runs & meets",
        badge: eventsList.filter(e => e.status === "upcoming").length > 0 ? String(eventsList.filter(e => e.status === "upcoming").length) : undefined,
      },
    ];
  }, [pendingRequests.length, eventsList]);

  return (
    <DashboardContainer
      title={clubName}
      subtitle={`Manage your club profile, coordinate meets, and build your auto community.`}
      navItems={navItems}
      activeId={activeTab}
      onNavigate={(id) => {
        setActiveTab(id as DashboardTab);
        setIsEditing(false);
      }}
      actions={
        <div className="flex items-center gap-2">
          {activeTab === "profile" && (
            <>
              {isEditing ? (
                <>
                  <Button size="sm" variant="ghost" onClick={handleCancel} disabled={updating}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white" onClick={handleSave} disabled={updating}>
                    <Check className="h-4 w-4 mr-1" /> {updating ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit Profile
                </Button>
              )}
            </>
          )}
          <Badge variant="secondary" className="bg-[#19376D]/10 text-[#19376D] font-medium border border-[#19376D]/20">
            Club Active
          </Badge>
          <Button size="sm" variant="outline" onClick={() => window.location.href = `/networking/Club-Profile/${club?.id ?? user?.userId}`}>
            View Club Page
          </Button>
        </div>
      }
    >
      {activeTab === "profile" && (
        isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Identity Card */}
              <Card className="border border-slate-200/80 shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                    <Compass className="h-5 w-5 text-[#19376D]" />
                    Club Identity
                  </CardTitle>
                  <CardDescription>Configure the core details of your club</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Name <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="e.g. Cityline Sedan Society"
                      {...form.register("clubName", { required: "Club Name is required" })}
                      className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                    />
                    {form.formState.errors.clubName && (
                      <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.clubName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Type <span className="text-red-500">*</span></label>
                    <Select
                      value={form.watch("clubType")}
                      onValueChange={(val) => form.setValue("clubType", val, { shouldValidate: true })}
                    >
                      <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                        <SelectValue placeholder="Select club type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">🏍 Bike Club</SelectItem>
                        <SelectItem value="car">🚗 Car Club</SelectItem>
                        <SelectItem value="other">🌟 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {clubTypeWatch === "other" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specify Club Type <span className="text-red-500">*</span></label>
                      <Input
                        placeholder="e.g. Offroad SUV Club"
                        {...form.register("otherClubType", { required: "Please specify the club type" })}
                        className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                      />
                      {form.formState.errors.otherClubType && (
                        <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.otherClubType.message}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Description</label>
                    <Textarea
                      placeholder="Describe what makes your club unique..."
                      rows={4}
                      {...form.register("description")}
                      className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card className="border border-slate-200/80 shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                    <MessageSquare className="h-5 w-5 text-[#19376D]" />
                    Contact & Location Details
                  </CardTitle>
                  <CardDescription>Help potential members find and reach your club</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City / Location <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="e.g. Islamabad, PK"
                      {...form.register("city", { required: "City is required" })}
                      className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                    />
                    {form.formState.errors.city && (
                      <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                    <Input
                      type="tel"
                      placeholder="e.g. +92 300 1234567"
                      {...form.register("phone", { required: "Phone number is required" })}
                      className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                    <Input
                      type="email"
                      placeholder="e.g. contact@myclub.com"
                      {...form.register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500 font-medium mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Contact Method</label>
                    <Select
                      value={form.watch("contactMethod")}
                      onValueChange={(val) => form.setValue("contactMethod", val as any, { shouldValidate: true })}
                    >
                      <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Club Branding Card */}
            <Card className="border border-slate-200/80 shadow-xs bg-white mt-6">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                  <Compass className="h-5 w-5 text-[#19376D]" />
                  Club Branding
                </CardTitle>
                <CardDescription>Upload a custom logo and banner for your club profile</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Logo</label>
                  <div className="flex items-center gap-4 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    {logoPreview || form.watch("logoUrl") ? (
                      <img
                        src={logoPreview || form.watch("logoUrl")}
                        alt="Logo Preview"
                        className="h-16 w-16 rounded-2xl object-cover border bg-white"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                        {initials}
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={logoUploading}
                        onClick={() => logoInputRef.current?.click()}
                      >
                        {logoUploading ? "Uploading..." : "Upload Logo"}
                      </Button>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>

                {/* Banner Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Club Banner</label>
                  <div className="flex flex-col gap-3 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    {bannerPreview || form.watch("bannerUrl") ? (
                      <img
                        src={bannerPreview || form.watch("bannerUrl")}
                        alt="Banner Preview"
                        className="h-20 w-full rounded-lg object-cover border bg-white"
                      />
                    ) : (
                      <div className="h-20 w-full rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500 font-medium">
                        No Banner Uploaded
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={bannerUploading}
                        onClick={() => bannerInputRef.current?.click()}
                      >
                        {bannerUploading ? "Uploading..." : "Upload Banner"}
                      </Button>
                      <p className="text-[10px] text-slate-400 mt-1">Recommended size: 1200x300px</p>
                    </div>
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Socials Connection Card */}
            <Card className="border border-slate-200/80 shadow-xs bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                  <Globe className="h-5 w-5 text-[#19376D]" />
                  Social Media Links
                </CardTitle>
                <CardDescription>Provide links for members to explore your social pages</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Website URL</label>
                  <Input
                    placeholder="e.g. https://myclub.com"
                    {...form.register("socialPlatforms.website")}
                    className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Instagram URL</label>
                  <Input
                    placeholder="e.g. https://instagram.com/myclub"
                    {...form.register("socialPlatforms.instagram")}
                    className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">LinkedIn URL</label>
                  <Input
                    placeholder="e.g. https://linkedin.com/company/myclub"
                    {...form.register("socialPlatforms.linkedin")}
                    className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Other URL</label>
                  <Input
                    placeholder="e.g. Facebook Page, Twitter/X, etc."
                    {...form.register("socialPlatforms.other")}
                    className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D] focus-visible:border-[#19376D] transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {updateError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
                {updateError}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={updating}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#19376D] hover:bg-[#0B2447] text-white" disabled={updating}>
                {updating ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="border border-slate-100 shadow-sm overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
              {club?.bannerUrl && (
                <div className="w-full h-40 overflow-hidden relative border-b border-slate-100">
                  <img
                    src={club.bannerUrl}
                    alt={`${clubName} Banner`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  {club?.logoUrl ? (
                    <img
                      src={club.logoUrl}
                      alt={clubName}
                      className="h-20 w-20 rounded-2xl object-cover border border-slate-200 bg-white shadow-md shrink-0"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold text-slate-900">{clubName}</h2>
                      <Badge variant="secondary" className="capitalize text-xs bg-slate-100 border border-slate-200">
                        {getClubTypeLabel(clubType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {city}
                    </p>
                    <p className="text-sm text-slate-600 max-w-xl italic mt-2">
                      {club?.description ?? "No description provided yet. Click edit profile to add one."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details & Contact Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                    <Compass className="h-5 w-5 text-[#19376D]" />
                    Club Information
                  </CardTitle>
                  <CardDescription>Details about your community parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Club Name</span>
                    <span className="text-sm text-slate-900 font-semibold">{clubName}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Club Category</span>
                    <span className="text-sm text-slate-900 font-semibold capitalize">{getClubTypeLabel(clubType)}</span>
                  </div>
                  {club?.otherClubType && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-500">Sub-type / Notes</span>
                      <span className="text-sm text-slate-900 font-semibold">{club.otherClubType}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">City / Location</span>
                    <span className="text-sm text-slate-900 font-semibold">{city}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2 text-slate-800">
                    <MessageSquare className="h-5 w-5 text-[#19376D]" />
                    Contact & Socials
                  </CardTitle>
                  <CardDescription>How members get in touch with your club</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                    <Phone className="h-4 w-4 text-[#19376D]" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">Phone ({club?.contactMethod || "call"})</p>
                      <p className="text-sm text-slate-900 font-medium">{club?.phone ?? "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                    <Mail className="h-4 w-4 text-[#19376D]" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">Email Address</p>
                      <p className="text-sm text-slate-900 font-medium">{club?.email ?? "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#19376D]" />
                      <span className="text-sm text-slate-900 font-medium">Social Connections</span>
                    </div>
                    <div className="flex gap-2">
                      {club?.socialPlatforms?.instagram && (
                        <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                          Instagram
                        </Badge>
                      )}
                      {club?.socialPlatforms?.website && (
                        <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                          Website
                        </Badge>
                      )}
                      {club?.socialPlatforms?.linkedin && (
                        <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                          LinkedIn
                        </Badge>
                      )}
                      {club?.socialPlatforms?.other && (
                        <Badge variant="outline" className="bg-[#19376D]/5 text-[#19376D] font-normal border-[#19376D]/20">
                          Other URL
                        </Badge>
                      )}
                      {!club?.socialPlatforms?.instagram && !club?.socialPlatforms?.website && !club?.socialPlatforms?.linkedin && !club?.socialPlatforms?.other && (
                        <span className="text-sm text-slate-500">None connected</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      )}

      {activeTab === "members" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: Join Requests */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Pending Join Requests
                {pendingRequests.length > 0 && (
                  <Badge className="bg-amber-500 text-white ml-2">
                    {pendingRequests.length} pending
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-slate-500">Review requests from riders wanting to join your club</p>
            </div>

            {loadingRequests ? (
              <Card className="p-8 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </Card>
            ) : pendingRequests.length === 0 ? (
              <Card className="border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center rounded-xl">
                <p className="text-sm text-slate-500">No pending join requests at the moment.</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {pendingRequests.map((req) => {
                  const userInitials = req.user?.name
                    ?.split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w: string) => w[0]?.toUpperCase())
                    .join("") || "R";
                  
                  return (
                    <Card key={req.id} className="border border-slate-100 shadow-sm hover:shadow-md transition duration-300 overflow-hidden bg-white rounded-xl">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12 rounded-xl border border-slate-100 shrink-0">
                            {req.user?.profileImage ? (
                              <AvatarImage src={req.user.profileImage} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-[#19376D]/10 text-[#19376D] font-bold rounded-xl">
                                {userInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900 text-sm">{req.user?.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone className="h-3 w-3 text-emerald-500" />
                              {req.user?.phone}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Requested {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                          <Button
                            size="sm"
                            disabled={actioningRequests.includes(req.id)}
                            onClick={() => handleApprove(req.id, req.userId)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5"
                          >
                            {actioningRequests.includes(req.id) ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Approve"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={actioningRequests.includes(req.id)}
                            onClick={() => handleReject(req.id, req.userId)}
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5"
                          >
                            {actioningRequests.includes(req.id) ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin text-red-600" />
                                Processing...
                              </>
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Club Members */}
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Active Members
                {activeMembers.length > 0 && (
                  <Badge className="bg-[#19376D] text-white ml-2">
                    {activeMembers.length}
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-slate-500">View and manage registered members of this club</p>
            </div>

            {loadingMembers ? (
              <Card className="p-8 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </Card>
            ) : activeMembers.length === 0 ? (
              <Card className="border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center rounded-xl">
                <p className="text-sm text-slate-500">No active members yet.</p>
              </Card>
            ) : (
              <Card className="border border-slate-100 shadow-sm overflow-hidden rounded-xl bg-white">
                <div className="divide-y divide-slate-100">
                  {activeMembers.map((member) => {
                    const initials = member.name
                      ?.split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w: string) => w[0]?.toUpperCase())
                      .join("") || "M";

                    return (
                      <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/50 transition gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-lg">
                            {member.profileImage ? (
                              <AvatarImage src={member.profileImage} className="object-cover" />
                            ) : (
                              <AvatarFallback className="bg-slate-100 text-[#19376D] font-bold">
                                {initials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                              {member.location?.city && (
                                <span className="flex items-center gap-0.5 text-slate-400">
                                  <MapPin className="h-3 w-3" />
                                  {member.location.city}
                                </span>
                              )}
                              {member.vehicle?.brand && (
                                <span className="text-primary/80 font-medium">
                                  {member.vehicle.brand} {member.vehicle.model} ({member.vehicle.year})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          {member.phone && (
                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {member.phone}
                            </span>
                          )}
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium rounded-full text-[10px]">
                            Active Member
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={removingIds.includes(member.id)}
                            onClick={() => handleRemoveMember(member.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg text-xs flex items-center gap-1.5"
                          >
                            {removingIds.includes(member.id) ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin text-red-600" />
                                Removing...
                              </>
                            ) : (
                              "Remove Member"
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Events Schedule</h3>
              <p className="text-sm text-slate-500">Create meetups, drives, and exhibitions</p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingEvent(null);
                setIsEventModalOpen(true);
              }}
              className="bg-[#19376D] hover:bg-[#0B2447] text-white"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Plan Event
            </Button>
          </div>

          {loadingEvents ? (
            <Card className="p-8 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </Card>
          ) : eventsList.length === 0 ? (
            <Card className="border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center rounded-xl">
              <p className="text-sm text-slate-500">No events created yet. Click "Plan Event" to get started.</p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventsList.map((event) => (
                <Card key={event.id} className="border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between h-full bg-white rounded-xl overflow-hidden">
                  <div>
                    {event.coverImage ? (
                      <div className="w-full h-32 relative">
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-slate-900/80 text-white backdrop-blur-xs capitalize text-[10px]">
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-slate-100 flex items-center justify-center relative">
                        <Calendar className="h-8 w-8 text-slate-300" />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-slate-900/80 text-white backdrop-blur-xs capitalize text-[10px]">
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                          {event.eventType?.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{event.visibility}</span>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {new Date(event.startDateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-1 mt-0.5 text-slate-500 text-xs">
                        <Compass className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                        <span className="line-clamp-1">{event.location?.name || "No location name"}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-600 space-y-2 py-2">
                      <p className="line-clamp-2">{event.description}</p>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span>Participants:</span>
                        <span className="font-semibold text-slate-950">{event.participantCount || 0} {event.maxParticipants ? `/ ${event.maxParticipants}` : ""}</span>
                      </div>
                    </CardContent>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-50 bg-slate-50/50">
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsParticipantsModalOpen(true);
                      }}
                      className="flex-1 text-xs py-1"
                    >
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Riders
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditingEvent(event);
                        setIsEventModalOpen(true);
                      }}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Event Dialog */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl bg-white p-6 shadow-xl border overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingEvent ? "Edit Event" : "Plan New Event"}
            </DialogTitle>
            <DialogDescription>
              Configure details, date, time and cover image for your event.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveEvent} className="space-y-4 overflow-y-auto px-1 py-1 max-h-[70vh]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Title <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. Sunday Morning Breakfast Run"
                {...eventForm.register("title", { required: "Title is required" })}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
              />
              {eventForm.formState.errors.title && (
                <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Type <span className="text-red-500">*</span></label>
                <Select
                  value={eventForm.watch("eventType")}
                  onValueChange={(val) => eventForm.setValue("eventType", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ride">🏍 Ride</SelectItem>
                    <SelectItem value="drive">🚗 Drive</SelectItem>
                    <SelectItem value="meetup">🤝 Meetup</SelectItem>
                    <SelectItem value="breakfast_run">🍳 Breakfast Run</SelectItem>
                    <SelectItem value="road_trip">🗺 Road Trip</SelectItem>
                    <SelectItem value="track_day">🏁 Track Day</SelectItem>
                    <SelectItem value="charity_event">❤️ Charity Event</SelectItem>
                    <SelectItem value="workshop">🔧 Workshop</SelectItem>
                    <SelectItem value="offroad">🏜 Offroad</SelectItem>
                    <SelectItem value="exhibition">🎪 Exhibition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <Select
                  value={eventForm.watch("status")}
                  onValueChange={(val) => eventForm.setValue("status", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description <span className="text-red-500">*</span></label>
              <Textarea
                placeholder="Tell riders what to expect, route details, etc..."
                rows={3}
                {...eventForm.register("description", { required: "Description is required" })}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
              />
              {eventForm.formState.errors.description && (
                <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.description.message}</p>
              )}
            </div>

            {/* Event Cover Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Cover Image</label>
              <div className="flex flex-col gap-3 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                {eventCoverPreview ? (
                  <img
                    src={eventCoverPreview}
                    alt="Cover Preview"
                    className="h-24 w-full rounded-lg object-cover border bg-white"
                  />
                ) : (
                  <div className="h-24 w-full rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-medium">
                    No Image Uploaded
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={eventCoverUploading}
                    onClick={() => eventCoverInputRef.current?.click()}
                  >
                    {eventCoverUploading ? "Uploading..." : "Upload Cover Image"}
                  </Button>
                  <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
                </div>
                <input
                  ref={eventCoverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEventCoverUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date & Time <span className="text-red-500">*</span></label>
                <Input
                  type="datetime-local"
                  {...eventForm.register("startDateTime", { required: "Start date is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
                {eventForm.formState.errors.startDateTime && (
                  <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.startDateTime.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date & Time <span className="text-red-500">*</span></label>
                <Input
                  type="datetime-local"
                  {...eventForm.register("endDateTime", { required: "End date is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
                {eventForm.formState.errors.endDateTime && (
                  <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.endDateTime.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City (General Location) <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. Lahore"
                {...eventForm.register("city", { required: "City is required" })}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
              />
              {eventForm.formState.errors.city && (
                <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.city.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specific Location / Venue Name <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. McDonald's M2 Motorway"
                {...eventForm.register("locationName", { required: "Venue name is required" })}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
              />
              {eventForm.formState.errors.locationName && (
                <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.locationName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location City <span className="text-red-500">*</span></label>
                <Input
                  placeholder="e.g. Lahore"
                  {...eventForm.register("locationCity", { required: "Location City is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
                {eventForm.formState.errors.locationCity && (
                  <p className="text-xs text-red-500 font-medium">{eventForm.formState.errors.locationCity.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Participants (Optional)</label>
                <Input
                  type="number"
                  placeholder="e.g. 50 (blank for unlimited)"
                  {...eventForm.register("maxParticipants")}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latitude (Optional)</label>
                <Input
                  placeholder="e.g. 31.5204"
                  {...eventForm.register("latitude")}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Longitude (Optional)</label>
                <Input
                  placeholder="e.g. 74.3587"
                  {...eventForm.register("longitude")}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visibility</label>
                <Select
                  value={eventForm.watch("visibility")}
                  onValueChange={(val) => eventForm.setValue("visibility", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">🌐 Public</SelectItem>
                    <SelectItem value="private">🔒 Private (Members Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsEventModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#19376D] hover:bg-[#0B2447] text-white" disabled={savingEvent}>
                {savingEvent ? "Saving..." : "Save Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Participants Dialog */}
      <Dialog open={isParticipantsModalOpen} onOpenChange={setIsParticipantsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white p-6 shadow-xl border overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Event Participants
            </DialogTitle>
            <DialogDescription>
              Registered riders for this event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto px-1 py-1 max-h-[70vh]">
            <div>
              <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{selectedEvent?.title}</h4>
              <p className="text-xs text-slate-500">List of registered riders participating in this event.</p>
            </div>

            {loadingParticipants ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : participantsList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm border border-dashed rounded-xl">
                No riders registered for this event yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden bg-white">
                {participantsList.map((p) => {
                  const initials = p.userName
                    ?.split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w: string) => w[0]?.toUpperCase())
                    .join("") || "R";
                  
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-slate-50/50 transition">
                      <Avatar className="h-8 w-8 rounded-lg">
                        {p.profileImage ? (
                          <AvatarImage src={p.profileImage} className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-slate-100 text-[#19376D] font-bold text-xs">
                            {initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{p.userName}</p>
                        <p className="text-[10px] text-slate-400">Registered {new Date(p.registeredAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  );
}
