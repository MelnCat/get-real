"use client";
import { BackCard, Card } from "@/components/Card";
import styles from "./deck.module.scss";
import { createDeck, mapGroupBy, deckTypes } from "../../../common/cards/card";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const Deck = () => {
	const searchParams = useSearchParams();
	const decks = useMemo(
		() =>
			Object.entries(searchParams.has("deck") ? { deck: deckTypes[searchParams.get("deck") as keyof typeof deckTypes] } : deckTypes).map(
				([name, rules]) => [name, mapGroupBy(createDeck(rules), x => x.color)] as const
			),
		[searchParams]
	);
	return (
		<main className={styles.main}>
			{decks.map(([name, cards]) => (
				<>
					{!searchParams.has("deck") ? (
						<h1>
							{name} [{[...cards.values()].flat().length}]
						</h1>
					) : null}
					<section key={name} style={{ gridTemplateColumns: `repeat(${cards.get([...cards.keys()][0])!.length}, 1fr)` }}>
						{[...cards.entries()].map(([color, values], j) =>
							values.map((card, i) => (
								<div key={`${color}_${i}`} className={styles.card} style={{}}>
									<Card symbol={card.type.toString()} color={card.color} />
								</div>
							))
						)}
					</section>
				</>
			))}
		</main>
	);
}
export default function DeckPage() {
	return <Suspense>
		<Deck />
	</Suspense>
}