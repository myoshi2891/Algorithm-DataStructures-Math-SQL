const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf8");

function main(input) {
	const [line1, line2] = input.trim().split("\n");
	const [N, target] = line1.split(" ");
	const colors = line2.trim().split("");

	// 2色を合成した結果を表すマップ
	const combine = {
		WW: "W",
		BB: "R",
		RR: "B",
		WB: "B",
		BW: "B",
		BR: "W",
		RB: "W",
		RW: "R",
		WR: "R",
	};

	// カードを左から順に1枚ずつ合成していく
	let current = colors[0];
	for (let i = 1; i < colors.length; i++) {
		const pair = current + colors[i];
		current = combine[pair];
	}

	console.log(current === target ? "Yes" : "No");
}

main(input);
