const fs = require("fs");

// 標準入力を読み込み（Node.js向け）
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");

const Q = parseInt(input[0]);
const queries = input.slice(1).map(Number);

// ===== エラトステネスの篩 =====
const MAX = 300000;
const is_prime = new Array(MAX + 1).fill(true);
is_prime[0] = is_prime[1] = false;

for (let i = 2; i * i <= MAX; i++) {
	if (is_prime[i]) {
		for (let j = i * i; j <= MAX; j += i) {
			is_prime[j] = false;
		}
	}
}

// ===== 質問に答える =====
for (let i = 0; i < Q; i++) {
	const x = queries[i];
	console.log(is_prime[x] ? "Yes" : "No");
}

// const fs = require("fs");
// let [num, ...targetNum] = fs
// 	.readFileSync("/dev/stdin", "utf8")
// 	.trim()
// 	.split("\n")
// 	.map(Number);

// function isPrime(n) {
// 	if (n < 2) return false;
// 	if (n === 2) return true;
// 	if (n % 2 === 0) return false;

// 	for (let i = 3; i * i <= n; i += 2) {
// 		if (n % i === 0) return false;
// 	}
// 	return true;
// }

// targetNum.map((n) => (isPrime(n) ? console.log("Yes") : console.log("No")));