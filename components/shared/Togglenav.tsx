import { cn } from "@/lib/utils";
import { Network, Store } from "lucide-react";
import Link from "next/link";

interface ToggleNavProps {
  pathname: string;
}

const Togglenav = ({ pathname }: ToggleNavProps) => {
  return (
    <nav className="flex items-center gap-8 text-[#0B2447] font-medium">
      {/* Pills Group */}
      <div className="flex bg-[#dcecf6] rounded-full p-1 gap-1">
        <Link
          href="/marketplace"
          className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all",
            pathname.startsWith("/marketplace")
              ? "bg-white text-[#0B2447] font-semibold shadow-sm"
              : "text-[#0B2447]/80 hover:text-[#0B2447]"
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
              ? "bg-white text-[#0B2447] font-semibold shadow-sm"
              : "text-[#0B2447]/80 hover:text-[#0B2447]"
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
