import { create } from "zustand";
import io, { Socket } from "socket.io-client";
import { useFirebaseStore } from "./firebase_firestore";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    const { user, user_loading } = useFirebaseStore.getState();
    if (typeof window !== "undefined" && !get().isConnected && !user_loading && user) {
      const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

      if (!SERVER_URL) {
        console.error("Socket server URL is missing!");
        return;
      }

      const newSocket = io(SERVER_URL, {
        transports: ["websocket"], // Force WebSocket to avoid polling
      });

      set({ socket: newSocket, isConnected: true });

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("join", { user_id: user.id });
        set({ isConnected: true });
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        set({ isConnected: false });
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      console.log("Disconnecting socket...");
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
