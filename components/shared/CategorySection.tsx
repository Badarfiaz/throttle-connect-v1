 
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { vehicleCategories } from "@/dummydata/networking";
import Link from "next/link";
 
export default function CategorySection() {
  return (
    <section className="py-16 bg-gradient-to-b from-[#f9fbff] to-[#eef4ff]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B2447] tracking-tight">
              Explore Categories
          </h2>
          <p className="text-[#19376D]/80 mt-2 text-sm md:text-base max-w-md mx-auto">
            Discover your next ride — from elegant sedans to powerful
            superbikes.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {vehicleCategories.map((category) => (
            <Link href={`/networking/Club-list/${category.categoryType}`}>
            <HoverCard key={category.id}>
              <HoverCardTrigger asChild>
                <Card className="group relative overflow-hidden border border-transparent bg-white/70 backdrop-blur-sm hover:border-[#BFD7FF] hover:shadow-md transition-all duration-300 rounded-xl">
                  <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-t-xl">
                    <Image
                      src={category.image}
                      alt={category.categoryType}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <CardHeader className="p-3 text-center">
                    <CardTitle className="text-base font-semibold text-[#0B2447] group-hover:text-[#19376D] transition-colors">
                      {category.categoryType}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </HoverCardTrigger>
            </HoverCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
