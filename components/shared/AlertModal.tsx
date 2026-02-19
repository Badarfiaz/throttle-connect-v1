import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

type AlertType = "success" | "error" | "info";

interface AlertModalProps {
  type: AlertType;
  message: string;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const AlertModal: FC<AlertModalProps> = ({ type, message, open, setOpen }) => {
  const bgColor =
    type === "success"
      ? "bg-green-100 border-green-500"
      : type === "error"
      ? "bg-red-100 border-red-500"
      : "bg-blue-100 border-blue-500";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className={`border-l-4 ${bgColor} rounded-md p-4 shadow-md max-w-sm`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-lg capitalize">{type}</AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-sm text-gray-700">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end">
          <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
