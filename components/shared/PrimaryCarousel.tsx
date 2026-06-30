import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getResponsiveClasses,
  ResponsiveConfig,
} from "@/ulity/responsiveClass";
import { cn } from "@/lib/utils";

interface PrimaryCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  multiple?: number; // fallback if responsive not provided
  responsive?: ResponsiveConfig;
  className?: string;
}

function PrimaryCarousel<T>({
  items,
  renderItem,
  multiple = 1,
  responsive,
  className,
}: PrimaryCarouselProps<T>) {
  // Use responsive config if provided, otherwise fall back to multiple
  const mobileItems = responsive?.mobile ?? 1;
  const tabletItems =
    responsive?.tablet ??
    (multiple > 1 ? Math.max(2, Math.floor(multiple / 2)) : multiple);
  const desktopItems = responsive?.desktop ?? multiple;

  const responsiveClasses = getResponsiveClasses(
    mobileItems,
    tabletItems,
    desktopItems,
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className={cn("w-full", className)}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className={`pl-2 md:pl-4 ${responsiveClasses}`}
          >
            <div className="w-full h-full">{renderItem(item, index)}</div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

export default PrimaryCarousel;
