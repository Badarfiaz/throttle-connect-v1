"use client";

import { useState } from "react";
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

type SocialSelectorProps = {
  options: Option[];
  multiple?: boolean;
  onChange?: (value: Record<string, string>) => void;
};

function SocialSelector({
  options,
  onChange,
}: SocialSelectorProps) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleSelect = (value: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev };

      if (value in newSelected) {
        delete newSelected[value];
      } else {
        newSelected[value] = "";
      }

      onChange?.(newSelected);
      return newSelected;
    });
  };

  const handleUrlChange = (platform: string, url: string) => {
    setSelected((prev) => {
      const updated = { ...prev, [platform]: url };
      onChange?.(updated);
      return updated;
    });
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

type RegistrationInputFieldProps = {
  field: FieldConfig;
};

export default function RegistrationInputField({
  field,
}: RegistrationInputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === "select" && field.options && (
        <Select>
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

      {field.type === "textarea" && (
        <Textarea placeholder={field.placeholder} />
      )}

      {field.type === "social" && field.options && (
        <SocialSelector
          options={field.options}
          multiple={field.multiple ?? true}
          onChange={(value) => console.log("Selected social URLs:", value)}
        />
      )}

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
        />
      )}
    </div>
  );
}
