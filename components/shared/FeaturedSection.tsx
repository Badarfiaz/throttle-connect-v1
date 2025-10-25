import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { whyThrottleConnectData } from "@/dummydata/shared";
import Title from "@/components/shared/Title";
import SharedButton from "./SharedButton";

const FeaturedSection = () => {
  const { title, description, buttonText, features } = whyThrottleConnectData;

  return (
    <section className="bg-background text-text py-20 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Header */}
        {/* <h2 className="text-4xl font-bold tracking-tight">{title}</h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p> */}
        <Title title={title} description={description} />

        <SharedButton label={buttonText} />

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div key={feature.id}>
              <Card className="border border-border/50 gap-2 py-6 bg-secondary/40 backdrop-blur-sm hover:bg-secondary/60 hover:shadow-lg transition-all duration-300 rounded-2xl">
                <CardHeader>
                  <div className="text-5xl mb-3">{feature.icon}</div>
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground ">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
