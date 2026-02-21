"use client";

import { useAppSelector } from "@/app/redux/hooks";

export default function MarketplaceDataExample() {
  // Access user's marketplace data with completed status from auth state
  const user = useAppSelector((state) => state.auth.user);
  const marketplace = user?.marketplace;
  const isMarketplaceCompleted = marketplace?.completed;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Marketplace Data Access Example</h1>

      {/* Check if user has completed marketplace onboarding */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">
          Onboarding Status (from auth.user)
        </h2>
        <p>
          Completed: <strong>{isMarketplaceCompleted ? "Yes" : "No"}</strong>
        </p>
        {marketplace && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              User Marketplace Data:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(marketplace, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Conditional rendering based on marketplace data */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Conditional Rendering</h2>

        {marketplace ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
            <p className="text-green-700 dark:text-green-300">
              ✓ User has marketplace data - Show marketplace features
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
            <p className="text-yellow-700 dark:text-yellow-300">
              ⚠ No marketplace data - Show registration prompt
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
