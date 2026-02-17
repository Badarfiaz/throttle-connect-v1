import React from "react";
import MarketplaceRegistration from "../marketplace/registration/MarketplaceRegistration";
type RegistrationContainerProps = {
  type: "marketplace" | "networking";
};
function RegistrationContainer({ type }: RegistrationContainerProps) {
  return (
    <div>
      {type === "marketplace" ? (
        <MarketplaceRegistration />
      ) : (
        <div>Networking Registration Form -- pending </div>
      )}
    </div>
  );
}

export default RegistrationContainer;
