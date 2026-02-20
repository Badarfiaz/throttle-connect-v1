"use client";

import { useAppSelector } from "@/app/redux/hooks";

export default function MarketplaceDataExample() {
  // Access marketplace store data from global state
  const marketplaceStore = useAppSelector((state) => state.marketplace.store);
  const isLoading = useAppSelector((state) => state.marketplace.isLoading);
  const error = useAppSelector((state) => state.marketplace.error);

  // Access user's marketplace data with completed status from auth state
  const auth = useAppSelector((state) => state.auth);
  const user = auth?.user;
  const isMarketplaceCompleted = user?.marketplace?.completed;

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
        {user?.marketplace && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              User Marketplace Data:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(user.marketplace, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Access marketplace store from marketplace slice */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">
          Current Store Data (from marketplace slice)
        </h2>

        {isLoading && <p>Loading marketplace data...</p>}

        {error && <p className="text-red-500">Error: {error}</p>}

        {marketplaceStore ? (
          <div className="space-y-2">
            {marketplaceStore.title && (
              <p>
                <strong>Title:</strong> {marketplaceStore.title}
              </p>
            )}
            {marketplaceStore.address && (
              <p>
                <strong>Address:</strong> {marketplaceStore.address}
              </p>
            )}
            {marketplaceStore.phone && (
              <p>
                <strong>Phone:</strong> {marketplaceStore.phone}
              </p>
            )}
            {marketplaceStore.email && (
              <p>
                <strong>Email:</strong> {marketplaceStore.email}
              </p>
            )}
            <p>
              <strong>Completed:</strong>{" "}
              {marketplaceStore.completed ? "Yes" : "No"}
            </p>

            {/* Show all data */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Full Store Data:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(marketplaceStore, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No marketplace store data available
          </p>
        )}
      </div>

      {/* Conditional rendering based on marketplace data */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Conditional Rendering</h2>

        {user?.marketplace ? (
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
