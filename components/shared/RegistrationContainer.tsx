import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import AlertModal from "../shared/AlertModal";

const MarketplaceRegistration = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API logic here
      setAlertMessage("Account created successfully!");
      setAlertType("success");
      setAlertOpen(true);
    } catch (err) {
      setAlertMessage("Signup failed. Please try again.");
      setAlertType("error");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign up</h2>
        <p className="text-center text-gray-500 mb-6">Create your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Full Name *" id="fullName" type="text" />
            <div className="flex flex-col space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex">
                <div className="px-3 flex items-center border rounded-l-md bg-gray-100 text-sm">
                  +92
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="rounded-l-none focus:ring-2 focus:ring-[#0B2447]"
                />
              </div>
            </div>
          </div>

          <InputGroup label="Email *" id="email" type="email" />
          <InputGroup label="Password *" id="password" type="password" />
          <InputGroup label="Confirm Password *" id="confirmPassword" type="password" />

          <div className="flex items-start space-x-2 text-sm">
            <input type="checkbox" required />
            <p>
              I agree to the{" "}
              <span className="text-blue-600 underline cursor-pointer">Terms & Conditions</span>{" "}
              and <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

          <Button type="submit" className="w-full bg-[#0B2447] hover:bg-[#19376D] text-white h-11">
            Create Account
          </Button>
        </form>
      </div>

      <AlertModal
        type={alertType}
        message={alertMessage}
        open={alertOpen}
        setOpen={setAlertOpen}
      />
    </>
  );
};

const InputGroup: React.FC<{ label: string; id: string; type: string }> = ({ label, id, type }) => (
  <div className="flex flex-col space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} name={id} type={type} required className="focus:ring-2 focus:ring-[#0B2447]" />
  </div>
);

export default MarketplaceRegistration;
