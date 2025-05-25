// 標準入力の読み取り（Node.js用）
const fs = require("fs");
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split("\n");

const N = parseInt(input[0]);
const movies = [];

// 映画の時間範囲を配列に格納
for (let i = 1; i <= N; i++) {
	const [L, R] = input[i].split(" ").map(Number);
	movies.push({ start: L, end: R });
}

// 映画を終了時間の昇順でソート
movies.sort((a, b) => a.end - b.end);

let count = 0;
let currentTime = 0;

for (const movie of movies) {
	if (movie.start >= currentTime) {
		count++;
		currentTime = movie.end;
	}
}

console.log(count);
