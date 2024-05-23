"use client";
import { useRouter } from "next/navigation";
import { useRoom } from "../util/context"
import { useEffect } from "react";

export default function SetupPage() {
	const room = useRoom();
	const router = useRouter();
	useEffect(() => {
		if (room !== null) router.replace("/room")
	}, [room, router])
	return <main>
		
	</main>
}