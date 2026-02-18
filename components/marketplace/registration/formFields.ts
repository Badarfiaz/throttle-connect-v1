export type Option = {
  label: string;
  value: string;
};

export type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "textarea" | "select" | "multiselect" | "social";
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  options?: Option[];
  multiple?: boolean;
};

export const shopSetupFields: FieldConfig[] = [
  { name: "storeTitle", label: "Shop Name", placeholder: "Enter your shop title", required: true },
  { name: "email", label: "Official Email", placeholder: "Enter email", required: true, keyboardType: "email-address" },
  { name: "phone", label: "Phone Number", placeholder: "Enter phone number", required: true, keyboardType: "phone-pad" },
  { name: "address", label: "Shop Address", placeholder: "Enter shop address" }, // optional
];

export const shopDetailsFields: FieldConfig[] = [
  {
    name: "businessType",
    label: "Business Type",
    placeholder: "Select business type",
    type: "multiselect",
    required: true,
    options: [
      { label: "Garage", value: "garage" },
      { label: "Workshop", value: "workshop" },
      { label: "Spare Parts", value: "spare-parts" },
    ],
  },
  { name: "overview", label: "Shop Overview", placeholder: "Write a brief shop description", type: "textarea" },
  { name: "location.province", label: "Province", placeholder: "Enter province" },
  { name: "location.city", label: "City", placeholder: "Enter city" },
  { name: "location.area", label: "Area", placeholder: "Enter area" },
];

export const socialFields: FieldConfig[] = [
  {
    name: "contactMethod",
    label: "Preferred Contact Method",
    type: "select",
    placeholder: "Select contact method",
    required: true,
    options: [
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Phone Call", value: "call" },
      { label: "Email", value: "email" },
    ],
  },
  {
    name: "socialPlatforms",
    label: "Select Social Platforms",
    type: "social",
    multiple: true,
    required: true, // at least one mandatory
    options: [
      { label: "Website", value: "website" },
      { label: "LinkedIn", value: "linkedin" },
      { label: "Instagram", value: "instagram" },
      { label: "Other", value: "other" },
    ],
  },
];
