import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { vehicleCategoriesType } from "@/dummydata/networking";
import CardLinkWrapper from "./CardLinkWapper";

interface CategorySectionProps {
  items: vehicleCategoriesType;
}

export default function CategorySection({ items }: CategorySectionProps) {
  const link = `/networking/Club-list/${items?.categoryType}`;

  return (
    <CardLinkWrapper link={link}>
      <HoverCard key={items?.id}>
        <HoverCardTrigger asChild>
          <Card
            className="
              group 
              relative 
              overflow-hidden 
              border border-transparent 
              bg-card/70 
              backdrop-blur-sm 
              hover:border-primary
              hover:shadow-md 
              transition-all 
              duration-300 
              rounded-xl
            "
          >
            <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-t-xl">
              <Image
                src={items?.image || "/images/placeholder.webp"}
                alt={items?.categoryType || "Unknown"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <CardHeader className="p-3 text-center">
              <CardTitle className="text-primary group-hover:text-primary/80 transition-colors">
                {items?.categoryType}
              </CardTitle>
            </CardHeader>
          </Card>
        </HoverCardTrigger>
      </HoverCard>
    </CardLinkWrapper>
  );
}
