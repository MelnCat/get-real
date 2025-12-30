"use client";
import { Card } from "@/components/Card";
import { NewCard } from "@/components/NewCard";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { deckTypes } from "../../../common/cards/card";
import styles from "./test.module.scss";

export default function Test() {
	const [clicked, setClicked] = useState(true);
	const [string, setString] = useState("");
	const foo = () => {
		const str = renderToString(<NewCard color="multicolor" symbol="+∞" height="20em" />);
		//console.log(str)
		setString(`data:image/svg+xml;utf8,${str}`);
	};
	console.log(string);
	return (
		<main className={styles.main}>
			<img src={string} />
			<section className={styles.row}>
				<Card color="multicolor" symbol="+∞" height="20em" />
				<Card color="red" symbol="3" height="20em" />
				<Card color={["red", "green", "yellow", "blue"]} symbol="+∞" height="20em" />
				<Card color="red" symbol="+2" height="20em" />
				<Card color="blue" symbol="+4" height="20em" />
			</section>
			<section className={styles.row}>
				<Card color="yellow" symbol="+8" height="20em" />
				<Card color="green" symbol="reverse" height="20em" />
				<Card color="green" symbol="skip" height="20em" />
				<Card color={["red", "green", "yellow", "blue"]} symbol="+4" height="20em" />
				<Card color={"multicolor"} symbol="+4" height="20em" />
				<Card color={deckTypes.neverending.colors} symbol="+∞" height="20em" />
				<Card color={deckTypes.insane.colors} symbol="+∞" height="20em" />
				<Card color={deckTypes.insane.colors} symbol="reverse" height="20em" />
				<Card color={deckTypes.insane.colors} symbol="skip" height="20em" />
			</section>
			<section className={styles.row}>
				<Card color={"multicolor"} symbol="+1" height="20em" />
				<Card color={"multicolor"} symbol="+2" height="20em" />
				<Card color={"multicolor"} symbol="+4" height="20em" />
				<Card color={"multicolor"} symbol="+8" height="20em" />
				<Card color={"multicolor"} symbol="+16" height="20em" />
				<Card color={"multicolor"} symbol="+32" height="20em" />
			</section>
			<hr />
			<button onClick={foo}>do stuff</button>
		</main>
	);
}
