---
name: project-admin-panel
description: Super Admin Panel built for ThrottleConnect — routes, components, hooks, analytics
metadata:
  type: project
---

Completed full Super Admin Dashboard at `/admin`.

**Why:** Platform needed role-based admin controls for managing all content.
**How to apply:** The admin panel is fully built and operational. Only add new admin features on top.

## Route Structure
- `/admin` — Overview dashboard with platform stats + charts
- `/admin/stores` — Marketplace stores management
- `/admin/products` — Products (collectionGroup query)
- `/admin/services` — Services (collectionGroup query)
- `/admin/clubs` — Networking clubs management
- `/admin/events` — Events management
- `/admin/users` — Users with role editor (promote/demote superAdmin)
- `/admin/notes` — Notes CRUD system
- `/admin/analytics` — Platform-wide analytics + leaderboards
- `/admin/settings` — Admin settings page

## Key Files
- `app/admin/layout.tsx` — Admin layout with sidebar; uses `AdminGuard`
- `components/admin/AdminGuard.tsx` — Client-side role check, redirects non-superAdmin
- `components/admin/AdminSidebar.tsx` — Dark sidebar (#0B2447) with all nav links
- `components/admin/AdminTopNav.tsx` — Top bar with mobile drawer + user dropdown
- `components/admin/FeaturedBadge.tsx` — Reusable featured badge (amber star)
- `components/admin/AdminStatsCard.tsx` — Reusable stats card
- `components/admin/ConfirmDialog.tsx` — Confirmation modal
- `components/shared/ConditionalShell.tsx` — Hides global Header/Footer on /admin routes
- `middleware.ts` — Redirects unauthenticated requests to /admin → /
- `hooks/admin/useAdminStores.ts` — Fetch/toggle/delete marketplace stores
- `hooks/admin/useAdminProducts.ts` — Fetch via collectionGroup("products")
- `hooks/admin/useAdminServices.ts` — Fetch via collectionGroup("services")
- `hooks/admin/useAdminClubs.ts` — networkingStores collection
- `hooks/admin/useAdminEvents.ts` — networkingEvents collection
- `hooks/admin/useAdminUsers.ts` — users collection with role change
- `hooks/admin/useAdminNotes.ts` — notes collection CRUD
- `hooks/admin/useAdminAnalytics.ts` — Platform stats via getCountFromServer
- `hooks/analytics/useTrackView.ts` — Increment views + dailyViews map
- `hooks/analytics/useTrackClick.ts` — Increment clicks

## Auth & RBAC
- `User.role` field: "user" | "superAdmin" (already in types/CommonType.ts)
- AuthProvider updated to read `role` from Firestore and dispatch it
- HeaderProfile updated: shows "Admin Dashboard" link only when `role === "superAdmin"`
- AdminGuard: checks Redux state, redirects if not superAdmin

## Featured System
- `featured: boolean` added to MarketplaceStore, MarketplaceProduct, MarketplaceService, NetworkingStore, NetworkingEvent, Club types
- FeaturedBadge shown on ProductCard, ServiceCard, ClubsCard, StoreHeader
- Admin toggle via Switch + updateDoc({ featured: !current }) with optimistic update

## Analytics Collections (Firestore)
- storeAnalytics / productAnalytics / serviceAnalytics / clubAnalytics / eventAnalytics
- Schema: { totalViews, totalClicks, uniqueVisitors, dailyViews: {date: count}, lastViewedAt, updatedAt }
