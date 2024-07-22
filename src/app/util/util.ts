export const randomGaussian = (mean: number, stdDev: number) => {
	const u = 1 - Math.random();
	const v = Math.random();
	const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	return z * stdDev + mean;
};
export const requiredVotekickCount = (playerCount: number) => playerCount < 3 ? 2 : Math.ceil(playerCount / 2);
export const getPlayerAngle = (playerCount: number, n: number) => {
	if (playerCount <= 2) return 90;
	if (playerCount === 3) return (180 / 3) * (n + 1); 
	return 180 / (playerCount - 2) * n;
}
export const getPlayerRadian = (playerCount: number, n: number) => {
	return (getPlayerAngle(playerCount, n) * Math.PI) / 180;
}