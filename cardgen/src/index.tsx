import { renderToString } from "react-dom/server";
import React from "react";
import { createDeck, deckTypes } from "../../common/cards/card";
import { NewCard } from "../../src/components/NewCard";
import sharp from "sharp";
import path from "path";
import { exists, existsSync } from "fs";
const deck = createDeck(deckTypes.insane);
console.log(deck.length);
const cache: Record<string, number> = {};

let i = 0;
for (const card of deck) {
	i++;
	const name = `${card.color instanceof Array ? "wild" : card.color}_${card.type}_${card.type.toString().split("").map(x => x.charCodeAt(0).toString(16).padStart(2, "0")).join("")}`.replaceAll(
		"?",
		"question"
	);
	cache[name] ??= 0;
	cache[name]++;
	const deduped = cache[name] >= 2 ? `${name}_${cache[name]}` : name;
	if (existsSync(path.join(import.meta.dirname, `../out/${deduped}.png`))) continue;
	console.log(`working on ${deduped} | ${i}/${deck.length}`);
	const text = renderToString(<NewCard color={card.color} symbol={card.type.toString()} />);
	sharp(Buffer.from(text))
		.resize(900, 1350)
		.toFile(path.join(import.meta.dirname, `../out/${deduped}.png`));
	console.log(`${deduped} | ${i}/${deck.length}`);
}
