import { Card } from "@/components/Card";
import { deckTypes } from "../../common/cards/card";
import styles from "./RoomSettings.module.scss";

const DeckTypeIcon = ({ name, children }: { name: string; children?: React.ReactNode }) => {
	return (
		<>
			<h1>{name}</h1>
			{children}
		</>
	);
};
const backgroundForColor = (color: string[]) => {
	return `linear-gradient(#00000033,#00000033), linear-gradient(90deg, ${color
		.filter(x => !x.startsWith("url(")).flatMap((x, i, a) => [`${x} ${(100 / a.length) * i}%`, `${x} ${(100 / a.length) * (i + 1)}%`])
		.join(", ")})`;
};

export const deckTypeIcons: Record<keyof typeof deckTypes, { background: string; element: JSX.Element }> = {
	normal: {
		element: (
			<DeckTypeIcon name="Get Real">
				<div className={styles.cardDisplay}>
					<Card color="green" symbol="12" height="3.5em" />
					<Card color="multicolor" symbol="+8" height="3.5em" />
					<Card color="blue" symbol="3" height="3.5em" />
					<Card color="orange" symbol="reverse" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.normal.colors),
	},
	normalWithSwap: {
		element: (
			<DeckTypeIcon name="Get Real + Swap">
				<div className={styles.cardDisplay}>
					<Card color="green" symbol="12" height="3.5em" />
					<Card color="multicolor" symbol="+8" height="3.5em" />
					<Card color="multicolor" symbol="swap" height="3.5em" />
					<Card color="orange" symbol="reverse" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.normalWithSwap.colors),
	},
	cursed: {
		element: (
			<DeckTypeIcon name="Cursed">
				<div className={styles.cardDisplay}>
					<Card color="brown" symbol="π" height="3.5em" />
					<Card color={deckTypes.cursed.colors} symbol="+∞" height="3.5em" />
					<Card color="teal" symbol="Σ" height="3.5em" />
					<Card color="goldenrod" symbol="÷4" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.cursed.colors),
	},
	original: {
		element: (
			<DeckTypeIcon name="Original">
				<div className={styles.cardDisplay}>
					<Card color="red" symbol="0" height="3.5em" />
					<Card color={deckTypes.original.colors} symbol=" " height="3.5em" />
					<Card color="blue" symbol="7" height="3.5em" />
					<Card color={deckTypes.original.colors} symbol="+4" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.original.colors),
	},
	originalWithSwap: {
		element: (
			<DeckTypeIcon name="Original + Swap">
				<div className={styles.cardDisplay}>
					<Card color="red" symbol="0" height="3.5em" />
					<Card color={deckTypes.original.colors} symbol="swap" height="3.5em" />
					<Card color="blue" symbol="7" height="3.5em" />
					<Card color={deckTypes.original.colors} symbol="+4" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.originalWithSwap.colors),
	},
	speedrun: {
		element: (
			<DeckTypeIcon name="Speedrun">
				<div className={styles.cardDisplay}>
					<Card color="#ccc" symbol="4" height="3.5em" />
					<Card color={deckTypes.speedrun.colors} symbol="5" height="3.5em" />
					<Card color="#555" symbol="1" height="3.5em" />
					<Card color={deckTypes.speedrun.colors} symbol="+1" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.speedrun.colors),
	},
	neverending: {
		element: (
			<DeckTypeIcon name="Neverending">
				<div className={styles.cardDisplay}>
					<Card color={deckTypes.neverending.colors} symbol="+64" height="3.5em" />
					<Card color={deckTypes.neverending.colors} symbol="2ˣ" height="3.5em" />
					<Card color="rebeccapurple" symbol="7" height="3.5em" />
					<Card color="springgreen" symbol="÷3" height="3.5em" />
				</div>
			</DeckTypeIcon>
		),
		background: backgroundForColor(deckTypes.neverending.colors),
	},
};
