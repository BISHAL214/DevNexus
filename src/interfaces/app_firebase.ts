import { ZodString } from "zod";

export interface firestoreInterface {
  user: any | null;
  error: any | null;
  is_error: boolean;
  user_loading: boolean;
  email_sign_in: (
    email: string | ZodString,
    password: string | ZodString,
  ) => Promise<any>;
  email_sign_up: (
    email: string | ZodString,
    password: string | ZodString,
  ) => Promise<any>;
  sign_out: () => Promise<void>;
  google_sign_in: () => Promise<any>;
  github_sign_in: () => Promise<any>;
  setUser: (user: any | null) => void;
  setUserLoading: (isLoading: boolean) => void;
  listen_to_auth_changes: () => void;
  updateUserLocally: (updates: any) => void;
  refreshUserCache: (userId: string) => void;
}

// type google_sign_in_return = {
//   success?: boolean;
//   message?: string | null;
//   displayName?: string | null;
//   photoURL?: string | null;
// };
// type github_sign_in_return = {
//   success?: boolean;
//   message?: string | null;
//   displayName?: string | null;
//   photoURL?: string | null;
// };
