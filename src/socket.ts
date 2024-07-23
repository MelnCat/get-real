"use client";

import { io } from "socket.io-client";
import { TypedCSocket } from "../server/types";
import parser from "socket.io-msgpack-parser";

export const socket = io({ parser }) as TypedCSocket;
socket.on("disconnect", e => {
	console.log("discon");
	if (document.hasFocus()) location.reload();
	else {
		document.addEventListener("visibilitychange", () => {
			location.reload();
		});
	}
});
