import * as fs from "fs";

function solveEventAttendance(input: string): string {
	const lines = input.trim().split("\n");
	const D: number = Number(lines[0]);
	const N: number = Number(lines[1]);
	const diff = Array(+D + 2).fill(0);

	// 差分配列を更新
	for (let i = 0; i < N; i++) {
		const [L, R] = lines[i + 2].split(" ").map(Number);
		diff[L] += 1;
		if (R + 1 <= +D) {
			diff[R + 1] -= 1;
		}
	}

	// 差分配列から累積和を計算
	const attendance = Array(D).fill(0);
	attendance[0] = diff[1]; // 初日の値
	for (let i = 2; i <= D; i++) {
		attendance[i - 1] = attendance[i - 2] + diff[i];
	}

	// 出力を改行区切りで結合
	return attendance.join("\n");
}

// 標準入力からデータを読み込む
const input = fs.readFileSync("/dev/stdin", "utf8");
const output = solveEventAttendance(input);
console.log(output);
