function minTimeToReachN(N: number, A: number[], B: number[]): number {
	// dp[i] は部屋 i+1 に到達するまでの最短時間
	const dp: number[] = new Array(N).fill(Infinity);
	dp[0] = 0; // 部屋 1 からの開始なので時間は 0

	for (let i = 1; i < N; i++) {
		// 1つ前の部屋から移動
		dp[i] = Math.min(dp[i], dp[i - 1] + A[i - 1]);

		// 2つ前の部屋から移動（可能な場合のみ）
		if (i > 1) {
			dp[i] = Math.min(dp[i], dp[i - 2] + B[i - 2]);
		}
	}

	return dp[N - 1];
}

const input: string[] = require("fs")
	.readFileSync("/dev/stdin", "utf8")
	.trim()
	.split("\n");

const N: number = Number(input[0]);
const A: number[] = input[1].split(" ").map(Number);
const B: number[] = input.length > 2 ? input[2].split(" ").map(Number) : [];

console.log(minTimeToReachN(N, A, B));
