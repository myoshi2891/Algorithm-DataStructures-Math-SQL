const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

function main(input) {
	const lines = input.trim().split("\n");
	const [N, M, B] = lines[0].split(" ").map(Number);
	const A = lines[1].split(" ").map(Number);
	const C = lines[2].split(" ").map(Number);

	const sumA = A.reduce((acc, val) => acc + val, 0);
	const sumC = C.reduce((acc, val) => acc + val, 0);

	const totalTime = N * M * B + M * sumA + N * sumC;
	return console.log(totalTime);
}

main(input);
