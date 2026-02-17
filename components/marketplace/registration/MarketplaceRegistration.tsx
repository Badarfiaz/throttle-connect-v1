"use client";

import { useForm } from "react-hook-form";
import { shopDetailsFields, shopSetupFields, socialFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";

type MarketplaceRegistrationValues = Record<
  string,
  string | Record<string, string>
>;

export default function MarketplaceRegistration() {
  const allFields = [...shopSetupFields, ...shopDetailsFields, ...socialFields];
  const defaultValues = allFields.reduce<MarketplaceRegistrationValues>(
    (acc, field) => {
      acc[field.name] = field.type === "social" ? {} : "";
      return acc;
    },
    {},
  );

  const form = useForm<MarketplaceRegistrationValues>({ defaultValues });

  const onSubmit = (values: MarketplaceRegistrationValues) => {
    console.log("Marketplace registration submitted:", values);
  };

  return (
    <div className="min-h-screen bg-background flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-card shadow-xl rounded-2xl p-8">
        <Title title="Marketplace Registration" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div>
            <h2 className="text-lg font-semibold mb-4">Shop Setup</h2>
            <div className="grid gap-5">
              {shopSetupFields.map((field) => (
                <RegistrationInputField
                  key={field.name}
                  field={field}
                  register={form.register}
                  setValue={form.setValue}
                  watch={form.watch}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
            <div className="grid gap-5">
              {shopDetailsFields.map((field) => (
                <RegistrationInputField
                  key={field.name}
                  field={field}
                  register={form.register}
                  setValue={form.setValue}
                  watch={form.watch}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Social & Contact</h2>
            <div className="grid gap-5">
              {socialFields.map((field) => (
                <RegistrationInputField
                  key={field.name}
                  field={field}
                  register={form.register}
                  setValue={form.setValue}
                  watch={form.watch}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Register Marketplace
          </Button>
        </form>
      </div>
    </div>
  );
}
