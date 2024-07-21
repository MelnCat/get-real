import { Dispatch, SetStateAction } from "react";
import { deckTypes, GameRules } from "../../common/cards/card";
import { RoomCreateOptions } from "../../server/room";
import styles from "./RoomSettings.module.scss";
import { deckTypeIcons } from "./deckTypeIcons";
import { Game } from "../../server/game";

export const RoomSettings = ({ settings, setSettings }: { settings: RoomCreateOptions; setSettings: Dispatch<SetStateAction<RoomCreateOptions>> }) => {
	const setRules = (cb: (rules: GameRules) => GameRules) => {
		setSettings(x => ({ ...x, rules: cb(x.rules) }));
	};
	return (
		<>
			<div className={styles.rules}>
				<h3>Deck</h3>
				<div className={styles.deckButtons}>
					{Object.keys(deckTypes).map(x => (
						<button
							aria-label={x}
							key={x}
							style={{
								borderColor: settings.deckType === x ? "#ffffff" : "#6f6f6f",
								filter: settings.deckType === x ? "" : "brightness(0.8)",
								backgroundImage: deckTypeIcons[x as keyof typeof deckTypeIcons]?.background,
							}}
							onClick={() => setSettings(y => ({ ...y, deckType: x }))}
						>
							{deckTypeIcons[x as keyof typeof deckTypeIcons]?.element}
						</button>
					))}
				</div>
			</div>
			<div className={styles.rules}>
				<h3>Rules</h3>
				<div className={styles.rule}>
					<p>Pickup Until Playable</p>
					<input checked={settings.rules.pickupUntilPlayable} type="checkbox" onChange={() => setRules(x => ({ ...x, pickupUntilPlayable: !x.pickupUntilPlayable }))} />
				</div>
				<div className={styles.rule}>
					<p>Starting Card Count</p>
					<input value={settings.rules.startingCards} type="number" onChange={e => setRules(x => ({ ...x, startingCards: +e.target.value }))} />
				</div>
				<div className={styles.rule}>
					<p>Unannounced 1 Card Penalty</p>
					<input value={settings.rules.unrealPenalty} type="number" onChange={e => setRules(x => ({ ...x, unrealPenalty: +e.target.value }))} />
				</div>
			</div>
			<div className={styles.rules}>
				<h3>Room Settings</h3>
				<div className={styles.rule}>
					Unlisted <input type="checkbox" checked={settings.unlisted} onChange={e => setSettings(x => ({ ...x, lateJoins: e.target.checked }))} />
				</div>
				<div className={styles.rule}>
					Allow joining during gameplay? <input type="checkbox" checked={settings.lateJoins} onChange={e => setSettings(x => ({ ...x, lateJoins: e.target.checked }))} />
				</div>
				<div className={styles.rule}>
					Max Players <input type="number" value={settings.max} onChange={e => setSettings(x => ({ ...x, max: +e.target.value }))} />
				</div>
			</div>
		</>
	);
};
