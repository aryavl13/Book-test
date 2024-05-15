import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  success: boolean,
  authentication: {
    email?: string,
    firstname?: string,
    role?: string,
    accessToken?: string,
    profile_image?:string
  }
}

interface AuthState {
  user: User | null; // Change user to a single object, not an array
  isLoading: boolean;
}

const INITIAL_STATE: AuthState = {
  user: null, // Initialize user as null
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    loggedInUser: (state, action: PayloadAction<AuthState["user"]>) => { 
      state.user = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<AuthState["isLoading"]>) => { 
      state.isLoading = action.payload;
    },
  },
});

export const { loggedInUser, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
