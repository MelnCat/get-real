import { roboto } from "@/font";
import styles from "./Card.module.scss";
import { icons } from "./icons";
import mix from "mix-css-color";

const sizeForSymbol = (symbol: string) => {
	const practicalLength = symbol
		.split("")
		.map(x => (/[A-Z∞]/.exec(x) ? 1.25 : /[★]/.exec(x) ? 2.5 : /[.]/.exec(x) ? 0 : 1))
		.reduce((l, c) => l + c, 0 as number);
	if (practicalLength < 2) return "normal";
	if (practicalLength <= 2) return "smaller";
	if (practicalLength <= 2.5) return "smallerer";
	if (practicalLength < 4) return "smallest";
	if (practicalLength >= 4) return "smallester";
};
const spacingForSymbol = (symbol: string) => {
	if (/\p{Lm}/u.exec(symbol)) return "large";
	return "normal";
};

const elementForSymbol = (symbol: string) => {
	if (symbol in icons) {
		const icon = icons[symbol as keyof typeof icons];
		if (icon.type === "both" || icon.type === "center")
			return (
				<div className={styles.bigIcon} style={{ "--icon-size": icon.size }}>
					{icon.element}
				</div>
			);
		else return null;
	}
	return <div className={styles.bigNumber}>{symbol}</div>;
};
const sideElementForSymbol = (symbol: string, flipped: boolean = false) => {
	if (symbol in icons) {
		const icon = icons[symbol as keyof typeof icons];
		if (icon.type === "both" || icon.type === "sides")
			return (
				<div className={styles.smallIcon} style={{ "--icon-size": icon.size }} {...(flipped ? { "data-flipped": true } : null)}>
					{icon.element}
				</div>
			);
	}
	return <div className={flipped ? styles.smallBottom : styles.smallTop}>{symbol}</div>;
};

const aliases = {
	multicolor: ["red", "blue", "yellow", "green", "orange", "purple"],
} as const;

const cardBackgroundForColor = (color: string | string[], colorOverride: string | undefined) => {
	const real = typeof color === "string" && color in aliases ? aliases[color as keyof typeof aliases] : color;
	if (real instanceof Array && real.length > 1) {
		return `linear-gradient(in oklab, ${real.join(", ")})`;
	}
	return typeof real === "string" ? real : real[0];
};
const ringBackgroundForColor = (color: string | string[], colorOverride: string | undefined) => {
	const real = typeof color === "string" && color in aliases ? aliases[color as keyof typeof aliases] : color;
	if (real instanceof Array && real.length > 1) {
		return `conic-gradient(in oklab, ${real.flatMap((x, i, a) => [`${x} ${(360 / a.length) * i}deg`, `${x} ${(360 / a.length) * (i + 1)}deg`]).join(", ")})`;
	}
	return typeof real === "string" ? real : real[0];
};

interface CardOptions {
	color: string | string[];
	symbol: string;
	flipped?: boolean;
	size?: "normal" | "small" | "smaller" | "smallerer" | "smallest" | "smallester";
	spacing?: "normal" | "large";
	height?: string;
	pinned?: boolean;
	colorOverride?: string;
}

const CardRing = ({ color, colorOverride }: { color: string | string[]; colorOverride: string | undefined }) => {
	return (
		<div
			className={styles.ring}
			style={{
				background: ringBackgroundForColor(color, colorOverride),
				"--color-override": colorOverride ? mix("transparent", colorOverride, 50).hexa : "",
			}}
		></div>
	);
};

export const Card = ({ color, symbol, flipped = false, size = sizeForSymbol(symbol), spacing = spacingForSymbol(symbol), height = "100px", pinned = false, colorOverride }: CardOptions) => {
	return (
		<article
			className={`${roboto.className} ${styles.cardWrapper}`}
			style={{ height, ...(flipped && { transform: "rotateY(180deg)" }), ...(pinned && { top: 0, left: 0, position: "absolute" }) }}
		>
			<div
				className={styles.card}
				style={{
					background: cardBackgroundForColor(color, colorOverride),
					"--color-override": colorOverride ?? "",
				}}
				data-size={size}
				data-spacing={spacing}
				data-foo={JSON.stringify(colorOverride)}
			>
				{sideElementForSymbol(symbol)}
				{sideElementForSymbol(symbol, true)}
				{elementForSymbol(symbol)}
				<CardRing color={color} colorOverride={colorOverride} />
			</div>
		</article>
	);
};

export const BackCard = ({ height = "100px", flipped = false, pinned = false }: { height?: string; flipped?: boolean; pinned?: boolean }) => {
	return (
		<article
			className={`${roboto.className} ${styles.cardWrapper}`}
			style={{ height, ...(flipped && { transform: "rotateY(180deg)" }), ...(pinned && { top: 0, left: 0, position: "absolute" }) }}
		>
			<div className={styles.card} style={{ backgroundColor: "black" }} data-size="normal">
				<div className={styles.backIcon}>GET REAL</div>
				<div className={styles.ring} style={{ backgroundColor: "#3C5B6F", borderColor: "#3C5B6F" }}></div>
			</div>
		</article>
	);
};
export const EmptyCard = ({ height = "100px" }: { height?: string }) => {
	return (
		<article className={`${roboto.className} ${styles.cardWrapper}`} style={{ height }}>
			<div className={styles.card} style={{ backgroundColor: "white" }} data-size="normal"></div>
		</article>
	);
};

export const DualCard = ({ height = "100px", flipped = false, color, symbol, size = sizeForSymbol(symbol), spacing = spacingForSymbol(symbol) }: Omit<CardOptions, "pinned">) => {
	return (
		<article className={styles.dualCard} style={{ height }}>
			<BackCard height={height} pinned flipped={flipped} />
			<Card symbol={symbol} spacing={spacing} color={color} height={height} flipped={!flipped} size={size} pinned />
		</article>
	);
};
