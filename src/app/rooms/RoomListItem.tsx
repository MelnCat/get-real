import Skeleton from "react-loading-skeleton";
import { RoomListData } from "../../../server/room";
import { socket } from "@/socket";
import styles from "./rooms.module.scss";

export const RoomListItem = ({ room, canJoin, setSubmitted, submitted }: { room: RoomListData | null; canJoin: boolean; setSubmitted(submitted: boolean): void; submitted: boolean }) => {
	return (
		<article className={styles.room}>
			<div className={styles.roomHeader}>
				<h1>{room?.name ?? <Skeleton />}</h1>
				<p className={styles.roomPlayers}>
					{room !== null ? (
						<>
							{room.playerCount}/{room.max}
						</>
					) : (
						<Skeleton />
					)}
				</p>
			</div>
			<p className={styles.roomStatus}>{room !== null ? room.state === "lobby" ? "In Lobby" : "In Game" : <Skeleton />}</p>
			<p>{room !== null ? `Owner: ${room.owner}` : <Skeleton />}</p>
			{canJoin && room !== null && <button disabled={submitted} onClick={() => {
				socket.emit("room:join", room.name);
				setSubmitted(true);
			}}>Join</button>}
		</article>
	);
};
