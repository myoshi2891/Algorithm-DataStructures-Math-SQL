const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

const lines = input.split("\n");

const [N, S] = lines[0].split(" ").map(Number);
const A = lines[1].split(" ").map(Number);

function subsetSumExists(N, S, A) {
	let dp = Array.from({ length: N + 1 }, () => Array(S + 1).fill(false));
	dp[0][0] = true; // 何も選ばない場合、合計 0 は作れる

	for (let i = 0; i < N; i++) {
		for (let j = 0; j <= S; j++) {
			if (dp[i][j]) {
				dp[i + 1][j] = true; // i番目のカードを選ばない場合
				if (j + A[i] <= S) {
					dp[i + 1][j + A[i]] = true; // i番目のカードを選ぶ場合
				}
			}
		}
	}

	console.log(dp[N][S] ? "Yes" : "No");
}

subsetSumExists(N, S, A);
