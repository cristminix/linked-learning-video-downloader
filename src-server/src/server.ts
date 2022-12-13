import {Server} from "socket.io-server"
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData} from "./types/socket-io";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();