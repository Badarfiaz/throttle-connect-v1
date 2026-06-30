import React from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Plus,
  Car,
  Compass,
  ArrowUpRight,
  Calendar
} from "lucide-react";
import { getMarketplaceFeaturedProducts } from "@/ulity/marketplaceProducts";
import UpcomingEventsSection from "@/components/networking/UpcomingEventsSection";
import FeaturedClubsSection from "@/components/networking/FeaturedClubsSection";
import FeaturedServicesSection from "@/components/marketplace/FeaturedServicesSection";
import ProductCard from "@/components/marketplace/ProductCard";
import type { MarketplaceProduct } from "@/types/marketplace";

const staticProducts: MarketplaceProduct[] = [
  {
    id: "static-p1",
    ownerUid: "static-owner",
    productName: "MT Stinger Helmet",
    category: "Riding Gear",
    price: 12500,
    imageurl: {
      ref: "",
      url: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=400"
    },
    stock: 10,
  },
  {
    id: "static-p2",
    ownerUid: "static-owner",
    productName: "Alpinestars Jacket",
    category: "Riding Jacket",
    price: 28000,
    imageurl: {
      ref: "",
      url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400"
    },
    stock: 5,
  },
  {
    id: "static-p3",
    ownerUid: "static-owner",
    productName: "Dainese Leather Gloves",
    category: "Bike Gloves",
    price: 6500,
    imageurl: {
      ref: "",
      url: "https://images.unsplash.com/photo-1627384113710-424c9181ebbb?auto=format&fit=crop&q=80&w=400"
    },
    stock: 15,
  },
  {
    id: "static-p4",
    ownerUid: "static-owner",
    productName: "Carbon Fiber Spoiler",
    category: "Car Accessories",
    price: 18500,
    imageurl: {
      ref: "",
      url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400"
    },
    stock: 2,
  }
];

const galleryImages = [
  "https://images.openai.com/static-rsc-4/vpXiLi-Kuh9b_IDW3V83vZAZDw6Wp_XOTZvSVPu-9-aWbfqRDIOa1KK9jsmZYYE2RadjnkqirnbT_F0FFnrKE3fVp0yje9aYbufOjCT9e7RROhsxwrSToVr9Fb8GbGLunzHGD9C76YbXWrF4lU4pWShfFZAx9ShE55zodHtE7uzfYl4uE_LhqjabFc7W2QPE?purpose=fullsize",
  "https://images.openai.com/static-rsc-4/AbctnWLNFCgC6xdqi-IMI5vW2hup74u3l36WFgQVzSa-IVoMWL4ktf28BWKS-ZvRmtzT3QoprgpFeF5y10u88MWw7DyJKI9e3euzxRfROpCM6t0UJyytaR_b9O7_s3lkUtQ2xZUBLESSPa0cIiWuLEZ1z9_Z-DLuGn_rTtXsvv5XQ1woc4biGVHgURcbRdjR?purpose=fullsize",
  "https://images.openai.com/static-rsc-4/6kfX-CdTdDBDAaby-vHwP08SJvMofgBZp96t1LoTiFcbCRzqDx56AeiuKke8G9gebe5ijYnnN7FFUG5GxZt_aIsRmURt7UEOl0HiVWp3jZnRIfi8O_UuxaVMF8zdv7dcyTrOoefOYODzkIE7W3TVJzT0fJvkrL0hhD_lMOMFvPSrDYbkISTSgRuXHd_g7bkT?purpose=fullsize",
  "https://images.openai.com/static-rsc-4/skyrhE7s8CB-TBzzLbgH3DRri4CbohA4urmH3a0yXDVtJb3mJyZSROqhNRAUwMTqDkzIZvges9CYkGBUySsyeZ6pw17hv1zZfTl0ynFk-gSdmn2Ci7D687qL-POMlHnwtRV9O_VVnjuUADEZgzpmY1U6mPOtjUQEeqx8kN0cOOAZZrA7GpnynClWS4JD3LBH?purpose=fullsize",
  "https://images.openai.com/static-rsc-4/Yb4s5RqbcA9W7p64A6Z1BKJ2SNNyLs2p2CqZzDDKq_7FyF7OOUWphFNBImUBoJqRVzroAb7MZfiZLm04hNtaLbGme40V90oixTinSeuYmQybjDQUIFDEIy_6CWTBGl276UBonawGi3Jz7nEHp1P9IOxAhcFuXc1a_6UhXBb9fKddZLN-WbzQ6uOzRv0GNq4H?purpose=fullsize",
  "https://images.openai.com/static-rsc-4/SdNuW9CgHCTHbT3Lw1kX9M-WH9Ogk_h6NpgvwC5EBUYGb4vl0pzFaP7UIqi5VtwXwLChGv7yFn9tODQJ2MwLwAGXrRF67KKmQzPWKT43Q9LTX_UMvcChysOvmUNiIUlBeLnv_TnsShJx3sUjEgr1q-DfyHEdfeiz4GGC9afXSQdCdAdkWd3nyXRqyIY2V4tj?purpose=fullsize"
];

export default async function LandingPage() {
  let productsList: MarketplaceProduct[] = [];

  try {
    const products = await getMarketplaceFeaturedProducts();
    if (products && products.length > 0) {
      productsList = products.slice(0, 4);
    }
  } catch (err) {
    console.error("Error fetching dynamic products on server:", err);
  }

  const finalProducts = productsList.length > 0 ? productsList : staticProducts;

  return (
    <div className="bg-[#f8fcff] text-[#0B2447] min-h-screen overflow-x-hidden antialiased">
      {/* Brand highlight gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 bg-[radial-gradient(circle_at_top,rgba(25,55,109,0.08),transparent_60%)] z-0" />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 pt-12 pb-16 overflow-hidden border-b border-[#0C6792]/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1920" 
            alt="Automotive Group" 
            className="w-full h-full object-cover object-center opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fcff] via-[#f8fcff]/90 to-[#f8fcff]/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 pt-8">
          <span className="inline-block bg-[#19376D]/10 text-[#19376D] border border-[#19376D]/20 px-4 py-1 text-xs font-mono uppercase tracking-widest rounded-full font-bold shadow-xs">
            🇵🇰 Pakistan's Automotive Network
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0B2447] leading-tight">
            Pakistan's Automotive <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#19376D] via-[#0C6792] to-[#19376D]">
              Community & Marketplace
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[#0B2447]/70 max-w-3xl mx-auto leading-relaxed font-medium">
            Connect with clubs, discover exciting events, find trusted workshops, and buy/sell automotive products—all in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Link 
              href="/networking" 
              className="w-full sm:w-auto px-8 py-4 bg-[#19376D] hover:bg-[#0B2447] text-white font-bold rounded-2xl shadow-[0_4px_16px_rgba(25,55,109,0.2)] transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
              Join The Community
            </Link>
            <Link 
              href="/marketplace" 
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-[#19376D] font-bold rounded-2xl shadow-xs transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Explore Marketplace
            </Link>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/70 backdrop-blur-md border border-[#0C6792]/10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          {[
            { label: "Members", value: "5000+" },
            { label: "Clubs", value: "100+" },
            { label: "Events", value: "300+" },
            { label: "Products", value: "1000+" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-3">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#19376D] tracking-tight">{stat.value}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: What Is ThrottleConnect? */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative h-[300px] sm:h-[450px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
            <img 
              src="/bike2.jpeg" 
              alt="Automotive Community" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/65 shadow-md">
              <p className="text-sm font-bold text-[#0B2447] flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-[#0C6792]" /> Connecting Enthusiasts Nationwide
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="inline-block bg-[#19376D]/10 text-[#19376D] border border-[#19376D]/20 px-3 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-wider font-semibold">
              About ThrottleConnect
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B2447] leading-tight">
              More Than Just <br className="hidden sm:inline" />
              a Marketplace
            </h2>
            <div className="h-1 w-20 bg-[#19376D] rounded-full" />
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
              ThrottleConnect brings together riders, drivers, clubs, workshops, creators, and automotive businesses. 
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Whether you want to join verified clubs, attend upcoming events, discover auto detailing/maintenance services, or shop high-quality products from trusted local sellers, everything is engineered into a single unified platform.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-[#19376D]/10 text-[#19376D] rounded-lg mt-1 shrink-0 border border-[#19376D]/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B2447]">Verified Clubs</p>
                  <p className="text-xs text-slate-500 font-medium">Only authentic clubs and hosts.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-[#19376D]/10 text-[#19376D] rounded-lg mt-1 shrink-0 border border-[#19376D]/20">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B2447]">Top Marketplace</p>
                  <p className="text-xs text-slate-500 font-medium">Secure listings for gear & parts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Two Main Pillars */}
      <section className="py-16 bg-[#eef5f9] border-y border-[#0C6792]/10">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-2">
          {/* Card 1: Networking */}
          <div className="relative group overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 hover:border-[#19376D]/30 transition duration-300 flex flex-col justify-between shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#19376D]/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />
            
            <div className="space-y-4">
              <div className="text-4xl">🏍️</div>
              <h3 className="text-2xl font-extrabold text-[#0B2447]">Networking</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Expand your automotive connections. Join group rides, meet like-minded drivers, and become a part of active local auto clubs.</p>
              <ul className="space-y-2 pt-2">
                {["Join Auto & Riding Clubs", "Attend Meetups & Runs", "Meet Riders & Drivers", "Discover Automotive Communities"].map((feat, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                    <span className="h-1.5 w-1.5 bg-[#19376D] rounded-full" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6">
              <Link 
                href="/networking" 
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#19376D] hover:text-[#0B2447] transition"
              >
                Explore Clubs <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Marketplace */}
          <div className="relative group overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 hover:border-[#19376D]/30 transition duration-300 flex flex-col justify-between shadow-xs">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#19376D]/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-500" />

            <div className="space-y-4">
              <div className="text-4xl">🛒</div>
              <h3 className="text-2xl font-extrabold text-[#0B2447]">Marketplace</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Buy and sell automotive parts, helmets, riding jackets, riding gear, and accessories. Connect with trusted sellers across Pakistan.</p>
              <ul className="space-y-2 pt-2">
                {["Buy & Sell Products", "Automotive Accessories", "Premium Parts & Riding Gear", "Trusted & Verified Sellers"].map((feat, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                    <span className="h-1.5 w-1.5 bg-[#19376D] rounded-full" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Link 
                href="/marketplace" 
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#19376D] hover:text-[#0B2447] transition"
              >
                Browse Marketplace <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      <UpcomingEventsSection displayLimit={3} />

      {/* Section 5: Featured Clubs */}
      <FeaturedClubsSection />

      {/* Section 6: Marketplace Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="inline-block bg-[#19376D]/10 text-[#19376D] border border-[#19376D]/20 px-3 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-wider font-semibold">
              Auto shop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2447]">Popular Listings in Marketplace</h2>
          </div>
          <Link 
            href="/marketplace" 
            className="inline-flex items-center gap-1 text-sm font-bold text-[#19376D] hover:underline shrink-0"
          >
            Explore Marketplace <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {finalProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              isLandingPage={true} 
            />
          ))}
        </div>
      </section>

      {/* Section 7: Service Providers */}
      <FeaturedServicesSection />

      {/* Section 8: Why ThrottleConnect? */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="inline-block bg-[#19376D]/10 text-[#19376D] border border-[#19376D]/20 px-3 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-wider font-semibold">
            Key Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B2447]">Why ThrottleConnect?</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Automotive Focused",
              desc: "Built specifically for Pakistan's growing riding, driving, and performance tuning community.",
              icon: <Car className="h-6 w-6" />
            },
            {
              title: "Trusted Clubs",
              desc: "Interact with verified motorcycle and car clubs, verify credentials, and apply safely.",
              icon: <ShieldCheck className="h-6 w-6" />
            },
            {
              title: "Premium Marketplace",
              desc: "Quickly browse, buy, and sell automotive gear, helmets, custom exhausts, and spares.",
              icon: <ShoppingBag className="h-6 w-6" />
            },
            {
              title: "Discover Events",
              desc: "Never miss breakfast runs, auto shows, track days, and multi-club meetups in your area.",
              icon: <Calendar className="h-6 w-6" />
            }
          ].map((why, idx) => (
            <div 
              key={idx} 
              className="border border-slate-200 bg-white p-6 rounded-2xl space-y-3 hover:border-[#19376D]/20 transition duration-300 shadow-xs"
            >
              <div className="h-10 w-10 bg-[#19376D]/5 text-[#19376D] rounded-xl flex items-center justify-center border border-[#19376D]/20 shrink-0">
                {why.icon}
              </div>
              <h4 className="font-extrabold text-[#0B2447] text-base">{why.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{why.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: Community Gallery */}
      <section className="py-20 bg-[#eef5f9] border-t border-[#0C6792]/10 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-block bg-[#19376D]/10 text-[#19376D] border border-[#19376D]/20 px-3 py-0.5 rounded-full font-mono text-[11px] uppercase tracking-wider font-semibold">
              Enthusiasts Grid
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B2447]">Community Moments</h2>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
            {galleryImages.map((imgUrl, idx) => (
              <div key={idx} className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:scale-[1.02] transition duration-300">
                <img src={imgUrl} alt={`Community moment ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/10 hover:bg-slate-900/0 transition duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="relative overflow-hidden py-24 px-6 border-t border-slate-200 text-center bg-white">
        {/* Glow highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#19376D]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0B2447] leading-tight">
            Ready to Join Pakistan's <br className="hidden sm:inline" />
            Automotive Community?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-semibold">
            Connect with enthusiasts, discover events, and grow your automotive network.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/networking" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#19376D] hover:bg-[#0B2447] text-white font-bold rounded-xl shadow-[0_4px_16px_rgba(25,55,109,0.15)] transition transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              Get Started
            </Link>
            <Link 
              href="/networking" 
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#19376D] font-bold rounded-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="h-4 w-4" /> Create Club
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
