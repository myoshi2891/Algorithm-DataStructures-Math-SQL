const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

const lines = input.split("\n");

const [N, S] = lines[0].split(" ").map(Number);
const A = lines[1].split(" ").map(Number);

function subsetSumBitset(N, S, A) {
	let possible = 1n; // ビットセットを整数で管理 (BigInt)

	for (let i = 0; i < N; i++) {
		possible |= possible << BigInt(A[i]); // 新しい和を追加
	}

	return (possible & (1n << BigInt(S))) !== 0n ? "Yes" : "No";
}

console.log(subsetSumBitset(N, S, A));
