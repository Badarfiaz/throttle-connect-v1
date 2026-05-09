"use client";
import { allowedPageType } from "@/types/CommonType";
import { useParams } from "next/navigation";
import React, { use } from "react";

type SearchContainerProps = {
  pageType: allowedPageType;
};
function SearchContainer({ pageType }: SearchContainerProps) {
  const slug = useParams().id;
  return (
    <div>
      Search Container for {pageType}
      slug : {slug}
    </div>
  );
}

export default SearchContainer;
