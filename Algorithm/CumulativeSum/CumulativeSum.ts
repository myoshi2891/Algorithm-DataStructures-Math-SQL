import * as fs from "fs";

function solveFromInput(input: string): string {
	const lines = input.trim().split("\n");
	const [N, Q] = lines[0].split(" ").map(Number);
	const A = lines[1].split(" ").map(Number);
	const queries = lines.slice(2).map((line) => line.split(" ").map(Number));

	// 累積和を計算
	const S: number[] = Array(N + 1).fill(0);
	for (let i = 1; i <= N; i++) {
		S[i] = S[i - 1] + A[i - 1];
	}

	// 各質問に答える
	const results: number[] = [];
	for (const [L, R] of queries) {
		results.push(S[R] - S[L - 1]);
	}

	// 結果を改行区切りで返す
	return results.join("\n");
}

// 標準入力からデータを読み込む
const input = fs.readFileSync("/dev/stdin", "utf8");
const output = solveFromInput(input);
console.log(output);
