"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <footer className="w-full bg-[#0B2447] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <Link href="/" className="text-lg font-semibold tracking-wide">
          ThrottleConnect
        </Link>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            contact@throttleconnect.com
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            +1 (234) 567-890
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            Tech City
          </div>

        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-[#0B2447] transition"
            >
              <social.icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-white/10 text-center text-sm text-gray-400 py-4">
        © {currentYear} ThrottleConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;