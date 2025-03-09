// 標準入力を受け取るための設定（Node.js環境を想定）
import * as fs from "fs";

// 入力データの取得
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");

// 最初の行でH, W, Nを取得
const [H, W, N] = input[0].split(" ").map(Number);

// 差分配列を (H+2) x (W+2) のサイズで初期化
const diff: number[][] = Array.from({ length: H + 2 }, () =>
	Array(W + 2).fill(0)
);

// 各日の積雪データを差分配列に反映
for (let i = 1; i <= N; i++) {
	const [A, B, C, D] = input[i].split(" ").map(Number);

	diff[A][B] += 1;
	diff[C + 1][B] -= 1;
	diff[A][D + 1] -= 1;
	diff[C + 1][D + 1] += 1;
}

// 横方向の累積和を計算
for (let i = 1; i <= H; i++) {
	for (let j = 1; j <= W; j++) {
		diff[i][j] += diff[i][j - 1];
	}
}

// 縦方向の累積和を計算
for (let j = 1; j <= W; j++) {
	for (let i = 1; i <= H; i++) {
		diff[i][j] += diff[i - 1][j];
	}
}

// 最終的な積雪量を出力
const result: string[] = [];
for (let i = 1; i <= H; i++) {
	result.push(diff[i].slice(1, W + 1).join(" "));
}

console.log(result.join("\n"));
