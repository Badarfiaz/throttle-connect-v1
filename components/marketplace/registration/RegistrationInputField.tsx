"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FieldConfig, Option } from "./formFields";
import type { FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";

type SocialSelectorProps = {
  options: Option[];
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
};

function SocialSelector({ options, value, onChange }: SocialSelectorProps) {
  const selected = value ?? {};

  const handleSelect = (platform: string) => {
    const updated = { ...selected };
    if (platform in updated) delete updated[platform];
    else updated[platform] = "";
    onChange?.(updated);
  };

  const handleUrlChange = (platform: string, url: string) => {
    onChange?.({ ...selected, [platform]: url });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-all",
              opt.value in selected ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {Object.keys(selected).map((platform) => (
        <div key={platform} className="flex flex-col">
          <label className="text-sm font-medium mb-1">{platform} URL</label>
          <Input
            value={selected[platform]}
            onChange={(e) => handleUrlChange(platform, e.target.value)}
            placeholder={`Enter ${platform} URL`}
          />
        </div>
      ))}
    </div>
  );
}

type Props = {
  field: FieldConfig;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors?: FieldErrors<FieldValues>;
};

export default function RegistrationInputField({ field, register, setValue, watch, errors }: Props) {
  useEffect(() => {
    if (field.type === "multiselect") {
      register(field.name, {
        required: field.required ? `${field.label} is required` : false,
        validate: (value) => !field.required || (Array.isArray(value) && value.length > 0) || `${field.label} is required`,
      });
    }
    if (field.type === "social") {
      register(field.name, {
        required: field.required ? `${field.label} is required` : false,
      });
    }
  }, [field.name, field.required, field.type, register]);

  const multiValue = (watch(field.name) as string[]) || [];
  const selectValue = watch(field.name) as string | undefined;
  const socialValue = (watch(field.name) as Record<string, string>) || {};
  const fieldError = errors?.[field.name];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === "multiselect" && field.options && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const isSelected = multiValue.includes(opt.value);
            const toggleOption = () => {
              const updated = isSelected ? multiValue.filter((v) => v !== opt.value) : [...multiValue, opt.value];
              setValue(field.name, updated, { shouldDirty: true, shouldValidate: true });
            };
            return (
              <button
                key={opt.value}
                type="button"
                onClick={toggleOption}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border",
                  fieldError && "border-red-500"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {field.type === "select" && field.options && (
        <Select value={selectValue || undefined} onValueChange={(v) => setValue(field.name, v, { shouldDirty: true, shouldValidate: true })}>
          <SelectTrigger className={cn(fieldError && "border-red-500")}>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "textarea" && <Textarea placeholder={field.placeholder} className={cn(fieldError && "border-red-500")} {...register(field.name, { required: field.required ? `${field.label} is required` : false })} />}

      {field.type === "social" && field.options && (
        <div className={cn(fieldError && "border border-red-500 p-3 rounded-md")}>
          <SocialSelector options={field.options} value={socialValue} onChange={(v) => setValue(field.name, v, { shouldDirty: true, shouldValidate: true })} />
        </div>
      )}

      {(field.type === "input" || !field.type) && (
        <Input
          type={
            field.keyboardType === "email-address" ? "email" :
            field.keyboardType === "phone-pad" ? "tel" :
            field.keyboardType === "numeric" ? "number" : "text"
          }
          placeholder={field.placeholder}
          className={cn(fieldError && "border-red-500")}
          {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
        />
      )}

      {fieldError && <p className="text-sm text-red-500">{fieldError.message as string}</p>}
    </div>
  );
}
