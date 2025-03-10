import { checkIfEmailExistsInFirebaseAuth } from "@/firebase/__helpers";
import {
  firebase_auth,
  github_provider,
  google_provider,
} from "@/firebase/__init";
import { firestoreInterface } from "@/interfaces/app_firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { getUserById, updateUserCache } from "../../actions/user_apis";
import { useSocketStore } from "./socket_socketstore";
import { ZodString } from "zod";

export const useFirebaseStore = create<firestoreInterface>((set) => ({
  user: null,
  error: null,
  is_error: false,
  user_loading: true,

  sign_out: async () => {
    // Implementation here
    return signOut(firebase_auth);
  },

  email_sign_in: async (
    email: string | ZodString,
    password: string | ZodString,
  ) => {
    try {
      const result = await signInWithEmailAndPassword(
        firebase_auth,
        email as string,
        password as string,
      );
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
      console.log(error);
      return {
        success: false,
        message: error.message ? error.message : "Something Went Wrong.",
      };
    }
  },

  email_sign_up: async (
    email: string | ZodString,
    password: string | ZodString,
  ) => {
    try {
      // check the email is alreayd registered or not
      const { exists, exists_method, error } =
        await checkIfEmailExistsInFirebaseAuth(email as string, firebase_auth);

      if (exists && exists_method && !error) {
        let all_methods: string = "";
        exists_method.forEach((method: string) => {
          // const MethodIcon  = methodIconMap[method as keyof typeof methodIconMap];
          all_methods += method + ", ";
        });

        return {
          success: false,
          message: `Email already registered with these methods: ${all_methods}`,
        };
      }

      const result = await createUserWithEmailAndPassword(
        firebase_auth,
        email as string,
        password as string,
      );
      if (result && result?.user) {
        await sendEmailVerification(result.user);
        return { user: result.user };
      }
    } catch (error: any) {
      console.log(error?.message);
      return {
        success: false,
        message: error?.message ? error?.message : "Something Went Wrong.",
      };
    }
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

  refreshUserCache: async (userId: string): Promise<boolean> => {
    // This will be our debounced function to refresh Redis cache
    try {
      if (!userId) {
        console.error("❌ refreshUserCache called with no userId");
        return false;
      }

      console.log(
        "🔄 Starting cache refresh for user:",
        userId,
        "at:",
        new Date().toISOString(),
      );
      const startTime = performance.now();

      // Add a small delay to ensure the database has the latest data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { success, message, uppdatedUser } = await updateUserCache(userId);

      const endTime = performance.now();
      console.log(
        `⏱️ Cache refresh took ${((endTime - startTime) / 1000).toFixed(
          2,
        )} seconds`,
      );

      if (success && uppdatedUser) {
        console.log(
          "✅ Cache refresh successful, updating local state with data:",
          uppdatedUser.id,
        );
        // First verify we have all required user data
        if (!uppdatedUser.id || !uppdatedUser.firebase_uid) {
          console.error("❌ Updated user data is incomplete:", uppdatedUser);
          return false;
        }

        set((state) => {
          // Preserve any existing user data that wasn't in the cache update
          const currentUser = state.user || {};
          const updatedState = {
            user: {
              ...currentUser,
              ...uppdatedUser,
              // Ensure critical fields are preserved
              firebase_uid:
                uppdatedUser.firebase_uid || currentUser.firebase_uid,
            },
            user_loading: false,
          };
          console.log("📝 Updated user state with new data");
          return updatedState;
        });

        return true;
      } else {
        console.error("❌ Cache refresh failed:", message);
        return false;
      }
    } catch (error) {
      console.error("❌ Cache refresh failed with error:", error);
      return false;
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
