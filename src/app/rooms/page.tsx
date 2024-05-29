"use client";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useRoom, useRoomList } from "../util/context";
import { RoomListItem } from "./RoomListItem";
import styles from "./rooms.module.scss";
import { GameRules, deckTypes, defaultRules } from "../../../common/cards/card";

export default function RoomsPage() {
	const room = useRoom();
	const router = useRouter();
	const auth = useAuth();
	const roomList = useRoomList();
	const [name, setName] = useState("");
	const [option, setOption] = useState("normal");
	const [rules, setRules] = useState<Record<keyof typeof defaultRules, string>>(
		Object.fromEntries(Object.entries(defaultRules).map(x => [x[0] as any, JSON.stringify(x[1])] as const))
	);
	useEffect(() => {
		if (auth.name === null) router.replace("/setup");
		else if (room !== null && room !== undefined) router.replace("/room");
	}, [room, router, auth]);
	const skeletons = [...Array(5)].map((_, i) => <RoomListItem room={null} key={i} canJoin={false} />);
	return (
		<main className={styles.main}>
			<h1>Rooms</h1>
			<section className={styles.roomList}>
				{roomList === undefined
					? skeletons
					: roomList.filter(x => (x.lateJoins ? x.state !== "end" : x.state === "lobby")).map(x => <RoomListItem room={x} key={x.name} canJoin={true} />)}
			</section>
			<section style={{ flexDirection: "column" }}>
				<h1>Create Room</h1>
				<input className={styles.createInput} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
				<div>
					Deck:{" "}
					<select value={option} onChange={x => setOption(x.target.value)}>
						{Object.keys(deckTypes).map(x => (
							<option key={x} value={x}>
								{x}
							</option>
						))}
					</select>
				</div>
				<div>
					{Object.entries(rules).map(([key, value]) => (
						<div key={key}>
							{key}:
							<input value={value} onChange={x => setRules({ ...rules, [key]: x.target.value })} />
						</div>
					))}
				</div>
				<button
					className={styles.createButton}
					onClick={() =>
						name.trim() &&
						socket.emit(
							"room:create",
							{ name, unlisted: false, deckType: option, rules: Object.fromEntries(Object.entries(rules).map(x => [x[0], JSON.parse(x[1])])) as GameRules },
							() => {
								router.push("/room");
							}
						)
					}
				>
					Create
				</button>
			</section>
		</main>
	);
}
