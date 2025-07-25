// 標準入力を受け取る
const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf8").trim().split(/\s+/);
const N = parseInt(input[0]);
const A = input.slice(1).map(Number);

let xorSum = 0;
for (let i = 0; i < N; i++) {
	xorSum ^= A[i];
}

console.log(xorSum === 0 ? "Second" : "First");
