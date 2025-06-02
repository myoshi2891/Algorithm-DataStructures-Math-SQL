const fs = require("fs");

function main(input) {
	const lines = input.trim().split("\n");
	const [N, Q] = lines[0].split(" ").map(Number);
	const A = Array.from({ length: N }, (_, i) => i + 1);

	let reversed = false;
	const output = [];

	for (let i = 1; i <= Q; i++) {
		const query = lines[i].split(" ").map(Number);
		if (query[0] === 1) {
			// 更新: 1 x y
			let x = query[1] - 1;
			let y = query[2];
			if (reversed) x = N - 1 - x;
			A[x] = y;
		} else if (query[0] === 2) {
			// 反転: toggle the flag
			reversed = !reversed;
		} else if (query[0] === 3) {
			// 取得: 3 x
			let x = query[1] - 1;
			if (reversed) x = N - 1 - x;
			output.push(A[x]);
		}
	}

	console.log(output.join("\n"));
}

main(fs.readFileSync("/dev/stdin", "utf8"));
