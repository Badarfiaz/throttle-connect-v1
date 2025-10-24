import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  layout?: 1 | 2;
  title: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  imageSrc?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  layout = 1,
  title,
  subtitle,
  ctaText = "Learn More",
  onCtaClick,
  imageSrc,
}) => {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-b-xl text-center shadow-md",
        "md:h-[600px] h-[450px]",
        layout === 1
          ? "bg-[url('/images/HeroBanner.jpg')] bg-cover bg-center"
          : "bg-[url('/images/hero-bg-2.jpg')] bg-cover bg-center"
      )}
    >
      {/* Overlayy */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-smx z-0" />

      <div className="relative z-10 max-w-3xl px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-white/90 leading-relaxed">
            {subtitle}
          </p>
        )}

        {ctaText && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={onCtaClick}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-semibold shadow-lg"
            >
              {ctaText}
            </Button>
          </div>
        )}
      </div>

      {/* Optional side image or decorative layout element for layout 2 */}
      {layout === 2 && imageSrc && (
        <div className="absolute bottom-0 right-0 w-1/2 hidden md:block">
          <Image
            src={imageSrc}
            alt="Hero image"
            width={600}
            height={600}
            className="object-contain drop-shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};

export default HeroSection;
