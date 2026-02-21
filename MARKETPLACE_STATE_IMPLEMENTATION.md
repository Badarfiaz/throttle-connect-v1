# Marketplace Global State (User-Scoped)

## Summary

Marketplace registration data is stored on `auth.user.marketplace` and updated
on every step. There is no separate marketplace slice.

## What Is Implemented

1. Auth user model includes `marketplace`.
2. `useOnboardStep` dispatches `updateUserOnboarding` on every step (optimistic).
3. `MarketplaceRegistration` initializes and resets forms from
   `auth.user.marketplace`.

## How To Access Marketplace Data

```typescript
import { useAppSelector } from "@/app/redux/hooks";

const marketplace = useAppSelector((state) => state.auth.user?.marketplace);
const isCompleted = marketplace?.completed;

if (marketplace) {
  console.log(marketplace.title);
  console.log(marketplace.address);
}
```

## State Structure

```typescript
{
  auth: {
    user: {
      id: "user-id",
      email: "user@example.com",
      marketplace: {
        completed: true,
        title: "My Shop",
        address: "123 Street"
      },
      networking: {
        completed: false
      }
    }
  }
}
```

## Notes

- Use `user?.marketplace?.completed` for gating UI or showing completion.
- If `user?.marketplace` is missing, show the registration prompt.
