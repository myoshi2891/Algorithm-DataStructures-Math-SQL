const fs = require("fs");
let input = fs.readFileSync("/dev/stdin", "utf-8").trim();
let [NX, arr] = input.split("\n");
const [N, X] = NX.split(" ");
let array = arr.split(" ");

function findElementIndex(A, X) {
	let left = 0;
	let right = A.length - 1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);

		if (A[mid] === X) {
			return mid + 1; // 配列のインデックスは0始まりなので1加える
		} else if (A[mid] < X) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return -1; // この場合、Xが配列内に必ず存在するため、ここに到達しない
}

const result = findElementIndex(array, X);
console.log(result);

// 入力例
// const A = [1, 3, 5, 7, 9, 11, 13];
// const X = 7;
