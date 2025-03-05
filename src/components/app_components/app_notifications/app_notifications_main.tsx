"use client";
import React, { useEffect } from "react";
import { NotificationTabs } from "./app_notifications_tabs";
import { NotificationList } from "./app_notification_list";
import { useFirebaseStore } from "@/store/firebase_firestore";
import { useSocketStore } from "@/store/socket_socketstore";
import { useNotificationStore } from "@/store/notification_notificationStore"; // Import Zustand store

const UserNotificationsMain = () => {
  const { user } = useFirebaseStore();
  const { socket } = useSocketStore();
  const {
    activeNotificationTab,
    setActiveNotificationTab,
    activeNotifications,
    fetchNotifications,
  } = useNotificationStore();

  // Fetch notifications when user ID changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
    }
  }, [user?.id]);

  // console.log("UserNotificationsMain", activeNotifications);
  console.log(user);

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
      {activeNotifications.length > 0 ? (
        <NotificationList notifications={activeNotifications} />
      ) : (
        <p className="text-white text-center mt-4">No notifications yet.</p>
      )}
    </div>
  );
};

export default UserNotificationsMain;
