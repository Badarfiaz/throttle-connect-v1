"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, Zap, ShieldCheck, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Pricing plans data
const plans = [
  {
    name: "Tameer Lite",
    tagline: "Best for individuals and small businesses taking their first step into the marketplace.",
    price: "Free",
    originalPrice: null,
    period: "",
    monthlyEquivalent: "Free",
    buttonText: "Get Started",
    icon: Zap,
    iconColor: "text-blue-500 bg-blue-50",
    popular: false,
    href: "/list-your-business",
    features: [
      "Standard marketplace presence in Throttle Connect",
      "Post up to 20 listings to showcase products or services",
      "Appear in search and category pages for buyer discovery",
      "Direct customer visibility through public business profile",
      "Upgrade anytime as your business grows",
    ],
  },
  {
    name: "Silver",
    tagline: "For small businesses ready to build visibility and start attracting quality inquiries.",
    price: "Rs. 46,000",
    originalPrice: "Rs. 56,000",
    period: "per 4 months",
    monthlyEquivalent: "Rs. 11,500 / month",
    buttonText: "Get Started",
    icon: ShieldCheck,
    iconColor: "text-slate-500 bg-slate-50",
    popular: false,
    href: "/checkout?plan=silver",
    features: [
      "16 Featured Listings for stronger category visibility",
      "24 professionally designed social media creatives",
      "8 engaging reels / short videos by our creative team",
      "44-66 Quality Leads for high-impact reach",
      "Organic + paid visibility mix in the ecosystem",
      "Limited slots per category - secure your position",
    ],
  },
  {
    name: "Gold",
    tagline: "For growing brands that want stronger positioning, better reach, and consistent lead flow.",
    price: "Rs. 83,000",
    originalPrice: "Rs. 104,000",
    period: "per 4 months",
    monthlyEquivalent: "Rs. 20,750 / month",
    buttonText: "Get Started",
    icon: Sparkles,
    iconColor: "text-amber-500 bg-amber-50",
    popular: true,
    href: "/checkout?plan=gold",
    features: [
      "32 Featured Listings for high-priority placement",
      "75+ brand banner Ads placements on key sections",
      "48 premium social media posts designed for your brand",
      "16 high-quality reels / videos for maximum engagement",
      "65-95 Quality Leads for high-impact reach",
      "Strong organic visibility + paid amplification",
      "Priority growth support & performance optimization",
      "Limited premium slots per category",
    ],
  },
  {
    name: "Platinum",
    tagline: "For serious brands that want category dominance, premium visibility, and maximum market impact.",
    price: "Rs. 112,000",
    originalPrice: "Rs. 140,000",
    period: "per 4 months",
    monthlyEquivalent: "Rs. 28,000 / month",
    buttonText: "Get Started",
    icon: Crown,
    iconColor: "text-purple-500 bg-purple-55 text-purple-500 bg-purple-50",
    popular: false,
    href: "/checkout?plan=platinum",
    features: [
      "80 Featured Listings for dominant category visibility",
      "185+ brand banner Ads placements for premium exposure",
      "80 professionally crafted social media creatives",
      "24 powerful reels / videos to maximize recall",
      "130-145 Quality Leads for maximum lead generation",
      "Maximum organic exposure + aggressive paid amplification",
      "Top-tier positioning to capture high-intent buyers",
      "Exclusive category dominance - limited vendors per city",
    ],
  },
];

// FAQ data
const faqs = [
  {
    question: "What is the duration of the premium plans?",
    answer: "Our premium plans (Silver, Gold, and Platinum) are billed as 4-month packages. This duration is designed to allow our creative team to produce high-quality media, run consistent advertising campaigns, and deliver a reliable flow of verified leads to your business.",
  },
  {
    question: "How are the quality leads generated and delivered?",
    answer: "Leads are generated through a combination of high-priority directory search visibility, banner ad impressions, and targeted social media campaigns (posts and reels) designed by our in-house team. When a buyer submits an inquiry, it is sent directly to your Throttle Connect profile dashboard and notified via your registered email/phone.",
  },
  {
    question: "What are 'Featured Listings' and how do they help?",
    answer: "Featured Listings are highlighted search results and category listings. They are pinned above standard free listings and feature a 'Featured' badge. This ensures they capture the immediate attention of buyers, resulting in up to 10x higher engagement and click-through rates.",
  },
  {
    question: "How does the social media content creation service work?",
    answer: "After subscribing, our dedicated account manager and creative designers will contact you to understand your business offerings, brand guidelines, and goals. We then design the custom creatives and produce/edit short-form reels/videos, which are promoted to drive traffic to your listings.",
  },
  {
    question: "Can I upgrade, downgrade, or cancel my plan?",
    answer: "Yes, you can upgrade your plan at any point during your cycle to immediately unlock higher limits and features. Downgrades or cancellations can be requested at any time and will take effect at the end of the current 4-month billing period.",
  },
  {
    question: "Are there any commissions or hidden fees on sales?",
    answer: "No! Throttle Connect is a zero-commission marketplace. All transactions, negotiations, and payments happen directly between you and the buyer. We only charge the flat subscription fee for visibility and lead generation services.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#fbfdfe]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#e8f4fd]/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#19376D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 -left-40 w-[400px] h-[400px] bg-[#0F4C75]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 max-w-7xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#19376D]/10 text-[#19376D] text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pakistan's Premium Business Growth Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-[#0B2447] mb-6"
          >
            Pricing &amp; Plans
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            Get discovered by real buyers actively looking for your services — not random traffic. Choose a plan that fits your business scale.
          </motion.p>

          {/* Period Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 inline-flex items-center justify-center p-1 bg-white border border-gray-200 rounded-2xl shadow-sm"
          >
            <span className="px-6 py-2.5 bg-[#0B2447] text-white text-sm font-semibold rounded-xl shadow-sm">
              Four Month Plans
            </span>
            <span className="px-6 py-2.5 text-gray-500 text-sm font-medium">
              Save up to 20%
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch mb-24">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col justify-between rounded-3xl bg-white border p-6 md:p-8 transition-all ${
                  plan.popular
                    ? "border-[#19376D] ring-2 ring-[#19376D]/20 shadow-xl lg:scale-105 z-10"
                    : "border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#19376D] to-[#0F4C75] text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl ${plan.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {plan.name === "Tameer Lite" ? "Basic" : "Premium"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#0B2447] mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 min-h-[60px]">
                    {plan.tagline}
                  </p>

                  {/* Pricing Details */}
                  <div className="mb-6">
                    {plan.originalPrice && (
                      <span className="text-sm text-gray-400 line-through block font-medium">
                        {plan.originalPrice}
                      </span>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-extrabold text-[#0B2447] tracking-tight">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-gray-500 font-medium">{plan.period}</span>
                      )}
                    </div>
                    {plan.monthlyEquivalent && (
                      <span className="text-xs font-semibold text-[#19376D] bg-[#19376D]/5 px-2.5 py-1 rounded-md inline-block mt-2">
                        {plan.monthlyEquivalent}
                      </span>
                    )}
                  </div>

                  <hr className="border-gray-100 my-6" />

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <p className="text-xs font-bold text-[#0B2447] uppercase tracking-wider">
                      What you'll achieve
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 leading-tight">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full h-12 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-[#19376D] hover:bg-[#0B3A5B] text-white shadow-md shadow-blue-500/10 cursor-pointer"
                      : "bg-white hover:bg-gray-50 text-[#0B2447] border border-gray-200 cursor-pointer"
                  }`}
                >
                  <Link href={plan.href}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Value Proposition Section */}
        <div className="bg-gradient-to-r from-[#0B2447] to-[#19376D] rounded-[2.5rem] p-8 md:p-12 text-white text-center md:text-left shadow-xl relative overflow-hidden mb-24">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 col-span-2">
                Why grow your business with Throttle Connect?
              </h2>
              <p className="text-blue-100/90 text-md md:text-lg max-w-2xl leading-relaxed">
                Unlike generic social platforms, Throttle Connect connects you directly with verified B2B buyers and professionals in Pakistan's business growth ecosystem. No commissions, no intermediaries, just pure growth.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end w-full">
              <Link href="/list-your-business" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white hover:bg-blue-50 text-[#0B2447] h-12 px-6 rounded-xl font-semibold text-sm">
                  Register Business
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border border-white/20 h-12 px-6 rounded-xl font-semibold text-sm">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B2447] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Have questions about our pricing plans or how lead generation works? Find answers below.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-[#0B2447] md:text-lg pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180 text-[#19376D]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 md:p-6 pt-0 border-t border-gray-50 text-gray-600 text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
