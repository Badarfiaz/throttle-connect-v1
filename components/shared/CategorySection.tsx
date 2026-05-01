import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import CardLinkWrapper from "./CardLinkWapper";
import { MarketplaceStoreCard } from "@/types/marketplace";
import { allowedPageType } from "@/types/CommonType";

type CategorySectionProps = {
  items: MarketplaceStoreCard;
  pageType?: allowedPageType;
};

export default function CategorySection({
  items,
  pageType,
}: CategorySectionProps) {
  console.log("CategorySection", items);
  const link = `${
    pageType === "marketplace"
      ? `/marketplace/storeProfile/${items?.slugUrl}`
      : `/networking/Club-list/${items?.slugUrl}`
  }`;
  return (
    <CardLinkWrapper link={link}>
      <HoverCard key={items?.id}>
        <HoverCardTrigger asChild>
          <Card
            ispadding={false}
            className="group relative w-full overflow-hidden border border-transparent bg-white/70 backdrop-blur-sm hover:border-[#BFD7FF] hover:shadow-md transition-all duration-300 rounded-xl"
          >
            <div className="relative w-full h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-xl">
              <Image
                src={items?.logoUrl || "/images/placeholder.webp"}
                alt={"Unknown"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <CardHeader className="p-3 text-center">
              <CardTitle className="text-base font-semibold text-[#0B2447] group-hover:text-[#19376D] transition-colors">
                {items?.title || "Unknown Category"}
              </CardTitle>
            </CardHeader>
          </Card>
        </HoverCardTrigger>
      </HoverCard>
    </CardLinkWrapper>
  );
}
