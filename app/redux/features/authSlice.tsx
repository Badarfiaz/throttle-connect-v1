import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { MarketplaceStore } from "@/types/marketplace";
import { NetworkingStore } from "@/types/networking";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { allowedPageType, User } from "@/types/CommonType";
import { normalizeFirestoreStore } from "@/lib/utils";
import { MemberProfile } from "@/types/member";

export type UserInput = {
  email: string;
  password: string;
  name?: string;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};
const getStoreData = async <TStore extends { createdAt?: unknown }>(
  collectionName: string,
  userId: string,
): Promise<TStore | null> => {
  // Generic implementation for fetching a store document by ownerUid
  const q = query(
    collection(db, collectionName),
    where("ownerUid", "==", userId),
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const docData = snapshot.docs[0].data();
    console.log(docData);
    return normalizeFirestoreStore(docData as TStore);
  }
  return null;
};

export const fetchMarketplaceForUser = createAsyncThunk(
  "auth/fetchMarketplaceForUser",
  async (userId: string) => {
    return await getStoreData<MarketplaceStore>("marketplaceStores", userId);
  },
);

export const fetchNetworkingForUser = createAsyncThunk(
  "auth/fetchNetworkingForUser",
  async (userId: string) => {
    return await getStoreData<NetworkingStore>("networkingStores", userId);
  },
);
export const fetchUserProfileData = createAsyncThunk(
  "auth/fetchUserProfileData",
  async (userId: string) => {
    return await getStoreData<MemberProfile>("members", userId);
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      console.log("user set user payload", action.payload);
      state.user = action.payload || null;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    updateUserOnboarding: (
      state,
      action: PayloadAction<{
        pageType: allowedPageType;
        data: any;
        completed: boolean;
      }>,
    ) => {
      if (state.user) {
        const { pageType, data, completed } = action.payload;
        console.log("user update onboarding payload", action.payload);
        state.user[pageType] = {
          ...data,
          completed,
        };
      }
    },
    setNetworkingStore: (state, action: PayloadAction<NetworkingStore | null>) => {
      if (state.user) {
        state.user.networking = action.payload || undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMarketplaceForUser.fulfilled, (state, action) => {
      const userId = action.meta.arg;
      if (state.user && state.user.userId === userId) {
        state.user.marketplace = action.payload;
      }
    });
    builder.addCase(fetchNetworkingForUser.fulfilled, (state, action) => {
      const userId = action.meta.arg;
      if (state.user && state.user.userId === userId) {
        state.user.networking = action.payload;
      }
    });
    builder.addCase(fetchUserProfileData.fulfilled, (state, action) => {
      const userId = action.meta.arg;
      if (state.user && state.user.userId === userId) {
        state.user.profileData = action.payload;
      }
    });
  },
});

// ================== Exports ==================
export const { logout, clearError, setUser, updateUserOnboarding, setNetworkingStore } =

  authSlice.actions;

// Listener middleware: when `setUser` is dispatched with a user, fetch both stores.
export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: setUser,
  effect: async (action, listenerApi) => {
    const user = action.payload as User | null;
    if (!user) return;
    try {
      await Promise.all([
        listenerApi.dispatch(fetchMarketplaceForUser(user.userId)),
        listenerApi.dispatch(fetchNetworkingForUser(user.userId)),
        listenerApi.dispatch(fetchUserProfileData(user.userId)),
      ]);
    } catch (e) {
      // ignore errors; fetchMarketplaceForUser handles nulls
    }
  },
});

export default authSlice.reducer;
