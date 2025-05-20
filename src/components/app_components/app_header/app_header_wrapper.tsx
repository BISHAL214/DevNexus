"use client";

import { usePathname } from "next/navigation";
import AppNavbar from "./app_header";
import { useFirebaseStore } from "@/store/firebase_firestore";

const Navbar = ({
  unreadNotificationCount,
  setShowNotificationBadge,
  showNotificationBadge,
}: {
  unreadNotificationCount: number;
  setShowNotificationBadge: (value: boolean) => void;
  showNotificationBadge: boolean;
}) => {
  const pathname = usePathname();
    const { user } = useFirebaseStore();
  // Hide Navbar on these routes
  const hideNavbarRoutes = [
    "/auth/signin",
    "/auth/verification/pending",
    "/user/onboarding",
    `/user/${user?.slug}/projects`
  ];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return shouldShowNavbar ? (
    <AppNavbar
      unreadNotificationCount={unreadNotificationCount}
      action={showNotificationBadge}
      setAction={setShowNotificationBadge}
    />
  ) : null;
};

export default Navbar;
