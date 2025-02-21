"use client";

import { useEffect, useState } from "react";
import { motion, spring } from "framer-motion";
import { Home, Search, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { app_navigation_links } from "@/constants/app_navigation_links";
import { useFirebaseStore } from "@/store/firebase_firestore";

export function MobileDockNavigation({
  unreadNotificationCount,
  setShowNotificationBadge,
  showNotificationBadge,
}: {
  unreadNotificationCount: number;
  setShowNotificationBadge: (value: boolean) => void;
  showNotificationBadge: boolean;
}) {
  const [activeItem, setActiveItem] = useState(0);
  const pathName = usePathname();
  const { user } = useFirebaseStore();

  useEffect(() => {
    if (pathName === `/user/${user?.slug}/notifications`) {
      setShowNotificationBadge(false);
    }
  }, [pathName]);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 m-2 right-0 z-50 bg-black/3 backdrop-blur-xl border-gray-800 rounded-xl shadow-lg md:hidden"
    >
      <ul className="flex justify-around items-center h-16">
        {app_navigation_links.map((item, index) => {
          const LinkIcon = item.icon;
          const href = `/user/${user?.slug}${item.href}`;
          if (item.title === "Notifications") {
            return (
              <motion.li
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 * index }}
                key={item.title}
                className="relative"
              >
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center w-10 h-16 p-3"
                  onClick={() => setActiveItem(index)}
                >
                  <motion.div
                    animate={{ scale: activeItem === index ? 1.2 : 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className={`${
                      pathName === href ? "text-blue-500" : "text-white"
                    }`}
                  >
                    {
                      <div className="relative">
                        <LinkIcon />
                        {showNotificationBadge && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, animation: "ease-in-out" }}
                            transition={{
                              duration: 0.2,
                              delay: 0.2,
                            }}
                            className="absolute top-0 z-10 right-0 w-3 h-3 bg-red-500 text-white rounded-full flex justify-center items-center"
                          />
                        )}
                      </div>
                    }
                    {/* className={`h-6 w-6 ${activeItem === index ? "text-blue-500" : "text-gray-500"}`} */}
                  </motion.div>
                  {/* <span
                    className={`text-xs mt-1 line-clamp-1 ${
                      pathName === item.href ? "text-blue-500" : "text-white"
                    }`}
                  >
                    {item.title}
                  </span> */}
                </Link>
                {/* {activeItem === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                    layoutId="activeItem"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )} */}
              </motion.li>
            );
          }
          return (
            <motion.li
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 * index }}
              key={item.title}
              className="relative"
            >
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center w-10 h-16 p-3"
                onClick={() => setActiveItem(index)}
              >
                <motion.div
                  animate={{ scale: activeItem === index ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`${
                    pathName === item.href ? "text-blue-500" : "text-white"
                  }`}
                >
                  {<LinkIcon />}
                  {/* className={`h-6 w-6 ${activeItem === index ? "text-blue-500" : "text-gray-500"}`} */}
                </motion.div>
                {/* <span
                  className={`text-xs mt-1 line-clamp-1 ${
                    pathName === item.href ? "text-blue-500" : "text-white"
                  }`}
                >
                  {item.title}
                </span> */}
              </Link>
              {/* {activeItem === index && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  layoutId="activeItem"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )} */}
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
