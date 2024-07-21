"use client";
import { getPlayerId } from "@/app/util/auth";
import { AuthContext, GameContext, RoomContext, RoomListContext } from "@/app/util/context";
import { socket } from "@/socket";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { compareTypes, mapGroupBy } from "../../common/cards/card";
import { EnhancedClientGameData } from "../../server/game";
import { ClientRoomData, RoomListData } from "../../server/room";

export const GameHandler = ({ children }: { children: React.ReactNode }) => {
	const [room, setRoom] = useState<ClientRoomData | null | undefined>(undefined);
	const [game, setGame] = useState<EnhancedClientGameData | null | undefined>(undefined);
	const [name, setName] = useLocalStorage<string | null>("playerName", null);
	const [roomList, setRoomList] = useState<RoomListData[] | undefined>();
	const authData = useMemo(() => ({ name, setName }), [name, setName]);
	useEffect(() => {
		if (name !== null) socket.emit("auth:name", name, console.log);
	}, [name]);
	useEffect(() => {
		if (process.env.NODE_ENV === "development") {
			socket.onAny(console.log.bind(console, "IN"));
			socket.onAnyOutgoing(console.log.bind(console, "OUT"));
		}
		const id = getPlayerId();
		socket.emit("auth:id", id, () => {
			if (name !== null) socket.emit("auth:name", name, console.log);
		});
		socket.on("room:data", x => {
			setRoom(x as ClientRoomData | null | undefined);
		});
		socket.on("room:list", x => {
			setRoomList(x);
		});
		socket.on("game:data", d => {
			d.hand.sort((a, b) => {
				const first =
					a.color instanceof Array
						? b.color instanceof Array
							? a.color.join("").localeCompare(b.color.join(""))
							: -1
						: b.color instanceof Array
							? 1
							: a.color.localeCompare(b.color);
				if (first !== 0) return first;
				return compareTypes(a.type, b.type);
			});
			const count = [...mapGroupBy(d.hand, x => x.type)]
				.sort((a, b) => compareTypes(a[0], b[0]))
				.map(x => [x[0], x[1].length] as const)
				.filter(x => x[1] > 1)
				.map(x => x[0]);
			d.hand.sort((a, b) => (count.includes(a.type) ? (count.includes(b.type) ? count.indexOf(a.type) - count.indexOf(b.type) : -1) : count.includes(b.type) ? 1 : 0));
			setGame(() => ({
				...d,
				get yourTurn() {
					return name === this.playerList[this.currIndex];
				},
				get pickup() {
					return +this.rawPickup;
				}
			}));
		});
	}, [game, name]);
	return (
		<RoomContext.Provider value={room}>
			<GameContext.Provider value={game}>
				<AuthContext.Provider value={authData}>
					<RoomListContext.Provider value={roomList}>
						{children}
					</RoomListContext.Provider>
				</AuthContext.Provider>
			</GameContext.Provider>
		</RoomContext.Provider>
	);
};
