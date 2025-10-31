"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact2() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Let’s Connect
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions or feedback? Fill out the form and we’ll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600">support@example.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Address</p>
                <p className="text-gray-600">
                  123 Main Street, City, Country
                </p>
              </div>
            </div>
          </div>

          {/* Right contact form */}
          <form className="bg-white p-8 rounded-2xl shadow-lg space-y-5">
            <div>
              <Input type="text" placeholder="Your Name" required />
            </div>
            <div>
              <Input type="email" placeholder="Your Email" required />
            </div>
            <div>
              <Textarea placeholder="Your Message" rows={5} required />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>

        </div>
      </div>
    </section>
  );
}
