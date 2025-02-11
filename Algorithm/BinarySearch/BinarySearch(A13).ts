function countPairs(N: number, K: number, A: number[]): number {
	let count = 0;

	// 二分探索を行う関数
	function upperBound(arr: number[], left: number, value: number): number {
		let right = arr.length;
		while (left < right) {
			let mid = Math.floor((left + right) / 2);
			if (arr[mid] <= value) left = mid + 1;
			else right = mid;
		}
		return left;
	}

	// 各 A[i] に対し、差が K 以下のペアを数える
	for (let i = 0; i < N; i++) {
		let j = upperBound(A, i + 1, A[i] + K); // A[i] + K 以下の最大インデックス
		count += j - (i + 1); // i 以降の要素で A[i] との差が K 以下の個数
	}

	return count;
}

// 標準入力の処理
const input = require("fs")
	.readFileSync("/dev/stdin", "utf8")
	.trim()
	.split("\n");
const [N, K] = input[0].split(" ").map(Number);
const A = input[1].split(" ").map(Number);

// 結果を出力
console.log(countPairs(N, K, A));
