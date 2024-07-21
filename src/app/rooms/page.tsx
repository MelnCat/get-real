"use client";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useRoom, useRoomList } from "../util/context";
import { RoomListItem } from "./RoomListItem";
import styles from "./rooms.module.scss";
import { GameRules, deckTypes, defaultRules } from "../../../common/cards/card";
import { RoomListData } from "../../../server/room";
import Image from "next/image";

export default function RoomsPage() {
	const room = useRoom();
	const router = useRouter();
	const auth = useAuth();
	const roomList = useRoomList();
	const [submitted, setSubmitted] = useState(false);
	const [name, setName] = useState("");
	const [option, setOption] = useState("normal");
	const [rules, setRules] = useState(() => structuredClone(defaultRules));
	const [lateJoins, setLateJoins] = useState(false);
	const [max, setMax] = useState(10);
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
		socket.emit(
			"room:create",
			{
				name,
				unlisted: false,
				deckType: option,
				rules: rules,
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
								<input className={styles.createInput} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
							</div>
							<div className={styles.deckSelect}>
								Deck:
								<div className={styles.deckButtons}>
									{Object.keys(deckTypes).map(x => (
										<button aria-label={x} key={x}>
											<Image width={128} height={128} src={`/deck/${x}.png`} alt={x} />
										</button>
									))}
								</div>
							</div>
							<div className={styles.rules}>
								<h3>Rules</h3>
								<div className={styles.rule}>
									<p>Pickup Until Playable</p>
									<input
										checked={rules.pickupUntilPlayable}
										type="checkbox"
										onChange={() => setRules(x => ({ ...x, pickupUntilPlayable: !x.pickupUntilPlayable }))}
									/>
								</div>
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
