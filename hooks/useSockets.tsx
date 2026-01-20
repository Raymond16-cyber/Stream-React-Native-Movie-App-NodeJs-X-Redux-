import { useAuth } from "@/Contexts/AuthContext";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://172.20.10.4:8000";

const useAppSockets = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth()
  

  useEffect(() => {
    if (!user?._id) return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { userId: user?._id },
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id);
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  return socketRef;
};

export default useAppSockets;
