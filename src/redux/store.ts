// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";

// Define the state shape
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  user: ReturnType<typeof userReducer>;
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

//creating a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//configure the store with typescript
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

//creating a persistor
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
