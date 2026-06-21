"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot, doc, getDoc, runTransaction } from "firebase/firestore";
import { toast } from "sonner";

export function useMembershipRequests(clubId: string | undefined, ownerUid: string | undefined) {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [actioningRequests, setActioningRequests] = useState<string[]>([]);

  useEffect(() => {
    if (!clubId) return;

    setLoadingRequests(true);
    const requestsQuery = query(
      collection(db, "membershipRequests"),
      where("clubId", "==", clubId),
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
  }, [clubId]);

  const handleApprove = async (requestId: string, requesterId: string) => {
    if (!clubId || !ownerUid) return;
    setActioningRequests((prev) => [...prev, requestId]);
    try {
      const requestRef = doc(db, "membershipRequests", requestId);
      const userRef = doc(db, "users", requesterId);
      const clubRef = doc(db, "networkingStores", clubId);

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
        if (clubData.ownerUid !== ownerUid) {
          throw new Error("Unauthorized: Only the club owner can approve requests.");
        }

        // Rule 1: One Club Only
        if (userData.clubId != null) {
          transaction.update(requestRef, { status: "rejected" });
          transaction.update(userRef, { membershipStatus: "rejected" });
          
          const pendingCount = clubData.pendingRequestsCount || 0;
          transaction.update(clubRef, {
            pendingRequestsCount: Math.max(0, pendingCount - 1)
          });
          
          throw new Error("User already belongs to another club. Request rejected automatically.");
        }

        // Rule 3: Approve request
        transaction.update(userRef, {
          clubId: clubId,
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
    if (!clubId || !ownerUid) return;
    setActioningRequests((prev) => [...prev, requestId]);
    try {
      const requestRef = doc(db, "membershipRequests", requestId);
      const userRef = doc(db, "users", requesterId);
      const clubRef = doc(db, "networkingStores", clubId);

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        if (!clubDoc.exists()) {
          throw new Error("Club document does not exist.");
        }

        const clubData = clubDoc.data();

        // Rule 2: Only owner can approve/reject
        if (clubData.ownerUid !== ownerUid) {
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

  return {
    pendingRequests,
    loadingRequests,
    actioningRequests,
    handleApprove,
    handleReject,
  };
}
