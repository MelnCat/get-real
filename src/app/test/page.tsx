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
			<button onClick={() => setClicked(x => !x)}>click</button>
			{clicked && (
				<motion.article layout="position" style={{rotate:"0deg"}}  layoutId="a" className={styles.a}>
					<Card symbol="A" color="red" />
				</motion.article>
			)}
			<section className={styles.bottom}>
				{!clicked && (
					<motion.article layout="position"  style={{rotate:"0deg"}} layoutId="a">
						<Card symbol="A" color="red" />
					</motion.article>
				)}
			</section>
		</main>
	);
}
