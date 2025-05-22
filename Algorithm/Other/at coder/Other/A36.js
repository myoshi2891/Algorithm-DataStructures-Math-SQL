function main(input) {
	const [N, K] = input.trim().split(" ").map(Number);
	const minSteps = 2 * (N - 1);

	if (K >= minSteps && (K - minSteps) % 2 === 0) {
		console.log("Yes");
	} else {
		console.log("No");
	}
}

// 以下はNode.jsでの標準入力処理
require("readline")
	.createInterface({
		input: process.stdin,
	})
	.on("line", (line) => {
		main(line);
	});
