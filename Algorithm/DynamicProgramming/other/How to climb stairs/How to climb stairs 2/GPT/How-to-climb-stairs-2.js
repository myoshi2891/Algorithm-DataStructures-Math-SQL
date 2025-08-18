// 以下のコードでは、DP（動的計画法）を使って n 段の階段を 1 歩 a 段または b 段で上る方法の数を求めます。
// 処理時間は **O(n)**、メモリ使用量は **O(n)** で、Node.js v16.17.1 の標準入力(fs)を利用しています。

// ```javascript
// Node.js v16.17.1
const fs = require("fs");

/**
 * 階段の上り方の総数を求める関数
 * @param {number} n - 階段の段数
 * @param {number} a - 1歩で上がる段数の選択肢1
 * @param {number} b - 1歩で上がる段数の選択肢2
 * @returns {number} - n段を上る方法の総数
 */
function countWays(n, a, b) {
    // dp[i] = i 段目に到達する方法の数
    const dp = Array(n + 1).fill(0);
    dp[0] = 1; // 0段目は1通り（何もしない）

    for (let i = 1; i <= n; i++) {
        if (i - a >= 0) dp[i] += dp[i - a];
        if (i - b >= 0) dp[i] += dp[i - b];
    }
    return dp[n];
}

// 入力処理
const input = fs.readFileSync("/dev/stdin", "utf8").trim().split(" ").map(Number);
const [n, a, b] = input;

// 計測開始
const startTime = process.hrtime.bigint();
const startMemory = process.memoryUsage().heapUsed;

const result = countWays(n, a, b);

const endTime = process.hrtime.bigint();
const endMemory = process.memoryUsage().heapUsed;

// 出力
console.log(result);

// 処理時間・メモリ使用量の計測結果（標準出力には含めない）
fs.writeFileSync(
    "/dev/stderr",
    `処理時間: ${(endTime - startTime) / 1000000n} ms\n` +
    `メモリ使用量: ${(endMemory - startMemory) / 1024} KB\n`
);
// ```

// ---

// ### アルゴリズム概要

// 1. **DP配列の定義**
//    `dp[i]` を「i 段目に到達する方法の数」とする。
// 2. **初期化**
//    `dp[0] = 1`（0段目は何もしない1通り）
// 3. **遷移式**

//    ```
//    dp[i] = dp[i - a] + dp[i - b] （ただし i-a >= 0, i-b >= 0 の場合のみ）
//    ```
// 4. **計算量**

//    * 時間計算量: O(n)
//    * 空間計算量: O(n)

// ---

// この方法だと、例えば
// 入力 `11 3 4` の場合は **3** が出力され、
// `4 3 5` の場合は到達できないため **0** になります。

// このエラーは、
// `fs.writeFileSync("/dev/stderr", ...)` が実行されたときに、実行環境で `/dev/stderr` への書き込み権限がないため発生しています。

// つまり、Linux や macOS では `/dev/stderr` に直接書けることもありますが、オンラインジャッジや一部のサンドボックス環境では禁止されているため、**permission denied** になります。

// ---

// ## 原因

// * `fs.writeFileSync("/dev/stderr", ...)` は「ファイルとして stderr に直接書き込み」を行う動作
// * 権限がない環境ではエラーになる
// * 標準エラー出力に出したいだけなら `console.error()` を使うべき

// ---

// ## 修正方法

// ### 修正版コード（stderr 書き込みを console.error に置き換え）

// ```javascript
// // 計測結果は console.error を使って標準エラー出力に送る
// console.error(
//     `処理時間: ${(endTime - startTime) / 1000000n} ms\n` +
//     `メモリ使用量: ${(endMemory - startMemory) / 1024} KB\n`
// );
// ```

// これなら `/dev/stderr` を直接開かないため、権限エラーは発生しません。

// ---

// ### まとめ

// * **原因**: `/dev/stderr` への直接書き込みが許可されていない環境で `fs.writeFileSync` を実行
// * **対策**: `console.error` を使うか、計測情報をファイルではなく標準エラー出力へ直接出す

// ---

// もし希望があれば、私が `console.error` に修正した完全版コードを提示できます。
