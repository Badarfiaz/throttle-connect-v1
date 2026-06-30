import { Card } from "@/components/ui/card";
import type { MarketplaceStore } from "@/types/marketplace";
import StoreBanner from "./StoreProfile/StoreBanner";
import StoreHeader from "./StoreProfile/StoreHeader";
import OverviewCard from "./StoreProfile/OverviewCard";
import SellerProfileCard from "./SellerProfileCard";
import StoreProductsSection from "../shared/StoreProductsSection";

type Props = {
  store?: MarketplaceStore | null;
  loading?: boolean;
};

const mockStore: MarketplaceStore = {
  id: "sarnex-chemicals",
  title: "Sarnex Chemicals",
  bannerUrl: null,
  logoUrl: null,
  businessType: ["retailer"],
  completed: true,
  overview: "",
  location: { area: "", city: "", province: "" },
};

export default function StoreProfilePage({
  store = mockStore,
  loading = false,
}: Props) {
  if (loading) return <div className="min-h-screen" />;

  if (!store || !store.id)
    return <div className="min-h-screen">Store Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-6 md:py-8 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
          <StoreBanner store={store} />
          <StoreHeader store={store} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Main Content Area */}
          <div className="flex flex-col gap-6 lg:col-span-8 order-2 lg:order-1">
            <OverviewCard store={store} />
          </div>

          {/* Sidebar Area */}
          <div className="flex flex-col gap-6 lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-24">
              <SellerProfileCard
                store={store}
                showMetadata={true}
                showStoreLink={false}
              />
            </div>
          </div>
        </div>
        
        <StoreProductsSection store={store} />
      </div>
    </div>
  );
}
