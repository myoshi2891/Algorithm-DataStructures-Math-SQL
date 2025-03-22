const fs = require("fs");

function insertionSort(A, n, h) {
	let num_of_move = 0;

	for (let i = h; i < n; i++) {
		let x = A[i];
		let j = i - h;

		while (j >= 0 && A[j] > x) {
			A[j + h] = A[j];
			j -= h;
			num_of_move++;
		}

		A[j + h] = x;
	}

	console.log(num_of_move);
}

function shellSort(A, n, H) {
	for (let h of H) {
		insertionSort(A, n, h);
	}
}

function main(input) {
	let lines = input.trim().split("\n");
	let n = parseInt(lines[0]);
	let A = lines[1].split(" ").map(Number);
	let k = parseInt(lines[2]);
	let H = lines[3].split(" ").map(Number);

	shellSort(A, n, H);
}

// 標準入力から読み込む
const input = fs.readFileSync("/dev/stdin", "utf8");
main(input);
