import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Club } from "@/dummydata/networking";

export type CategoryType = "Sports" | "Classic" | "Offroad" | "EV" | "Motorcycle";

 
interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-background text-text">
      {/* Image Section */}
      <div className="relative w-full h-52">
        <Image
          src={club.image}
          alt={club.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-primary/80 text-white text-xs px-3 py-1 rounded-full">
          {club.categoryType}
        </div>
      </div>

      {/* Content Section */}
      <CardHeader>
        <h3 className="text-lg font-semibold">{club.name}</h3>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-400 line-clamp-2">{club.description}</p>

        <div className="flex justify-between items-center mt-3 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{club.location}</span>
          </div>
          <span>{club.memberCount} Members</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t border-gray-700 pt-3">
        <span className="text-xs text-gray-400">By {club.createdBy}</span>
        <Button size="sm" className="bg-primary hover:bg-secondary text-white">
          View Club
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;
