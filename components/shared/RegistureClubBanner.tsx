import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe2, ClipboardPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Title from "@/components/shared/Title";
import SharedButton from "./SharedButton";
const cardData = [
  {
    icon: Users,
    title: "Thousands of Enthusiasts",
    description:
      "Join a growing network of clubs and enthusiasts around the globe.",
  },
  {
    icon: Globe2,
    title: "Global Club Community",
    description:
      "Explore meetups and auto events in your city or across the world.",
  },
  {
    icon: ClipboardPlus,
    title: "Easy Club Registration",
    description:
      "Create a profile for your club and start connecting instantly.",
  },
];

interface RegistureClubProps {
  title?: string;
  description?: string;
  ctaButton1?: string;
  ctaButton2?: string;
}
const RegistureClubBanner = ({
  title,
  description,
  ctaButton1,
  ctaButton2,
}: RegistureClubProps) => {
  return (
    <section className="bg-background text-text py-20 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title title={title} description={description} />
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href={"/networking/Club-Registration"}>
            <SharedButton label={ctaButton1} />
          </Link>
          <SharedButton variant="outline" label={ctaButton2} />
        </motion.div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {cardData.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="h-full"
              >
                <Card className="bg-secondary/20 border-none hover:shadow-lg transition">
                  <CardContent className="p-6 text-center space-y-4">
                    <Icon className="w-10 h-10 mx-auto text-primary" />
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RegistureClubBanner;
