// 先ほどの **りんごの最小購入金額問題** を **Node.js (v16.17.1)** で実装します。

// 条件として

// * **標準入力から fs を利用して値を取得**
// * **処理時間・メモリ消費を意識**
// * **関数化してパラメータと返却値をコメントで明示**
//   を反映します。

// ---

// ## 実装（JavaScript / Node.js v16.17.1）

// ```javascript
'use strict';

const fs = require('fs');

/**
 * n: 必要なりんごの個数
 * x: x個入りセットのりんご
 * a: x個入りセットの価格
 * y: y個入りセットのりんご
 * b: y個入りセットの価格
 * z: z個入りセットのりんご
 * c: z個入りセットの価格
 *
 * @returns {number} n個以上のりんごを買うのに必要な最小金額
 */
function minCost(n, x, a, y, b, z, c) {
    const INF = Number.MAX_SAFE_INTEGER;
    const maxApples = n + Math.max(x, y, z); // n以上をカバーする範囲
    const dp = new Array(maxApples + 1).fill(INF);
    dp[0] = 0;

    // 動的計画法による最小コスト更新
    for (let i = 0; i <= maxApples; i++) {
        if (dp[i] === INF) continue;
        if (i + x <= maxApples) dp[i + x] = Math.min(dp[i + x], dp[i] + a);
        if (i + y <= maxApples) dp[i + y] = Math.min(dp[i + y], dp[i] + b);
        if (i + z <= maxApples) dp[i + z] = Math.min(dp[i + z], dp[i] + c);
    }

    // n個以上の最小コスト
    let ans = INF;
    for (let i = n; i <= maxApples; i++) {
        if (dp[i] < ans) ans = dp[i];
    }
    return ans;
}

// ---------- メイン処理 ----------
(function main() {
    const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
    const [n, x, a, y, b, z, c] = input;
    const result = minCost(n, x, a, y, b, z, c);

    console.log(result);

    // 処理時間とメモリ使用量を出力（※問題の答えには含めずコメントとして記録）
    const usage = process.memoryUsage();
    // console.error(`Time: ${process.uptime().toFixed(3)}s, RSS: ${(usage.rss / 1024 / 1024).toFixed(2)}MB`);
})();
// ```

// ---

// ## 計算量とメモリ

// * **時間計算量**: `O(n * 3)` → 最大で約 3000 ステップ
// * **メモリ使用量**: `O(n + max(x,y,z))` → 高々 2001 要素程度 (数KB)
// * `process.memoryUsage()` と `process.uptime()` を使えば計測可能（今回はコメント扱い）

// ---

// ✅ 出力は **必要な金額のみ（末尾改行あり）**
// ✅ `fs.readFileSync(0, "utf8")` で標準入力を処理

// ---
