import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import AnimateMotion from "./AnimateMotion";
import SharedButton from "./SharedButton";
import { cardDataType } from "@/dummydata/networking";

interface RegistureClubProps {
  title?: string;
  description?: string;
  ctaButton1?: string;
  ctaButton2?: string;
  cardData?: cardDataType[];
}

const RegistureClubBanner = ({
  title,
  description,
  ctaButton1,
  ctaButton2,
  cardData,
}: RegistureClubProps) => {
  return (
    <section className="relative py-16 px-6  overflow-hidden border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          {/* Left: Text Content */}
          <div className="text-left space-y-6 max-w-2xl flex-1">
            <AnimateMotion
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                {title || "Unlock Your Automotive Potential"}
              </h2>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                {description ||
                  "Join a community of enthusiasts and professionals. List your business or find the perfect club today."}
              </p>
            </AnimateMotion>

            <AnimateMotion
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/networking/Club-Registration">
                <SharedButton
                  label={ctaButton1 || "Get Started"}
                  className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                />
              </Link>
              {ctaButton2 && (
                <SharedButton
                  variant="outline"
                  label={ctaButton2 || "Learn More"}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                />
              )}
            </AnimateMotion>
          </div>

          {/* Right: Minimal Features List (No Big Cards) */}
          <div className="w-full  lg:w-auto flex-1 max-w-xl">
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {cardData?.slice(0, 4).map((card, index) => {
                const Icon = card.icon;
                return (
                  <AnimateMotion
                    key={index}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-xl  bg-gray-100 transition-colors duration-200"
                  >
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-snug line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </AnimateMotion>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistureClubBanner;
