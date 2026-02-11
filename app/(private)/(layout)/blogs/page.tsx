"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock Data
const CATEGORIES = [
  "All",
  "Bike News",
  "Car Reviews",
  "Industry Updates",
  "Maintenance",
  "New Launches",
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "2026 Honda CG 125 Gold Edition Launched",
    excerpt:
      "The legendary CG 125 gets a stunning makeover with gold accents and improved fuel efficiency.",
    category: "New Launches",
    author: "Auto Expert",
    date: "Feb 12, 2026",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=2070",
    featured: true,
  },
  {
    id: 2,
    title: "Suzuki Alto 660cc vs Prince Pearl: Complete Comparison",
    excerpt:
      "Which budget hatchback offers the best value for money in Pakistan? We break down the specs, mileage, and comfort.",
    category: "Car Reviews",
    author: "Sarah Chen",
    date: "Feb 10, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=2070",
    featured: false,
  },
  {
    id: 3,
    title: "Yamaha YBR 125G 2026: Is it Worth the Hype?",
    excerpt:
      "A deep dive into the new features of the YBR 125G, including the new sticker design and suspension upgrades.",
    category: "Bike News",
    author: "Marcus Johnson",
    date: "Feb 08, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070",
    featured: false,
  },
  {
    id: 4,
    title: "5 Essential Maintenance Tips for Your Car in Summer",
    excerpt:
      "Keep your engine cool and AC running efficiently during the scorching heat with these simple maintenance tips.",
    category: "Maintenance",
    author: "Emma Wilson",
    date: "Feb 05, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070",
    featured: false,
  },
  {
    id: 5,
    title: "Electric Bikes in Pakistan: The Future or a Fad?",
    excerpt:
      "Analyzing the rising trend of electric scooters and bikes in urban cities like Lahore and Karachi.",
    category: "Industry Updates",
    author: "David Kim",
    date: "Feb 03, 2026",
    readTime: "7 min read",
    image: "/images/category/classic.webp",
    featured: false,
  },
  {
    id: 6,
    title: "Toyota Corolla Cross Hybrid Review",
    excerpt:
      "Is the locally assembled Corolla Cross Hybrid the best SUV in its price range? Read our detailed review.",
    category: "Car Reviews",
    author: "Sophie Martin",
    date: "Jan 28, 2026",
    readTime: "8 min read",
    image: "/images/category/hatchback.webp",

    featured: false,
  },
];

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{ backgroundImage: `url(${featuredPost?.image})` }}
        />

        <div className="container relative z-20 px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <Badge
              variant="secondary"
              className="px-4 py-1 text-sm font-medium bg-primary text-white border-none hover:bg-primary/90"
            >
              Featured Story
            </Badge>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
              {featuredPost?.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto line-clamp-2">
              {featuredPost?.excerpt}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-300 pt-4">
              <span className="flex items-center gap-2">
                <User size={16} /> {featuredPost?.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {featuredPost?.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> {featuredPost?.readTime}
              </span>
            </div>
            <div className="pt-6">
              <Button
                size="lg"
                className="rounded-full px-8 text-lg group bg-white text-black hover:bg-white/90"
              >
                Read Article
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-muted-foreground/20 focus-visible:ring-primary focus-visible:ring-offset-0 bg-card hover:bg-accent/50 transition-colors"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="relative h-60 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 text-xs uppercase tracking-wide">
                      {post.category}
                    </Badge>
                  </div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{post.author}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 hover:bg-transparent text-primary hover:text-primary/80 group/btn"
                    >
                      Read More{" "}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary/5 py-20 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Stay connected</h2>
            <p className="text-muted-foreground text-lg">
              Get the latest updates, articles, and resources delivered straight
              to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="h-12 bg-background border-primary/20 focus-visible:ring-primary"
              />
              <Button size="lg" className="h-12 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
