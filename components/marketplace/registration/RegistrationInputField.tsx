"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { FieldConfig, Option } from "./formFields";
import type { UseFormReturn } from "react-hook-form";
import StoreLogoCard from "@/components/marketplace/dashboard/sections/profile/StoreLogoCard";

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

type MultiSelectDropdownProps = {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
};

function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
  const selected = Array.isArray(value) ? value : [];
  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  const triggerLabel =
    selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          <span
            className={cn(
              "truncate",
              selectedLabels.length === 0 && "text-muted-foreground",
            )}
          >
            {triggerLabel || "Select options"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
        sideOffset={6}
      >
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isChecked}
              onCheckedChange={(checked) => {
                const shouldAdd = checked === true;
                const nextValues = shouldAdd
                  ? Array.from(new Set([...selected, option.value]))
                  : selected.filter((item) => item !== option.value);
                onChange?.(nextValues);
              }}
              onSelect={(event) => event.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type RegistrationInputFieldProps = {
  field: FieldConfig;
  form?: UseFormReturn<any>; // ⬅ IMPORTANT: receive form instance
};

export default function RegistrationInputField({
  field,
  form,
}: RegistrationInputFieldProps) {
  const { register, setValue, watch } = form || {};

  const watchedValue = watch ? watch(field.name) : undefined;
  const selectValue = Array.isArray(watchedValue)
    ? undefined
    : (watchedValue as string | undefined);
  const multiSelectValue = Array.isArray(watchedValue)
    ? watchedValue
    : watchedValue
      ? [watchedValue as string]
      : [];
  const socialValue =
    (watchedValue as Record<string, string> | undefined) ?? {};

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* ===== SELECT FIELD ===== */}
      {field.type === "select" && field.options && !field.multiple && (
        <Select
          value={selectValue}
          onValueChange={(value) => {
            setValue && setValue(field.name, value, { shouldValidate: true });
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

      {field.type === "select" && field.options && field.multiple && (
        <MultiSelectDropdown
          options={field.options}
          value={multiSelectValue}
          placeholder={field.placeholder}
          onChange={(value) =>
            setValue && setValue(field.name, value, { shouldValidate: true })
          }
        />
      )}

      {/* ===== TEXTAREA ===== */}
      {field.type === "textarea" && (
        <Textarea
          placeholder={field.placeholder}
          {...(register
            ? register(field.name, { required: field.required })
            : {})}
        />
      )}

      {/* ===== SOCIAL SELECTOR ===== */}
      {field.type === "social" && field.options && (
        <SocialSelector
          options={field.options}
          value={socialValue}
          onChange={(value) =>
            setValue && setValue(field.name, value, { shouldValidate: true })
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
          {...(register
            ? register(field.name, { required: field.required })
            : {})}
        />
      )}
    </div>
  );
}
