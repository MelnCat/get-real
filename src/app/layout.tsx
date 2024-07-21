import { GameHandler } from "@/components/GameHandler";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "react-loading-skeleton/dist/skeleton.css";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Get Real - The card game",
	description: "Generic play cards until you reach 0 game",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Script src="https://cdn.jsdelivr.net/npm/container-query-polyfill@0.2.4/dist/container-query-polyfill.modern.js" />
			<body className={inter.className}>
				<GameHandler>{children}</GameHandler>
			</body>
		</html>
	);
}
