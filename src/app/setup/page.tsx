"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useRoom } from "../util/context";
import styles from "./setup.module.scss";
import { Card } from "@/components/Card";

export default function SetupPage() {
	const room = useRoom();
	const router = useRouter();
	const [input, setInput] = useState("");
	const auth = useAuth();
	useEffect(() => {
		if (room !== undefined && room !== null) router.replace("/room");
	}, [room, router]);
	const submit = (value: string) => {
		if (room !== null && room !== undefined) return;
		auth.setName(value);
		router.push("/rooms");
	};
	return (
		<main className={styles.main}>
			<article className={styles.box}>
				<h1>Welcome to Get Real!</h1>
				<p>
					Get Real is a card game based on UNO™,
					<section className={styles.cardBar}>
					<Card color="red" symbol="G" />
					<Card color="blue" symbol="E" />
					<Card color="multicolor" symbol="T" />
					<Card color="red" symbol="R" />
					<Card color="red" symbol="E" />
					<Card color="red" symbol="A" />
					<Card color="red" symbol="L" />
					</section>
				</p>
				<section className={styles.submit}>
					<input value={input} onChange={e => setInput(e.target.value)}></input>
					<button onClick={() => input && submit(input)}>Submit</button>
				</section>
			</article>
		</main>
	);
}
