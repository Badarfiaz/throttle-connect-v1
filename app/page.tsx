"use client";
import { Button } from "@/components/ui/button";
import { FETCHER_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import React, { useState } from "react";

const TEST_QUERY = `{
  marketplaceStores {
    id
    title
    address
    businessType
    completed
    contactMethod
    createdAt
    email
    location { area city province }
    onBoardType
    overview
    ownerUid
    pageType
    phone
  }
}`;

function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Get Firebase auth token
      const { token } = await getFirebaseToken();
      console.log(token);
      if (!token) {
        setError("Not authenticated. Please log in first.");
        setLoading(false);
        return;
      }

      const res = await fetch(FETCHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: TEST_QUERY }),
      });

      const result = await res.json();
      console.log("marketplaceStores data:", result);

      if (result.errors) {
        setError(JSON.stringify(result.errors, null, 2));
      } else {
        setData(result.data);
      }
    } catch (err) {
      console.error("Error fetching marketplaceStores:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Button onClick={handleTest} disabled={loading}>
        {loading ? "Loading..." : "Test Fetch marketplaceStores"}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {data && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold mb-2">Marketplace Stores Data:</h3>
          <pre className="whitespace-pre-wrap overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Page;
