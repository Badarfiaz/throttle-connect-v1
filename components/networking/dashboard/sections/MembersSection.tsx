import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MemberCard from "@/components/networking/MemberCard";
import type { NetworkingMember } from "@/dummydata/members";
import { memberDataType } from "../NetworkingDashboardContainer";

type MembersSectionProps = {
  members: memberDataType[];
  loading?: boolean;
  error?: string | null;
  onAcceptMember?: (memberId: string) => void;
  onRejectMember?: (memberId: string) => void;
  processing?: boolean;
};

const MembersSection = ({
  members,
  loading,
  error,
  onAcceptMember,
  onRejectMember,
  processing,
}: MembersSectionProps) => {
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const pendingCount = 5;
  const approvedCount = 4;

  const handleAccept = async (memberId: string) => {
    setProcessingId(memberId);
    try {
      await onAcceptMember?.(memberId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (memberId: string) => {
    setProcessingId(memberId);
    try {
      await onRejectMember?.(memberId);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900">Club Members</h2>
          <p className="text-sm text-slate-500">
            Manage member requests and approvals for your club.
          </p>
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-800 border-yellow-200"
            >
              {pendingCount} Pending
            </Badge>
          )}
          <Badge variant="secondary">{approvedCount} Approved</Badge>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading members...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && members.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-medium text-slate-900">No members yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Members who join your club will appear here.
          </p>
        </div>
      )}

      {!loading && !error && members.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onAccept={handleAccept}
              onReject={handleReject}
              isProcessing={processing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersSection;
