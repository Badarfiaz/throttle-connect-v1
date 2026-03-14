"use client";

import React, { useState } from "react";
import { NetworkingMember } from "@/dummydata/members";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { memberDataType } from "./dashboard/NetworkingDashboardContainer";

type MemberCardProps = {
  member: memberDataType;
  onAccept?: (memberId: string) => void;
  onReject?: (memberId: string) => void;
  isProcessing?: boolean;
};

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onAccept,
  onReject,
  isProcessing = false,
}) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header with avatar and info */}
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900 truncate">
                    {member.memberName}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Club and Location Info */}
          <div className="grid grid-cols-2 gap-3 text-sm"></div>

          {/* Contact Info */}
          <div className="space-y-1 border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600">
              <span className="text-slate-500">Email:</span> {member.email}
            </p>
            <p className="text-sm text-slate-600">
              <span className="text-slate-500">Phone:</span> {member.phone}
            </p>
          </div>

          {/* Action Buttons - Only show for pending members */}

          <div className="flex gap-2 border-t border-slate-100 pt-3">
            <Button
              variant="default"
              size="sm"
              onClick={() => console.log("clicked")}
              disabled={isProcessing}
              className="flex-1 gap-2"
            >
              <Check size={16} />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("clicked")}
              disabled={isProcessing}
              className="flex-1 gap-2"
            >
              <X size={16} />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
