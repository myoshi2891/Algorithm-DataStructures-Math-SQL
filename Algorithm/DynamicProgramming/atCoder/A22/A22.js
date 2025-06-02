const fs = require("fs");

// 標準入力からの読み取り
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");

const N = Number(input[0]);
const A = input[1].split(" ").map(Number);
const B = input[2].split(" ").map(Number);

// dp[i]: マス i に到達する最大スコア（1-indexed）
const dp = new Array(N + 1).fill(-Infinity);
dp[1] = 0; // スタート地点はスコア0

for (let i = 1; i < N; i++) {
	if (dp[i] === -Infinity) continue; // 到達不可能ならスキップ

	// 遷移1：マス A[i - 1] に +100 で進む
	dp[A[i - 1]] = Math.max(dp[A[i - 1]], dp[i] + 100);

	// 遷移2：マス B[i - 1] に +150 で進む
	dp[B[i - 1]] = Math.max(dp[B[i - 1]], dp[i] + 150);
}

// 最終マスに到達する最大スコアを出力
console.log(dp[N]);
