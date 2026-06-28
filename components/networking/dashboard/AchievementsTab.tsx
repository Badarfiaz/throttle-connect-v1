"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AchievementFormValues } from "./hooks/useClubAchievements";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trophy, Car, Bike } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AchievementsTabProps {
  achievementsList: any[];
  loadingAchievements: boolean;
  isAchievementModalOpen: boolean;
  setIsAchievementModalOpen: (open: boolean) => void;
  editingAchievement: any | null;
  setEditingAchievement: (ach: any | null) => void;
  savingAchievement: boolean;
  handleSaveAchievement: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleDeleteAchievement: (achId: string) => Promise<void>;
  achievementForm: UseFormReturn<AchievementFormValues>;
}

export default function AchievementsTab({
  achievementsList,
  loadingAchievements,
  isAchievementModalOpen,
  setIsAchievementModalOpen,
  editingAchievement,
  setEditingAchievement,
  savingAchievement,
  handleSaveAchievement,
  handleDeleteAchievement,
  achievementForm,
}: AchievementsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Club Achievements</h3>
          <p className="text-sm text-slate-500">Add awards, milestones, and trophies earned by your club</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingAchievement(null);
            setIsAchievementModalOpen(true);
          }}
          className="bg-[#19376D] hover:bg-[#0B2447] text-white"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Achievement
        </Button>
      </div>

      {loadingAchievements ? (
        <Card className="p-8 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </Card>
      ) : achievementsList.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center rounded-xl">
          <p className="text-sm text-slate-500">No achievements added yet. Click "Add Achievement" to celebrate your club's accomplishments!</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievementsList.map((ach) => {
            const AchievementIcon = ach.awardType === "car" ? Car : ach.awardType === "bike" ? Bike : Trophy;
            return (
              <Card key={ach.id} className="border border-slate-150 hover:shadow-md transition duration-200 flex flex-col justify-between h-full bg-white rounded-xl overflow-hidden p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <AchievementIcon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-slate-100 hover:bg-slate-150 text-slate-600 font-semibold py-0.5 px-2.5 capitalize text-[10px] border border-slate-200">
                      {ach.awardType?.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-base">{ach.title}</h4>
                    {ach.date && (
                      <p className="text-xs text-slate-400 font-medium">
                        Awarded: {new Date(ach.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{ach.description}</p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setEditingAchievement(ach);
                      setIsAchievementModalOpen(true);
                    }}
                    className="flex-1 text-xs py-1"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Achievement Dialog */}
      <Dialog open={isAchievementModalOpen} onOpenChange={setIsAchievementModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl bg-white p-6 shadow-xl border overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {editingAchievement ? "Edit Achievement" : "Add Achievement"}
            </DialogTitle>
            <DialogDescription>
              Celebrate your club's accomplishments, milestones, or awards.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveAchievement} className="space-y-4 overflow-y-auto px-1 py-1 max-h-[70vh]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Achievement Title <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. Best Motorcycle Club 2025"
                {...achievementForm.register("title", { required: "Title is required" })}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
              />
              {achievementForm.formState.errors.title && (
                <p className="text-xs text-red-500 font-medium">{achievementForm.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Award Type <span className="text-red-500">*</span></label>
                <Select
                  value={achievementForm.watch("awardType")}
                  onValueChange={(val: any) => achievementForm.setValue("awardType", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trophy">🏆 Trophy</SelectItem>
                    <SelectItem value="car">🚗 Car Award</SelectItem>
                    <SelectItem value="bike">🏍 Bike Award</SelectItem>
                    <SelectItem value="milestone">📍 Milestone</SelectItem>
                    <SelectItem value="other">🌟 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Awarded <span className="text-red-500">*</span></label>
                <Input
                  type="date"
                  {...achievementForm.register("date", { required: "Date is required" })}
                  className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
                />
                {achievementForm.formState.errors.date && (
                  <p className="text-xs text-red-500 font-medium">{achievementForm.formState.errors.date.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description <span className="text-red-500">*</span></label>
              <Textarea
                placeholder="Describe the milestone or award, how it was won, etc..."
                rows={3}
                {...achievementForm.register("description", { required: "Description is required" })}
                className="border-slate-200/80 focus-visible:ring-1 focus-visible:ring-[#19376D]"
              />
              {achievementForm.formState.errors.description && (
                <p className="text-xs text-red-500 font-medium">{achievementForm.formState.errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsAchievementModalOpen(false);
                  setEditingAchievement(null);
                }}
                disabled={savingAchievement}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#19376D] hover:bg-[#0B2447] text-white"
                disabled={savingAchievement}
              >
                {savingAchievement ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  "Save Achievement"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
