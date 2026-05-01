import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authListenerMiddleware } from "./features/authSlice";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
});
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
