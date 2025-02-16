const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

const lines = input.split("\n");

const [N, K] = lines[0].split(" ").map(Number);
const printers = lines[1].split(" ").map(Number);

function findPrintTime(N, K, A) {
	let left = 1,
		right = K * Math.min(...A);

	const canPrintKSheets = (T) => {
		let totalSheets = 0;
		for (let i = 0; i < N; i++) {
			totalSheets += Math.floor(T / A[i]);
			if (totalSheets >= K) return true; // K 枚以上印刷できるならOK
		}
		return false;
	};

	while (left < right) {
		let mid = Math.floor((left + right) / 2);
		if (canPrintKSheets(mid)) {
			right = mid; // K 枚以上印刷できるなら、もっと小さい時間を探す
		} else {
			left = mid + 1; // K 枚印刷できないなら、もっと時間が必要
		}
	}

	console.log(left);
}

findPrintTime(N, K, printers);
