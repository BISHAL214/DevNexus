import { useFirebaseStore } from "@/store/firebase_firestore";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import {
  deleteNotificationById,
  getUsersNotifications,
  markNotificationAsReadById,
  markNotificationsAsRead,
} from "../../actions/user_apis";

export type NotificationTypes = "all" | "connection_request" | "messages";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<any[]>([]);
  const [activeNotificationTab, setActiveNotificationTab] =
    useState<NotificationTypes>("all");
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  );
  const [connectionAcceptedArray, setConnectionAcceptedArray] = useState<any[]>(
    []
  );

  const { refreshUserCache, updateUserLocally } = useFirebaseStore();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // used in connection accept listener
  const executeRef = useRef(false); // used in connection accept listener

  const fetchNotifications = async (user_id: string) => {
    setNotificationsLoading(true);
    try {
      const { notifications, success, message } = await getUsersNotifications(
        user_id
      );
      if (success && notifications) {
        setNotifications(notifications);
        setNotificationCount(notifications.length);

        // Count only unread notifications
        const unreadNotifications = notifications.filter((n: any) => !n.isRead);
        setUnreadCount(unreadNotifications.length);
      } else {
        setNotificationsError(message);
      }
    } catch (err: any) {
      setNotificationsError(err.message || "Error fetching notifications");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const addNotification = (notification: any) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Update activeNotifications instantly
    setActiveNotifications((prev) => [notification, ...prev]);
  };


  const listenForNotifications = (socket: Socket, user: any) => {
    if (!socket) return;

    const handleNewRequest = (data: any) => {
      console.log("New connection request received:", data);

      if (data?.new_connection_request?.receiver?.id === user?.id) {
        toast.success(data.notification.message, {
          duration: 5000,
          closeButton: true,
        });
        setNotifications((prev) => [data.notification, ...prev]);
        setNotificationCount((prev) => prev + 1);
        setUnreadCount((prev) => prev + 1);

        // Update active notifications instantly
        setActiveNotifications((prev) => [data.notification, ...prev]);
      }
    };

    socket.on("new_connection_request", handleNewRequest);

    return () => {
      socket.off("new_connection_request", handleNewRequest);
    };
  };

  const markAllAsRead = async (user_id: string) => {
    try {
      const { success, message } = await markNotificationsAsRead(user_id);
      if (success) {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setActiveNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      } else {
        setNotificationsError(message);
      }
    } catch (err: any) {
      console.error("Error marking notifications as read:", err.message);
      setNotificationsError(
        err.message || "Error marking notifications as read"
      );
    }
  };

  const markSpecificNotificationAsRead = async (notification_id: string) => {
    try {
      const { success, message } = await markNotificationAsReadById(
        notification_id
      );
      if (success) {
        setUnreadCount((prev) => prev - 1);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification_id ? { ...n, isRead: true } : n
          )
        );
        setActiveNotifications((prev) =>
          prev.map((n) =>
            n.id === notification_id ? { ...n, isRead: true } : n
          )
        );
      } else {
        setNotificationsError(message);
      }
    } catch (err: any) {
      console.error("Error marking notification as read:", err.message);
      setNotificationsError(
        err.message || "Error marking notification as read"
      );
    }
  };

  const listenForConnectionAccept = (socket: Socket, user: any) => {
    if (!socket) {
      console.log("Socket is not available");
      return;
    }

    const scheduleCacheRefresh = () => {
      if (timeoutRef.current) return; // Prevent duplicate scheduling

      timeoutRef.current = setTimeout(() => {
        refreshUserCache(user?.id); // Refresh cache for the current user
        executeRef.current = true;
        timeoutRef.current = null; // Clear timeout reference
      }, 1 * 60 * 1000);
    };

    const handleConnectionAccept = (data: any) => {
      console.log("Connection request accepted:", data);
      const connectionSender = data?.updated_connection?.sender?.id;
      const connectionReceiver = data?.updated_connection?.receiver?.id;

      setConnectionAcceptedArray((prev) => [
        ...prev,
        { conn_sender: connectionSender, conn_receiver: connectionReceiver },
      ]);

      const followerId =
        connectionSender === user?.id ? connectionReceiver : connectionSender;

      updateUserLocally({
        followers: [...(user?.followers || []), { id: followerId }],
        updatedAt: new Date(),
      });

      if (user?.id === connectionSender) {
        // give a toast to the user who sent the connection_request
        toast.success(`${data?.updated_connection?.receiver?.name} accept your connection request`, {
          duration: 5000,
          closeButton: true,
        });
      }

      // Schedule cache refresh after
      scheduleCacheRefresh();
    };

    const handleBeforeUnload = () => {
      if (!executeRef.current) {
        console.log("user is leaving before 5 minutes, forcing cache update");
        localStorage.setItem("cache_update", "true")
        refreshUserCache(user?.id);
        executeRef.current = true;
      }
    }

    document.addEventListener("beforeunload", handleBeforeUnload);
    socket.on("connection_request_accepted", handleConnectionAccept);

    return () => {
      socket.off("connection_request_accepted", handleConnectionAccept);
      document.removeEventListener("beforeunload", handleBeforeUnload);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  };

  const deleteNotification = async (notification_id: string) => {
    console.log("Before delete notification:", notifications);
    console.log("Before delete active notification:", activeNotifications);
    // first remove the notivication from the list
    setNotifications((prev) => prev.filter((n) => n.id !== notification_id));
    setActiveNotifications((prev) =>
      prev.filter((n) => n.id !== notification_id)
    );

    console.log("After delete notification:", notifications);
    console.log("After delete active notification:", activeNotifications);

    // then delete from database
    try {
      const { success, message } = await deleteNotificationById(
        notification_id
      );
      if (success) {
        toast.success(message);
      } else {
        setNotificationsError(message);
      }
    } catch (err: any) {
      console.error("Error deleting notification:", err.message);
      setNotificationsError(err.message || "Error deleting notification");
    }
  };

  // ✅ Use useEffect to update activeNotifications
  useEffect(() => {
    if (activeNotificationTab === "all") {
      setActiveNotifications(notifications);
    } else {
      setActiveNotifications(
        notifications.filter(
          (n) => n?.type?.toLowerCase() === activeNotificationTab
        )
      );
    }
  }, [activeNotificationTab, notifications]);

  return {
    notifications,
    notificationCount,
    unreadCount,
    notificationsLoading,
    notificationsError,
    fetchNotifications,
    listenForNotifications,
    activeNotificationTab,
    setActiveNotificationTab,
    activeNotifications,
    markAllAsRead,
    addNotification,
    markSpecificNotificationAsRead,
    listenForConnectionAccept,
    deleteNotification,
    connectionAcceptedArray,
  };
}; 
