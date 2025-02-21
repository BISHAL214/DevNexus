"use client";

import React, { useEffect } from "react";
import { useSocketStore } from "@/store/socket_socketstore"; // Import your store

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    connect(); // Connect on mount
    return () => {
      disconnect(); // Disconnect on unmount
    };
  }, [connect, disconnect]);

  return <>{children}</>; 
};
