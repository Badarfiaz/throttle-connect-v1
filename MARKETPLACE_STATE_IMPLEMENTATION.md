# Marketplace Global State Implementation

## Summary

I've created a new Redux slice for marketplace stores and integrated it with the registration flow. The marketplace data is now dispatched to the global state on every step of the registration process.

## What Was Implemented

### 1. New Marketplace Slice (`app/redux/features/marketplaceSlice.tsx`)

- Created a new Redux slice to manage marketplace store data
- Actions available:
  - `setMarketplace(data)` - Updates marketplace data (merges with existing)
  - `clearMarketplace()` - Clears all marketplace data
  - `setMarketplaceLoading(boolean)` - Sets loading state
  - `setMarketplaceError(string)` - Sets error state

### 2. Root Reducer Updated

- Added marketplace reducer to the root reducer
- Available in state as `state.marketplace`

### 3. useOnboardStep Hook Enhanced

- Now dispatches marketplace data on every step submission
- Updates both:
  - `marketplace` slice (for temporary/form data)
  - `auth.user.marketplace` (for persistent user onboarding data)

### 4. MarketplaceRegistration Component Updated

- Imports and uses Redux dispatcher
- Dispatches `setMarketplace` on every step
- Initializes form with existing marketplace data if available
- Updates global state before API call (optimistic update)

## How to Access Marketplace Data

### Option 1: From Marketplace Slice (Current Registration Data)

```typescript
import { useAppSelector } from "@/app/redux/hooks";

const marketplaceStore = useAppSelector((state) => state.marketplace.store);
const isLoading = useAppSelector((state) => state.marketplace.isLoading);

// Access data
console.log(marketplaceStore?.title);
console.log(marketplaceStore?.address);
console.log(marketplaceStore?.completed);
```

### Option 2: From Auth User (Persistent User Data)

```typescript
import { useAppSelector } from "@/app/redux/hooks";

const auth = useAppSelector((state) => state.auth);
const user = auth?.user;

// Check if marketplace registration is completed
const isCompleted = user?.marketplace?.completed; // true or false

// Access marketplace data
if (user?.marketplace) {
  console.log(user.marketplace.title);
  console.log(user.marketplace.address);
  console.log(user.marketplace.phone);
}
```

### Conditional Rendering Examples

```typescript
// Show different UI based on marketplace completion
{auth?.user?.marketplace?.completed ? (
  <MarketplaceDashboard />
) : (
  <MarketplaceRegistrationPrompt />
)}

// Show marketplace data if it exists
{user?.marketplace && (
  <div>
    <h3>{user.marketplace.title}</h3>
    <p>{user.marketplace.address}</p>
  </div>
)}

// For networking (same pattern)
{auth?.user?.networking?.completed ? (
  <NetworkingDashboard />
) : (
  <NetworkingRegistrationPrompt />
)}
```

## Data Flow

1. **User fills form step** → Component state updated
2. **User clicks Next** → `onNext` handler triggered
3. **Data merged** → Current step data merged with collected data
4. **Dispatch to Redux** → `setMarketplace` action dispatched
5. **API call** → Data sent to backend via `submitStep`
6. **Backend saves** → Data saved to both collections:
   - `marketplaceStores/{userId}` - Full store data
   - `users/{userId}.marketplace` - User's marketplace reference
7. **Auth provider** → Fetches updated user data on next auth state change

## State Structure

```typescript
// Redux State
{
  auth: {
    user: {
      id: "user-id",
      email: "user@example.com",
      marketplace: {
        completed: true,
        title: "My Shop",
        address: "123 Street",
        // ... other fields
      },
      networking: {
        completed: false,
        // ... other fields
      }
    }
  },
  marketplace: {
    store: {
      title: "My Shop",
      address: "123 Street",
      completed: false,
      // ... current form data
    },
    isLoading: false,
    error: null
  }
}
```

## Example Component

See `components/marketplace/MarketplaceDataExample.tsx` for a complete example of accessing and displaying marketplace data.

## Benefits

1. **Real-time updates** - Global state updates on every step
2. **Persistent data** - Data saved in user profile
3. **Easy access** - Access from any component using Redux hooks
4. **Type-safe** - Full TypeScript support
5. **Conditional rendering** - Easy to check completion status
6. **Optimistic updates** - UI updates before API response

## Same Pattern for Networking

The same pattern works for networking registration:

- Access via `auth?.user?.networking?.completed`
- Check existence with `user?.networking`
- All the same benefits and patterns apply
