"use client";
import { Button } from "@/components/ui/button";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import React, { useState } from "react";

function Page() {
  const [completedOnly, setCompletedOnly] = useState(false);
  const { data, loading, error, fetchMarketplaceStores } = useMarketplaceStore({
    isCompleted: true,
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={completedOnly}
            onChange={(e) => setCompletedOnly(e.target.checked)}
          />
          Completed only
        </label>

        <Button onClick={fetchMarketplaceStores} disabled={loading}>
          {loading ? "Loading..." : "Test Fetch marketplaceStores"}
        </Button>
      </div>

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





