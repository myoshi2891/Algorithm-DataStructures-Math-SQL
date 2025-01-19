function binarySearch(N: number, X: number, A: number[]): number {
	let left = 0;
	let right = N - 1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		if (A[mid] === X) {
			return mid + 1; // 配列の1始まりインデックスを返す
		} else if (A[mid] < X) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return -1; // 問題文よりXは必ず存在するため、この場合には到達しない
}

// 入力処理
const fs = require("fs");
let input = fs.readFileSync("/dev/stdin", "utf-8").trim();

const lines = input.split("\n");
const [N, X] = lines[0].split(" ").map(Number);
const A = lines[1].split(" ").map(Number);

// 二分探索を実行
const result = binarySearch(N, X, A);

// 結果を出力
console.log(result);
