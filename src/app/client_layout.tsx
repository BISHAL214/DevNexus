"use client";

import Navbar from "@/components/app_components/app_header/app_header_wrapper";
import { MobileDockNavigation } from "@/components/app_components/app_header/app_mobile_dock";
import { useNotifications } from "@/hooks/use-notifications";
import { SocketProvider } from "@/lib/socket_provider";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { useSocketStore } from "@/store/socket_socketstore";
import { useEffect, useRef, useState } from "react";
import AuthListener from "./auth_listener";
import { Toaster } from "sonner";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);

  const { user, refreshUserCache } = useFirebaseStore();
  const { socket } = useSocketStore();
  const {
    unreadCount,
    fetchNotifications,
    listenForNotifications,
    listenForConnectionAccept,
  } = useNotifications();

  // 🛑 Prevent multiple listener registrations
  const hasRegisteredConnectionListener = useRef(false);
  const hasRegisteredNotificationListener = useRef(false);

  // 🔄 Fetch notifications only when user ID changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id]);

  // 🔔 Setup socket listener for notifications (only once)
  useEffect(() => {
    if (!socket || !user) return;

    if (!hasRegisteredNotificationListener.current) {
      const cleanup = listenForNotifications(socket, user);
      hasRegisteredNotificationListener.current = true;
      if (!cleanup) return;
      return () => {
        cleanup();
        hasRegisteredNotificationListener.current = false; // Reset on unmount
      };
    }
  }, [socket, user]);

  // 🔵 Listen for connection accept events & refresh cache on unload
  useEffect(() => {
    if (!socket || !user) return;

    if (!hasRegisteredConnectionListener.current) {
      const cleanup = listenForConnectionAccept(socket, user);
      hasRegisteredConnectionListener.current = true;

      // 🔥 Force cache refresh when user leaves (before debounce executes)
      const handleUnload = () => refreshUserCache(user.id);
      window.addEventListener("beforeunload", handleUnload);
      if (!cleanup) return;
      return () => {
        cleanup();
        window.removeEventListener("beforeunload", handleUnload);
        hasRegisteredConnectionListener.current = false;
      };
    }
  }, [socket, user]);

  // 🔥 Update badge when unread notifications exist
  useEffect(() => {
    setShowNotificationBadge(unreadCount > 0);
  }, [unreadCount]);

  console.log(user);

  return (
    <SocketProvider>
      <Navbar
        unreadNotificationCount={unreadCount}
        setShowNotificationBadge={setShowNotificationBadge}
        showNotificationBadge={showNotificationBadge}
      />
      {children}
      <Toaster />
      <MobileDockNavigation
        unreadNotificationCount={unreadCount}
        setShowNotificationBadge={setShowNotificationBadge}
        showNotificationBadge={showNotificationBadge}
      />
      <AuthListener />
    </SocketProvider>
  );
};
