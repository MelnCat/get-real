import { icons } from "./icons";
import styles from "./NewCard.module.scss"
import React from "react";
const NewCardRing = ({ color, colorOverride }: { color: string | readonly string[]; colorOverride: string | undefined }) => {
	return (
		<>
			<g transform="scale(0.8,1.24) translate(0, -30) skewX(-33) translate(124,1) rotate(-90, 100, 150)">
				{color instanceof Array &&
					color
						.toReversed()
						.map((x, i) => (
							<circle
								key={x}
								r="50"
								cx="100"
								cy="150"
								fill="#00000000"
								stroke={x}
								strokeWidth="100"
								strokeDasharray={`${(1 - i / color.length) * Math.PI * 50 * 2} ${Math.PI * 50 * 2}`}
							/>
						))}
			</g>
			<ellipse
				cx="165"
				cy="150"
				rx="80"
				ry="120"
				width={200 - CARD_STROKE}
				height={300 - CARD_STROKE}
				fill={newCardBackgroundForColor(color, colorOverride) instanceof Array ? "#00000000" : (color as string)}
				stroke="white"
				strokeWidth="8"
				transform="skewX(-23)"
			/>
		</>
	);
};

const aliases = {
	multicolor: ["red", "blue", "yellow", "green", "orange", "purple"],
} as const;

const newCardBackgroundForColor = (color: string | readonly string[], colorOverride: string | undefined) => {
	if (colorOverride?.startsWith("url(") || colorOverride === "transparent") return colorOverride;
	const real = typeof color === "string" && color in aliases ? aliases[color as keyof typeof aliases] : color;
	if (real instanceof Array && real.length > 1) {
		return real;
	}
	return typeof real === "string" ? real : real[0];
};
const CARD_STROKE = 12;
export const css = String.raw;
export const newElementForSymbol = (symbol: string) => {
	if (symbol in icons) {
		const icon = icons[symbol as keyof typeof icons];
		if (icon.type === "both" || icon.type === "center")
			return (
				<g stroke="black" strokeWidth="5" overflow="visible" filter="url(#shadow)" fill="white">
					{icon.newElement}
				</g>
			);
		else return null;
	}
	return (
		<text
			textAnchor="middle"
			dominantBaseline="middle"
			x="104"
			y={symbol.length === 1 ? 160 : 156}
			filter="url(#shadow)"
			fontSize={symbol.length <= 1 ? "143px" : symbol.length <= 2 ? "94px" : symbol.length <= 3 ? "70px" : "50px"}
			fontWeight="800"
			fill="white"
			stroke="black"
			strokeWidth="11"
			strokeLinecap="butt"
			strokeLinejoin="miter"
			paintOrder="stroke"
		>
			{symbol.split("").map((x, i) => <tspan letterSpacing={i !== 0 ? 0 : -5}>{x}</tspan>)}
		</text>
	);
};
export const newSideElementForSymbol = (symbol: string, flipped: boolean = false) => {
	if (symbol in icons) {
		const icon = icons[symbol as keyof typeof icons];
		if (icon.type === "both" || icon.type === "sides")
			return (
				<g
					stroke="black"
					strokeWidth="3"
					overflow="visible"
					filter={`url(#${flipped ? "shadowFlipped" : "shadow"})`}
					fill="white"
					transform={`${flipped ? "rotate(180, 100, 150)" : ""} scale(0.5) translate(-6,-62)`}
				>
					{icon.newElement}
				</g>
			);
	}
	const smallSize = symbol.length <= 1 ? "61px" : symbol.length <= 2 ? "46px" : symbol.length <= 3 ? "41px" : "35px";
	return (
		<text
			className="small-text"
			textAnchor="left"
			dominantBaseline="hanging"
			strokeWidth="6"
			x="25"
			y="22"
			filter={`url(#${flipped ? "shadowSmallFlipped" : "shadowSmall"})`}
			fontSize={smallSize}
			transform={flipped ? "rotate(180, 100, 150)" : ""}
			fontWeight="800"
			fill="white"
			stroke="black"
			strokeLinecap="butt"
			strokeLinejoin="miter"
			paintOrder="stroke"
		>
			{symbol}
		</text>
	);
};
export const NewCard = ({
	color,
	symbol,
	flipped = false,
	height = "100px",
	pinned = false,
	colorOverride,
}: {
	color: string | string[];
	symbol: string;
	flipped?: boolean;
	size?: "normal" | "small" | "smaller" | "smallerer" | "smallest" | "smallester";
	spacing?: "normal" | "large";
	height?: string;
	pinned?: boolean;
	colorOverride?: string;
}) => {
	console.log(colorOverride);
	const cardBackground = newCardBackgroundForColor(color, colorOverride);
	const ringBackground = colorOverride ?? newCardBackgroundForColor(color, colorOverride);
	return (
		<svg version="1.1" width="200" height="300" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" className={styles.newCard}>
			<defs>
				{cardBackground instanceof Array && (
					<linearGradient id={`bg_${color.toString().replaceAll(/\W/g, "")}`} x1="0" x2="0" y1="0" y2="1">
						{cardBackground.map((x, i) => (
							<stop key={i} offset={`${(i / (cardBackground.length - 1)) * 100}%`} stopColor={x} />
						))}
					</linearGradient>
				)}
				<filter filterUnits="userSpaceOnUse" id="shadow" width="140%" x="-20%" height="140%" y="-20%">
					<feOffset in="SourceAlpha" dx="-7" dy="9" />
					<feBlend in="SourceGraphic" in2="offOut" />
				</filter>
				<filter filterUnits="userSpaceOnUse" id="shadowFlipped" width="140%" x="-20%" height="140%" y="-20%">
					{typeof window === "undefined" ? (
						<feOffset in="SourceAlpha" dx="-7" dy="9" />
					) : (
						<feOffset in="SourceAlpha" dx="7" dy="-9" />
					)}
					<feBlend in="SourceGraphic" in2="offOut" />
				</filter>
				<filter filterUnits="userSpaceOnUse" id="shadowSmall" width="140%" x="-20%" height="140%" y="-20%">
					<feOffset in="SourceAlpha" dx="-3" dy="6" />
					<feBlend in="SourceGraphic" in2="offOut" />
				</filter>
				<filter filterUnits="userSpaceOnUse" id="shadowSmallFlipped" width="140%" x="-20%" height="140%" y="-20%">
					{typeof window === "undefined" ? (
						<feOffset in="SourceAlpha" dx="-3" dy="6" />
					) : (
						<feOffset in="SourceAlpha" dx="3" dy="-6" />
					)}
					<feBlend in="SourceGraphic" in2="offOut" />
				</filter>
				<filter filterUnits="userSpaceOnUse" id="whiteOutline">
					<feMorphology in="SourceAlpha" result="DILATED" operator="dilate" radius="3"></feMorphology>

					<feFlood floodColor="#ffffff" floodOpacity="1" result="PINK"></feFlood>
					<feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE"></feComposite>

					<feMerge>
						<feMergeNode in="OUTLINE" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<rect
				x={CARD_STROKE / 2}
				y={CARD_STROKE / 2}
				rx="18"
				width={200 - CARD_STROKE}
				height={300 - CARD_STROKE}
				fill={typeof ringBackground === "string" ? ringBackground : `url(#bg_${color.toString().replaceAll(/\W/g, "")})`}
				stroke="white"
				strokeWidth="12"
			/>
			<NewCardRing color={cardBackground} colorOverride={colorOverride} />
			<g>{newElementForSymbol(symbol)}</g>
			<g filter={cardBackground instanceof Array ? "url(#whiteOutline)" : ""}>
				{newSideElementForSymbol(symbol, false)}
				{newSideElementForSymbol(symbol, true)}
			</g>

			<rect
				x={CARD_STROKE / 2}
				y={CARD_STROKE / 2}
				rx="18"
				width={200 - CARD_STROKE}
				height={300 - CARD_STROKE}
				fill="#00000000"
				pointerEvents="none"
				stroke="white"
				strokeWidth="12"
			/>
			<style>
				{css`
					@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");
					text {
						font-family: "Roboto";
					}
				`}
			</style>
		</svg>
	);
};
