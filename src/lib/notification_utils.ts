import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Socket } from "socket.io-client";

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
  socket.emit("accept_connection_request", {
    senderId,
    recieverId,
    connectionId: typeId,
  });
};
