import { shopSetupFields, shopDetailsFields, socialFields } from "./formFields";

export type RegistrationStep = {
  id: number;
  title: string;
  fields: any[];
};

export const registrationSteps: RegistrationStep[] = [
  { id: 1, title: "Shop Setup", fields: shopSetupFields },
  { id: 2, title: "Shop Details", fields: shopDetailsFields },
  { id: 3, title: "Social & Contact", fields: socialFields },
];
