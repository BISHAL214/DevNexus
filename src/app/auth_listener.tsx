"use client";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { useEffect } from "react";

const AuthListener = () => {
  const listenToAuthChanges = useFirebaseStore(
    (state) => state.listen_to_auth_changes
  );
  useEffect(() => {
    listenToAuthChanges();
  }, [listenToAuthChanges]);
  return null;
};

export default AuthListener;
