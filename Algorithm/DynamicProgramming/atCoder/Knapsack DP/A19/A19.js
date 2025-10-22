// const fs = require("fs");

// let [NW, ...jewels] = fs.readFileSync("/dev/stdin", "utf-8").trim().split("\n");

// const [num, maximum] = NW.split(" ").map(Number);
// jewels = jewels.map((j) => j.split(" ").map(Number));
// jewels.sort((a, b) => {
// 	if (b[1] !== a[1]) {
// 		return b[1] - a[1];
// 	} else {
// 		return b[0] - a[0];
// 	}
// });

// function knapsack(input) {
// 	cache = new Array(maximum + 1).fill(0);
// 	for (let i = 0; i < num; i++) {
// 		for (let w = maximum; w >= input[i][0]; w--) {
// 			cache[w] = Math.max(cache[w], cache[w - input[i][0]] + input[i][1]);
// 		}
// 	}

// 	return Math.max(...cache);
// }
// console.log(knapsack(jewels));

const fs = require('fs');

function knapsack(input) {
    const lines = input.trim().split('\n');
    const [N, W] = lines[0].split(' ').map(Number);
    const items = lines.slice(1).map((line) => line.split(' ').map(Number));

    // DPテーブルを初期化
    const dp = new Array(W + 1).fill(0);

    // 各アイテムについてDPテーブルを更新
    for (let i = 0; i < N; i++) {
        const [weight, value] = items[i];
        for (let w = W; w >= weight; w--) {
            dp[w] = Math.max(dp[w], dp[w - weight] + value);
        }
    }

    // 最大価値を出力
    console.log(Math.max(...dp));
}

// 標準入力から読み込む
const input = fs.readFileSync('/dev/stdin', 'utf8');
knapsack(input);
