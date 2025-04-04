"use client";

import Navbar from "@/components/app_components/app_header/app_header_wrapper";
import { MobileDockNavigation } from "@/components/app_components/app_header/app_mobile_dock";
import { useNotificationStore } from "@/store/notification_notificationStore";
import { SocketProvider } from "@/lib/socket_provider";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { useSocketStore } from "@/store/socket_socketstore";
import { useEffect, useRef, useState } from "react";
import AuthListener from "./auth_listener";
import { Toaster } from "sonner";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useFirebaseStore();
  const { socket } = useSocketStore();
  const {
    unreadCount,
    notifications,
    fetchNotifications,
    listenForNotifications,
    listenForConnectionAccept,
    listenForConnectionDecline,
    pendingUserRefreshes,
  } = useNotificationStore();

  const [showNotificationBadge, setShowNotificationBadge] =
    useState<boolean>(false);

  // Refs to prevent multiple listener registrations and track cleanup functions
  const listenerRefs = useRef({
    notification: { registered: false, cleanup: null as (() => void) | null },
    connection_accept: {
      registered: false,
      cleanup: null as (() => void) | null,
    },
    connection_decline: {
      registered: false,
      cleanup: null as (() => void) | null,
    },
  });

  // Fetch notifications when user ID changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id]);

  // Setup all socket listeners
  useEffect(() => {
    if (!socket || !user) return;

    // Helper to setup a listener with proper cleanup tracking
    const setupListener = (
      type: "notification" | "connection_accept" | "connection_decline",
      listenerFn:
        | typeof listenForNotifications
        | typeof listenForConnectionAccept
        | typeof listenForConnectionDecline,
    ) => {
      if (!listenerRefs.current[type].registered) {
        const cleanup = listenerFn(socket, user);
        if (cleanup) {
          listenerRefs.current[type].cleanup = cleanup;
          listenerRefs.current[type].registered = true;
        }
      }
    };

    // Setup all listeners
    setupListener("notification", listenForNotifications);
    setupListener("connection_accept", listenForConnectionAccept);
    setupListener("connection_decline", listenForConnectionDecline);

    // Cleanup function
    return () => {
      // Cleanup all listeners
      Object.values(listenerRefs.current).forEach((ref) => {
        if (ref.cleanup) {
          ref.cleanup();
          ref.registered = false;
          ref.cleanup = null;
        }
      });
    };
  }, [socket, user]);

  // Update badge when unread notifications exist
  useEffect(() => {
    setShowNotificationBadge(unreadCount > 0);
  }, [unreadCount]);

  return (
    <SocketProvider>
      <Navbar
        unreadNotificationCount={unreadCount}
        showNotificationBadge={showNotificationBadge}
        setShowNotificationBadge={setShowNotificationBadge}
      />
      {children}
      <Toaster />
      {user && (
        <MobileDockNavigation
          unreadNotificationCount={unreadCount}
          showNotificationBadge={showNotificationBadge}
          setShowNotificationBadge={setShowNotificationBadge}
        />
      )}
      <AuthListener />
    </SocketProvider>
  );
};
