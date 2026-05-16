import Image from "next/image";
import Link from "next/link";

const MarketplaceBanner = () => {
  return (
    <div className="w-full mt-8 mb-4 overflow-hidden">
      <Link href="/marketplace" className="block relative w-full h-[150px] sm:h-[250px] md:h-[350px] lg:h-[400px] transition-transform hover:scale-[1.01]">
        <Image
          src="/images/jaecoo-banner.png.jpeg"
          alt="Marketplace Promotion Banner"
          fill
          className="object-cover object-center scale-[1.35]"
          priority
        />
      </Link>
    </div>
  );
};

export default MarketplaceBanner;