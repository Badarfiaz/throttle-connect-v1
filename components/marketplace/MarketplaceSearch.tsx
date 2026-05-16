"use client";

import { MapPin, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const popularCities = [
  "Pakistan",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Multan",
  "Quetta",
  "Faisalabad",
];

export default function MarketplaceSearch() {
  const [location, setLocation] = useState("Pakistan");

  return (
    <div className="w-full bg-[#f2f4f5] py-5 sticky top-[40px] md:top-[68px] z-40 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-2 md:gap-0">
        {/* Location Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full md:w-[300px] h-[48px] bg-white border-2 border-gray-300 md:border-r-0 rounded md:rounded-none md:rounded-l flex items-center justify-between px-3 cursor-pointer hover:border-[#002f34] transition-colors focus:border-[#002f34] z-10 focus:outline-none">
              <div className="flex items-center gap-3 w-full">
                <MapPin size={20} className="text-[#3a77ff] min-w-[20px]" />
                <span className="w-full text-left text-[15px] bg-transparent text-[#002f34] truncate outline-none select-none">
                  {location}
                </span>
              </div>
              <ChevronDown size={24} className="text-[#002f34] min-w-[24px]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] md:w-[300px] max-h-[300px] overflow-y-auto">
            {popularCities.map((city) => (
              <DropdownMenuItem
                key={city}
                className="cursor-pointer text-[15px] text-[#002f34] py-2.5"
                onClick={() => setLocation(city)}
              >
                <MapPin size={16} className="text-gray-400 mr-2" />
                {city}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar */}
        <div className="flex w-full flex-1 h-[48px]">
          <div className="flex-1 flex items-center bg-white border-2 border-r-0 border-gray-300 rounded-l md:rounded-none focus-within:border-[#002f34] focus-within:z-20 relative px-4 hover:border-[#002f34] transition-colors">
            <input
              type="text"
              placeholder="Find Cars, Mobile Phones and more..."
              className="w-full h-full outline-none text-[15px] bg-transparent text-[#002f34] placeholder:text-gray-500"
            />
          </div>
          <button className="h-[48px] px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-r flex items-center justify-center gap-2 transition-colors z-10">
            <Search
              size={22}
              className="text-white font-bold"
              strokeWidth={2.5}
            />
            <span className="hidden md:block text-base">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
