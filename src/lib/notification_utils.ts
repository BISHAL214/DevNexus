import { ACCEPT_CONNECTION_REQUEST, DECLINE_CONNECTION_REQUEST } from "@/constants/socket_events";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

export const handleNotificationClick = (
  markSpecificNotificationAsRead: (id: string) => Promise<void>,
  notificationId: string,
  sender: any,
  router: AppRouterInstance,
  type?: string
) => {
  console.log("Notification clicked", "type:", type && type);
  markSpecificNotificationAsRead(notificationId);
  router.push(`/user/profile/${sender.slug}`);
};

export const handleAcceptConnectionRequest = (
  socket: Socket | null,
  senderId: string,
  recieverId: string,
  markSpecificNotificationAsRead: (id: string) => Promise<void>,
  typeId: string | undefined,
  notificationId?: string,
  setIsAlredyRead?: (isRead: boolean) => void
) => {
  if (!socket || !senderId || !recieverId) return;
  // console.log("Connection request accepted", "senderId:", senderId, "recieverId:", recieverId);
  if (notificationId) {
    setIsAlredyRead && setIsAlredyRead(true);
    markSpecificNotificationAsRead(notificationId);
  }
  socket.emit(ACCEPT_CONNECTION_REQUEST, {
    senderId,
    recieverId,
    connectionId: typeId,
  });
};

export const handleDeclineConnectionRequest = (
  deleteNotification: (id: string) => Promise<void>,
  notificationId: string,
  senderId: string,
  recieverId: string,
  socket: Socket | null,
  conn_id: string,
  user_id: string
) => {
  if (!socket || !senderId || !recieverId || !conn_id) return;
  if (user_id === recieverId) {
    deleteNotification(notificationId);
    toast.info("Connection request declined and deleted", {
      position: "bottom-right",
      duration: 5000,
      closeButton: true,
    });
    socket.emit(DECLINE_CONNECTION_REQUEST, {
      senderId,
      recieverId,
      conn_id
    })
  }
}