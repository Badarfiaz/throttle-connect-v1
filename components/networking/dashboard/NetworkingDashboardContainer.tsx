"use client";

import React, { useState, useMemo } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit2 } from "lucide-react";

// Hooks
import { useClubProfile } from "./hooks/useClubProfile";
import { useMembershipRequests } from "./hooks/useMembershipRequests";
import { useClubMembers } from "./hooks/useClubMembers";
import { useClubEvents } from "./hooks/useClubEvents";
import { useClubAchievements } from "./hooks/useClubAchievements";
import { useClubGallery } from "./hooks/useClubGallery";

// Tabs
import ClubProfileTab from "./ClubProfileTab";
import MembersTab from "./MembersTab";
import EventsTab from "./EventsTab";
import AchievementsTab from "./AchievementsTab";
import GalleryTab from "./GalleryTab";

type DashboardTab = "profile" | "members" | "events" | "achievements" | "gallery";

export default function NetworkingDashboardContainer() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  const user = useAppSelector((state) => state.auth.user);
  const club = user?.networking;

  // Membership & Members Hooks
  const {
    pendingRequests,
    loadingRequests,
    actioningRequests,
    handleApprove,
    handleReject
  } = useMembershipRequests(club?.id, user?.userId);

  const {
    activeMembers,
    loadingMembers,
    removingIds,
    handleRemoveMember
  } = useClubMembers(club?.id, user?.userId);

  // Profile hook
  const {
    form: profileForm,
    updating: profileUpdating,
    updateError: profileUpdateError,
    logoUploading,
    bannerUploading,
    logoPreview,
    bannerPreview,
    logoInputRef,
    bannerInputRef,
    handleLogoUpload,
    handleBannerUpload,
    handleSave: handleProfileSave,
    handleCancel: handleProfileCancel
  } = useClubProfile(club, user, isEditing, setIsEditing);

  // Events Hook
  const {
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
    setIsParticipantsModalOpen
  } = useClubEvents(club, user);

  // Achievements Hook
  const {
    achievementsList,
    loadingAchievements,
    isAchievementModalOpen,
    setIsAchievementModalOpen,
    editingAchievement,
    setEditingAchievement,
    savingAchievement,
    handleSaveAchievement,
    handleDeleteAchievement,
    achievementForm
  } = useClubAchievements(club?.id, user?.userId);

  // Gallery Hook
  const {
    galleryList,
    uploading: galleryUploading,
    fileInputRef: galleryFileInputRef,
    handleUpload: handleGalleryUpload,
    handleDelete: handleGalleryDelete
  } = useClubGallery(club, user);

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
      {
        id: "achievements",
        label: "Achievements",
        description: "Celebrate milestones & trophies",
      },
      {
        id: "gallery",
        label: "Club Gallery",
        description: "Post club moments (max 10)",
        badge: club?.gallery?.length ? `${club.gallery.length}/10` : undefined,
      },
    ];
  }, [pendingRequests.length, eventsList, club?.gallery]);

  return (
    <DashboardContainer
      title={clubName}
      subtitle="Manage your club profile, coordinate meets, and build your auto community."
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
                  <Button size="sm" variant="ghost" onClick={handleProfileCancel} disabled={profileUpdating}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-[#19376D] hover:bg-[#0B2447] text-white" onClick={handleProfileSave} disabled={profileUpdating}>
                    <Check className="h-4 w-4 mr-1" /> {profileUpdating ? "Saving..." : "Save"}
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
        <ClubProfileTab
          club={club}
          user={user}
          isEditing={isEditing}
          form={profileForm}
          updating={profileUpdating}
          updateError={profileUpdateError}
          logoUploading={logoUploading}
          bannerUploading={bannerUploading}
          logoPreview={logoPreview}
          bannerPreview={bannerPreview}
          logoInputRef={logoInputRef}
          bannerInputRef={bannerInputRef}
          handleLogoUpload={handleLogoUpload}
          handleBannerUpload={handleBannerUpload}
          handleSave={handleProfileSave}
          handleCancel={handleProfileCancel}
        />
      )}

      {activeTab === "members" && (
        <MembersTab
          pendingRequests={pendingRequests}
          loadingRequests={loadingRequests}
          actioningRequests={actioningRequests}
          handleApprove={handleApprove}
          handleReject={handleReject}
          activeMembers={activeMembers}
          loadingMembers={loadingMembers}
          removingIds={removingIds}
          handleRemoveMember={handleRemoveMember}
        />
      )}

      {activeTab === "events" && (
        <EventsTab
          eventsList={eventsList}
          loadingEvents={loadingEvents}
          isEventModalOpen={isEventModalOpen}
          setIsEventModalOpen={setIsEventModalOpen}
          editingEvent={editingEvent}
          setEditingEvent={setEditingEvent}
          savingEvent={savingEvent}
          handleSaveEvent={handleSaveEvent}
          handleDeleteEvent={handleDeleteEvent}
          eventForm={eventForm}
          eventCoverUploading={eventCoverUploading}
          eventCoverPreview={eventCoverPreview}
          eventCoverInputRef={eventCoverInputRef}
          handleEventCoverUpload={handleEventCoverUpload}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          participantsList={participantsList}
          loadingParticipants={loadingParticipants}
          isParticipantsModalOpen={isParticipantsModalOpen}
          setIsParticipantsModalOpen={setIsParticipantsModalOpen}
        />
      )}

      {activeTab === "achievements" && (
        <AchievementsTab
          achievementsList={achievementsList}
          loadingAchievements={loadingAchievements}
          isAchievementModalOpen={isAchievementModalOpen}
          setIsAchievementModalOpen={setIsAchievementModalOpen}
          editingAchievement={editingAchievement}
          setEditingAchievement={setEditingAchievement}
          savingAchievement={savingAchievement}
          handleSaveAchievement={handleSaveAchievement}
          handleDeleteAchievement={handleDeleteAchievement}
          achievementForm={achievementForm}
        />
      )}

      {activeTab === "gallery" && (
        <GalleryTab
          galleryList={galleryList}
          uploading={galleryUploading}
          fileInputRef={galleryFileInputRef}
          handleUpload={handleGalleryUpload}
          handleDelete={handleGalleryDelete}
        />
      )}
    </DashboardContainer>
  );
}
