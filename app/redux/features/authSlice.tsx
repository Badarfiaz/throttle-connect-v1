import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
 import { doc, setDoc } from "firebase/firestore";
 import {auth, db} from '../../../firebase.js'
 // ================== Types ==================
export type User = {
  id: string;
  email: string;
  name?: string;
};

export type UserInput = {
  email: string;
  password: string;
  
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

// ================== Initial State ==================
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ================== Thunks ==================

// Create new user
export const createUserThunk = createAsyncThunk<User, UserInput>(
  "auth/createUser",
  async (data: UserInput) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const firebaseUser = userCredential.user;
   const userId = firebaseUser.uid;
    const name = data.email ? data.email.split("@")[0] : "";

     const userDocRef = doc(db, "users", userId);

    await setDoc(
      userDocRef,
      {
        name,
        userId,
        email: firebaseUser.email ?? "",
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );




    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? "",
     };
  }
);

// Sign in existing user
export const loginUser = createAsyncThunk<User, UserInput>(
  "auth/loginUser",
  async (data: UserInput) => {
    const auth = getAuth();
    console.log('Auth Thunk => ', data)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const firebaseUser = userCredential.user;
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? "",
    };
  }
);

 


// Check current auth state
export const checkAuthStateThunk = createAsyncThunk<User | null>(
  "auth/checkAuthState",
  async () => {
    const auth = getAuth();
    return new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve({
            id: user.uid,
            email: user.email ?? "",
          });
        } else {
          resolve(null);
        }
      });
    });
  }
);
export const loginUserWithGoogle = createAsyncThunk(
  "auth/loginUserWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
const userId = user.uid;
    const name = user.email ? user.email.split("@")[0] : "";

      // 1️⃣ Firestore user reference
      const userDocRef = doc(db, "users", userId);

      // 2️⃣ Merge user details into Firestore
      await setDoc(
        userDocRef,
        {
          name,
          userId,
          email: user.email ?? "",
            createdAt: new Date().toISOString(),
        },
        { merge: true }
      );


      return {
        id: user.uid,
        email: user.email,
      //  userType: "customer",
      };
   } catch (error: unknown) {
  return rejectWithValue((error as Error).message || "Google login failed");
}

  }
);

 

// Logout user
export const logoutUserThunk = createAsyncThunk("auth/logoutUser", async () => {
  const auth = getAuth();
  await signOut(auth);
});

// ================== Slice ==================
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
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // ===== createUser =====
    builder
      .addCase(createUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Sign up failed";
      });

    // ===== loginUser =====
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;  
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      });

    // ===== checkAuthState =====
    builder
      .addCase(checkAuthStateThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStateThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthStateThunk.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

    // ===== logoutUser =====
  .addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    })

    .addCase(loginUserWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !! action.payload;
      })
      .addCase(loginUserWithGoogle.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
  },
});

// ================== Exports ==================
export const { logout, clearError, setUser } = authSlice.actions;
export { createUserThunk as createUser, logoutUserThunk as logoutUser, checkAuthStateThunk as checkAuthState };
export default authSlice.reducer;
