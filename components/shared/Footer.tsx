"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Reviews", href: "/reviews" },
        { label: "Updates", href: "/updates" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
        { label: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Legal", href: "/legal" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Status", href: "/status" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#0B2447] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                ThrottleConnect
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Empowering your digital journey with seamless connectivity and
              innovative solutions. Join the future today.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <a
                href="mailto:contact@throttleconnect.com"
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
              >
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                contact@throttleconnect.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
              >
                <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-300 group">
                <div className="p-2 rounded-full bg-white/10">
                  <MapPin className="w-4 h-4" />
                </div>
                123 Innovation Dr, Tech City, TC 90210
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-6">
              <h3 className="font-semibold text-white tracking-tight">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors inline-block relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400">
            © {currentYear} ThrottleConnect. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-white/10 text-gray-300 hover:bg-white hover:text-[#0B2447] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
