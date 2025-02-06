"use client";
import GeometricBackground from "@/components/app_components/app_background_pattern/app_geometric_background";
import BackgroundPattern from "@/components/app_components/app_background_pattern/background_pattern";
import { Loader } from "@/components/app_components/app_loader/__loader";
import UserOnboardingForm from "@/components/app_components/app_user_onboarding/user_onboardingForm";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const UserOnBoardingPage = () => {
  const { user, user_loading } = useFirebaseStore();

  useEffect(() => {
    if (!user_loading) {
      if (user && user.id) {
        redirect("/");
      }
    }
  }, [user, user_loading]);

  if (user_loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader className="text-white" />
      </div>
    );
  }

  return (
    <GeometricBackground>
      <div className="min-h-screen overflow-y-scroll relative flex items-center justify-center flex-col">
        <h1 className="text-white mt-[7rem] z-10 text-4xl sm:text-5xl md:text-6xl text-center font-bold font-sans">
          Welcome To The <span className="text-blue-400 font-playwrite">Onboarding</span> Page
        </h1>
        <UserOnboardingForm />
      </div>
    </GeometricBackground>
  );
};

export default UserOnBoardingPage;
