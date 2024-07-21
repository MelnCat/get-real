"use client";
import { useRouter } from "next/navigation";
import { useAuth, useRoom } from "../util/context";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { socket } from "@/socket";
import styles from "./room.module.scss";
import { RoomSettings } from "@/components/RoomSettings";
import { RoomCreateOptions } from "../../../server/room";

export default function RoomPage() {
	const room = useRoom();
	const router = useRouter();
	const auth = useAuth();
	const [submitted, setSubmitted] = useState(false);
	const settings = useMemo<RoomCreateOptions | null>(() => {
		if (room === null || room === undefined) return null;
		return {
			name: room.name,
			deckType: room.deckTypeString,
			customDeckType: room.deckType,
			lateJoins: room.lateJoins,
			max: room.max,
			rules: room.rules,
			unlisted: room.unlisted,
		};
	}, [room]);
	const updateSettings = (cb: (settings: RoomCreateOptions) => RoomCreateOptions) => {
		if (room?.owner !== auth.name || settings === null) return;
		socket.emit("room:config", cb(settings));
	};
	useEffect(() => {
		if (auth.name === null) router.replace("/setup");
		else if (room === null) router.replace("/rooms");
		else if (room !== undefined && (room.state === "play" || room.state === "starting" || room.state === "end")) router.replace("/game");
	}, [auth, room, router]);
	const onClickStart = () => {
		setSubmitted(true);
		socket.emit("room:start");
	};
	const onClickLeave = () => {
		setSubmitted(true);
		socket.emit("room:leave");
	};

	return (
		<main className={styles.main}>
			<article className={styles.box}>
				<header>
					<h1>{room ? `Room: ${room.name}` : <Skeleton />}</h1>
				</header>
				<article className={styles.containerBox}>
					<section className={styles.playerList}>
						<header>
							<h2>
								Players ({room?.players.length ?? "?"}/{room?.max ?? "?"})
							</h2>
						</header>
						<section className={styles.playerGrid}>
							{(room ? room.players : [null, null]).map((x, i) => (
								<div className={styles.player} key={x ?? i}>
									<h1>{x ?? <Skeleton/>}</h1>
									{<p className={styles.role}>{x === null ? <Skeleton /> : x === room?.owner ? "Owner" : "Player"}</p>}
									{room?.owner === auth.name && x !== room?.owner && <button onClick={() => x && socket.emit("room:kick", x)}>Kick</button>}
								</div>
							))}
						</section>
					</section>
					<section className={styles.actionPanel}>
						<header>
							<h2>Room</h2>
						</header>
						<section className={styles.roomOptions}>
							<RoomSettings setSettings={updateSettings} settings={settings} disabled={submitted || room?.owner !== auth.name} />{" "}
							{room?.owner === auth.name ? (
								<button disabled={submitted} className={styles.actionButton} onClick={onClickStart}>
									Start Game
								</button>
							) : (
								""
							)}
							<button disabled={submitted} className={styles.actionButton} onClick={onClickLeave}>
								Leave Room
							</button>
						</section>
					</section>
				</article>
			</article>
		</main>
	);
}
