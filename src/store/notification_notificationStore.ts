import { CONNECTION_REQUEST_ACCEPTED, CONNECTION_REQUEST_DECLINED, NEW_CONNECTION_REQUEST } from "@/constants/socket_events";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import {
  checkNotificationForAcceptedConnection,
  deleteNotificationById,
  getUsersNotifications,
  markNotificationAsReadById,
  markNotificationsAsRead
} from "../../actions/user_apis";
import { useFirebaseStore } from "./firebase_firestore";

export type NotificationTypes = "all" | "connection_request" | "messages";

interface NotificationState {
  notifications: any[];
  activeNotifications: any[];
  notificationCount: number;
  unreadCount: number;
  activeNotificationTab: NotificationTypes;
  notificationsLoading: boolean;
  notificationsError: string | null;
  connectionAcceptedArray: any[];
  pendingUserRefreshes: Set<string>;

  // Actions
  fetchNotifications: (user_id: string) => Promise<void>;
  listenForNotifications: (socket: Socket, user: any) => any;
  listenForConnectionAccept: (socket: Socket, user: any) => any;
  listenForConnectionDecline: (socket: Socket, user: any) => any;
  markAllAsRead: (user_id: string) => Promise<void>;
  markSpecificNotificationAsRead: (notification_id: string) => Promise<void>;
  deleteNotification: (notification_id: string) => Promise<void>;
  setActiveNotificationTab: (tab: NotificationTypes) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  activeNotifications: [],
  notificationCount: 0,
  unreadCount: 0,
  activeNotificationTab: "all" as NotificationTypes,
  notificationsLoading: false,
  notificationsError: null,
  connectionAcceptedArray: [],
  pendingUserRefreshes: new Set<string>(),

  fetchNotifications: async (user_id: string) => {
    set({ notificationsLoading: true, notificationsError: null });
    try {
      const { notifications, success, message } = await getUsersNotifications(user_id);
      // console.log("Notifications:", notifications, success);
      if (success && notifications) {
        let final_notifications: any[] = [];
        const connection_notifications = notifications.filter((n: any) => n.type?.toLowerCase() === "connection_request");
        const notifications_without_connection = notifications.filter((n: any) => n.type?.toLowerCase() !== "connection_request");
        const conn_ids = connection_notifications.map((n: any) => n.typeId);
        const { success, error, id_status_map } = await checkNotificationForAcceptedConnection(conn_ids);
        if (success) {
          const final_conn_noti = connection_notifications.map((n: any) => {
            // Add status to connection request notifications
            const status = id_status_map.find((x: any) => x.id === n.typeId)?.status;
            return { ...n, status };
          })
          // Combine connection request notifications with other notifications
          final_notifications = [...final_conn_noti, ...notifications_without_connection];
        } else {
          console.log("Error checking connection request status:", error);
          return;
        }
        set((state) => {
          let filteredNotifications = final_notifications;
          if (state.activeNotificationTab === "connection_request") {
            filteredNotifications = notifications.filter((n: any) => n.type?.toLowerCase() === "connection_request");
          } else if (state.activeNotificationTab === "messages") {
            filteredNotifications = notifications.filter((n: any) => n.type?.toLowerCase() === "messages");
          }

          return {
            notifications,
            notificationCount: notifications.length,
            unreadCount: notifications.filter((n) => !n.isRead).length,
            activeNotifications: filteredNotifications, // Ensure it's updated initially
          };
        });
      } else {
        set({ notificationsError: message });
      }
    } catch (err: any) {
      set({ notificationsError: err.message || "Error fetching notifications" });
    } finally {
      set({ notificationsLoading: false });
    }
  },

  listenForNotifications: (socket: Socket, user: any) => {
    if (!socket || !user) return;
    console.log("Setting up notification listeners for user:", user.id);

    let timeoutId: NodeJS.Timeout | null = null;
    let isRefreshScheduled = false;
    // const pendingRefreshes = new Set<string>();

    const performRefresh = async (sender: string, receiver: string): Promise<void> => {
      try {
        console.log("⚡ Executing cache refresh for users:", { sender, receiver }, "at:", new Date().toISOString());

        // Execute refreshes sequentially to ensure both complete
        const results = await Promise.all([
          (async () => {
            try {
              return useFirebaseStore.getState().refreshUserCache(sender);
            } catch (error) {
              console.error(`Failed to refresh sender ${sender}:`, error);
              return false;
            }
          })(),
          (async () => {
            try {
              return useFirebaseStore.getState().refreshUserCache(receiver);
            } catch (error) {
              console.error(`Failed to refresh receiver ${receiver}:`, error);
              return false;
            }
          })()
        ]);

        const [senderResult, receiverResult] = results;
        console.log("Refresh results:", { sender: senderResult, receiver: receiverResult });

        // Clear pending status only if both refreshes were successful
        if (senderResult && receiverResult) {
          // set((state) => ({
          //   pendingUserRefreshes: new Set([...state.pendingUserRefreshes].filter((userId) => userId !== sender && userId !== receiver))
          // }))
          // const existingPendingUserRefreshes = await getPendingUserRefreshes();
          // console.log("Existing pending user refreshes:", existingPendingUserRefreshes);
          // if (existingPendingUserRefreshes && existingPendingUserRefreshes.length > 0 && existingPendingUserRefreshes.includes(sender) && existingPendingUserRefreshes.includes(receiver)) {
          //   await setPendingUserRefreshes(existingPendingUserRefreshes.filter((userId) => userId !== sender && userId !== receiver));
          // }
          isRefreshScheduled = false;
          console.log("✅ Cache refresh completed successfully for both users");
        } else {
          console.error("❌ Cache refresh failed for one or both users");
        }
      } catch (error) {
        console.error("❌ Cache refresh failed with error:", error);
        // Keep in pending state if failed
        isRefreshScheduled = true;
      } finally {
        timeoutId = null;
      }
    };

    const scheduleCacheRefresh = async (sender: string, receiver: string): Promise<void> => {
      console.log("🔄 Scheduling cache refresh for users:", { sender, receiver }, "at:", new Date().toISOString());

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Add to pending refreshes
      // set((state) => ({
      //   pendingUserRefreshes: new Set([...state.pendingUserRefreshes, sender, receiver
      //   ])
      // }))
      // await setPendingUserRefreshes(Array.from(new Set([sender, receiver])))
      isRefreshScheduled = true;

      // Schedule the refresh
      timeoutId = setTimeout(() => {
        console.log("⏰ Timeout reached, performing refresh");
        void performRefresh(sender, receiver);
      }, 20 * 1000);
      console.log("⏰ Cache refresh scheduled for:", new Date(Date.now() + 20 * 1000).toISOString());
    };

    const handleNewReq = (data: any) => {
      console.log("📨 Socket event received - New connection request:", data);
      const sender = data?.new_connection_request?.sender?.id;
      const receiver = data?.new_connection_request?.receiver?.id;
      console.log("👤 Current user:", user.id, "Sender:", sender, "Receiver:", receiver);

      if (!sender || !receiver) {
        console.error("❌ Sender or receiver not found in new connection request event");
        return;
      }

      // Update local state first
      if (user?.id === receiver) {
        useFirebaseStore.getState().updateUserLocally({
          receivedConnections: [...(user?.receivedConnections || []), {
            id: data?.new_connection_request?.id,
            sender,
            receiver,
            status: data?.new_connection_request?.status,
            createdAt: new Date()
          }],
        });
        toast.success(data.notification.message, { duration: 5000, closeButton: true });
        set((state) => ({
          notifications: [data.notification, ...state.notifications],
          activeNotifications: [data.notification, ...state.activeNotifications],
          notificationCount: state.notificationCount + 1,
          unreadCount: state.unreadCount + 1,
        }));
      }

      if (user?.id === sender) {
        console.log("✉️ Connection request sent successfully");
        useFirebaseStore.getState().updateUserLocally({
          sentConnections: [...(user?.sentConnections || []), {
            id: data?.new_connection_request?.id,
            sender,
            receiver,
            status: data?.new_connection_request?.status,
            createdAt: new Date()
          }],
        });
        // scheduled cache refresh for both sender and receiver by sender
        scheduleCacheRefresh(sender, receiver);
      }
    };
    socket.on(NEW_CONNECTION_REQUEST, handleNewReq);

    return () => {
      socket.off(NEW_CONNECTION_REQUEST, handleNewReq);
      // Do not clear the timeout here to ensure it executes
    };
  },

  listenForConnectionAccept: (socket: Socket, user: any) => {
    if (!socket || !user) return;
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    const executeRef = { current: false };
    const pendingRefreshes = new Set<string>();

    const scheduleCacheRefresh = (sender: string, receiver: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      pendingRefreshes.add(sender);
      pendingRefreshes.add(receiver);

      timeoutRef.current = setTimeout(async () => {
        try {
          await Promise.all([
            useFirebaseStore.getState().refreshUserCache(sender),
            useFirebaseStore.getState().refreshUserCache(receiver)
          ]);
          pendingRefreshes.delete(sender);
          pendingRefreshes.delete(receiver);
          executeRef.current = true;
        } catch (error) {
          console.error("Cache refresh failed:", error);
        }
        timeoutRef.current = null;
      }, 5 * 60 * 1000);
    };

    let lastSender: string | null = null;
    let lastReceiver: string | null = null;

    const handleConnectionAccept = (data: any) => {
      console.log("Connection request accepted:", data);
      const sender = data?.updated_connection?.sender?.id;
      const receiver = data?.updated_connection?.receiver?.id;

      if (!sender || !receiver) {
        console.log("Sender or receiver not found in connection accept event");
        return;
      }

      lastSender = sender;
      lastReceiver = receiver;

      set((state) => ({
        connectionAcceptedArray: [...state.connectionAcceptedArray, { conn_sender: sender, conn_receiver: receiver }],
      }));

      const followerId = sender === user?.id ? receiver : sender;
      useFirebaseStore.getState().updateUserLocally({
        followers: [...(user?.followers || []), { id: followerId }],
        updatedAt: new Date()
      });

      if (user?.id === sender) {
        toast.success(`${data?.updated_connection?.receiver?.name} accepted your connection request`, {
          duration: 5000,
          closeButton: true,
        });
      }

      scheduleCacheRefresh(sender, receiver);
    }

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (pendingRefreshes.size > 0) {
        event.preventDefault();
        event.returnValue = '';

        try {
          const refreshPromises = Array.from(pendingRefreshes).map(userId =>
            useFirebaseStore.getState().refreshUserCache(userId)
          );
          await Promise.all(refreshPromises);
          pendingRefreshes.clear();
        } catch (error) {
          console.error("Force cache refresh failed:", error);
        }
      }

      if (!executeRef.current && (lastSender || lastReceiver)) {
        try {
          if (lastSender) await useFirebaseStore.getState().refreshUserCache(lastSender);
          if (lastReceiver) await useFirebaseStore.getState().refreshUserCache(lastReceiver);
        } catch (error) {
          console.error("Force cache refresh failed:", error);
        }
        executeRef.current = true;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    socket.on(CONNECTION_REQUEST_ACCEPTED, handleConnectionAccept);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off(CONNECTION_REQUEST_ACCEPTED, handleConnectionAccept);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  },

  listenForConnectionDecline: (socket: Socket, user: any) => {
    if (!socket || !user) return;
    let timeoutId: NodeJS.Timeout | null = null;
    let isRefreshScheduled = false;
    const pendingRefreshes = new Set<string>();

    const performRefresh = async (sender: string, receiver: string): Promise<void> => {
      try {
        console.log("⚡ Executing cache refresh for users:", { sender, receiver }, "at:", new Date().toISOString());

        // Execute refreshes sequentially to ensure both complete
        const results = await Promise.all([
          (async () => {
            try {
              return useFirebaseStore.getState().refreshUserCache(sender);
            } catch (error) {
              console.error(`Failed to refresh sender ${sender}:`, error);
              return false;
            }
          })(),
          (async () => {
            try {
              return useFirebaseStore.getState().refreshUserCache(receiver);
            } catch (error) {
              console.error(`Failed to refresh receiver ${receiver}:`, error);
              return false;
            }
          })()
        ]);

        const [senderResult, receiverResult] = results;
        console.log("Refresh results:", { sender: senderResult, receiver: receiverResult });

        // Clear pending status only if both refreshes were successful
        if (senderResult && receiverResult) {
          pendingRefreshes.delete(sender);
          pendingRefreshes.delete(receiver);
          isRefreshScheduled = false;
          console.log("✅ Cache refresh completed successfully for both users");
        } else {
          console.error("❌ Cache refresh failed for one or both users");
        }
      } catch (error) {
        console.error("❌ Cache refresh failed with error:", error);
        // Keep in pending state if failed
        isRefreshScheduled = true;
      } finally {
        timeoutId = null;
      }
    };

    const scheduleCacheRefresh = (sender: string, receiver: string): void => {
      console.log("🔄 Scheduling cache refresh for users:", { sender, receiver }, "at:", new Date().toISOString());

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Add to pending refreshes
      pendingRefreshes.add(sender);
      pendingRefreshes.add(receiver);
      isRefreshScheduled = true;

      // Schedule the refresh
      timeoutId = setTimeout(() => {
        console.log("⏰ Timeout reached, performing refresh");
        void performRefresh(sender, receiver);
      }, 10 * 1000);
      console.log("⏰ Cache refresh scheduled for:", new Date(Date.now() + 10 * 1000).toISOString());
    };

    const handleDeclineRequest = (data: any) => {
      console.log("Connection request declined", data);
      const sender = data?.sender?.id;
      const receiver = data?.receiver?.id;
      if (!sender || !receiver) {
        console.log("Sender or receiver not found in connection decline event");
        return;
      }
      if (user?.id === receiver) {
        useFirebaseStore.getState().updateUserLocally({
          receivedConnections: user?.receivedConnections?.filter((c: any) => c.id !== data?.declined_connection?.id),
        })
        scheduleCacheRefresh(sender, receiver);
      }
      if (user?.id === sender) {
        useFirebaseStore.getState().updateUserLocally({
          sentConnections: user?.sentConnections?.filter((c: any) => c.id !== data?.declined_connection?.id),
        })
        toast.info(`${data?.receiver?.name} declined your connection request`, {
          duration: 5000,
          closeButton: true,
        })
      }
    }
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      console.log("🚪 Handling page unload - checking pending refreshes");
      // If there are pending refreshes or a scheduled refresh hasn't executed
      if (pendingRefreshes.size > 0 || isRefreshScheduled) {
        event.preventDefault();
        event.returnValue = '';

        // Clear any pending timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        console.log("🔄 Forcing cache refresh before unload for users:", Array.from(pendingRefreshes));
        try {
          // Execute refreshes sequentially to ensure completion
          for (const userId of pendingRefreshes) {
            const result = await useFirebaseStore.getState().refreshUserCache(userId);
            console.log(`Cache refresh result for ${userId}:`, result);
          }
          console.log("✅ Force cache refresh completed successfully");
        } catch (error) {
          console.error("❌ Force cache refresh failed:", error);
        }
      }
    };
    // Use both beforeunload and unload to ensure the refresh happens
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleBeforeUnload);
    socket.on(CONNECTION_REQUEST_DECLINED, handleDeclineRequest);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
      socket.off(CONNECTION_REQUEST_DECLINED, handleDeclineRequest);
      // Do not clear the timeout here to ensure it executes
    };
  },

  markAllAsRead: async (user_id: string) => {
    try {
      const { success, message } = await markNotificationsAsRead(user_id);
      if (success) {
        set((state) => ({
          unreadCount: 0,
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          activeNotifications: state.activeNotifications.map((n) => ({ ...n, isRead: true })),
        }));
      } else {
        set({ notificationsError: message });
      }
    } catch (err: any) {
      set({ notificationsError: err.message || "Error marking notifications as read" });
    }
  },

  markSpecificNotificationAsRead: async (notification_id: string) => {
    try {
      const { success } = await markNotificationAsReadById(notification_id);
      if (success) {
        set((state) => ({
          unreadCount: Math.max(state.unreadCount - 1, 0),
          notifications: state.notifications.map((n) =>
            n.id === notification_id ? { ...n, isRead: true } : n
          ),
          activeNotifications: state.activeNotifications.map((n) =>
            n.id === notification_id ? { ...n, isRead: true } : n
          ),
        }));
      }
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
    }
  },

  deleteNotification: async (notification_id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notification_id),
      activeNotifications: state.activeNotifications.filter((n) => n.id !== notification_id),
    }));

    try {
      const { success, message } = await deleteNotificationById(notification_id);
      if (success) toast.success(message, {
        position: "bottom-right",
        duration: 5000,
        closeButton: true,
      });
    } catch (err: any) {
      console.error("Error deleting notification:", err);
    }
  },

  setActiveNotificationTab: (tab: NotificationTypes) => {
    set((state) => {
      let filteredNotifications = state.notifications;

      if (tab === "connection_request") {
        filteredNotifications = state.notifications.filter((n) => n?.type?.toLowerCase() === "connection_request");
      } else if (tab === "messages") {
        filteredNotifications = state.notifications.filter((n) => n?.type?.toLowerCase() === "messages");
      }

      return {
        activeNotificationTab: tab,
        activeNotifications: filteredNotifications, // Update active notifications dynamically
      };
    });
  },
}));
