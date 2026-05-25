// ============================================================
// CampusOS AI — Socket.io Client
// Lazy connection with JWT auth
// ============================================================

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

let socket: Socket | null = null;

/** Connect to Socket.io server with JWT auth */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("🔌 Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.warn("🔌 Socket connection error:", err.message);
  });

  return socket;
}

/** Disconnect from Socket.io server */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/** Get current socket instance */
export function getSocket(): Socket | null {
  return socket;
}
