import { FC, useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import AlertModal from "../../shared/AlertModal";

const MarketplaceRegistration: FC = () => {
  const [submitting, setSubmitting] = useState(false);

  // ALERT STATE
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("success");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement)?.value;

    // PASSWORD MATCH VALIDATION
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1000));
      setAlertMessage("Marketplace account created successfully!");
      setAlertType("success");
      setAlertOpen(true);
      form.reset();
    } catch (err) {
      setAlertMessage("Something went wrong. Please try again.");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-md sm:max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">Marketplace Registration</h2>
        <p className="text-gray-500 text-center mb-6">Fill the form to create your marketplace account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 2-column layout: Full Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="Full Name *" id="name" type="text" />
            <div className="flex flex-col space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="flex">
                <div className="px-3 flex items-center border rounded-l-lg bg-gray-100 text-sm">+92</div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="rounded-l-none focus:ring-2 focus:ring-[#0B2447] h-12"
                />
              </div>
            </div>
          </div>

          <InputGroup label="Email *" id="email" type="email" />
          <InputGroup label="Password *" id="password" type="password" />
          <InputGroup label="Confirm Password *" id="confirmPassword" type="password" />

          <div className="flex items-start space-x-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            <p className="text-gray-600">
              I agree to the{" "}
              <span className="text-blue-600 underline cursor-pointer">Terms & Conditions</span> and{" "}
              <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0B2447] to-[#19376D] hover:from-[#19376D] hover:to-[#0B2447] text-white h-12 font-semibold rounded-lg shadow-md transition-all duration-200"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </div>

      {/* ALERT MODAL */}
      <AlertModal type={alertType} message={alertMessage} open={alertOpen} setOpen={setAlertOpen} />
    </>
  );
};

const InputGroup: FC<{ label: string; id: string; type: string }> = ({ label, id, type }) => (
  <div className="flex flex-col space-y-1">
    <Label htmlFor={id} className="font-medium">{label}</Label>
    <Input id={id} name={id} type={type} required className="focus:ring-2 focus:ring-[#0B2447] rounded-lg h-12" />
  </div>
);

export default MarketplaceRegistration;
