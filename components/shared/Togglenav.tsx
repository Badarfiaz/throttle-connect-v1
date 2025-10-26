import { cn } from "@/lib/utils";
import { Network, Store } from "lucide-react";
import Link from "next/link";

interface ToggleNavProps {
  pathname: string;
}

const Togglenav = ({ pathname }: ToggleNavProps) => {
  return (
    <nav className="flex items-center gap-8 text-primary font-medium">
      <div className="flex bg-card/40 rounded-full p-1 gap-1">
        <Link
          href="/marketplace"
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all",
            pathname.startsWith("/marketplace")
              ? "bg-card text-primary font-semibold shadow-sm"
              : "text-primary/80 hover:text-primary"
          )}
        >
          <Store className="w-4 h-4" />
          Marketplace
        </Link>
        <Link
          href="/networking"
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all",
            pathname.startsWith("/networking")
              ? "bg-card text-primary font-semibold shadow-sm"
              : "text-primary/80 hover:text-primary"
          )}
        >
          <Network className="w-4 h-4" />
          Networking
        </Link>
      </div>
    </nav>
  );
};

export default Togglenav;
