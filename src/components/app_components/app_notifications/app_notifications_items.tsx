import { motion } from "framer-motion";
import { Check, MessageSquare, Users2Icon, X } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "./app_notification_list";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import {
  handleAcceptConnectionRequest,
  handleNotificationClick,
} from "@/lib/notification_utils";
import { useSocketStore } from "@/store/socket_socketstore";
import { useState } from "react";

export function NotificationItem({
  type,
  message,
  createdAt,
  sender,
  id,
  isRead,
  reciever,
  typeId,
}: Notification) {
  const router = useRouter();
  const [isAlreadyRead, setIsAlreadyRead] = useState(isRead);
  const [showConnectionActions, setShowConnectionActions] = useState(
    type.toLowerCase() === "connection_request"
  );
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);
  const { markSpecificNotificationAsRead, deleteNotification } =
    useNotifications();
  const { socket } = useSocketStore();

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-start space-x-4 p-4 ${
        !isAlreadyRead ? "bg-slate-900" : "bg-white/10"
      }  backdrop-blur-md rounded-lg shadow-lg cursor-pointer`}
      onClick={() =>
        handleNotificationClick(
          markSpecificNotificationAsRead,
          id,
          sender,
          router,
          "connection_request"
        )
      }
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={sender?.avatar} alt={sender?.name} />
        <AvatarFallback>
          {sender?.name?.split(" ")?.map((n) => n[0])}
        </AvatarFallback>
      </Avatar>
      {/* </div> */}
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
        <p className="text-xs text-gray-400 mt-1 tracking-wide">
          {format(createdAt, "MMM dd yyyy")}
        </p>
      </div>
      {showConnectionActions && (
        <div className="flex space-x-2 mr-1 items-center">
          <Button
            className="rounded-full bg-white/5 hover:bg-white/10 w-10 h-10 flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              if (!socket) return;
              setShowConnectionActions(false);
              setShowDeleteNotification(true);
              handleAcceptConnectionRequest(
                socket,
                sender?.id,
                reciever?.id,
                markSpecificNotificationAsRead,
                typeId,
                id,
                setIsAlreadyRead
              );
            }}
          >
            <Check className="text-green-500" />
          </Button>
          <Button className="rounded-full bg-white/5 hover:bg-white/10 w-10 h-10 flex justify-center items-center">
            <X className="text-red-500" />
          </Button>
        </div>
      )}
      {showDeleteNotification && (
        <Button
          className="rounded-full bg-white/5 hover:bg-white/10 w-10 h-10 flex justify-center items-center"
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(id);
          }}
        >
          <X className="text-red-500" />
        </Button>
      )}
    </motion.div>
  );
}
