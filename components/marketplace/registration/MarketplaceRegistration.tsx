"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { registrationSteps } from "./steps";
import RegistrationInputField from "./RegistrationInputField";
import Stepper from "./Stepper";
import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";

type MarketplaceRegistrationValues = Record<string, any>;

function setNestedValue(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let temp = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) temp[key] = value;
    else temp[key] = temp[key] || {};
    temp = temp[key];
  });
}

export default function MarketplaceRegistration() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStep = registrationSteps.find((s) => s.id === step)!;
  const allFields = registrationSteps.flatMap((s) => s.fields);

  const defaultValues = useMemo(() => {
    const result: MarketplaceRegistrationValues = {};
    allFields.forEach((field) => {
      if (field.type === "social") setNestedValue(result, field.name, {});
      else if (field.type === "multiselect") setNestedValue(result, field.name, []);
      else setNestedValue(result, field.name, "");
    });
    return result;
  }, [allFields]);

  const form = useForm<MarketplaceRegistrationValues>({ defaultValues, mode: "onChange" });

  const onSubmit = (values: MarketplaceRegistrationValues) => {
    console.log("Marketplace submitted:", values);
    setIsSubmitted(true);
  };

  // required fields for current step
  const requiredFields = currentStep.fields.map((f) => f.name);

  // check current step validation
  const isCurrentStepValid = requiredFields.every((fieldName) => {
    const value = form.watch(fieldName);

    if (Array.isArray(value)) return value.length > 0;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // ✅ For social, ensure at least one URL is non-empty
      return Object.values(value).some((v) => v && v.trim() !== "");
    }

    return value !== "" && value !== undefined;
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center px-4">
        <div className="w-full max-w-xl bg-card shadow-xl rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-bold mb-4 text-primary">🎉 Thank You for Registering!</h1>
          <p className="text-muted-foreground mb-6">Your marketplace registration has been successfully submitted.</p>
          <Button onClick={() => { setStep(1); setIsSubmitted(false); }}>Back to Start</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-card shadow-xl rounded-2xl p-8">
        <Title title="Marketplace Registration" />
        <Stepper steps={registrationSteps} currentStep={step} />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div>
            <h2 className="text-lg font-semibold mb-4">{currentStep.title}</h2>
            <div className="grid gap-5">
              {currentStep.fields.map((field) => (
                <RegistrationInputField
                  key={field.name}
                  field={field}
                  register={form.register}
                  setValue={form.setValue}
                  watch={form.watch}
                  errors={form.formState.errors}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 w-full mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}

            {step < registrationSteps.length ? (
              <Button
                type="button"
                className="flex-1"
                disabled={!isCurrentStepValid}
                onClick={async () => {
                  const valid = await form.trigger(requiredFields);
                  if (valid) setStep((s) => s + 1);
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground"
                disabled={!isCurrentStepValid} // ✅ Step 3 required
              >
                Submit Marketplace
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
