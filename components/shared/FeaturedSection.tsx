import { Button } from "@/components/ui/button";
import { whyThrottleConnectData } from "@/dummydata/shared";
import Title from "@/components/shared/Title";
import SharedButton from "./SharedButton";

const FeaturedSection = () => {
  const { title, description, features } = whyThrottleConnectData;

  return (
    <section className="bg-white text-gray-900 py-16 px-6 relative overflow-hidden border-t border-gray-100">

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <Title title={title} description={description} />
        </div>

        {/* Features Grid - Compact & Horizontal */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.id} className="flex items-start gap-5 group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
