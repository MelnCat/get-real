"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useRoom } from "../util/context";
import styles from "./setup.module.scss";
import { Card, DualCard } from "@/components/Card";

export default function SetupPage() {
	const room = useRoom();
	const router = useRouter();
	const [input, setInput] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const auth = useAuth();
	useEffect(() => {
		if (room !== undefined && room !== null) router.replace("/room");
	}, [room, router]);
	const submit = (value: string) => {
		if (room !== null && room !== undefined) return;
		auth.setName(value);
		setSubmitted(true);
		router.push("/rooms");
	};
	return (
		<main className={styles.main}>
			<article className={styles.box}>
				<h1>Welcome to Get Real!</h1>
				<section className={styles.description}>
					<section className={styles.cardBar}>
						<DualCard height="6em" flipped color="red" symbol="G" />
						<DualCard height="6em" flipped color="blue" symbol="E" />
						<DualCard height="6em" flipped color="multicolor" symbol="T" />
						<DualCard height="6em" flipped color="purple" symbol="+2" />
						<DualCard height="6em" flipped color="orange" symbol="R" />
						<DualCard height="6em" flipped color="green" symbol="E" />
						<DualCard height="6em" flipped color="multicolor" symbol="A" />
						<DualCard height="6em" flipped color="yellow" symbol="L" />
						<DualCard height="6em" flipped color="url('/mewhenthe.gif')" symbol="+∞" />
					</section>
					<span className={styles.getReal}>GET REAL</span> is a card game based on UNO™, but with additional rules and cards!
					<br />
					Ever wanted more <span className={styles.colors}>colors</span>? More pickups? A +∞? We have it all!
					<br />
					Begin by entering a username below.
				</section>
				<section className={styles.submit}>
					<p>Pick a username:</p>
					<input
						aria-label="Username"
						name="username"
						value={input}
						onChange={e => setInput(e.target.value)}
						disabled={submitted}
					></input>
					<button onClick={() => input && submit(input)} disabled={submitted}>
						Submit
					</button>
				</section>
			</article>
		</main>
	);
}
