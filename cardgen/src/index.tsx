import { renderToString } from "react-dom/server";
import React from "react";
import { createDeck, deckTypes } from "../../common/cards/card";
import { NewCard } from "../../src/components/NewCard";
import sharp from "sharp";
import path from "path";
const deck = createDeck(deckTypes.insane);

for (let i = 0; i < 50; i++) {
	const random = deck[Math.floor(Math.random() * deck.length)];

	const text = renderToString(<NewCard color={random.color} symbol={random.type.toString()} />);

	sharp(Buffer.from(text))
		.resize(900, 1350)
		.toFile(path.join(import.meta.dirname, `../out/${i}.png`));
}
