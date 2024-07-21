"use client";
import { useRouter } from "next/navigation";
import { useAuth, useRoom } from "../util/context";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { socket } from "@/socket";
import styles from "./room.module.scss";

export default function RoomPage() {
	const room = useRoom();
	const router = useRouter();
	const auth = useAuth();
	useEffect(() => {
		if (auth.name === null) router.replace("/setup");
		else if (room === null) router.replace("/rooms");
		else if (room !== undefined && (room.state === "play" || room.state === "starting" || room.state === "end")) router.replace("/game");
	}, [auth, room, router]);
	const onClickStart = () => {
		socket.emit("room:start");
	};
	const onClickLeave = () => {
		socket.emit("room:leave");
	};

	return (
		<main className={styles.main}>
			<article className={styles.box}>
				<header>
					<h1>{room ? `Room: ${room.name}` : <Skeleton />}</h1>
				</header>
				<section className={styles.players}>
					<h1>
						Players ({room?.players.length}/{room?.max})
					</h1>
					<ul>
						{room ? (
							room.players.map(x => (
								<li key={x}>
									{x}
									{room.owner === x ? <span>OWNER</span> : null}
								</li>
							))
						) : (
							<Skeleton count={4} />
						)}
					</ul>
				</section>
				<section className={styles.buttonRow}>
					{room?.owner === auth.name ? <button onClick={onClickStart}>Start</button> : ""}
					<button onClick={onClickLeave}>Leave</button>
				</section>
			</article>
		</main>
	);
}
