# Networking Dashboard - File Structure & Quick Reference

## 📁 Project Structure

```
throttle-connect-v1/
├── components/
│   └── networking/
│       ├── MemberCard.tsx                          ⭐ Member card UI component
│       ├── dashboard/
│       │   ├── NetworkingDashboardContainer.tsx   ⭐ Main dashboard container
│       │   └── sections/
│       │       ├── ProfileSection.tsx             ⭐ Club profile form section
│       │       ├── MembersSection.tsx             ⭐ Members grid section
│       │       └── profile/
│       │           ├── ClubIdentityCard.tsx       ⭐ Club identity form
│       │           └── ClubDetailsCard.tsx        ⭐ Club details form
│       └── registration/
│           └── formFields.ts                       (Existing - reused)
│
├── dummydata/
│   └── members.tsx                                 ⭐ Dummy member data
│
├── ulity/
│   └── networkingDashboard.ts                      ⭐ Dashboard types & config
│
└── app/
    └── (private)/
        └── (layout)/
            └── networking/
                └── dashboard/
                    └── page.tsx                    ⭐ Dashboard page route
```

## 🔗 File Links

| Component           | Purpose                          | Location                                                                                                                                       |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Member Card         | Display member info with actions | [components/networking/MemberCard.tsx](components/networking/MemberCard.tsx)                                                                   |
| Dashboard Container | Main dashboard orchestrator      | [components/networking/dashboard/NetworkingDashboardContainer.tsx](components/networking/dashboard/NetworkingDashboardContainer.tsx)           |
| Profile Section     | Club profile forms               | [components/networking/dashboard/sections/ProfileSection.tsx](components/networking/dashboard/sections/ProfileSection.tsx)                     |
| Members Section     | Members grid view                | [components/networking/dashboard/sections/MembersSection.tsx](components/networking/dashboard/sections/MembersSection.tsx)                     |
| Club Identity Card  | Name, email, phone, city form    | [components/networking/dashboard/sections/profile/ClubIdentityCard.tsx](components/networking/dashboard/sections/profile/ClubIdentityCard.tsx) |
| Club Details Card   | Club type & description form     | [components/networking/dashboard/sections/profile/ClubDetailsCard.tsx](components/networking/dashboard/sections/profile/ClubDetailsCard.tsx)   |
| Dummy Members Data  | Sample member data               | [dummydata/members.tsx](dummydata/members.tsx)                                                                                                 |
| Dashboard Types     | TypeScript types & nav config    | [ulity/networkingDashboard.ts](ulity/networkingDashboard.ts)                                                                                   |
| Dashboard Page      | Route page                       | [app/(private)/(layout)/networking/dashboard/page.tsx](<app/(private)/(layout)/networking/dashboard/page.tsx>)                                 |

## 🎨 Key Features

### Member Card Component

- **Status Indicators**: Pending (yellow), Approved (green), Rejected (red)
- **Action Buttons**: Accept/Reject (only for pending members)
- **Information Display**: Name, email, phone, club, location, join date
- **Avatar Support**: Image display for member profile picture
- **Responsive**: Works on mobile and desktop

### Dashboard Navigation

- **Two Main Tabs**:
  - Profile (Edit club information)
  - Members (Manage member requests)
- **Status Badges**: Shows stats on member counts
- **Quick Actions**: Settings button, status indicators

### Form Integration

- Uses existing `RegistrationInputField` component
- Reuses networking `formFields` (clubSetupFields, clubDetailsFields)
- Form validation with react-hook-form
- Toast notifications for user feedback

## 🚀 Access Points

**Development URL**: `http://localhost:3000/networking/dashboard`

**Page Route**: `/app/(private)/(layout)/networking/dashboard/page.tsx`

**Main Component**: `<NetworkingDashboardContainer clubName="Urban Riders Moto" />`

## 📊 Data Structure

### Member Object

```typescript
type NetworkingMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  clubName: string;
  city: string;
  position?: string;
  joinDate: string;
  avatar?: string;
  status: "pending" | "approved" | "rejected";
};
```

## 🔄 Current Implementation Status

| Feature           | Status      | Notes                                |
| ----------------- | ----------- | ------------------------------------ |
| UI Components     | ✅ Complete | All components built & styled        |
| Dummy Data        | ✅ Complete | 6 sample members ready               |
| Form Fields       | ✅ Complete | Uses existing networking form fields |
| Member Actions    | ✅ Complete | Accept/Reject handlers in place      |
| Static Mode       | ✅ Complete | Works without backend                |
| Routing           | ✅ Complete | Dashboard page route created         |
| Responsive Design | ✅ Complete | Mobile-first approach                |
| Type Safety       | ✅ Complete | Full TypeScript support              |
| Error Handling    | ✅ Complete | Error states & loading states        |

## 🔗 Dependencies

**Reused from Marketplace**:

- `DashboardContainer` (shared component)
- `RegistrationInputField` (form input component)
- Badge, Button, Card UI components
- Form validation logic

**Existing Networking Components**:

- `clubSetupFields` form fields
- `clubDetailsFields` form fields

**Icons Used**:

- lucide-react: Check, X, Users, User (from navigation)

## 🎯 Next Steps

1. **Connect Firebase**
   - Replace `dummyMembers` with Firestore queries
   - Add real-time listeners
2. **Implement API Handlers**
   - Backend functions for accept/reject
   - Profile update endpoints
3. **Add Authentication**
   - User verification
   - Admin-only access control

4. **Extend Features**
   - Member search & filtering
   - Member role management
   - Activity timeline
   - Member history

## 📝 Notes

- All files follow the marketplace pattern for consistency
- Components are fully typed with TypeScript
- Uses Tailwind CSS for styling
- Responsive grid layout (3 columns on large screens)
- Static mode allows testing without backend
- Ready for Firebase integration
