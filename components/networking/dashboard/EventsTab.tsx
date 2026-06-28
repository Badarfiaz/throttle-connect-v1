"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./hooks/useClubEvents";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Loader2, Compass, Plus, X, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EventsTabProps {
  eventsList: any[];
  loadingEvents: boolean;
  isEventModalOpen: boolean;
  setIsEventModalOpen: (open: boolean) => void;
  editingEvent: any | null;
  setEditingEvent: (event: any | null) => void;
  savingEvent: boolean;
  handleSaveEvent: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  eventForm: UseFormReturn<EventFormValues>;
  eventCoverUploading: boolean;
  eventCoverPreview: string | null;
  eventCoverInputRef: React.RefObject<HTMLInputElement | null>;
  handleEventCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectedEvent: any | null;
  setSelectedEvent: (event: any | null) => void;
  participantsList: any[];
  loadingParticipants: boolean;
  isParticipantsModalOpen: boolean;
  setIsParticipantsModalOpen: (open: boolean) => void;
}

export default function EventsTab({
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
}: EventsTabProps) {
  return (
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
              <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden bg-white animate-in fade-in duration-200">
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
    </div>
  );
}
