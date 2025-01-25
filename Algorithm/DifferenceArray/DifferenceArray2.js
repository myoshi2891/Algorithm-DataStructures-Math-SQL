// コード長	412 Byte
// 実行時間	393 ms
// メモリ	75676 KB
const fs = require("fs");

const input = fs.readFileSync("/dev/stdin", "utf-8").trim();

let [D, N, ...rest] = input.split("\n");

let arr = new Array(+D + 1).fill(0);

rest.map((row) => {
	const [L, R] = row.split(" ").map(Number);
	arr[L] += 1;
	if (R + 1 <= +D) {
		arr[R + 1] -= 1;
	}
});

let sum = 0;
arr = arr.map((a) => (sum += a));
arr.shift();
arr.map((a) => console.log(a));
