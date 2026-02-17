'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/* =========================================================
   Field Config Type
========================================================= */
type Option = {
  label: string;
  value: string;
};

type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'input' | 'textarea' | 'select' | 'social';
  keyboardType?: 'default' | 'phone-pad' | 'numeric' | 'email-address';
  options?: Option[];
  multiple?: boolean;
};

/* =========================================================
   Social Selector (Multiple Selection, At Least One Mandatory)
========================================================= */
function SocialSelector({
  options,
  multiple = true,
  onChange,
}: {
  options: Option[];
  multiple?: boolean;
  onChange?: (value: Record<string, string>) => void;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleSelect = (value: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev };

      if (value in newSelected) {
        delete newSelected[value]; // deselect
      } else {
        newSelected[value] = ''; // add with empty URL
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
      {/* Platform buttons */}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = selected.hasOwnProperty(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all border',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-border hover:bg-accent'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* URL input for each selected platform */}
      {Object.keys(selected).map((platform) => (
        <div key={platform}>
          <label className="text-sm font-medium mb-1">
            {platform === 'other' ? 'Other URL' : `${platform} URL`}
          </label>
          <Input
            placeholder={`Enter ${platform === 'other' ? 'your URL' : platform + ' URL'}`}
            value={selected[platform]}
            onChange={(e) => handleUrlChange(platform, e.target.value)}
            required
          />
        </div>
      ))}

      {/* Mandatory note */}
      {Object.keys(selected).length === 0 && (
        <p className="text-red-500 text-sm">Please select at least one platform</p>
      )}
    </div>
  );
}

/* =========================================================
   Field Renderer
========================================================= */
function RenderField({ field }: { field: FieldConfig }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Select */}
      {field.type === 'select' && field.options && (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Textarea */}
      {field.type === 'textarea' && <Textarea placeholder={field.placeholder} />}

      {/* Social Selector */}
      {field.type === 'social' && field.options && (
        <SocialSelector
          options={field.options}
          multiple={field.multiple ?? true}
          onChange={(value) => console.log('Selected social URLs:', value)}
        />
      )}

      {/* Input */}
      {(field.type === 'input' || !field.type) && (
        <Input
          type={
            field.keyboardType === 'email-address'
              ? 'email'
              : field.keyboardType === 'phone-pad'
              ? 'tel'
              : field.keyboardType === 'numeric'
              ? 'number'
              : 'text'
          }
          placeholder={field.placeholder}
        />
      )}
    </div>
  );
}

/* =========================================================
   Field Configurations
========================================================= */
const shopSetupFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Shop Name',
    placeholder: 'Enter your shop title',
    required: true,
  },
  {
    name: 'email',
    label: 'Official Email',
    placeholder: 'Enter email',
    required: true,
    keyboardType: 'email-address',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    required: true,
    keyboardType: 'phone-pad',
  },
  {
    name: 'address',
    label: 'Shop Address',
    placeholder: 'Enter shop address',
  },
];

const shopDetailsFields: FieldConfig[] = [
  {
    name: 'businessType',
    label: 'Business Type',
    placeholder: 'Select business type',
    type: 'select',
    required: true,
    options: [
      { label: 'Garage', value: 'garage' },
      { label: 'Workshop', value: 'workshop' },
      { label: 'Spare Parts', value: 'spare-parts' },
    ],
  },
  {
    name: 'overview',
    label: 'Shop Overview',
    placeholder: 'Write a brief shop description',
    type: 'textarea',
  },
  { name: 'province', label: 'Province', placeholder: 'Enter province' },
  { name: 'city', label: 'City', placeholder: 'Enter city' },
  { name: 'area', label: 'Area', placeholder: 'Enter area' },
];

const socialFields: FieldConfig[] = [
  {
    name: 'contactMethod',
    label: 'Preferred Contact Method',
    type: 'select',
    placeholder: 'Select contact method',
    required: true,
    options: [
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Phone Call', value: 'call' },
      { label: 'Email', value: 'email' },
    ],
  },
  {
    name: 'socialPlatforms',
    label: 'Select Social Platforms',
    type: 'social',
    multiple: true, // now multiple selections allowed
    options: [
      { label: 'Website', value: 'website' },
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Instagram', value: 'instagram' },
      { label: 'Other', value: 'other' },
    ],
  },
];

/* =========================================================
   Main Page Component
========================================================= */
export default function MarketplaceRegistrationPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-card shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-8 text-center">
          Marketplace Registration
        </h1>

        <form className="space-y-10">
          {/* Shop Setup */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Shop Setup</h2>
            <div className="grid gap-5">
              {shopSetupFields.map((field) => (
                <RenderField key={field.name} field={field} />
              ))}
            </div>
          </div>

          {/* Shop Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
            <div className="grid gap-5">
              {shopDetailsFields.map((field) => (
                <RenderField key={field.name} field={field} />
              ))}
            </div>
          </div>

          {/* Social Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Social & Contact</h2>
            <div className="grid gap-5">
              {socialFields.map((field) => (
                <RenderField key={field.name} field={field} />
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
