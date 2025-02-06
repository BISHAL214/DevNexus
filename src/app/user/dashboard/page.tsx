"use client"
import DashboardPage from "@/components/app_components/app_user_dashboard/__main_dashboard";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { redirect } from "next/navigation";
import React from "react";

const UserDashboardPage = () => {
  const { user } = useFirebaseStore();
  if(!user) redirect("/");
  return (
    <div className="min-h-screen relative overflow-y-auto flex bg-black">
      <DashboardPage />
    </div>
  );
};

export default UserDashboardPage;
