import type { FieldConfig } from "../../marketplace/registration/formFields";

export const personalInfoFields: FieldConfig[] = [
  {
    name: "memberName",
    label: "Full Name",
    placeholder: "Enter full name",
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
    placeholder: "Enter primary phone",
    required: true,
    keyboardType: "phone-pad",
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    placeholder: "Enter WhatsApp number",
    keyboardType: "phone-pad",
  },
  {
    name: "profileImage",
    label: "Profile Image URL",
    placeholder: "https://example.com/avatar.jpg",
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter city",
    required: true,
  },
  {
    name: "area",
    label: "Area",
    placeholder: "Enter area",
    required: true,
  },
];

export const vehicleFields: FieldConfig[] = [
  {
    name: "vehicleType",
    label: "Vehicle Type",
    placeholder: "Select vehicle type",
    type: "select",
    required: true,
    options: [
      { label: "Bike", value: "bike" },
      { label: "Car", value: "car" },
      { label: "Both", value: "both" },
    ],
  },
  {
    name: "vehicleBrand",
    label: "Vehicle Brand",
    placeholder: "e.g. Honda",
    required: true,
  },
  {
    name: "vehicleModel",
    label: "Vehicle Model",
    placeholder: "e.g. CB 150F",
    required: true,
  },
  {
    name: "ModelYear",
    label: "Model Year",
    placeholder: "e.g. 2022",
    keyboardType: "numeric",
  },
  {
    name: "vehicleImages",
    label: "Vehicle Images",
    placeholder: "Comma-separated image URLs",
    type: "textarea",
  },
];

export const verificationFields: FieldConfig[] = [
  {
    name: "documents",
    label: "Driving License Image URL",
    placeholder: "https://example.com/license.jpg",
    required: true,
  },
  {
    name: "emergencyContactName",
    label: "Emergency Contact Name",
    placeholder: "Enter contact name",
    required: true,
  },
  {
    name: "emergencyContactPhone",
    label: "Emergency Contact Phone",
    placeholder: "Enter contact phone",
    required: true,
    keyboardType: "phone-pad",
  },
  {
    name: "bloodGroup",
    label: "Blood Group",
    placeholder: "Select blood group",
    type: "select",
    options: [
      { label: "A+", value: "A+" },
      { label: "A-", value: "A-" },
      { label: "B+", value: "B+" },
      { label: "B-", value: "B-" },
      { label: "AB+", value: "AB+" },
      { label: "AB-", value: "AB-" },
      { label: "O+", value: "O+" },
      { label: "O-", value: "O-" },
    ],
  },
  {
    name: "experienceYears",
    label: "Riding Experience",
    placeholder: "Select experience",
    type: "select",
    options: [
      { label: "0 - 1 years", value: "0-1" },
      { label: "2 - 3 years", value: "2-3" },
      { label: "4 - 6 years", value: "4-6" },
      { label: "7+ years", value: "7+" },
    ],
  },
  {
    name: "interests",
    label: "Riding Interests",
    placeholder: "Select at least one",
    type: "select",
    multiple: true,
    options: [
      { label: "Weekend Rides", value: "weekend" },
      { label: "Long Tours", value: "touring" },
      { label: "Track Days", value: "track" },
      { label: "Community Events", value: "events" },
      { label: "Volunteering", value: "volunteering" },
    ],
  },
];
