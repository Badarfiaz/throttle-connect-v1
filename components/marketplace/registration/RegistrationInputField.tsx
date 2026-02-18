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

/* ============================= */
/* SOCIAL SELECTOR COMPONENT     */
/* ============================= */

type SocialSelectorProps = {
  options: Option[];
  value?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
};

function SocialSelector({ options, value, onChange }: SocialSelectorProps) {
  const selected = value ?? {};

  const handleSelect = (platform: string) => {
    const updated = { ...selected };

    if (platform in updated) {
      delete updated[platform];
    } else {
      updated[platform] = "";
    }

    onChange?.(updated);
  };

  const handleUrlChange = (platform: string, url: string) => {
    onChange?.({ ...selected, [platform]: url });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = option.value in selected;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
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
            {platform} URL
          </label>
          <Input
            value={selected[platform]}
            onChange={(e) =>
              handleUrlChange(platform, e.target.value)
            }
            placeholder={`Enter ${platform} URL`}
          />
        </div>
      ))}
    </div>
  );
}

/* ============================= */
/* MAIN COMPONENT                */
/* ============================= */

type Props = {
  field: FieldConfig;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export default function RegistrationInputField({
  field,
  register,
  setValue,
  watch,
}: Props) {
  /* ============================= */
  /* REGISTER CUSTOM FIELD TYPES   */
  /* ============================= */

  useEffect(() => {
    if (field.type === "multiselect") {
      register(field.name, {
        required: field.required,
        validate: (value) =>
          !field.required ||
          (Array.isArray(value) && value.length > 0),
      });
    }

    if (field.type === "social") {
      register(field.name, { required: field.required });
    }
  }, [field.name, field.required, field.type, register]);

  const multiValue = (watch(field.name) as string[]) || [];
  const selectValue = watch(field.name) as string | undefined;
  const socialValue =
    (watch(field.name) as Record<string, string>) || {};

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {/* ============================= */}
      {/* MULTI SELECT (Business Type)  */}
      {/* ============================= */}
      {field.type === "multiselect" && field.options && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => {
            const isSelected = multiValue.includes(option.value);

            const toggleOption = () => {
              const updated = isSelected
                ? multiValue.filter((v) => v !== option.value)
                : [...multiValue, option.value];

              setValue(field.name, updated, {
                shouldDirty: true,
                shouldValidate: true,
              });
            };

            return (
              <button
                key={option.value}
                type="button"
                onClick={toggleOption}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ============================= */}
      {/* NORMAL SELECT (Single)       */}
      {/* ============================= */}
      {field.type === "select" && field.options && (
        <Select
          value={selectValue || undefined}
          onValueChange={(value) =>
            setValue(field.name, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
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

      {/* ============================= */}
      {/* TEXTAREA                     */}
      {/* ============================= */}
      {field.type === "textarea" && (
        <Textarea
          placeholder={field.placeholder}
          {...register(field.name, {
            required: field.required,
          })}
        />
      )}

      {/* ============================= */}
      {/* SOCIAL SELECTOR              */}
      {/* ============================= */}
      {field.type === "social" && field.options && (
        <SocialSelector
          options={field.options}
          value={socialValue}
          onChange={(value) =>
            setValue(field.name, value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      )}

      {/* ============================= */}
      {/* DEFAULT INPUT                */}
      {/* ============================= */}
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
          {...register(field.name, {
            required: field.required,
          })}
        />
      )}
    </div>
  );
}
