import { Card } from "@/components/Card";
import { deckTypes } from "../../../common/cards/card";
import styles from "./rooms.module.scss";

const DeckTypeIcon = ({ name, children }: { name: string; children?: React.ReactNode }) => {
	return (
		<>
			<h1>{name}</h1>
			{children}
		</>
	);
};
const backgroundForColor = (color: string[]) => {
	return `linear-gradient(#00000033,#00000033), linear-gradient(90deg, ${color.flatMap((x, i, a) => [`${x} ${(100 / a.length) * i}%`, `${x} ${(100 / a.length) * (i + 1)}%`]).join(", ")})`;
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
		background: backgroundForColor(deckTypes.normal.colors),
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
};
