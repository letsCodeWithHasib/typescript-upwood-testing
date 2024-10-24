import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  signUpUserWithEmail,
  signInWithEmail,
  getSession,
  signOut as cognitoSignOut,
  verifyCode as confirmSignUp,
} from "../../libs/cognito";

// Define the structure of the authentication response
interface AuthResponse {
  accessToken: string;
  idToken: string;
}

// Define the structure of the initial state
interface AuthState {
  user: null | { email: string; name?: string }; // Adjust based on your user structure
  accessToken: string | null;
  idToken: string | null;
  loading: boolean;
  error: string | null;
  authStatus:
    | "SignedIn"
    | "SignedOut"
    | "Error"
    | "Verified"
    | "VerificationFailed"
    | null;
  sessionInfo: AuthResponse | null; // Store session information
}

// Define the initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  idToken: null,
  loading: false,
  error: null,
  authStatus: null,
  sessionInfo: null,
};

// Thunk for signing in
export const signIn = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    const session = await signInWithEmail(email, password);
    return {
      accessToken: session.getAccessToken().getJwtToken(),
      idToken: session.getIdToken().getJwtToken(),
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Thunk for signing up
export const signUp = createAsyncThunk<
  unknown,
  { email: string; password: string }
>("auth/signUp", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await signUpUserWithEmail(email, password);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Thunk for fetching session
export const fetchSession = createAsyncThunk<AuthResponse>(
  "auth/fetchSession",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      return {
        accessToken: session.getAccessToken().getJwtToken(),
        idToken: session.getIdToken().getJwtToken(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for signing out
export const signOut = createAsyncThunk("auth/signOut", async () => {
  await cognitoSignOut();
});

// Thunk for verification
export const verifyCode = createAsyncThunk<
  unknown,
  { email: string; code: string }
>("auth/verifyCode", async ({ email, code }, { rejectWithValue }) => {
  try {
    const response = await confirmSignUp(email, code);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        signIn.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.authStatus = "SignedIn";
          state.sessionInfo = action.payload;
          state.error = null;
        }
      )
      .addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
        // Changed from string | null to any
        state.authStatus = "Error";
        state.error = action.payload || "Login failed";
      })
      .addCase(signUp.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
        // Changed from string | null to any
        state.error = action.payload || "Sign up failed";
      })
      .addCase(
        fetchSession.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.authStatus = "SignedIn";
          state.sessionInfo = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSession.rejected, (state, action: PayloadAction<any>) => {
        // Changed from string | null to any
        state.authStatus = "SignedOut";
        state.sessionInfo = null;
        state.error = action.payload || "Failed to fetch session";
      })
      .addCase(signOut.fulfilled, (state) => {
        state.authStatus = "SignedOut";
        state.sessionInfo = null;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.authStatus = "Verified";
        state.error = null;
      })
      .addCase(verifyCode.rejected, (state, action: PayloadAction<any>) => {
        // Changed from string | null to any
        state.authStatus = "VerificationFailed";
        state.error = action.payload || "Verification failed";
      });
  },
});

export default authSlice.reducer;
