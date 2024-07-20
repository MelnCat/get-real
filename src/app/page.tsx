"use client";
import { BackCard, Card } from "@/components/Card";
import { useEffect, useState } from "react";
import { canMatch, canPlay } from "../../common/cards/card";
import { socket } from "../socket";
import styles from "./page.module.css";
import { useGame, useRoom } from "./util/context";
import { useRouter } from "next/navigation";

export default function Home() {
	const room = useRoom();
	const game = useGame();
	const [selected, setSelected] = useState<string[]>([]);
	const router = useRouter();
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") router.replace("/rooms");
	}, [router])
	return (
		<main className={styles.main}>
			<h1>Loading...</h1>
		</main>
	);
}
