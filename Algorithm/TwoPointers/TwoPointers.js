const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

let [NK, numbers] = input.split("\n");
const [N, K] = NK.split(" ").map(Number);
A = numbers.split(" ").map(Number);

function countPairsTwoPointers(N, K, A) {
	let count = 0;
	let j = 0;

	for (let i = 0; i < N; i++) {
		while (j < N && A[j] - A[i] <= K) {
			j++;
		}
		count += j - i - 1;
	}

	console.log(count);
}

countPairsTwoPointers(N, K, A);
