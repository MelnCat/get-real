"use client";
import { BackCard, Card } from "@/components/Card";
import styles from "./test.module.scss";
import { createDeck, mapGroupBy, deckTypes } from "../../../common/cards/card";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function Test() {
	const [clicked, setClicked] = useState(true);
	return (
		<main className={styles.main}>
			<Card color="multicolor" symbol="+∞" height="20em" />
			<Card color="red" symbol="3" height="20em" />
			<BackCard height="20em" />

		</main>
	);
}
