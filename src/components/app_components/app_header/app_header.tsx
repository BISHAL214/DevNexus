"use client";

import Link from "next/link";
import AppLogo from "./app_logo";
import { app_navigation_links } from "./../../../constants/app_navigation_links";
import { usePathname } from "next/navigation";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "../app_loader/__loader";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FolderKanban, LogOut, SlidersHorizontal, User } from "lucide-react";
import { motion } from "framer-motion";
import type React from "react";
import { toast } from "sonner";
import { Pacifico } from "next/font/google";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MotionLink = motion.create(Link);
const MotionAvatar = motion.create(Avatar);

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

const NavLink = ({
  href,
  children,
  index,
  totalLinks,
}: {
  href: string;
  children: React.ReactNode;
  index: number;
  totalLinks: number;
}) => {
  const pathname = usePathname();
  return (
    <MotionLink
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + 0.1 * (totalLinks - index) }}
      // whileHover={{ scale: 1.1 }}
      href={href}
      className={`px-4 py-2 transition-colors font-sans text-md tracking-wide hover:bg-gray-900 rounded-full ${
        href.includes("signin") ? pacifico.className : "hidden md:block"
      } ${pathname === href ? "text-blue-400 font-bold" : "text-white"}`}
    >
      {children}
    </MotionLink>
  );
};

export default function AppNavbar() {
  const { user, user_loading, sign_out } = useFirebaseStore();

  const handle_signout = async () => {
    try {
      await sign_out();
      toast.success("Signed out successfully");
    } catch (error) {
      console.log("Sign Out Error - ", error);
      toast.error("Failed to sign out");
    }
  };

  const avatar_fallback =
    user &&
    (user?.name || user?.displayName)
      ?.split(" ")
      .map((n: string) => n[0])
      .join("");

  return (
    <nav className="fixed w-full bg-transparent z-20">
      <div className="backdrop-blur-md bg-black/5 mx-2 mt-2 rounded-xl">
        <div className="flex px-3 h-14 w-full">
          <div className="w-full flex relative items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                <AppLogo />
              </Link>
            </div>
            {/* <div className="hidden md:block"> */}
            <div className="ml-10 flex justify-end items-center space-x-2">
              {user &&
                !user_loading &&
                app_navigation_links.map((link, index) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    index={index}
                    totalLinks={app_navigation_links.length}
                  >
                    {link.title}
                  </NavLink>
                ))}
              {user_loading && <Loader className="text-white" />}
              {!user && !user_loading && (
                <NavLink href="/auth/signin" index={0} totalLinks={1}>
                  Signin
                </NavLink>
              )}
              {user && !user_loading && (
                <MotionAvatar
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0 }}
                  className="w-10 h-10 cursor-pointer outline-none border-none focus:ring-0 focus:outline-none ml-4"
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar className="w-10 h-10 cursor-pointer outline-none border-none focus:ring-0 focus:outline-none">
                        <AvatarImage src={user?.avatar || user?.photoURL} />
                        <AvatarFallback>{avatar_fallback}</AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>

                    <PopoverContent className="w-48 mt-1 mr-3 bg-white/5 backdrop-blur-lg border-gray-900 rounded-xl shadow-xl p-2">
                      <span className="text-white px-2 text-md font-bold font-sans tracking-wide">
                        Account
                      </span>
                      <DropdownMenuSeparator className="bg-gray-700" />

                      <div className="flex items-center gap-2 px-2 py-2 text-white hover:bg-gray-900 rounded-md cursor-pointer font-sans tracking-wide">
                        <Link
                          className="flex justify-between w-full"
                          href={`/user/profile/${user?.id}`}
                        >
                          Profile
                          <User />
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 text-white px-2 py-2 hover:bg-gray-900 rounded-md cursor-pointer font-sans tracking-wide">
                        <Link
                          href={`/user/projects/${user?.id}`}
                          className="flex justify-between w-full"
                        >
                          Projects
                          <FolderKanban />
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 text-white px-2 py-2 hover:bg-gray-900 rounded-md cursor-pointer font-sans tracking-wide">
                        <Link
                          href={`/user/settings/${user?.id}`}
                          className="flex justify-between w-full"
                        >
                          Settings
                          <SlidersHorizontal />
                        </Link>
                      </div>

                      <DropdownMenuSeparator className="bg-gray-700" />

                      <AlertDialog>
                        <AlertDialogTrigger className="w-full outline-none border-none">
                          <div className="flex items-center gap-2 px-2 py-2 text-red-500 hover:bg-gray-900 rounded-md cursor-pointer font-sans tracking-wide justify-between w-full">
                            Logout
                            <LogOut />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/10 backdrop-blur-lg border-none rounded-xl shadow-xl p-10">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-500">
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              This will log you out of your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500" onClick={handle_signout} >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PopoverContent>
                  </Popover>
                </MotionAvatar>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </nav>
  );
}
