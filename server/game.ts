import { Server } from "http";
import { Socket } from "socket.io";
import { TypedServer, TypedSocket } from "./types";
import {
	allMatch,
	canMatch,
	canPlay,
	Card,
	createDeck,
	createPlayingDeck,
	GameConstants,
	GameRules,
	getPickupValue,
	getTotalPickupValue,
	modifyPickupValue,
	PlayedCard,
} from "../common/cards/card";
import { shuffle } from "../common/util/util";
import { PlayingRoom, Room, StartingRoom, roomManager } from "./room";
import { players } from "./auth";

export interface GameC2SEvents {
	"game:play": (cards: string[]) => void;
	"game:configure": (options: { type: "color"; color: number } | { type: "swap-player"; player: string }) => void;
	"game:pickup": () => void;
	"game:call": () => void;
}
export interface GameS2CEvents {
	"game:data": (data: ClientGameData) => void;
	"game:effect": (effect: "skip" | "reverse") => void;
	"game:pickup": (count: number) => void;
	"game:call": (from: string) => void;
	"game:win": () => void;
}

export interface ClientGameData {
	deckSize: number;
	playerList: string[];
	currIndex: number;
	order: 1 | -1;
	playerHands: Record<string, number>;
	currentCard: PlayedCard;
	lastDiscards: PlayedCard[];
	hand: PlayedCard[];
	canPlay: boolean;
	pickedUp: boolean;
	configurationState: null | "color" | "swap-player";
	pickup: number;
	lastPlayer: string;
	winners: { name: string; extra?: string }[];
	rules: GameRules;
}

export interface EnhancedClientGameData extends ClientGameData {
	get yourTurn(): boolean;
}

export interface Game {
	deck: PlayedCard[];
	nextPlayer: string;
	playerList: string[];
	currIndex: number;
	players: Record<
		string,
		{
			cards: PlayedCard[];
			called: boolean;
		}
	>;
	order: 1 | -1;
	currentCard: PlayedCard;
	discard: PlayedCard[];
	canPlay: boolean;
	room: StartingRoom | PlayingRoom;
	pickedUp: boolean;
	configurationState: null | {
		type: "color" | "swap-player";
		playedCards: PlayedCard[];
		card: PlayedCard;
	};
	pickup: number;
	lastPlayer: string;
	winners: { id: string; extra?: string }[];
	takeDeck(count: number): PlayedCard[];
	takeCard(): PlayedCard | null;
	rules: GameRules;
}

export const gameManager = {
	resendGame(room: StartingRoom | PlayingRoom) {
		for (const playerId of room.players) {
			players[playerId].socket.emit("game:data", this.createClientData(room.game, playerId));
		}
	},
	startGame(io: TypedServer, room: StartingRoom) {
		const players = shuffle(room.players);
		const deck = shuffle(createPlayingDeck(room.deckType));
		const startCardIndex = deck.findIndex(x => room.deckType.numbers.includes(x.type) && typeof x.color === "string");
		const [startCard] = deck.splice(startCardIndex === -1 ? 0 : startCardIndex, 1);
		if (startCard.color instanceof Array) startCard.colorOverride = startCard.color[Math.floor(Math.random() * startCard.color.length)];
		room.game = {
			currIndex: 0,
			deck,
			nextPlayer: players[1] ?? players[0],
			playerList: players,
			players: Object.fromEntries(players.map(x => [x, { cards: [], called: false }])),
			order: 1,
			currentCard: startCard,
			discard: [],
			canPlay: true,
			room,
			pickedUp: false,
			configurationState: null,
			pickup: 0,
			lastPlayer: "",
			winners: [],
			rules: room.rules,
			takeDeck(count: number) {
				const took = this.deck.splice(0, count);
				if (took.length < count) {
					const newDeck = shuffle(this.discard);
					for (const card of newDeck) delete card.colorOverride;
					this.discard = [];
					this.deck = newDeck;
					for (const card of this.deck.splice(0, count - took.length)) took.push(card);
				}
				return took;
			},
			takeCard() {
				const [card] = this.takeDeck(1);
				return card ?? null;
			},
		};
		for (const player of Object.values(room.game.players)) {
			player.cards.push(...deck.splice(0, room.game.rules.startingCards));
		}
		gameManager.resendGame(room);
		setTimeout(() => {
			(room as unknown as PlayingRoom).state = "play";
			roomManager.resendData(room.name);
		}, 1000);
	},
	createClientData(game: Game, playerId: string): ClientGameData {
		return {
			deckSize: game.deck.length,
			currentCard: game.currentCard,
			currIndex: game.currIndex,
			order: game.order,
			playerHands: Object.fromEntries(Object.entries(game.players).map(x => [players[x[0]].name, x[1].cards.length])),
			playerList: game.playerList.map(x => players[x].name),
			lastDiscards: game.discard.slice(-15),
			hand: game.players[playerId].cards,
			canPlay: game.canPlay,
			pickedUp: game.pickedUp,
			configurationState: game.configurationState?.type ?? null,
			pickup: game.pickup,
			lastPlayer: players[game.lastPlayer]?.name,
			winners: game.winners.map(x => ({ name: players[x.id].name, extra: x.extra })),
			rules: game.rules,
		};
	},
	byPlayer(playerId: string) {
		const room = roomManager.byPlayer(playerId);
		if (room === undefined || room.state !== "play") return null;
		return room.game;
	},
	nextPlayer(cards: PlayedCard[], game: Game) {
		game.lastPlayer = game.playerList[game.currIndex];

		game.canPlay = true;

		if (game.deck.length === 0) {
			const newDeck = shuffle(game.discard);
			for (const card of newDeck) delete card.colorOverride;
			game.discard = [];
			game.deck = newDeck;
		}

		if (cards[0]?.type === "skip") {
			for (const _ of cards) {
				game.currIndex = game.playerList.indexOf(game.nextPlayer);
				game.nextPlayer = game.playerList[(game.currIndex + game.order + game.playerList.length) % game.playerList.length];
				players[game.nextPlayer].socket.emit("game:effect", "skip");
			}
		} else if (cards[0]?.type === "reverse") {
			for (const _ of cards) game.order *= -1;
			if (cards.length % 2 === 1) for (const player of game.playerList) players[player].socket.emit("game:effect", "reverse");
		}
		if (game.pickup !== 0) {
			game.pickup = modifyPickupValue(game.pickup, cards as Card[]) ?? game.pickup;
		} else if (cards.length > 0) {
			const pickup = getTotalPickupValue(game.nextPlayer, game, cards as Card[]);
			if (pickup !== null) {
				game.pickup = pickup;
			}
		}

		if (!game.rules.pickupUntilPlayable || cards.length > 0) {
			game.currIndex = game.playerList.indexOf(game.nextPlayer);
			game.nextPlayer = game.playerList[(game.currIndex + game.order + game.playerList.length) % game.playerList.length];
		}

		if (game.players[game.lastPlayer].cards.length === 0) {
			const currentPlayer = game.playerList[game.currIndex];
			game.winners.push({ id: game.lastPlayer });
			players[game.lastPlayer].socket.emit("game:win");
			game.playerList.splice(game.playerList.indexOf(game.lastPlayer), 1);
			game.currIndex = game.playerList.indexOf(currentPlayer);
		}

		if (game.playerList.length === 0 || (game.playerList.length === 1 && game.winners.length > 0)) {
			if (game.playerList.length > 0 && game.pickup !== 0) {
				if (game.pickup > 0) for (const card of game.takeDeck(game.pickup)) game.players[game.playerList[0]].cards.push(card);
				else {
					const iterCount = Math.min(-game.pickup, game.players[game.playerList[0]].cards.length);
					for (let i = 0; i < iterCount; i++)
						game.deck.push(...game.players[game.playerList[0]].cards.splice(Math.floor(Math.random() * game.players[game.playerList[0]].cards.length), 1));
				}
				players[game.playerList[game.currIndex]].socket.emit("game:pickup", game.pickup);
				game.pickup = 0;
			}
			(game.room.state as string) = "end";
			const id = game.playerList.pop()!;
			game.winners.push({ id, extra: `${game.players[id].cards.length} cards left` });
			roomManager.resendData(game.room.name);
		}
	},
};

export const registerGameEvents = (io: TypedServer, socket: TypedSocket) => {
	socket.on("game:call", () => {
		const game = gameManager.byPlayer(socket.data.playerId);
		if (game === null) return;
		for (const player of game.playerList) players[player].socket.emit("game:call", players[socket.data.playerId].name);
		game.players[socket.data.playerId].called = true;
		for (const [id, data] of Object.entries(game.players)) {
			if (data.cards.length === 1 && !data.called) {
				for (const card of game.takeDeck(game.rules.unrealPenalty)) data.cards.push(card);
				gameManager.resendGame(game.room);
				players[id].socket.emit("game:pickup", game.rules.unrealPenalty);
			}
		}
	});
	socket.on("game:play", cardIds => {
		const game = gameManager.byPlayer(socket.data.playerId);
		if (game === null) return;
		if (game.playerList[game.currIndex] !== socket.data.playerId) return;
		if (!game.canPlay) return;
		const cards = cardIds.map(x => game.players[socket.data.playerId].cards.find(y => y.id === x));
		if (cards.includes(undefined)) return;
		if (cards.length === 0) {
			if (game.pickup !== 0) return;
			game.canPlay = false;
			if (!game.pickedUp) {
				const drawnCard = game.takeCard();
				if (drawnCard !== null) {
					game.players[socket.data.playerId].cards.push(drawnCard);
					if (canPlay(game.currentCard, drawnCard)) {
						game.pickedUp = true;
						game.canPlay = true;
						gameManager.resendGame(game.room);
						return;
					}
				}
			} else game.pickedUp = false;
		} else {
			if (!allMatch(cards as Card[])) return;
			if (!canPlay(game.currentCard, cards[0]!)) return;
			if (game.pickup !== 0 && getPickupValue(cards[0]!) === null) return;
			game.canPlay = false;
			game.pickedUp = false;

			gameManager.resendGame(game.room);

			game.players[socket.data.playerId].cards = game.players[socket.data.playerId].cards.filter(x => !cardIds.includes(x.id));
			if (game.players[socket.data.playerId].cards.length !== 1) game.players[game.playerList[game.currIndex]].called = false;
			const newDiscards = cards.slice(0, -1) as PlayedCard[];
			for (const [i, card] of newDiscards.entries()) {
				const previous = i === 0 ? game.currentCard : newDiscards[i - 1];
				if (card.color instanceof Array && typeof previous.color === "string") card.colorOverride = previous.colorOverride ?? previous.color;
			}
			game.discard.push(game.currentCard, ...newDiscards);
			game.currentCard = cards.at(-1)!;

			if (game.currentCard.type === "swap" && game.playerList.length > 1 && game.players[socket.data.playerId].cards.length >= 1) {
				game.configurationState = {
					type: "swap-player",
					playedCards: cards as PlayedCard[],
					card: game.currentCard,
				};
				gameManager.resendGame(game.room);
				return;
			} else if (game.currentCard.color instanceof Array) {
				game.configurationState = {
					type: "color",
					playedCards: cards as PlayedCard[],
					card: game.currentCard,
				};
				gameManager.resendGame(game.room);
				return;
			}
		}

		gameManager.nextPlayer(cards as PlayedCard[], game);
		/*
		
		if (game.pickup !== 0 && !next.cards.some(x => canPlay(game.currentCard, x) && getPickupValue(x) !== null)) {
			for (const card of game.takeDeck(game.pickup)) next.cards.push(card);
			players[game.playerList[game.currIndex]].socket.emit("game:pickup", game.pickup);
			game.pickup = 0;
		}*/

		gameManager.resendGame(game.room);
	});

	socket.on("game:pickup", () => {
		const game = gameManager.byPlayer(socket.data.playerId);
		if (game === null) return;
		if (game.playerList[game.currIndex] !== socket.data.playerId) return;
		if (!game.canPlay || game.pickup === 0) return;
		game.pickup = Math.floor(game.pickup);

		if (game.pickup > 0) for (const card of game.takeDeck(game.pickup)) game.players[socket.data.playerId].cards.push(card);
		else {
			const iterCount = Math.min(-game.pickup, game.players[game.playerList[0]].cards.length);
			for (let i = 0; i < iterCount; i++)
				game.deck.push(...game.players[game.playerList[0]].cards.splice(Math.floor(Math.random() * game.players[game.playerList[0]].cards.length), 1));
		}
		players[game.playerList[game.currIndex]].socket.emit("game:pickup", game.pickup);
		if (game.players[socket.data.playerId].cards.length === 0) {
			gameManager.nextPlayer([] as PlayedCard[], game);
		}
		game.pickup = 0;
		gameManager.resendGame(game.room);
	});

	socket.on("game:configure", opts => {
		const game = gameManager.byPlayer(socket.data.playerId);
		if (game === null) return;
		if (game.playerList[game.currIndex] !== socket.data.playerId) return;
		if (game.configurationState === null) return;
		if (game.configurationState.type === "color" && opts.type === "color") {
			const colorIndex = opts.color;
			const chosen = game.configurationState.card.color[colorIndex];
			game.currentCard.colorOverride = chosen;
			gameManager.nextPlayer(game.configurationState.playedCards, game);
			game.configurationState = null;
			gameManager.resendGame(game.room);
		} else if (game.configurationState.type === "swap-player" && opts.type === "swap-player") {
			const player = opts.player;
			const matched = game.playerList.find(x => players[x].name === player);
			if (matched === undefined || matched === socket.data.playerId) return;
			[game.players[socket.data.playerId].cards, game.players[matched].cards] = [game.players[matched].cards, game.players[socket.data.playerId].cards];
			if (game.currentCard.color instanceof Array) {
				game.configurationState = {
					type: "color",
					playedCards: game.configurationState.playedCards,
					card: game.configurationState.card,
				};
				gameManager.resendGame(game.room);
				return;
			}
			gameManager.nextPlayer(game.configurationState.playedCards, game);
			game.configurationState = null;
			gameManager.resendGame(game.room);
		}
	});
};
