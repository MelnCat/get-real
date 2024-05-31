"use client";
import { useRouter } from "next/navigation";
import { useAuth, useGame, useRoom } from "../util/context";
import { useEffect, useRef, useState } from "react";
import styles from "./game.module.scss";
import { BackCard, Card, EmptyCard } from "@/components/Card";
import { useMouse } from "@uidotdev/usehooks";
import { socket } from "@/socket";
import { Flipper, Flipped } from "react-flip-toolkit";
import { canMatch, canPlay, getPickupValue, PlayedCard } from "../../../common/cards/card";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { motion } from "framer-motion";
import fontColorContrast from "font-color-contrast";
import React from "react";
import { roboto } from "@/font";
import { numberFormat } from "../util/format";
const DeckCard = ({ index, length, ...other }: { index: number; length: number }) => {
	const ref = useRef(null);
	const modulus = length < 200 ? 1 : 2;
	return (
		<CSSTransition
			nodeRef={ref}
			timeout={500}
			classNames={{
				exit: styles.deckExit,
			}}
			{...other}
		>
			<div
				ref={ref}
				className={styles.deckCard}
				style={{
					"--deck-index": index,
					"--d": modulus,
					display: length - index > 10 ? (index % modulus === 0 ? undefined : "none") : undefined,
				}}
			>
				{index + 10 > length - 1 ? <BackCard height="12em" /> : <EmptyCard height="12em" />}
			</div>
		</CSSTransition>
	);
};
const DiscardCard = ({ card, index, ...other }: { card: PlayedCard; index: number }) => {
	const ref = useRef(null);
	return (
		<CSSTransition
			timeout={500}
			classNames={{
				enter: styles.discardEnter,
				enterActive: styles.discardEnterActive,
			}}
			nodeRef={ref}
			{...other}
		>
			<div
				ref={ref}
				className={styles.discardCard}
				style={{
					"--random-seed": card.id.split("").reduce((l, c) => c.charCodeAt(0) + (l % 1000000) * 7, 0),
					"--card-index": index,
				}}
			>
				<Card height="12em" {...card} symbol={card.type.toString()} />
			</div>
		</CSSTransition>
	);
};

export default function GamePage() {
	const room = useRoom();
	const game = useGame();
	const auth = useAuth();
	const router = useRouter();
	const [mouse] = useMouse();
	const [selected, setSelected] = useState<string[]>([]);
	const [pickingUp, setPickingUp] = useState(false);
	const handRef = useRef<HTMLDivElement | null>(null);
	const justClicked = useRef<Record<string, number>>({});

	useEffect(() => {
		if (auth.name === null) router.replace("/setup");
		else if (room === null) router.replace("/rooms");
		else if (room !== undefined && room.state !== "play" && room.state !== "starting" && room.state !== "end") router.replace("/room");
		socket.on("game:pickup", () => {
			setPickingUp(true);
			setTimeout(() => setPickingUp(false), 500);
		});
	}, [auth, room, router]);
	if (room === undefined || room === null || game === undefined || game === null) return <main className={styles.main}></main>;

	const onClickDeck = () => {
		if (room.state === "play" && game.yourTurn && !game.pickedUp && game.canPlay) {
			socket.emit("game:play", []);
			setSelected([]);
		}
	};
	const onClickCard = (id: string) => {
		if (room.state !== "play" || !game.canPlay || !game.yourTurn) return;
		const card = game.hand.find(x => x.id === id);
		if (card === undefined) return;
		if (selected.includes(id)) {
			if (id in justClicked.current) {
				if (justClicked.current[id] + 50 > Date.now()) return;
				if (justClicked.current[id] + 400 > Date.now()) return onRightClickCard(undefined, id);
			}
			setSelected(x => {
				const y = x.toSpliced(x.indexOf(id), 1);
				if (y.length === 0) return y;
				if (!canPlay(game.currentCard, game.hand.find(z => z.id === y[0])!)) return [];
				const mismatch = y.findIndex((x, i, a) => i !== 0 && !canMatch(game.hand.find(z => z.id === a[i - 1])!, game.hand.find(z => z.id === x)!));
				if (mismatch !== -1) return y.slice(0, mismatch);
				return y;
			});
		} else if (selected.length > 0) {
			if (canMatch(game.hand.find(x => x.id === selected.at(-1))!, card)) {
				justClicked.current[id] = Date.now();
				setSelected(x => x.concat(id));
			}
		} else if ((!game.pickup || getPickupValue(card) !== null) && canPlay(game.currentCard, card)) {
			justClicked.current[id] = Date.now();
			setSelected(x => x.concat(id));
		}
	};
	const onRightClickCard = (event: React.MouseEvent | undefined, id: string) => {
		event?.preventDefault();
		if (room.state !== "play" || !game.canPlay || !game.yourTurn) return;
		const card = game.hand.find(x => x.id === id);
		if (card === undefined) return;
		if (!selected.includes(id)) {
			if (selected.length === 0 && (!game.pickup || getPickupValue(card) !== null) && canPlay(game.currentCard, card)) {
				setSelected(x => x.concat(id).concat(game.hand.filter(y => y.id !== card.id && canMatch(card, y)).map(y => y.id)));
			} else {
				setSelected([]);
			}
			return;
		}
		if (canMatch(game.hand.find(x => x.id === selected.at(-1))!, card)) {
			const toAdd = game.hand.filter(y => !selected.includes(y.id) && canMatch(game.hand.find(p => p.id === selected.at(-1))!, y)).map(y => y.id);
			if (toAdd.length === 0) setSelected([]);
			else setSelected(x => x.concat(...toAdd));
		}
	};
	const onClickPlay = () => {
		if (room.state === "play" && selected.length !== 0 && game.yourTurn && game.canPlay) {
			socket.emit("game:play", selected);
			setSelected([]);
			justClicked.current = {};
		}
	};
	const onClickPass = () => {
		if (room.state === "play" && game.yourTurn && game.canPlay && game.pickedUp) socket.emit("game:play", []);
	};
	const onClickChooseColor = (index: number) => {
		if (room.state === "play" && game.configurationState === "color" && game.yourTurn) socket.emit("game:configure", { color: index, type: "color" });
	};
	const onClickChooseSwapPlayer = (player: string) => {
		if (room.state === "play" && game.configurationState === "swap-player" && game.yourTurn) socket.emit("game:configure", { player, type: "swap-player" });
	};
	const onClickPickup = () => {
		if (room.state === "play" && game.yourTurn && game.canPlay && game.pickup !== 0) socket.emit("game:pickup");
	};
	const onClickCall = () => {
		if (room.state === "play") socket.emit("game:call");
	};
	const onClickLeave = () => {
		if (room.state === "end" || confirm("Are you sure you want to leave?")) socket.emit("room:leave");
	};

	return (
		<main className={styles.main} {...(game.yourTurn ? { "data-turn": true } : null)}>
			<div
				className={styles.table}
				style={
					game.deckSize > 500
						? { "--offset-x": 0, "--offset-y": 0 }
						: {
								"--offset-x": `${-(mouse.x - innerWidth / 2) / 15}px`,
								"--offset-y": `${-(mouse.y - innerHeight / 2) / 15}px`,
						  }
				}
			>
				<button
					className={styles.deck}
					{...((game.lastPlayer === auth.name && !game.yourTurn && !game.pickedUp) || pickingUp || (game.pickedUp && game.yourTurn) ? { "data-turn": true } : null)}
					{...(game.yourTurn && !game.pickedUp ? { "data-clickable": true } : null)}
					onClick={onClickDeck}
					aria-label="Deck"
				>
					<TransitionGroup component={null}>
						{[...Array(Math.ceil(Math.min(game.deckSize, 400)))].map((_, i, a) => (
							<DeckCard key={game.deckSize > 400 ? game.deckSize - 400 + i : i} index={i} length={a.length} />
						))}
					</TransitionGroup>
				</button>
				<div className={styles.discard} {...(game.lastPlayer === auth.name || (game.yourTurn && game.configurationState !== null) ? { "data-last-turn": true } : null)}>
					<TransitionGroup component={null} exit={false}>
						{game.lastDiscards.concat(game.currentCard).map((x, i, a) => (
							<DiscardCard card={x} index={i} key={x.id} />
						))}
					</TransitionGroup>
				</div>
				{game.pickup !== 0 && (
					<div className={`${styles.pickupIcon} ${roboto.className}`}>
						{game.pickup > 0 ? "+" : "−"}
						{numberFormat.format(Math.abs(game.pickup))}
					</div>
				)}
			</div>
			<div className={styles.bottomRow}>
				<div className={styles.actionRow}>
					{game.yourTurn && selected.length !== 0 && (
						<button className={styles.playCards} onClick={onClickPlay}>
							Play Card{selected.length > 1 ? "s" : ""}
						</button>
					)}
					{game.yourTurn && (game.pickedUp || game.deckSize === 0) && (
						<button className={styles.pass} onClick={onClickPass}>
							Pass
						</button>
					)}
					{game.yourTurn && game.pickup !== 0 && (
						<button className={styles.pickup} onClick={onClickPickup}>
							Pickup
						</button>
					)}
				</div>
				<button className={styles.call} onClick={onClickCall}>
					GET REAL!
				</button>
				<Flipper flipKey={game.hand.map(x => x.id).join("")}>
					<div
						className={styles.hand}
						ref={handRef}
						onWheel={e => {
							e.preventDefault();
							handRef.current?.scrollBy({ left: e.deltaY });
						}}
					>
						{game.hand.map((x, i, a) => (
							<Flipped flipId={x.id} key={x.id}>
								<button
									className={styles.handCard}
									{...(selected.includes(x.id) ? { "data-selected": true } : null)}
									{...(game.yourTurn &&
									!selected.includes(x.id) &&
									(selected.length === 0
										? !canPlay(game.currentCard, x) || (game.pickup && getPickupValue(x) === null)
										: !canMatch(game.hand.find(y => y.id === selected.at(-1))!, x))
										? { "data-disabled": true }
										: null)}
									onClick={() => onClickCard(x.id)}
									onContextMenu={e => onRightClickCard(e, x.id)}
									aria-label={`Card ${x.color} ${x.type}`}
								>
									<Card height="12em" {...x} symbol={x.type.toString()} />
								</button>
							</Flipped>
						))}
					</div>
				</Flipper>
			</div>
			{game.yourTurn && game.configurationState === "color" && (
				<div
					className={styles.colorConfig}
					style={{
						"--column-count":
							[0, 1, 2, 3, 2, 3, 3, 4, 4][game.currentCard.color.length] ??
							(game.currentCard.color.length % 5 === 0
								? 5
								: game.currentCard.color.length % 4 === 0
								? 4
								: game.currentCard.color.length % 3 === 0
								? 3
								: game.currentCard.color.length % 2 === 0
								? game.currentCard.color.length / 2
								: 5),
					}}
				>
					{game.currentCard.color instanceof Array
						? game.currentCard.color.map((x, i) => (
								<div key={x}>
									<button style={{ backgroundColor: x, color: fontColorContrast(x) }} className={x} aria-label={x} onClick={() => onClickChooseColor(i)}></button>
								</div>
						  ))
						: "?"}
				</div>
			)}
			{game.yourTurn && game.configurationState === "swap-player" && (
				<div className={styles.playerConfig}>
					{game.playerList
						.filter(x => x !== auth.name)
						.map(x => (
							<div key={x}>
								<button style={{ backgroundColor: x }} className={x} aria-label={x} onClick={() => onClickChooseSwapPlayer(x)}>
									{x}
								</button>
							</div>
						))}
				</div>
			)}
			<div className={styles.temporary}>
				{game?.playerList.map((x, i) => (
					<div key={x}>
						<span
							style={{
								color: game.currIndex === i ? "yellow" : "#eee",
								fontWeight: game.currIndex === i ? "bold" : "",
								textDecoration: game.currIndex === i ? "underline" : "",
							}}
						>
							{x}
						</span>
						: {game.playerHands[x]} Card(s)
					</div>
				))}
			</div>
			{room.state === "end" ? (
				<div className={`${roboto.className} ${styles.endScreen}`}>
					<h1>Game Over</h1>
					<ul>
						{game.winners.map((x, i, a) => (
							<li key={x.name}>
								<b>{i === a.length - 1 ? "DNF" : `#${i + 1}`}</b>: {x.name}
								{x.extra && <span>{x.extra}</span>}
							</li>
						))}
					</ul>
					<button className={styles.leaveButton} onClick={onClickLeave}>
						Leave
					</button>
				</div>
			) : (
				<button className={styles.gameLeaveButton} onClick={onClickLeave}>
					Quit Game
				</button>
			)}
		</main>
	);
}
