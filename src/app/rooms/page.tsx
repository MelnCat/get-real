"use client";
import { RoomSettings } from "@/components/RoomSettings";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultRules } from "../../../common/cards/card";
import { RoomCreateOptions } from "../../../server/room";
import { useAuth, useRoom, useRoomList } from "../util/context";
import { RoomListItem } from "./RoomListItem";
import styles from "./rooms.module.scss";

export default function RoomsPage() {
	const room = useRoom();
	const router = useRouter();
	const auth = useAuth();
	const roomList = useRoomList();
	const [submitted, setSubmitted] = useState(false);
	const [settings, setSettings] = useState<RoomCreateOptions>({
		name: "",
		deckType: "normal",
		lateJoins: false,
		max: 10,
		rules: defaultRules,
		unlisted: false
	});
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		if (auth.name === null) router.replace("/setup");
		else if (room !== null && room !== undefined) router.replace("/room");
	}, [room, router, auth]);
	const skeletons = (
		<section className={styles.roomGrid}>
			{[...Array(5)].map((_, i) => (
				<RoomListItem room={null} key={i} canJoin={false} submitted={false} setSubmitted={() => {}} />
			))}
		</section>
	);
	const createRoom = () => {
		setSubmitted(true);
		setError(null);
		socket.emit("room:create", settings, success => {
			if (success) router.push("/room");
			else {
				setSubmitted(false);
				setError(`This name is already taken.`);
			}
		});
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
										<RoomListItem room={x} key={x.name} canJoin={true} submitted={submitted} setSubmitted={setSubmitted} />
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
								<input
									className={styles.createInput}
									placeholder="Name"
									value={settings.name}
									onChange={e => {
										setSettings(x => ({ ...x, name: e.target.value }));
										setError(null);
									}}
								/>
							</div>
							<RoomSettings settings={settings} setSettings={setSettings} />
							<button disabled={submitted || settings.name.trim() === ""} className={styles.createButton} onClick={() => settings.name.trim() && createRoom()}>
								Create
							</button>
							<p className={styles.error}>{error}</p>
						</section>
					</section>
				</article>
			</article>
		</main>
	);
}
