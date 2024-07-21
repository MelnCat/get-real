import { deckTypes, defaultConstants, GameConstants, GameRules } from "../common/cards/card";
import { shuffle } from "../common/util/util";
import { players } from "./auth";
import { gameManager, type Game } from "./game";
import type { EventCallback, TypedServer, TypedSocket } from "./types";

export interface RoomCreateOptions {
	name: string;
	unlisted: boolean;
	deckType: string;
	customDeckType?: GameConstants;
	rules: GameRules;
	lateJoins: boolean;
	max: number;
}
export interface ClientRoomData {
	name: string;
	owner: string;
	players: string[];
	lateJoins: boolean;
	state: Room["state"];
	max: number;
}
export interface RoomC2SEvents {
	"room:create": (options: RoomCreateOptions, cb: EventCallback<boolean>) => void;
	"room:config": (options: RoomCreateOptions) => void;
	"room:join": (roomName: string) => void;
	"room:start": () => void;
	"room:leave": () => void;
}
export interface RoomListData {
	name: string;
	owner: string;
	playerCount: number;
	lateJoins: boolean;
	max: number;
	state: Room["state"];
}
export interface RoomS2CEvents {
	"room:list": (rooms: RoomListData[]) => void;
	"room:data": (
		room: {
			name: string;
			owner: string;
			players: string[];
			lateJoins: boolean;
			max: number;
			state: Room["state"];
		} | null
	) => void;
}

export interface BaseRoom {
	name: string;
	players: string[];
	owner: string;
	unlisted: boolean;
	max: number;
	lateJoins: boolean;
	deckType: GameConstants;
	rules: GameRules;
	createdAt: number;
}
export interface LobbyRoom extends BaseRoom {
	state: "lobby";
}
export interface StartingRoom extends BaseRoom {
	state: "starting";
	game: Game;
}
export interface PlayingRoom extends BaseRoom {
	state: "play";
	game: Game;
}
export interface EndedRoom extends BaseRoom {
	state: "end";
	game: Game;
}
export type Room = LobbyRoom | StartingRoom | PlayingRoom | EndedRoom;

export const roomManager = {
	rooms: {} as Record<string, Room>,
	_roomPlayerCache: {} as Record<string, Room>,
	byPlayer(playerId: string) {
		return this._roomPlayerCache[playerId] as Room | undefined;
	},
	joinRoom(playerId: string, roomId: string) {
		const room = this.rooms[roomId];
		if (room === undefined || room.players.includes(playerId) || this.byPlayer(playerId) !== undefined) return;
		if (room.state === "end") return;
		if (room.state === "lobby" || room.lateJoins) {
			if (room.state !== "lobby" && room.game.deck.length < room.game.rules.startingCards) return;
			room.players.push(playerId);
			this._roomPlayerCache[playerId] = room;
			if (room.state !== "lobby") {
				room.game.players[playerId] = { cards: [...room.game.deck.splice(0, room.game.rules.startingCards)], called: false };
				room.game.playerList.push(playerId);
				gameManager.resendGame(room);
			}
			this.resendData(roomId);
		}
	},
	resendData(name: string) {
		const room = this.rooms[name];
		if (room === undefined) return;
		for (const playerId of room.players) {
			this.resendPlayerData(playerId, room);
		}
		for (const player of Object.values(players)) {
			roomManager.sendPublicRooms(player.socket);
		}
	},
	resendPlayerData(playerId: string, room: Room | undefined) {
		if (room === undefined) {
			players[playerId].socket.emit("room:data", null);
			return;
		}
		players[playerId].socket.emit("room:data", this.createClientData(room));
		if ("game" in room) players[playerId].socket.emit("game:data", gameManager.createClientData(room.game, playerId));
	},
	createClientData(room: Room): ClientRoomData {
		return {
			name: room.name,
			owner: players[room.owner].name,
			players: room.players.map(x => players[x].name),
			lateJoins: room.lateJoins,
			state: room.state,
			max: room.max,
		};
	},
	createListData(room: Room) {
		return {
			name: room.name,
			owner: players[room.owner].name,
			playerCount: room.players.length,
			lateJoins: room.lateJoins,
			state: room.state,
			max: room.max,
		};
	},
	getPublicRooms() {
		return Object.values(this.rooms).filter(x => !x.unlisted);
	},
	sendPublicRooms(socket: TypedSocket) {
		socket.emit(
			"room:list",
			roomManager.getPublicRooms().map(x => roomManager.createListData(x))
		);
	},
	createRoom(owner: string, options: RoomCreateOptions) {
		const room: Room = {
			owner,
			state: "lobby",
			lateJoins: options.lateJoins,
			max: options.max,
			name: options.name,
			players: [owner],
			unlisted: options.unlisted,
			deckType: (options.deckType === "custom" ? options.customDeckType : deckTypes[options.deckType as keyof typeof deckTypes]) ?? defaultConstants,
			rules: options.rules,
			createdAt: Date.now()
		};
		this._roomPlayerCache[owner] = room;
		this.rooms[room.name] = room;
		this.resendData(room.name);
	},
	deleteRoom(name: string) {
		const room = this.rooms[name];
		if (room === undefined) return;
		delete this.rooms[name];
		for (const player of room.players) {
			delete this._roomPlayerCache[player];
			this.resendPlayerData(player, undefined);
		}
	},
	purgeInactiveRooms() {
		for (const room of Object.values(this.rooms)) {
			if (room.createdAt + 1000 * 60 * 60 * 24 < Date.now()) this.deleteRoom(room.name);
		}
	}
};

export const registerRoomEvents = (io: TypedServer, socket: TypedSocket) => {
	roomManager.sendPublicRooms(socket);
	socket.on("room:create", (args, cb) => {
		if (args.name in roomManager.rooms) return cb(false);
		roomManager.createRoom(socket.data.playerId, args);
		cb(true);
	});
	socket.on("room:join", room => {
		roomManager.joinRoom(socket.data.playerId, room);
	});
	socket.on("room:config", options => {
		const lobby = roomManager.byPlayer(socket.data.playerId);
		if (lobby === undefined || lobby.state !== "lobby") return;
		if (lobby.owner !== socket.data.playerId) return;
		const room = lobby as unknown as StartingRoom;
		room.rules = options.rules;
		room.max = options.max;
		room.lateJoins = options.lateJoins;
		room.unlisted = options.unlisted;
		roomManager.resendData(room.name);
	});
	socket.on("room:start", () => {
		const lobby = roomManager.byPlayer(socket.data.playerId);
		if (lobby === undefined || lobby.state !== "lobby") return;
		if (lobby.owner !== socket.data.playerId) return;
		const room = lobby as unknown as StartingRoom;
		room.state = "starting";
		roomManager.resendData(room.name);
		gameManager.startGame(io, room);
	});
	socket.on("room:leave", () => {
		const room = roomManager.byPlayer(socket.data.playerId);
		if (room === undefined) return;
		room.players = room.players.filter(x => x !== socket.data.playerId);
		if (room.players.length === 0) {
			delete roomManager._roomPlayerCache[socket.data.playerId];
			roomManager.deleteRoom(room.name);
			roomManager.resendPlayerData(socket.data.playerId, undefined);
			for (const player of Object.values(players)) {
				roomManager.sendPublicRooms(player.socket);
			}
			return;
		}
		switch (room.state) {
			case "lobby":
				break;
			case "starting":
			case "play":
			case "end": {
				const game = room.game;
				if (game.playerList[game.currIndex] === socket.data.playerId) {
					game.playerList = game.playerList.filter(x => x !== socket.data.playerId);
					game.configurationState = null;
					game.canPlay = true;
					game.currIndex = game.playerList.indexOf(game.nextPlayer);
					game.pickedUp = false;
					game.nextPlayer = game.playerList[(game.currIndex + game.order + game.playerList.length) % game.playerList.length];
				} else if (game.nextPlayer === socket.data.playerId) {
					const currentPlayer = game.playerList[game.currIndex];
					game.playerList = game.playerList.filter(x => x !== socket.data.playerId);
					game.currIndex = game.playerList.indexOf(currentPlayer);
					game.nextPlayer = game.playerList[(game.currIndex + game.order + game.playerList.length) % game.playerList.length];
				} else {
					game.playerList = game.playerList.filter(x => x !== socket.data.playerId);
				}
				game.deck.push(...game.players[socket.data.playerId].cards);
				game.deck = shuffle(game.deck);
				delete game.players[socket.data.playerId];
				gameManager.resendGame(room as StartingRoom | PlayingRoom);
			}
		}
		room.players = room.players.filter(x => x !== socket.data.playerId);
		if (room.owner === socket.data.playerId) room.owner = room.players[Math.floor(Math.random() * room.players.length)];
		delete roomManager._roomPlayerCache[socket.data.playerId];
		roomManager.resendData(room.name);
		roomManager.resendPlayerData(socket.data.playerId, undefined);
	});
};
