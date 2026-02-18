"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FieldConfig, Option } from "./formFields";
import type {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type SocialSelectorProps = {
  options: Option[];
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
};

function SocialSelector({ options, value, onChange }: SocialSelectorProps) {
  const selected = value ?? {};

  const handleSelect = (value: string) => {
    const newSelected = { ...selected };

    if (value in newSelected) {
      delete newSelected[value];
    } else {
      newSelected[value] = "";
    }

    onChange?.(newSelected);
  };

  const handleUrlChange = (platform: string, url: string) => {
    const updated = { ...selected, [platform]: url };
    onChange?.(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = Object.prototype.hasOwnProperty.call(
            selected,
            option.value,
          );
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {Object.keys(selected).map((platform) => (
        <div key={platform}>
          <label className="text-sm font-medium mb-1">
            {platform === "other" ? "Other URL" : `${platform} URL`}
          </label>
          <Input
            placeholder={`Enter ${platform === "other" ? "your URL" : platform + " URL"}`}
            value={selected[platform]}
            onChange={(e) => handleUrlChange(platform, e.target.value)}
            required
          />
        </div>
      ))}

      {Object.keys(selected).length === 0 && (
        <p className="text-red-500 text-sm">
          Please select at least one platform
        </p>
      )}
    </div>
  );
}
import { UseFormReturn } from "react-hook-form";

type RegistrationInputFieldProps = {
  field: FieldConfig;
  form: UseFormReturn<any>; // ⬅ IMPORTANT: receive form instance
};

export default function RegistrationInputField({
  field,
  form,
}: RegistrationInputFieldProps) {
  const { register, setValue, watch } = form;

  const selectValue = watch(field.name);
  const socialValue = watch(field.name) || {};

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* ===== SELECT FIELD ===== */}
      {field.type === "select" && field.options && (
        <Select
          value={selectValue}
          onValueChange={(value) => {
            setValue(field.name, value, { shouldValidate: true });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>

          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* ===== TEXTAREA ===== */}
      {field.type === "textarea" && (
        <Textarea
          placeholder={field.placeholder}
          {...register(field.name, { required: field.required })}
        />
      )}

      {/* ===== SOCIAL SELECTOR ===== */}
      {field.type === "social" && field.options && (
        <SocialSelector
          options={field.options}
          value={socialValue}
          onChange={(value) =>
            setValue(field.name, value, { shouldValidate: true })
          }
        />
      )}

      {/* ===== INPUT FIELD ===== */}
      {(field.type === "input" || !field.type) && (
        <Input
          type={
            field.keyboardType === "email-address"
              ? "email"
              : field.keyboardType === "phone-pad"
                ? "tel"
                : field.keyboardType === "numeric"
                  ? "number"
                  : "text"
          }
          placeholder={field.placeholder}
          {...register(field.name, { required: field.required })}
        />
      )}
    </div>
  );
}
