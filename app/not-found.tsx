"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Rocket, Construction } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-6 rounded-full">
            <Rocket className="h-10 w-10 text-primary animate-bounce" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          We’re Building Something{" "}
          <span className="text-primary">Extraordinary</span> 🚀
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist — yet. But behind the
          scenes, we’re crafting an experience for automotive lovers that’ll
          redefine connection, passion, and performance.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button className="rounded-2xl px-6 py-2">Go Home</Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              className="rounded-2xl px-6 py-2 flex items-center gap-2"
            >
              <Construction className="w-4 h-4" />
              Learn More
            </Button>
          </Link>
        </div>

        <div className="mt-10 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>ThrottleConnect — fueling your next adventure</span>
        </div>
      </motion.div>
    </div>
  );
}
