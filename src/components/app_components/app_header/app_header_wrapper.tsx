"use client";

import { usePathname } from "next/navigation";
import AppNavbar from "./app_header";

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

  // Hide Navbar on these routes
  const hideNavbarRoutes = ["/auth/signin", "/user/onboarding"];
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
