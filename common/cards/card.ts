import { v4 } from "uuid";
import { Game } from "../../server/game";
import { randomGaussian } from "@/app/util/util";
import { omit } from "radash";

export interface Card {
	type: string | number;
	color: string | string[];
}
export interface PlayedCard extends Card {
	id: string;
	colorOverride?: string;
}
export interface NumberedCard extends Card {
	count?: number;
}

export type CardType = number | string;

export type GameConstants = {
	colors: string[];
	wilds: string[][];
	includeMulticolorWild: boolean;
	numbers: (number | string)[];
	special: { type: CardType; variety: "normal" | "wild" | "both"; count: number }[];
	amountPerNumber: number;
	amountPerWild: number;
	amountPerNumberOverride: { [key: number | string]: number };
	extra: (() => NumberedCard[]) | NumberedCard[];
	copies?: number;
};

export const defaultConstants: GameConstants = {
	colors: ["red", "blue", "yellow", "green", "orange", "purple"],
	wilds: [],
	includeMulticolorWild: true,
	numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
	special: [
		{ type: "+2", variety: "normal", count: 2 },
		{ type: "skip", variety: "normal", count: 2 },
		{ type: "reverse", variety: "normal", count: 2 },
		{ type: "+4", variety: "wild", count: 4 },
		{ type: "+8", variety: "wild", count: 2 },
		{ type: "×2", variety: "wild", count: 4 },
	],
	amountPerNumber: 2,
	amountPerWild: 2,
	amountPerNumberOverride: { "0": 1 },
	extra: [],
} satisfies GameConstants;

export const originalConstants = {
	colors: ["red", "blue", "yellow", "green"],
	wilds: [],
	includeMulticolorWild: true,
	numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	special: [
		{ type: "+2", variety: "normal", count: 2 },
		{ type: "skip", variety: "normal", count: 2 },
		{ type: "reverse", variety: "normal", count: 2 },
		{ type: "+4", variety: "wild", count: 4 },
		{ type: " ", variety: "wild", count: 8 },
	],
	amountPerNumber: 2,
	amountPerWild: 0,
	amountPerNumberOverride: { 0: 1 },
	extra: [],
} satisfies GameConstants;

export const speedrun = {
	colors: ["#555", "#ccc"],
	wilds: [],
	includeMulticolorWild: true,
	numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	amountPerNumber: 8,
	amountPerWild: 4,
	amountPerNumberOverride: { 0: 4 },
	special: [
		{ type: "skip", variety: "normal", count: 4 },
		{ type: "reverse", variety: "normal", count: 4 },
		{ type: "+1", variety: "wild", count: 4 },
	],
	extra: [],
} satisfies GameConstants;
export const insaneConstants = {
	colors: ["red", "blue", "yellow", "green", "orange", "purple", "#ddd", "#111", "gray", "#4b3223ff", "pink", "teal"],
	wilds: [],
	includeMulticolorWild: true,
	numbers: [
		"FIVE",
		"🐈",
		"π",
		2,
		3,
		5,
		7,
		11,
		13,
		17,
		"α",
		"β",
		"γ",
		"δ",
		"ε",
		"ζ",
		"η",
		"θ",
		"ι",
		"κ",
		"λ",
		"μ",
		"ν",
		"ξ",
		"ρ",
		"σ",
		"τ",
		"υ",
		"φ",
		"χ",
		"ψ",
		"ω",
		"Γ",
		"Δ",
		"Θ",
		"Λ",
		"Ξ",
		"Π",
		"Σ",
		"Φ",
		"Ψ",
		"Ω",
	],
	amountPerNumber: 2,
	amountPerWild: 2,
	amountPerNumberOverride: { π: 4 },
	special: [
		{ type: "+2", variety: "both", count: 4 },
		{ type: "+4", variety: "both", count: 4 },
		{ type: "+8", variety: "both", count: 4 },
		{ type: "+16", variety: "both", count: 4 },
		{ type: "×2", variety: "both", count: 2 },
		{ type: "×1.5", variety: "both", count: 2 },
		{ type: "−2", variety: "wild", count: 2 },
		{ type: "−4", variety: "wild", count: 2 },
		{ type: "−8", variety: "wild", count: 2 },
		{ type: "÷2", variety: "wild", count: 2 },
		{ type: "÷4", variety: "wild", count: 2 },
		{ type: "+∞", variety: "wild", count: 1 },
		{ type: "+?", variety: "both", count: 2 },
		{ type: "2ˣ", variety: "wild", count: 1 },
		{ type: "^2", variety: "wild", count: 1 },
		{ type: "×0", variety: "wild", count: 1 },
		{ type: "skip", variety: "both", count: 2 },
		{ type: "reverse", variety: "both", count: 2 },
		{ type: "help", variety: "wild", count: 1 },
	],
	extra: [
		{ color: ["red", "#ddd", "red", "#ddd"], type: "CA", count: 4 },
		{ color: ["blue", "#ddd", "red"], type: "FR", count: 4 },
		{ color: ["#111", "red", "yellow"], type: "DE", count: 4 },
	],
} satisfies GameConstants;
export const cursedConstants = {
	colors: ["red", "blue", "yellow", "green", "orange", "purple", "#ddd", "#111", "lime", "brown", "goldenrod", "teal"],
	wilds: [],
	includeMulticolorWild: true,
	numbers: [
		2024,
		"π",
		2,
		3,
		5,
		7,
		11,
		13,
		17,
		"α",
		"β",
		"γ",
		"δ",
		"ε",
		"ζ",
		"η",
		"θ",
		"ι",
		"κ",
		"λ",
		"μ",
		"ν",
		"ξ",
		"ρ",
		"σ",
		"τ",
		"υ",
		"φ",
		"χ",
		"ψ",
		"ω",
		"Γ",
		"Δ",
		"Θ",
		"Λ",
		"Ξ",
		"Π",
		"Σ",
		"Φ",
		"Ψ",
		"Ω",
	],
	amountPerNumber: 2,
	amountPerWild: 2,
	amountPerNumberOverride: { π: 4 },
	special: [
		{ type: "+2", variety: "both", count: 4 },
		{ type: "+4", variety: "both", count: 4 },
		{ type: "+8", variety: "both", count: 4 },
		{ type: "+16", variety: "both", count: 4 },
		{ type: "×2", variety: "both", count: 2 },
		{ type: "×1.5", variety: "both", count: 2 },
		{ type: "−2", variety: "both", count: 2 },
		{ type: "−4", variety: "both", count: 2 },
		{ type: "−8", variety: "both", count: 2 },
		{ type: "÷2", variety: "both", count: 2 },
		{ type: "÷4", variety: "both", count: 2 },
		{ type: "+∞", variety: "wild", count: 1 },
		{ type: "+?", variety: "both", count: 2 },
		{ type: "2ˣ", variety: "wild", count: 1 },
		{ type: "^2", variety: "wild", count: 1 },
		{ type: "×0", variety: "wild", count: 2 },
		{ type: "skip", variety: "both", count: 2 },
		{ type: "reverse", variety: "both", count: 2 },
	],
	extra: [
		{ color: ["blue", "#ddd", "red"], type: "FR", count: 4 },
		{ color: ["#111", "red", "yellow"], type: "DE", count: 4 },
	],
} satisfies GameConstants;
export const neverendingConstants = {
	colors: [
		"aliceblue",
		"antiquewhite",
		"aquamarine",
		"azure",
		"beige",
		"bisque",
		"black",
		"blanchedalmond",
		"blue",
		"blueviolet",
		"brown",
		"burlywood",
		"cadetblue",
		"chartreuse",
		"chocolate",
		"coral",
		"cornflowerblue",
		"cornsilk",
		"crimson",
		"cyan",
		"darkblue",
		"darkcyan",
		"darkgoldenrod",
		"darkgray",
		"darkgreen",
		"darkkhaki",
		"darkmagenta",
		"darkolivegreen",
		"darkorange",
		"darkorchid",
		"darkred",
		"darksalmon",
		"darkseagreen",
		"darkslateblue",
		"darkslategray",
		"darkturquoise",
		"darkviolet",
		"deeppink",
		"deepskyblue",
		"dimgray",
		"dodgerblue",
		"firebrick",
		"floralwhite",
		"forestgreen",
		"gainsboro",
		"ghostwhite",
		"gold",
		"goldenrod",
		"gray",
		"green",
		"greenyellow",
		"honeydew",
		"hotpink",
		"indianred",
		"indigo",
		"ivory",
		"khaki",
		"lavender",
		"lavenderblush",
		"lawngreen",
		"lemonchiffon",
		"lightblue",
		"lightcoral",
		"lightcyan",
		"lightgoldenrodyellow",
		"lightgray",
		"lightgreen",
		"lightpink",
		"lightsalmon",
		"lightseagreen",
		"lightskyblue",
		"lightslategray",
		"lightsteelblue",
		"lightyellow",
		"lime",
		"limegreen",
		"linen",
		"magenta",
		"maroon",
		"mediumaquamarine",
		"mediumblue",
		"mediumorchid",
		"mediumpurple",
		"mediumseagreen",
		"mediumslateblue",
		"mediumspringgreen",
		"mediumturquoise",
		"mediumvioletred",
		"midnightblue",
		"mintcream",
		"mistyrose",
		"moccasin",
		"navajowhite",
		"navy",
		"oldlace",
		"olive",
		"olivedrab",
		"orange",
		"orangered",
		"orchid",
		"palegoldenrod",
		"palegreen",
		"paleturquoise",
		"palevioletred",
		"papayawhip",
		"peachpuff",
		"peru",
		"pink",
		"plum",
		"powderblue",
		"purple",
		"rebeccapurple",
		"red",
		"rosybrown",
		"royalblue",
		"saddlebrown",
		"salmon",
		"sandybrown",
		"seagreen",
		"seashell",
		"sienna",
		"silver",
		"skyblue",
		"slateblue",
		"slategray",
		"snow",
		"springgreen",
		"steelblue",
		"tan",
		"teal",
		"thistle",
		"tomato",
		"turquoise",
		"violet",
		"wheat",
		"white",
		"whitesmoke",
		"yellow",
		"yellowgreen",
		"transparent",
		"url(/mewhenthe.gif)"
	],
	wilds: [],
	includeMulticolorWild: true,
	numbers: [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9
	],
	amountPerNumber: 2,
	amountPerWild: 4,
	amountPerNumberOverride: { 0: 1 },
	special: [
		{ type: "+2", variety: "both", count: 1 },
		{ type: "+4", variety: "both", count: 2 },
		{ type: "+8", variety: "both", count: 2 },
		{ type: "+16", variety: "both", count: 2 },
		{ type: "+32", variety: "both", count: 2 },
		{ type: "+64", variety: "both", count: 2 },
		{ type: "×2", variety: "both", count: 1 },
		{ type: "×4", variety: "both", count: 1 },
		{ type: "×8", variety: "both", count: 1 },
		{ type: "×16", variety: "both", count: 1 },
		{ type: "÷3", variety: "both", count: 1 },
		{ type: "÷9", variety: "both", count: 1 },
		{ type: "skip", variety: "both", count: 1 },
		{ type: "reverse", variety: "both", count: 1 },

		{ type: "^2", variety: "wild", count: 4 },
		{ type: "^3", variety: "wild", count: 2 },
		{ type: "2ˣ", variety: "wild", count: 2 },
		{ type: "3ˣ", variety: "wild", count: 2 },
		{ type: "+∞", variety: "wild", count: 2 },
		{ type: "×∞", variety: "wild", count: 2 },
		{ type: "×0", variety: "wild", count: 1 },
		{ type: "+1000", variety: "wild", count: 2 },
	],
	extra: [
	],
} satisfies GameConstants;
export const deckTypes = {
	normal: defaultConstants,
	normalWithSwap: {
		...defaultConstants,
		special: defaultConstants.special.concat({ type: "swap", variety: "wild", count: 4 }),
	},
	original: originalConstants,
	originalWithSwap: {
		...originalConstants,
		special: originalConstants.special.slice(0, -1).concat({ type: " ", variety: "wild", count: 4 }, { type: "swap", variety: "wild", count: 4 }),
	},
	speedrun,
	insane: insaneConstants,
	cursed: cursedConstants,
	neverending: neverendingConstants
} satisfies Record<string, GameConstants>;

export const createDeck = (constants: GameConstants): Card[] => {
	const deck: Card[] = [];
	for (const color of constants.colors) {
		for (const number of constants.numbers) {
			for (let i = 0; i < (constants.amountPerNumberOverride[number] ?? constants.amountPerNumber); i++) deck.push({ type: number, color });
		}
		for (const special of constants.special) {
			if (special.variety === "normal" || special.variety === "both") for (let i = 0; i < special.count; i++) deck.push({ type: special.type, color });
		}
	}
	for (const wild of [...constants.wilds, ...(constants.includeMulticolorWild ? [constants.colors] : [])]) {
		for (const number of constants.numbers) {
			for (let i = 0; i < constants.amountPerWild; i++) deck.push({ type: number, color: wild });
		}
		for (const special of constants.special) {
			if (special.variety === "wild" || special.variety === "both") for (let i = 0; i < special.count; i++) deck.push({ type: special.type, color: wild });
		}
	}
	deck.push(...(constants.extra instanceof Function ? constants.extra() : constants.extra).flatMap(x => Array(x.count ?? 1).fill(omit(x, ["count"]))));
	return [...Array(constants.copies ?? 1)].fill(deck).flat();
};

export const createPlayingDeck = (constants: GameConstants): PlayedCard[] => createDeck(constants).map(x => ({ ...x, id: v4() }));

export const canPlay = (current: Omit<PlayedCard, "id">, card: Card) => {
	if (current.color instanceof Array && current.colorOverride === undefined) {
		if (card.color instanceof Array) return card.color.some(x => current.color.includes(x));
		return current.color.includes(card.color);
	}
	const color = current.color instanceof Array ? current.colorOverride ?? current.color[0] : current.color;
	if (card.color instanceof Array) return card.color.includes(color);
	if (color === card.color) return true;
	if (current.type === card.type) return true;
	return false;
};

export const canMatch = (bottom: Card, top: Card) => {
	return bottom.type === top.type;
};

export const allMatch = (cards: Card[]) => {
	return cards
		.slice(1)
		.map((x, i) => [cards[i], x])
		.every(x => canMatch(x[0], x[1]));
};

export const getPickupValue = (card: Card) => {
	if (typeof card.type !== "string") return null;
	if (card.type.length === 1) return null;
	if (card.type.endsWith("ˣ")) {
		const base = +card.type.slice(0, -1);
		if (isNaN(base)) return null;
		return { type: "exp", value: base };
	}
	const rawValue = card.type.slice(1);
	const value = rawValue === "∞" ? Infinity : rawValue === "π" ? Math.PI : rawValue === "?" ? Math.ceil(Math.abs(randomGaussian(6, 4))) : +rawValue;
	if (isNaN(value)) return null;
	if (card.type.startsWith("+")) return { type: "add", value };
	if (card.type.startsWith("−")) return { type: "add", value: -value };
	if (card.type.startsWith("×")) return { type: "multiply", value };
	if (card.type.startsWith("÷")) return { type: "multiply", value: 1 / value };
	if (card.type.startsWith("^")) return { type: "power", value };
	return null;
};

export interface CardValue {
	type: "add" | "multiply" | "power" | "exp";
}

export const modifyPickupValue = (initial: number, cards: Card[]) => {
	let value = initial;
	for (const card of cards) {
		const val = getPickupValue(card);
		if (val === null) return null;
		if (val.type === "add") value += val.value;
		if (val.type === "multiply") value *= val.value;
		if (val.type === "power") value **= val.value;
		if (val.type === "exp") value = val.value ** value;
	}
	if (isNaN(value)) return null;
	return value;
};

export const getInitialPickupValue = (nextPlayerId: string, game: Game, card: Card) => {
	const value = getPickupValue(card);
	if (value === null) return null;
	if (value.type === "add") return value.value;
	if (value.type === "multiply") return game.players[nextPlayerId].cards.length * (value.value - 1);
	const final = modifyPickupValue(game.players[nextPlayerId].cards.length, [card]);
	if (final === null) return null;
	return final - game.players[nextPlayerId].cards.length;
};

export const getTotalPickupValue = (nextPlayerId: string, game: Game, cards: Card[]) => {
	let value = getInitialPickupValue(nextPlayerId, game, cards[0]);
	if (value === null) return null;
	return modifyPickupValue(value, cards.slice(1));
};

export const compareTypes = (first: string | number, second: string | number) => {
	return typeof first === "number" ? (typeof second === "number" ? first - second : 1) : typeof second === "number" ? -1 : first.localeCompare(second);
};

export const mapGroupBy = <T, K>(array: T[], mapper: (value: T) => K) => {
	const map = new Map<K, T[]>();
	for (const value of array) {
		const k = mapper(value);
		if (!map.has(k)) map.set(k, []);
		map.get(k)!.push(value);
	}
	return map;
};

export interface GameRules {
	pickupUntilPlayable: boolean;
	startingCards: number;
	unrealPenalty: number;
}
export const defaultRules = {
	pickupUntilPlayable: false as boolean,
	startingCards: 10,
	unrealPenalty: 2,
} satisfies GameRules;
