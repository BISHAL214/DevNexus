"use client";

import { usePathname } from "next/navigation";
import AppNavbar from "./app_header";

const Navbar = () => {
  const pathname = usePathname();

  // Hide Navbar on these routes
  const hideNavbarRoutes = ["/auth/signin", "/user/onboarding"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return shouldShowNavbar ? <AppNavbar /> : null;
};

export default Navbar;
