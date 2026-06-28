"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users, Phone, ShieldCheck, MapPin, Eye } from "lucide-react";

interface MembersTabProps {
  pendingRequests: any[];
  loadingRequests: boolean;
  actioningRequests: string[];
  handleApprove: (requestId: string, requesterId: string) => Promise<void>;
  handleReject: (requestId: string, requesterId: string) => Promise<void>;
  activeMembers: any[];
  loadingMembers: boolean;
  removingIds: string[];
  handleRemoveMember: (memberId: string) => Promise<void>;
}

export default function MembersTab({
  pendingRequests,
  loadingRequests,
  actioningRequests,
  handleApprove,
  handleReject,
  activeMembers,
  loadingMembers,
  removingIds,
  handleRemoveMember,
}: MembersTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Section 1: Join Requests */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Pending Join Requests
            {pendingRequests.length > 0 && (
              <Badge className="bg-amber-500 text-white ml-2 animate-pulse">
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
                    <Link href={`/networking/member/${req.userId}`} className="flex items-start gap-4 hover:opacity-80 transition group flex-1">
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
                        <h4 className="font-semibold text-slate-900 text-sm group-hover:text-[#19376D] transition flex items-center gap-1">
                          {req.user?.name}
                          <Eye className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#19376D] transition-all" />
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="h-3 w-3 text-emerald-500" />
                          {req.user?.phone}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Requested {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] font-semibold text-[#19376D] hover:underline pt-0.5">
                          View Profile & Credentials
                        </p>
                      </div>
                    </Link>

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
                    <Link href={`/networking/member/${member.id}`} className="flex items-center gap-3 hover:opacity-80 transition group">
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
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-[#19376D] transition flex items-center gap-1">
                          {member.name}
                          <Eye className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#19376D] transition-all" />
                        </p>
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
                    </Link>
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
  );
}
