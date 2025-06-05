const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

let input = [];

rl.on("line", (line) => input.push(line.trim())).on("close", () => {
	const T = parseInt(input[0]);
	const ops = input.slice(1).map((l) => l.split(" ").map((x) => x - 1));
	const X = new Int8Array(20);
	let zeroCount = 20;
	const res = [];

	for (let i = 0; i < T; i++) {
		const [p, q, r] = ops[i];

		let gainA = 0,
			gainB = 0;
		for (const idx of [p, q, r]) {
			if (X[idx] === 0) gainA--;
			if (X[idx] + 1 === 0) gainA++;
			if (X[idx] === 0) gainB--;
			if (X[idx] - 1 === 0) gainB++;
		}

		if (zeroCount + gainA >= zeroCount + gainB) {
			res.push("A");
			for (const i of [p, q, r]) {
				if (X[i] === 0) zeroCount--;
				X[i]++;
				if (X[i] === 0) zeroCount++;
			}
		} else {
			res.push("B");
			for (const i of [p, q, r]) {
				if (X[i] === 0) zeroCount--;
				X[i]--;
				if (X[i] === 0) zeroCount++;
			}
		}
	}

	console.log(res.join("\n"));
});
