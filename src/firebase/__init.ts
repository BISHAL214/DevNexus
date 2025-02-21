import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./__config";

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const firebase_storage = getStorage(firebase_app);
export const google_provider = new GoogleAuthProvider();
export const github_provider = new GithubAuthProvider();