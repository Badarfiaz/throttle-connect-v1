"use client";

import { useEffect } from "react";

const AlgoliaSearch = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).SiteSearch) {
      (window as any).SiteSearch.init({
        container: "#search",
        applicationId: "BDXQ3YSOFN",
        apiKey: "53e96ee7418fc58616b605e8c4808715",
        indexName: "marketplace_products",
        attributes: {
          primaryText: "productName",
          secondaryText: "price",
          tertiaryText: "category",
          url: "",
          image: "imageurl.url",
        },
        darkMode: true,
      });
    }
  }, []);

  return <div id="search" />;
};

export default AlgoliaSearch;
