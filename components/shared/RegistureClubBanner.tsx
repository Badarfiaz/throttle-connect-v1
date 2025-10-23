 import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe2, ClipboardPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const RegistureClubBanner = () => {
  return (
    <section className="bg-background text-text py-20 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Join the Throttle Connect Club Network
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you’re looking to register your own club or discover new ones, we’ve got you covered. 
            Connect with auto enthusiasts, explore meetups, and grow your community.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button  size="lg" className="rounded-2xl px-8">
           <Link href={'/networking/Club-Registration'}>Register Club</Link>  
          </Button>
          <Button size="lg" variant="outline" className="rounded-2xl px-8">
            Find a Club
          </Button>
        </motion.div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Enthusiasts Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="h-full"
          >
            <Card className="bg-secondary/20 border-none hover:shadow-lg transition">
              <CardContent className="p-6 text-center space-y-4">
                <Users className="w-10 h-10 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Thousands of Enthusiasts</h3>
                <p className="text-muted-foreground">
                  Join a growing network of clubs and enthusiasts around the globe.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Global Community */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="h-full"
          >
            <Card className="bg-secondary/20 border-none hover:shadow-lg transition">
              <CardContent className="p-6 text-center space-y-4">
                <Globe2 className="w-10 h-10 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Global Club Community</h3>
                <p className="text-muted-foreground">
                  Explore meetups and auto events in your city or across the world.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Easy Registration */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="h-full"
          >
            <Card className="bg-secondary/20 border-none hover:shadow-lg transition">
              <CardContent className="p-6 text-center space-y-4">
                <ClipboardPlus className="w-10 h-10 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Easy Club Registration</h3>
                <p className="text-muted-foreground">
                  Create a profile for your club and start connecting instantly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegistureClubBanner;
