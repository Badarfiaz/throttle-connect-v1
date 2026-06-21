"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, query, where, onSnapshot, doc, runTransaction, getDocs } from "firebase/firestore";
import { toast } from "sonner";

export function useClubMembers(clubId: string | undefined, ownerUid: string | undefined) {
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!clubId) return;

    setLoadingMembers(true);
    const membersQuery = query(
      collection(db, "users"),
      where("clubId", "==", clubId)
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
  }, [clubId]);

  const handleRemoveMember = async (memberId: string) => {
    if (!clubId || !ownerUid) return;
    setRemovingIds((prev) => [...prev, memberId]);
    try {
      const userRef = doc(db, "users", memberId);
      const clubRef = doc(db, "networkingStores", clubId);

      const q = query(
        collection(db, "membershipRequests"),
        where("userId", "==", memberId),
        where("clubId", "==", clubId)
      );
      const querySnap = await getDocs(q);

      await runTransaction(db, async (transaction) => {
        const clubDoc = await transaction.get(clubRef);
        const userDoc = await transaction.get(userRef);

        if (!clubDoc.exists() || !userDoc.exists()) {
          throw new Error("Club or member document does not exist.");
        }

        const clubData = clubDoc.data();

        // Rule 2: Only owner can remove
        if (clubData.ownerUid !== ownerUid) {
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
        querySnap.forEach((docSnap) => {
          transaction.update(docSnap.ref, {
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

  return {
    activeMembers,
    loadingMembers,
    removingIds,
    handleRemoveMember,
  };
}
