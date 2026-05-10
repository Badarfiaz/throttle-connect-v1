import { Card } from "@/components/ui/card";
import type { MarketplaceStore } from "@/types/marketplace";
import StoreBanner from "./StoreProfile/StoreBanner";
import StoreHeader from "./StoreProfile/StoreHeader";
import OverviewCard from "./StoreProfile/OverviewCard";
import ContactCard from "./StoreProfile/ContactCard";
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
    <div className="min-h-screen bg-slate-50/70 font-sans">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-3 py-6 md:px-4">
        <Card className="overflow-hidden border-slate-200 p-0 shadow-sm">
          <StoreBanner store={store} />
          <StoreHeader store={store} />
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-4 md:col-span-1">
            <ContactCard store={store} />
          </div>

          <div className="md:col-span-2">
            <OverviewCard store={store} />
          </div>
        </div>
        <StoreProductsSection store={store} />
      </div>
    </div>
  );
}
