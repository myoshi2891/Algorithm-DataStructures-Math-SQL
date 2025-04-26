// 標準入力から値を読み込むために、Node.jsの readline モジュールを使用
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// GCD（最大公約数）を求める関数（ユークリッドの互除法）
function gcd(a, b) {
	while (b !== 0) {
		let temp = b;
		b = a % b;
		a = temp;
	}
	return a;
}

// 入力処理
rl.on("line", (line) => {
	const [A, B] = line.split(" ").map(Number);
	console.log(gcd(A, B));
	rl.close();
});
