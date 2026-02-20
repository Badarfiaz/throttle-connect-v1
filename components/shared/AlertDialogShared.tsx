"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
type AlertDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle: string;
  dialogDescription: string;
  routeLink: string;
  btnLabel: string;
};
export function AlertDialogShared({
  isOpen,
  onOpenChange,
  dialogTitle,
  dialogDescription,
  routeLink,
  btnLabel,
}: AlertDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="w-full sm:w-auto"
            onClick={() => router.push(routeLink || "/")}
          >
            {btnLabel}
          </Button>
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
