import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PrimaryCarouselProps<T> {
  /** Array of items to render in the carousel */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Number of items visible per view */
  multiple?: number;
  /** Optional className for container */
  className?: string;
}

function PrimaryCarousel<T>({
  items,
  renderItem,
  multiple = 1,
  className,
}: PrimaryCarouselProps<T>) {
  const itemWidth = 100 / multiple;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className={className}
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            style={{
              flex: `0 0 ${itemWidth}%`,
            }}
            className="pl-2 md:pl-4"
          >
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default PrimaryCarousel;
