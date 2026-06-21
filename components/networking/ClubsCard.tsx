"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Club } from "@/types/main";
import AnimateMotion from "../shared/AnimateMotion";
import Link from "next/link";
import SharedButton from "../shared/SharedButton";

interface ClubCardProps {
  club: Club;
  isLandingPage?: boolean;
}

const ClubCard = ({ club, isLandingPage }: ClubCardProps) => {
  return (
    <AnimateMotion
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
    >
      <Card
        ispadding={false}
        className="group relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-b from-secondary/30 to-background shadow-md hover:shadow-xl transition-all duration-500"
      >
        {/* Image Section */}
        <div className="relative w-full h-48 xs:h-52 sm:h-56 overflow-hidden">
          <Image
            src={club.logoUrl || club.image || ""}
            alt={club.name}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category Tag */}
          <div className="absolute top-4 left-4 bg-secondary/90 text-primary text-xs uppercase tracking-wide px-2 xs:px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
            {club.categoryType.replace("-", " ")}
          </div>
        </div>

        {/* Card Content */}
        <CardHeader className="px-4 xs:px-5 pt-3 xs:pt-4">
          <h3 className="text-base xs:text-lg font-semibold text-primary group-hover:text-primary transition-colors">
            {club.name}
          </h3>
        </CardHeader>

        <CardContent className="px-4 xs:px-5 pb-2">
          <p className="text-xs xs:text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          <div className="flex justify-between items-center mt-3 xs:mt-4 text-xs xs:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 xs:w-4 xs:h-4 text-primary" />
              <span className="truncate">{club.location}</span>
            </div>
            <span className="font-medium text-text/80 text-xs xs:text-sm">
              {club.memberCount} Members
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center border-t border-border/20 px-4 xs:px-5 py-3 xs:py-4 backdrop-blur-md">
          <span className="text-xs text-muted-foreground/80 italic truncate max-w-[120px] xs:max-w-none">
            By {club.createdBy}
          </span>
          <Link href={`/networking/Club-Profile/${club.id}`}>
            <SharedButton size="sm" label="View Club" />
          </Link>
        </CardFooter>

        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none" />
      </Card>
    </AnimateMotion>
  );
};

export default ClubCard;
