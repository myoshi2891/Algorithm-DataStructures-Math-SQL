// 標準入力を受け取るための設定
const fs = require("fs");

function main(input) {
	const N = BigInt(input.trim());

	// Inclusion-Exclusion 原理を使って解く
	const countDivBy = (x) => N / BigInt(x);
	const count = countDivBy(3) + countDivBy(5) - countDivBy(15);

	console.log(count.toString());
}

// ファイルから標準入力を読む（AtCoderなどのオンラインジャッジ向け）
main(fs.readFileSync("/dev/stdin", "utf8"));
