import React from "react";
import MarketplaceRegistration from "../marketplace/registration/MarketplaceRegistration";
import NetworkingRegistration from "../networking/registration/NetworkingRegistration";

type RegistrationContainerProps = {
  type: "marketplace" | "networking";
};

export default function RegistrationContainer({
  type,
}: RegistrationContainerProps) {
  return (
    <div>
      {type === "marketplace" && <MarketplaceRegistration />}
      {type === "networking" && <NetworkingRegistration />}
    </div>
  );
}

