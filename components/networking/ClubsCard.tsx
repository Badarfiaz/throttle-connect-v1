"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Club } from "@/dummydata/networking";
import { motion } from "framer-motion";

interface ClubCardProps {
  club: Club;
}

const ClubCard = ({ club }: ClubCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
    >
      <Card className="group relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-b from-secondary/30 to-background shadow-md hover:shadow-xl transition-all duration-500">
        {/* Image Section */}
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={club.image}
            alt={club.name}
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category Tag */}
          <div className="absolute top-4 left-4 bg-primary/90 text-white text-xs uppercase tracking-wide px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
            {club.categoryType.replace("-", " ")}
          </div>
        </div>

        {/* Card Content */}
        <CardHeader className="px-5 pt-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {club.name}
          </h3>
        </CardHeader>

        <CardContent className="px-5 pb-2">
          <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
            {club.description}
          </p>

          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">{club.location}</span>
            </div>
            <span className="font-medium text-text/80">{club.memberCount} Members</span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex justify-between items-center border-t border-border/20 px-5 py-4 backdrop-blur-md">
          <span className="text-xs text-muted-foreground/80 italic">
            By {club.createdBy}
          </span>
          <Button
            size="sm"
            variant="default"
            className="bg-primary text-white hover:bg-secondary transition-colors rounded-xl px-4"
          >
            View Club
          </Button>
        </CardFooter>

        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none" />
      </Card>
    </motion.div>
  );
};

export default ClubCard;
