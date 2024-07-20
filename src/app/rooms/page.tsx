"use client";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useRoom, useRoomList } from "../util/context";
import { RoomListItem } from "./RoomListItem";
import styles from "./rooms.module.scss";
import { GameRules, deckTypes, defaultRules } from "../../../common/cards/card";
import { RoomListData } from "../../../server/room";

export default function RoomsPage() {
	const room = useRoom();
	const router = useRouter();
	const auth = useAuth();
	const roomList = useRoomList();
	const [submitted, setSubmitted] = useState(false);
	const [name, setName] = useState("");
	const [option, setOption] = useState("normal");
	const [rules, setRules] = useState<Record<keyof typeof defaultRules, string>>(
		Object.fromEntries(Object.entries(defaultRules).map(x => [x[0] as any, JSON.stringify(x[1])] as const))
	);
	const [lateJoins, setLateJoins] = useState(false);
	const [max, setMax] = useState(10);
	useEffect(() => {
		if (auth.name === null) router.replace("/setup");
		else if (room !== null && room !== undefined) router.replace("/room");
	}, [room, router, auth]);
	const skeletons = (
		<section className={styles.roomGrid}>
			{[...Array(5)].map((_, i) => (
				<RoomListItem room={null} key={i} canJoin={false} setSubmitted={() => {}} />
			))}
		</section>
	);
	const createRoom = () => {
		setSubmitted(true);
		socket.emit(
			"room:create",
			{
				name,
				unlisted: false,
				deckType: option,
				rules: Object.fromEntries(Object.entries(rules).map(x => [x[0], JSON.parse(x[1])])) as GameRules,
				lateJoins,
				max,
			},
			() => {
				router.push("/room");
			}
		);
	};
	return (
		<main className={styles.main}>
			<article className={styles.box}>
				<header>
					<h1>Rooms</h1>
				</header>
				<article className={styles.panel}>
					<section className={styles.roomList}>
						<header>
							<h2>Public Rooms</h2>
						</header>
						{roomList === undefined ? (
							skeletons
						) : roomList.length === 0 ? (
							<p className={styles.noRooms}>There are currently no public rooms.</p>
						) : (
							<section className={styles.roomGrid}>
								{roomList
									.filter(x => (x.lateJoins ? x.state !== "end" : x.state === "lobby"))
									.map(x => (
										<RoomListItem room={x} key={x.name} canJoin={true} setSubmitted={setSubmitted} />
									))}
							</section>
						)}
					</section>
					<section className={styles.createPanel}>
						<header>
							<h2>Create New Room</h2>
						</header>
						<section className={styles.createOptions}>
							<div className={styles.createRoomName}>
								<p>Name: </p>
								<input className={styles.createInput} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
							</div>
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
							<div>
								Late Joins: <input type="checkbox" value={lateJoins ? "on" : ""} onChange={x => setLateJoins(x => !x)} />
							</div>
							<div>
								Max Players: <input type="number" value={max} onChange={x => setMax(+x.target.value)} />
							</div>
							<button className={styles.createButton} onClick={() => name.trim() && createRoom()}>
								Create
							</button>
						</section>
					</section>
				</article>
			</article>
		</main>
	);
}
