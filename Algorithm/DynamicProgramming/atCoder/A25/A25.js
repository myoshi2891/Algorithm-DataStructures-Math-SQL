function main(input) {
	const lines = input.trim().split("\n");
	const [H, W] = lines[0].split(" ").map(Number);
	const grid = lines.slice(1).map((line) => line.trim());

	// 初期化: DP配列を0で埋める
	const dp = Array.from({ length: H }, () => Array(W).fill(0));

	// スタート地点が白なら1通り
	if (grid[0][0] === ".") {
		dp[0][0] = 1;
	}

	for (let i = 0; i < H; i++) {
		for (let j = 0; j < W; j++) {
			if (grid[i][j] === "#") continue; // 黒マスはスキップ

			// 上から来る
			if (i > 0) {
				dp[i][j] += dp[i - 1][j];
			}

			// 左から来る
			if (j > 0) {
				dp[i][j] += dp[i][j - 1];
			}
		}
	}

	// ゴール地点の通り数を出力
	console.log(dp[H - 1][W - 1]);
}

const fs = require("fs");
main(fs.readFileSync("/dev/stdin", "utf8"));
