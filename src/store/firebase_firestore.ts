import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  firebase_auth,
  firebase_storage,
  google_provider,
  github_provider,
} from "@/firebase/__init";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import axios from "axios";
import { User } from "@/interfaces/app_database_models";
import { firestoreInterface } from "@/interfaces/app_firebase";
import { prisma } from "@/lib/prisma";
import { getUserById, updateUserCache } from "../../actions/user_apis";
import { useSocketStore } from "./socket_socketstore";

export const useFirebaseStore = create<firestoreInterface>((set) => ({
  user: null,
  error: null,
  is_error: false,
  user_loading: true,

  sign_out: async () => {
    // Implementation here
    return signOut(firebase_auth);
  },

  google_sign_in: async () => {
    // Implementation here
    try {
      const result: any = await signInWithPopup(firebase_auth, google_provider);
      if (result && result?.user) {
        const uid = result.user.uid;
        // find if the user exists or onboarded in the database
        const existing_user = await getUserById(uid);
        if (
          existing_user?.error &&
          existing_user?.message === "User not found"
        ) {
          return { user: result.user, is_onboarded: false };
        }
        return { user: result?.user, is_onboarded: true };
      }
    } catch (error: any) {
      console.log(error.message);
      return {
        success: false,
        message: error.message ? error.message : "Something Went Wrong.",
      };
    }
  },

  github_sign_in: async () => {
    try {
      const result = await signInWithPopup(firebase_auth, github_provider);
      if (result && result?.user) {
        const uid = result.user.uid;
        // find if the user exists or onboarded in the database
        const existing_user = await getUserById(uid);

        if (
          existing_user?.error &&
          existing_user?.message === "User not found"
        ) {
          return { user: result.user, is_onboarded: false };
        }
        return { user: result?.user, is_onboarded: true };
      }
    } catch (error: any) {
      console.log(error.message);
      return {
        success: false,
        message: error.message ? error.message : "Something Went Wrong.",
      };
    }
  },

  setUser: (user) => set({ user }),

  setUserLoading: (isLoading) => set({ user_loading: isLoading }),

  listen_to_auth_changes: () => {
    set({ user_loading: true });
    console.log("Listening to auth changes");
    onAuthStateChanged(firebase_auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser?.uid) {
        const { connect, socket } = useSocketStore.getState();
        try {
          const database_user = await getUserById(firebaseUser.uid);
          if (database_user.success && database_user.user_data) {
            set({
              user: { ...firebaseUser, ...database_user.user_data },
              user_loading: false,
            });
            connect();
            // socket?.emit("join", { user_id: database_user.user_data.id });
          } else {
            set({ user: firebaseUser, user_loading: false });
          }
        } catch (err: any) {
          console.log(err.message);
          set({ error: err.message, user_loading: false });
        }
      } else {
        set({ user: null, user_loading: false });
        useSocketStore.getState().disconnect();
      }
    });
  },

  updateUserLocally: (updates: any) => {
    set((state) => {
      if (!state.user) return { user: null };

      // Create a copy of the existing user object
      const newUser = { ...state.user };

      // Remove keys that are being updated
      Object.keys(updates).forEach((key) => {
        delete newUser[key];
      });

      // Spread updates over the cleaned user object
      return { user: { ...newUser, ...updates } };
    });
  },

  refreshUserCache: async (userId: string) => {
    // This will be our debounced function to refresh Redis cache
    try {
      const { success, message, uppdatedUser } = await updateUserCache(userId);
      if (success) {
        set({ user: { ...uppdatedUser }, user_loading: false });
        console.log("Cache refresh successful:", message);
      } else {
        console.error("Cache refresh failed:", message);
      }
    } catch (error) {
      console.error("Cache refresh failed from catch error:", error);
    }
  },
}));

// const loggedInUser = await prisma.user.findUnique({
//   where: { id: firebaseUser.uid },
// })
// if(loggedInUser) {
//   set({ user: { ...firebaseUser, ...loggedInUser }, user_loading: false });
// } else {
//   set({ user: firebaseUser, user_loading: false });
//   window.location.href = "/user/onboarding";
// }

// If no user is signed in, set state and redirect to onboarding page
// window.location.href = "/user/onboarding";
