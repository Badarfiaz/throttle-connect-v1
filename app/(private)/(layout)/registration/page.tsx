import Link from "next/link";
import RegistrationClientSide from "@/components/shared/RegistrationClientSide";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-20">
      {/* Heading */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Get Started with{" "}
          <span className="text-primary">Throttle Connect</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose how you want to continue
        </p>
      </section>

      {/* Cards */}
      <RegistrationClientSide />

      {/* Continue as Guest */}
      <div className="text-center mt-20">
        <p className="text-sm text-muted-foreground mb-2">Just exploring?</p>
        <Link
          href="/"
          className="
            inline-flex items-center gap-1
            text-primary font-medium
            hover:underline
          "
        >
          Continue as Guest →
        </Link>
      </div>
    </div>
  );
}
