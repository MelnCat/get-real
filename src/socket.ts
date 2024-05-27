"use client";

import { io } from "socket.io-client";
import { TypedCSocket } from "../server/types";
import parser from "socket.io-msgpack-parser";

export const socket = io({ parser }) as TypedCSocket;
