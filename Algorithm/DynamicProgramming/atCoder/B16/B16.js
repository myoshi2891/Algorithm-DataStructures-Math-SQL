// 以下に、指定された条件（Node.js 18.16.1、`fs` モジュール使用、実行時間・メモリ効率重視）に従って、**カエルの最小コストジャンプ問題**をJavaScriptで解いた実装を示します。

// ---

// ## ✅ アルゴリズム概要（動的計画法DP）

// * `dp[i]`: 足場 `i` に到達するための最小コスト。
// * 遷移式：

//   * `dp[i] = min(dp[i-1] + abs(h[i] - h[i-1]), dp[i-2] + abs(h[i] - h[i-2]))`
// * 初期値：

//   * `dp[0] = 0`
//   * `dp[1] = abs(h[1] - h[0])`

// ---

// ## ✅ JavaScript (Node.js) 実装（`fs` 使用）

// ```javascript
// const fs = require('fs');

// function main(input) {
//   const lines = input.trim().split('\n');
//   const N = parseInt(lines[0], 10);
//   const h = lines[1].split(' ').map(Number);

//   const dp = new Array(N).fill(0);
//   dp[0] = 0;
//   dp[1] = Math.abs(h[1] - h[0]);

//   for (let i = 2; i < N; i++) {
//     dp[i] = Math.min(
//       dp[i - 1] + Math.abs(h[i] - h[i - 1]),
//       dp[i - 2] + Math.abs(h[i] - h[i - 2])
//     );
//   }

//   console.log(dp[N - 1]);
// }

// // 標準入力から読み込む
// main(fs.readFileSync('/dev/stdin', 'utf8'));
// ```

// ---

// ## ✅ 計算量・メモリ使用量

// * **時間計算量**: `O(N)`（1回ずつループ）
// * **空間計算量**: `O(N)`（DP配列1本）

//   * さらに最適化すれば `O(1)` でも可能（直近2要素のみ使用）

// ---

// ## ✅ 最適化バージョン（メモリ `O(1)`）

// ```javascript
const fs = require('fs');

function main(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0], 10);
    const h = lines[1].split(' ').map(Number);

    let prev2 = 0; // dp[i-2]
    let prev1 = Math.abs(h[1] - h[0]); // dp[i-1]

    for (let i = 2; i < N; i++) {
        const curr = Math.min(prev1 + Math.abs(h[i] - h[i - 1]), prev2 + Math.abs(h[i] - h[i - 2]));
        prev2 = prev1;
        prev1 = curr;
    }

    console.log(prev1);
}

main(fs.readFileSync('/dev/stdin', 'utf8'));

// ## ✅ 入出力例テスト（例1）

// ```
// 入力:
// 4
// 10 30 40 20

// 出力:
// 30
// ```
