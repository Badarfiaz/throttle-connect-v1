"use client";

import React, { useState, useMemo } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X, Edit2, Users, Calendar, Trophy, Image as ImageIcon, Plus, Sparkles, TrendingUp, Info, AlertCircle, ArrowRight } from "lucide-react";

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
import AnalyticsTab from "./AnalyticsTab";

type DashboardTab = "overview" | "profile" | "members" | "events" | "achievements" | "gallery" | "analytics";

export default function NetworkingDashboardContainer() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
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
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
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
        id: "overview",
        label: "Overview",
        description: "Dashboard landing & insights",
      },
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
      {
        id: "analytics",
        label: "Analytics",
        description: "Profile views & listing clicks",
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
      {/* ── Landing Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          
          {/* Welcome Banner */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Welcome to your Club Dashboard <Sparkles className="h-5 w-5 text-amber-500" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Monitor membership approvals, schedule upcoming meets, and keep track of club achievements.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <Button size="sm" onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} className="rounded-xl bg-[#19376D] text-white">
                <Plus className="h-4 w-4 mr-1.5" /> Plan Event
              </Button>
            </div>
          </div>

          {/* Pending requests warning banner */}
          {pendingRequests.length > 0 && (
            <div className="rounded-2xl border border-amber-250 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold">
                  You have {pendingRequests.length} pending membership requests waiting for your approval!
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("members")} className="h-8 text-xs border-amber-300/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 bg-white dark:bg-slate-900 rounded-xl cursor-pointer">
                Manage Requests <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          )}

          {/* Club Statistics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Members</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{activeMembers.length}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400"><Users className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Events</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{eventsList.length}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400"><Calendar className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Achievements</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{achievementsList.length}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-650 dark:text-purple-400"><Trophy className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gallery size</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{club?.gallery?.length || 0} / 10</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400"><ImageIcon className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Static Insights */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Quick Actions Panel */}
            <Card className="md:col-span-2 rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
                <CardDescription className="text-xs">Direct paths to take control of your community</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => { setEditingEvent(null); setIsEventModalOpen(true); }} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Calendar className="h-4.5 w-4.5 text-amber-500" />
                    <span className="text-xs font-bold">Plan Event</span>
                  </Button>
                  <Button variant="outline" onClick={() => { setEditingAchievement(null); setIsAchievementModalOpen(true); }} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Trophy className="h-4.5 w-4.5 text-purple-650" />
                    <span className="text-xs font-bold">Add Achievement</span>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("members")} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Users className="h-4.5 w-4.5 text-blue-600" />
                    <span className="text-xs font-bold">Manage Members</span>
                  </Button>
                  <Button variant="outline" onClick={() => { setActiveTab("profile"); setIsEditing(true); }} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Edit2 className="h-4.5 w-4.5 text-slate-500" />
                    <span className="text-xs font-bold">Edit Details</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Static Insights / Tips panel */}
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Insights & Tips</CardTitle>
                <CardDescription className="text-xs">Community growth suggestions</CardDescription>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Scheduling Tip:</strong> Schedule rides on Tuesdays to give members enough time to RSVP.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Bio Optimization:</strong> Clubs with rich, detailed bio information receive 65% more join requests.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Moments Count:</strong> Your moments gallery has space for {10 - (club?.gallery?.length || 0)} more snapshots. Keep it fresh!
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Club Growth Charts (SVG chart representation) */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-base font-bold">Activity and RSVPs Statistics</CardTitle>
              <CardDescription className="text-xs">Month-over-month (MOM) platform trends</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-44">
                <svg className="w-full h-full" viewBox="0 0 500 120">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-700" />
                  
                  <path
                    d="M40,100 L40,80 Q120,60 200,85 T360,40 T480,20 L480,100 Z"
                    fill="url(#clubOverviewGradient)"
                    opacity="0.15"
                  />
                  <path
                    d="M40,80 Q120,60 200,85 T360,40 T480,20"
                    fill="none"
                    stroke="#19376D"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="40" cy="80" r="4.5" fill="#19376D" stroke="#fff" strokeWidth="2" />
                  <circle cx="200" cy="85" r="4.5" fill="#19376D" stroke="#fff" strokeWidth="2" />
                  <circle cx="360" cy="40" r="4.5" fill="#19376D" stroke="#fff" strokeWidth="2" />
                  <circle cx="480" cy="20" r="4.5" fill="#19376D" stroke="#fff" strokeWidth="2" />

                  <text x="40" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">Jan</text>
                  <text x="150" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">Mar</text>
                  <text x="300" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">May</text>
                  <text x="480" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">Jun</text>

                  <defs>
                    <linearGradient id="clubOverviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#19376D" />
                      <stop offset="100%" stopColor="#19376D" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

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
      {activeTab === "analytics" && <AnalyticsTab clubId={club?.id} />}
    </DashboardContainer>
  );
}
