import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { registerRoomEvents, roomManager } from "./server/room";
import { TypedServer, TypedSocket } from "./server/types";
import { registerAuthEvents } from "./server/auth";
import { registerGameEvents } from "./server/game";
import parser from "socket.io-msgpack-parser";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 2223
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer, { connectionStateRecovery: {}, parser }) as TypedServer;
	registerAuthEvents(io, (socket: TypedSocket) => {
		registerRoomEvents(io, socket);
		registerGameEvents(io, socket);
	})
	httpServer
		.once("error", err => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});

setInterval(() => {
	roomManager.purgeInactiveRooms();
}, 60 * 1000 * 60)