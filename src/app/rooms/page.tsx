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
import { deckTypeIcons } from "./deckTypeIcons";

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
										<button
											aria-label={x}
											key={x}
											style={{ borderColor: option === x ? "#ffffff" : "#6f6f6f", filter: option === x ? "" : "brightness(0.8)",
												backgroundImage: deckTypeIcons[x as keyof typeof deckTypeIcons]?.background
											 }}
											onClick={() => setOption(x)}
											
										>
											{deckTypeIcons[x as keyof typeof deckTypeIcons]?.element}
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
								<div className={styles.rule}>
									<p>Starting Card Count</p>
									<input value={rules.startingCards} type="number" onChange={e => setRules(x => ({ ...x, startingCards: +e.target.value }))} />
								</div>
								<div className={styles.rule}>
									<p>Unannounced 1 Card Penalty</p>
									<input value={rules.unrealPenalty} type="number" onChange={e => setRules(x => ({ ...x, unrealPenalty: +e.target.value }))} />
								</div>
							</div>
							<div className={styles.rules}>
								<h3>Room Settings</h3>
								<div className={styles.rule}>
									Allow joining during gameplay? <input type="checkbox" value={lateJoins ? "on" : ""} onChange={x => setLateJoins(x => !x)} />
								</div>
								<div className={styles.rule}>
									Max Players: <input type="number" value={max} onChange={x => setMax(+x.target.value)} />
								</div>
							</div>
							<button disabled={submitted || name.trim() === ""} className={styles.createButton} onClick={() => name.trim() && createRoom()}>
								Create
							</button>
						</section>
					</section>
				</article>
			</article>
		</main>
	);
}
