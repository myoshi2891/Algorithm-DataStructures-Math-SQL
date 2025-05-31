const fs = require("fs");

// 標準入力からの読み取り
const input = fs.readFileSync(0, "utf8").trim().split("\n");
const n = parseInt(input[0]);
const A = input[1].split(" ").map(Number);

let count = 0;

function quick_sort(A, left, right) {
	if (left + 1 >= right) return;

	const pivot = A[right - 1];
	let cur_index = left;

	for (let i = left; i <= right - 2; i++) {
		if (A[i] < pivot) {
			[A[cur_index], A[i]] = [A[i], A[cur_index]];
			cur_index++;
			count++;
		}
	}

	[A[cur_index], A[right - 1]] = [A[right - 1], A[cur_index]];

	quick_sort(A, left, cur_index);
	quick_sort(A, cur_index + 1, right);
}

// クイックソートを実行
quick_sort(A, 0, n);

// 結果の出力
console.log(A.join(" "));
console.log(count);
