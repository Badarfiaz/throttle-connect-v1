import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ================== Types ==================
export type MarketplaceStore = {
  title?: string;
  address?: string;
  phone?: string;
  email?: string;
  completed?: boolean;
  pageType?: string;
  onBoardType?: string;
  [key: string]: any; // Allow for additional fields
};

export type MarketplaceState = {
  store: MarketplaceStore | null;
  isLoading: boolean;
  error: string | null;
};

// ================== Initial State ==================
const initialState: MarketplaceState = {
  store: {
    completed: false,
  },
  isLoading: false,
  error: null,
};

// ================== Slice ==================
const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setMarketplace: (state, action: PayloadAction<MarketplaceStore>) => {
      state.store = {
        ...state.store,
        ...action.payload,
      };
      state.isLoading = false;
      state.error = null;
    },
    clearMarketplace: (state) => {
      state.store = null;
      state.error = null;
    },
    setMarketplaceLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMarketplaceError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

// ================== Exports ==================
export const {
  setMarketplace,
  clearMarketplace,
  setMarketplaceLoading,
  setMarketplaceError,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
