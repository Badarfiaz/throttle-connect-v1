// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import marketplaceReducer from "./features/marketplaceSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  marketplace: marketplaceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
