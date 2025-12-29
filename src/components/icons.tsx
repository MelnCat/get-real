import React from "react";
const PICKUP_1_SIZE = 34;
const PICKUP_2_SIZE = 58;
const PICKUP_4_SIZE = 21;
const PICKUP_8_SIZE = 18;
const PICKUP_16_SIZE = 13;
const PICKUP_32_SIZE = 9.3;
export const icons = {
	"+1": {
		type: "center",
		size: "45%",
		element: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" fill="currentColor" overflow="visible"></svg>,
		newElement: (
			<>
				<rect x={(200 - 2 * PICKUP_1_SIZE) / 2} y={(300 - PICKUP_1_SIZE * 3) / 2} width={PICKUP_1_SIZE * 2} height={PICKUP_1_SIZE * 3} />
			</>
		),
	},
	"+2": {
		type: "center",
		size: "45%",
		element: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" fill="currentColor" overflow="visible">
				<rect x="100" y="0" width="200" height="300" />
				<rect x="0" y="100" width="200" height="300" />
			</svg>
		),
		newElement: (
			<>
				<rect
					x={(200 - (3 / 2) * PICKUP_2_SIZE) / 2 + PICKUP_2_SIZE / 2}
					y={(300 - ((PICKUP_2_SIZE * 3) / 2 + PICKUP_2_SIZE / 2)) / 2}
					width={PICKUP_2_SIZE}
					height={(PICKUP_2_SIZE * 3) / 2}
				/>
				<rect
					x={(200 - (3 / 2) * PICKUP_2_SIZE) / 2}
					y={(300 - ((PICKUP_2_SIZE * 3) / 2 + PICKUP_2_SIZE / 2)) / 2 + PICKUP_2_SIZE / 2}
					width={PICKUP_2_SIZE}
					height={(PICKUP_2_SIZE * 3) / 2}
				/>
			</>
		),
	},
	"+4": {
		type: "center",
		size: "60%",
		element: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" fill="currentColor" overflow="visible">
				<rect x="300" y="0" width="200" height="300" />
				<rect x="200" y="100" width="200" height="300" />
				<rect x="100" y="200" width="200" height="300" />
				<rect x="0" y="300" width="200" height="300" />
			</svg>
		),
		newElement: (
			<>
				{[...Array(4)].map((_, i) => (
					<rect
						key={i}
						x={(200 - PICKUP_4_SIZE * 5) / 2 + 3 * PICKUP_4_SIZE - PICKUP_4_SIZE * i}
						y={(300 - PICKUP_4_SIZE * 6) / 2 + PICKUP_4_SIZE * i}
						width={PICKUP_4_SIZE * 2}
						height={PICKUP_4_SIZE * 3}
					/>
				))}
			</>
		),
	},
	"+8": {
		type: "center",
		size: "70%",
		element: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" fill="currentColor">
				<rect x="300" y="0" width="200" height="300" />
				<rect x="200" y="100" width="200" height="300" />
				<rect x="100" y="200" width="200" height="300" />
				<rect x="0" y="300" width="200" height="300" />
				<rect x="500" y="100" width="200" height="300" />
				<rect x="400" y="200" width="200" height="300" />
				<rect x="300" y="300" width="200" height="300" />
				<rect x="200" y="400" width="200" height="300" />
			</svg>
		),
		newElement: (
			<>
				{[...Array(2)].map((_, j) =>
					[...Array(4)].map((_, i) => (
						<rect
							key={i}
							x={(200 - PICKUP_8_SIZE) / 2 - PICKUP_8_SIZE * i + PICKUP_8_SIZE * 2 * j}
							y={(300 - PICKUP_8_SIZE * 7) / 2 + PICKUP_8_SIZE * i + PICKUP_8_SIZE * j}
							width={PICKUP_8_SIZE * 2}
							height={PICKUP_8_SIZE * 3}
						/>
					))
				)}
			</>
		),
	},
	"+16": {
		type: "center",
		size: "70%",
		element: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" fill="currentColor"></svg>,
		newElement: (
			<>
				{[...Array(2)].map((_, j) =>
					[...Array(8)].map((_, i) => (
						<rect
							key={i}
							x={(200 + 3 * PICKUP_16_SIZE) / 2 - PICKUP_16_SIZE * i + PICKUP_16_SIZE * 2 * j}
							y={(300 - PICKUP_16_SIZE * (8 + 3)) / 2 + PICKUP_16_SIZE * i + PICKUP_16_SIZE * j}
							width={PICKUP_16_SIZE * 2}
							height={PICKUP_16_SIZE * 3}
						/>
					))
				)}
			</>
		),
	},
	"+32": {
		type: "center",
		size: "70%",
		element: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" fill="currentColor"></svg>,
		newElement: (
			<>
				{[...Array(4)].map((_, j) =>
					[...Array(8)].map((_, i) => (
						<rect
							key={i}
							x={(200 - PICKUP_32_SIZE) / 2 - PICKUP_32_SIZE * i + PICKUP_32_SIZE * 2 * j}
							y={(300 - PICKUP_32_SIZE * (10 + 3)) / 2 + PICKUP_32_SIZE * i + PICKUP_32_SIZE * j}
							width={PICKUP_32_SIZE * 2}
							height={PICKUP_32_SIZE * 3}
						/>
					))
				)}
			</>
		),
	},
	skip: {
		type: "both",
		size: "57%",
		element: (
			// From https://www.svgrepo.com/svg/24968/prohibited-sign
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 415.064 415.064" fill="currentColor">
				<g>
					<path
						d="M354.279,60.785C315.082,21.587,262.967,0,207.532,0C152.098,0,99.982,21.587,60.785,60.785
		C21.588,99.982,0,152.098,0,207.532c0,55.435,21.588,107.55,60.785,146.747c39.197,39.197,91.313,60.785,146.747,60.785
		c55.435,0,107.55-21.588,146.747-60.785c39.198-39.197,60.785-91.312,60.785-146.747
		C415.064,152.098,393.478,99.982,354.279,60.785z M207.532,339.918c-22.863,0-44.391-5.826-63.178-16.072l179.493-179.49
		c10.244,18.787,16.071,40.313,16.071,63.178C339.919,280.53,280.53,339.918,207.532,339.918z M207.532,75.145
		c22.862,0,44.392,5.827,63.178,16.073L91.219,270.711c-10.245-18.787-16.072-40.314-16.072-63.179
		C75.146,134.534,134.534,75.145,207.532,75.145z"
					/>
				</g>
			</svg>
		),
		newElement: (
			<path
				transform="scale(0.24) translate(210, 420)"
				strokeWidth="20"
				d="M354.279,60.785C315.082,21.587,262.967,0,207.532,0C152.098,0,99.982,21.587,60.785,60.785
		C21.588,99.982,0,152.098,0,207.532c0,55.435,21.588,107.55,60.785,146.747c39.197,39.197,91.313,60.785,146.747,60.785
		c55.435,0,107.55-21.588,146.747-60.785c39.198-39.197,60.785-91.312,60.785-146.747
		C415.064,152.098,393.478,99.982,354.279,60.785z M207.532,339.918c-22.863,0-44.391-5.826-63.178-16.072l179.493-179.49
		c10.244,18.787,16.071,40.313,16.071,63.178C339.919,280.53,280.53,339.918,207.532,339.918z M207.532,75.145
		c22.862,0,44.392,5.827,63.178,16.073L91.219,270.711c-10.245-18.787-16.072-40.314-16.072-63.179
		C75.146,134.534,134.534,75.145,207.532,75.145z"
			/>
		),
	},
	reverse: {
		type: "both",
		size: "57%",
		element: (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="currentColor" overflow="visible">
				<path d="M 0 100 L 0 200 L 400 200 L 400 300 L 600 150 L 400 0 L 400 100 L 0 100 Z" />
				<path d="M 0 350 L 0 450 L 400 450 L 400 550 L 600 400 L 400 250 L 400 350 L 0 350 Z" transform="matrix(-1, 0, 0, -1, 600, 800)" />
			</svg>
		),
		newElement: (
			<g transform="scale(0.174) translate(290, 580)">
				<path d="M 0 100 L 0 200 L 400 200 L 400 300 L 600 150 L 400 0 L 400 100 L 0 100 Z" strokeWidth="27" />
				<path d="M 0 350 L 0 450 L 400 450 L 400 550 L 600 400 L 400 250 L 400 350 L 0 350 Z" strokeWidth="27" transform="matrix(-1, 0, 0, -1, 600, 800)" />
			</g>
		),
	},
};
