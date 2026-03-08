export type Option = {
  label: string;
  value: string;
};

export type FieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "textarea" | "select" | "social";
  keyboardType?: "default" | "phone-pad" | "numeric" | "email-address";
  options?: Option[];
  multiple?: boolean;
};

// ---------------- Reusable Social Fields ----------------
export const createSocialFields = (): FieldConfig[] => [
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
    options: [
      { label: "Website", value: "website" },
      { label: "LinkedIn", value: "linkedin" },
      { label: "Instagram", value: "instagram" },
      { label: "Other", value: "other" },
    ],
  },
];

// ---------------- Club Setup ----------------
export const clubSetupFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email address",
    required: true,
    keyboardType: "email-address",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter phone number",
    required: true,
    keyboardType: "phone-pad",
  },
  {
    name: "clubName",
    label: "Club Name",
    placeholder: "Enter your club name",
    required: true,
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter city",
    required: true,
  },
];

// ---------------- Club Details ----------------
export const clubDetailsFields: FieldConfig[] = [
  {
    name: "clubType",
    label: "Club Type",
    type: "select",
    placeholder: "Select club type",
    required: true,
    options: [
      { label: "🏍 Bike Club", value: "bike" },
      { label: "🚗 Car Club", value: "car" },
      { label: "🌟 Other", value: "other" },
    ],
  },
  {
    name: "description",
    label: "Club Description",
    placeholder: "Write a brief description",
    type: "textarea",
  },
];

// ---------------- Club Social ----------------
export const clubSocialFields = createSocialFields();