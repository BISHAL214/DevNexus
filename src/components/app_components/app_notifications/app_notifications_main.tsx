"use client";
import { useNotifications } from "@/hooks/use-notifications";
import React, { useEffect } from "react";
import { NotificationTabs } from "./app_notifications_tabs";
import { NotificationList } from "./app_notification_list";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { useSocketStore } from "@/store/socket_socketstore";

type Props = {};

const UserNotificationsMain = (props: Props) => {
  const { user } = useFirebaseStore();
  const { socket } = useSocketStore();
  const {
    activeNotificationTab,
    setActiveNotificationTab,
    activeNotifications,
    fetchNotifications,
    markAllAsRead,
    addNotification,
    notifications,
  } = useNotifications();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user?.id);
    }
  }, [user, notifications.length, activeNotifications.length]);

  // Listen for new notifications if on the notification page
  useEffect(() => {
    if (socket && user?.id) {
      const handleNewNotification = (data: any) => {
        console.log("🔔 New notification:", data);
        addNotification(data.notification);
      };

      socket.on("new_connection_request", handleNewNotification);
      return () => {
        socket.off("new_connection_request", handleNewNotification);
      };
    }
  }, [socket, user]);

  return (
    <div className="max-w-3xl mx-auto bg-transparent p-2 md:p-6">
      <div className="flex w-full mt-1 mb-4">
        <h1 className="text-white text-2xl font-sans gradient-text font-semibold">
          Notifications
        </h1>
      </div>
      <NotificationTabs
        activeTab={activeNotificationTab}
        setActiveTab={setActiveNotificationTab}
      />
      {activeNotifications && (
        <NotificationList notifications={activeNotifications} />
      )}
    </div>
  );
};

export default UserNotificationsMain;
