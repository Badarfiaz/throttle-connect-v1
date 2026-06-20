"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, runTransaction, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/app/redux/hooks";
import { toast } from "sonner";
import {
  Users,
  MapPin,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Compass,
  ArrowLeft,
  Loader2,
  Calendar,
  AlertCircle,
  FileText,
  Check,
  X,
  Heart
} from "lucide-react";

export default function MemberProfileView() {
  const { id } = useParams();
  const router = useRouter();
  const viewer = useAppSelector((state) => state.auth.user);
  
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Pending request from this user to the viewer's club
  const [pendingRequest, setPendingRequest] = useState<any>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);
  
  // Lightbox for vehicle images
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Fetch target user's details
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const docRef = doc(db, "users", id as string);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMember(docSnap.data());
      } else {
        setMember(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  // Check if there is a pending club membership request from this user to the viewer's club
  useEffect(() => {
    const viewerClubId = viewer?.networking?.id;
    if (!id || !viewerClubId) {
      setPendingRequest(null);
      return;
    }

    setLoadingRequest(true);
    const q = query(
      collection(db, "membershipRequests"),
      where("userId", "==", id as string),
      where("clubId", "==", viewerClubId),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setPendingRequest(snapshot.docs[0].data());
      } else {
        setPendingRequest(null);
      }
      setLoadingRequest(false);
    }, (error) => {
      console.error("Error listening to membership requests:", error);
      setLoadingRequest(false);
    });

    return () => unsubscribe();
  }, [id, viewer?.networking?.id]);

  // Handle Approve request
  const handleApprove = async () => {
    const clubId = viewer?.networking?.id;
    if (!pendingRequest || !clubId || !viewer) return;

    setSubmittingAction(true);
    try {
      const requestRef = doc(db, "membershipRequests", pendingRequest.id);
      const userRef = doc(db, "users", id as string);
      const clubRef = doc(db, "networkingStores", clubId);

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

        if (clubData.ownerUid !== viewer.userId) {
          throw new Error("Unauthorized: Only the club owner can approve requests.");
        }

        if (userData.clubId && userData.clubId !== "none") {
          // Requester joined another club in the meantime, auto-reject
          transaction.update(requestRef, { status: "rejected" });
          transaction.update(userRef, { membershipStatus: "rejected" });
          const pendingCount = clubData.pendingRequestsCount || 0;
          transaction.update(clubRef, {
            pendingRequestsCount: Math.max(0, pendingCount - 1)
          });
          throw new Error("User has already joined another club. Request rejected automatically.");
        }

        // Approve and update member count
        transaction.update(userRef, {
          clubId: clubId,
          membershipStatus: "active"
        });

        const memberCount = clubData.memberCount || 0;
        const pendingCount = clubData.pendingRequestsCount || 0;

        transaction.update(clubRef, {
          memberCount: memberCount + 1,
          pendingRequestsCount: Math.max(0, pendingCount - 1)
        });

        transaction.update(requestRef, { status: "approved" });
      });

      toast.success("Request Approved", {
        description: "Rider is now a member of your club."
      });
      router.back();
    } catch (err: any) {
      console.error("Error approving member:", err);
      toast.error(err.message || "Failed to approve request");
    } finally {
      setSubmittingAction(false);
    }
  };

  // Handle Reject request
  const handleReject = async () => {
    const clubId = viewer?.networking?.id;
    if (!pendingRequest || !clubId || !viewer) return;

    setSubmittingAction(true);
    try {
      const requestRef = doc(db, "membershipRequests", pendingRequest.id);
      const userRef = doc(db, "users", id as string);
      const clubRef = doc(db, "networkingStores", clubId);

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }

        const clubData = clubDoc.data();
        if (clubData.ownerUid !== viewer.userId) {
          throw new Error("Unauthorized: Only the club owner can reject requests.");
        }

        transaction.update(requestRef, { status: "rejected" });
        transaction.update(userRef, { membershipStatus: "rejected" });

        const pendingCount = clubData.pendingRequestsCount || 0;
        transaction.update(clubRef, {
          pendingRequestsCount: Math.max(0, pendingCount - 1)
        });
      });

      toast.success("Request Rejected", {
        description: "Join request has been rejected."
      });
      router.back();
    } catch (err: any) {
      console.error("Error rejecting member:", err);
      toast.error(err.message || "Failed to reject request");
    } finally {
      setSubmittingAction(false);
    }
  };

  const displayName = member?.name || "Rider Profile";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "R";

  // Vehicle details
  const vehicle = member?.vehicle;
  const vehicleImages = useMemo(() => {
    if (!vehicle?.images) return [];
    return Array.isArray(vehicle.images) ? vehicle.images : [vehicle.images];
  }, [vehicle]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500 animate-pulse font-medium">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="p-8 text-center border-dashed">
          <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <CardTitle className="text-lg text-slate-700">Rider profile not found</CardTitle>
          <CardDescription className="mt-1">The profile does not exist or has been removed.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-600 font-semibold rounded-xl hover:bg-slate-100">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      {/* Action Banner for pending requests */}
      {pendingRequest && (
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Pending Membership Request</p>
              <p className="text-xs text-slate-500 mt-0.5">This rider wants to join your club, {viewer?.networking?.clubName || "your club"}.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={handleReject}
              disabled={submittingAction}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-semibold h-9 px-4"
            >
              <X className="h-4 w-4 mr-1.5" />
              Reject
            </Button>
            <Button
              onClick={handleApprove}
              disabled={submittingAction}
              size="sm"
              className="flex-1 sm:flex-none bg-[#19376D] hover:bg-[#0B2447] text-white rounded-xl font-semibold h-9 px-4"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Approve
            </Button>
          </div>
        </Card>
      )}

      {/* Hero Header Card */}
      <section className="relative overflow-hidden rounded-3xl border bg-white shadow-xs p-6 md:p-8">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top right, hsl(var(--primary) / 0.15), transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative h-24 w-24 rounded-2xl border object-cover bg-slate-50 shrink-0 shadow-sm">
            {member.profileImage ? (
              <img src={member.profileImage} alt={displayName} className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#19376D] bg-slate-100 rounded-2xl">
                {initials}
              </div>
            )}
            <Badge className="absolute -bottom-2 -right-2 bg-emerald-600 text-white shadow-md border border-white">
              Verified
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{displayName}</h1>
            </div>
            
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              {[member.location?.area, member.location?.city, member.location?.country].filter(Boolean).join(", ")}
            </p>
            
            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                {member.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                {member.phone}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: General Profile Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Primary Ride Info */}
          <Card className="rounded-2xl bg-white border">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Rider's Ride</CardTitle>
                <CardDescription className="text-xs">Primary ride and garage collection</CardDescription>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 capitalize font-semibold py-0.5 px-2.5">
                {vehicle?.type || "Ride"}
              </Badge>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{vehicle?.brand || "Not specified"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{vehicle?.model || "Not specified"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Year</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{vehicle?.year || "Not specified"}</p>
                </div>
              </div>

              {/* Ride Images Gallery */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Garage Gallery</label>
                {vehicleImages.length === 0 ? (
                  <div className="h-32 border border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400">
                    <Compass className="h-8 w-8 text-slate-300 mb-1" />
                    <span className="text-xs">No ride photos uploaded</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {vehicleImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative h-20 rounded-xl overflow-hidden border bg-slate-50 cursor-zoom-in hover:scale-[1.02] transition"
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={imgUrl} alt={`Vehicle image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Safety & Documents Panel */}
          <Card className="rounded-2xl bg-white border">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Safety & Verification Documents</CardTitle>
              <CardDescription className="text-xs">Rider credentials and licenses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <FileText className="h-4 w-4 text-[#19376D]" /> Driving License Documentation
                </div>
                {member.profileData?.drivingLicenseImage || member.drivingLicenseImage ? (
                  <div className="relative border rounded-xl overflow-hidden max-w-md bg-slate-50 border-slate-200">
                    <img
                      src={member.profileData?.drivingLicenseImage || member.drivingLicenseImage}
                      alt="Driving License"
                      className="w-full h-44 object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-4 border border-dashed rounded-xl flex items-center justify-center gap-2 text-slate-400">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-xs">Rider has not uploaded a driving license document yet.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Emergency and Metadata details */}
        <div className="space-y-6">
          {/* Emergency Contacts card */}
          <Card className="border-red-150 rounded-2xl bg-white overflow-hidden">
            <div className="bg-red-500/10 text-red-700 px-4 py-3 border-b border-red-100 flex items-center gap-2">
              <Heart className="h-4 w-4 shrink-0 fill-red-500 stroke-red-600" />
              <span className="text-xs font-bold uppercase tracking-wider">Emergency Medical Card</span>
            </div>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-100 rounded-xl">
                <span className="text-xs font-bold text-red-800">Blood Group</span>
                <Badge className="bg-red-600 text-white font-extrabold text-xs px-2.5 py-0.5">
                  {member.emergencyContact?.bloodGroup || "Not specified"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</label>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5">{member.emergencyContact?.name || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                  <p className="font-extrabold text-[#19376D] text-sm mt-0.5">{member.emergencyContact?.phone || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Riding Experience & Interests */}
          <Card className="rounded-2xl bg-white border">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">Riding Experience</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Riding years</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-extrabold text-slate-800 text-sm">
                    {member.profileData?.experienceYears !== undefined
                      ? (typeof member.profileData.experienceYears === "number" ? `${member.profileData.experienceYears} Years` : String(member.profileData.experienceYears))
                      : "Fresh Rider"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Riding Interests</label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {member.profileData?.interests && member.profileData.interests.length > 0 ? (
                    member.profileData.interests.map((int: string) => (
                      <Badge key={int} variant="secondary" className="capitalize text-[10px] bg-slate-100 hover:bg-slate-150 text-slate-600 font-semibold py-0.5 border">
                        {int}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">None specified</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImageIndex(null)}
        >
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 shrink-0 bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={vehicleImages[activeImageIndex]} alt="Ride Zoomed" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10" />
            
            {vehicleImages.length > 1 && (
              <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-4 text-white text-xs font-semibold">
                <button
                  disabled={activeImageIndex === 0}
                  onClick={() => setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
                  className="hover:text-primary transition disabled:opacity-30 disabled:hover:text-white"
                >
                  Prev
                </button>
                <span>{activeImageIndex + 1} / {vehicleImages.length}</span>
                <button
                  disabled={activeImageIndex === vehicleImages.length - 1}
                  onClick={() => setActiveImageIndex((prev) => (prev !== null && prev < vehicleImages.length - 1 ? prev + 1 : prev))}
                  className="hover:text-primary transition disabled:opacity-30 disabled:hover:text-white"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
