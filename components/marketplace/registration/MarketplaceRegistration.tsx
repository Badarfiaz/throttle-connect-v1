import { shopDetailsFields, shopSetupFields, socialFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
import Title from "@/components/shared/Title";

export default function MarketplaceRegistration() {
  const handlesubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data:", data);
    // Handle form submission logic here
  };
  return (
    <div className="min-h-screen bg-background flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-card shadow-xl rounded-2xl p-8">
        <Title title="Marketplace Registration" />

        <form className="space-y-10">
          <div>
            <h2 className="text-lg font-semibold mb-4">Shop Setup</h2>
            <div className="grid gap-5">
              {shopSetupFields.map((field) => (
                <RegistrationInputField key={field.name} field={field} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
            <div className="grid gap-5">
              {shopDetailsFields.map((field) => (
                <RegistrationInputField key={field.name} field={field} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Social & Contact</h2>
            <div className="grid gap-5">
              {socialFields.map((field) => (
                <RegistrationInputField key={field.name} field={field} />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Register Marketplace
          </button>
        </form>
      </div>
    </div>
  );
}
