import React from "react";
import MarketplaceRegistration from "../marketplace/registration/MarketplaceRegistration";
import NetworkingRegistration from "../networking/registration/NetworkingRegistration";
import MemberRegistration from "../member/registration/MemberRegistration";

type RegistrationContainerProps = {
  type: "marketplace" | "networking" | "member";
};

export default function RegistrationContainer({
  type,
}: RegistrationContainerProps) {
  return (
    <div>
      {type === "marketplace" && <MarketplaceRegistration />}
      {type === "networking" && <NetworkingRegistration />}
      {type === "member" && <MemberRegistration />}
    </div>
  );
}
