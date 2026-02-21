"use client";
import { useState, useCallback } from "react";
import { useAppSelector } from "@/app/redux/hooks";

export function useMarketplaceCompletedDialog() {
  const marketplaceCompleted = useAppSelector(
    (state) => state.auth.user?.marketplace?.completed,
  );
  const [isMarketplaceCompletedOpen, setIsMarketplaceCompletedOpen] =
    useState(false);
  const isMarketplaceCompleted = Boolean(marketplaceCompleted);

  const handleMarketplaceClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isMarketplaceCompleted) return;
      event.preventDefault();
      setIsMarketplaceCompletedOpen(true);
    },
    [isMarketplaceCompleted],
  );

  return {
    isMarketplaceCompleted,
    isMarketplaceCompletedOpen,
    setIsMarketplaceCompletedOpen,
    handleMarketplaceClick,
  };
}
