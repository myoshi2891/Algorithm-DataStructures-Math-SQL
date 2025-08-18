// 以下のコードは、

// * **動的計画法 (DP)** を使って `n` 段の階段を上る方法の総数を計算
// * `fs` モジュールで標準入力から値を取得
// * Node.js (v16.17.1) で動作
// * 処理時間とメモリ使用量を考慮し、配列を最小限で使用

// です。

// ```javascript
// Node.js v16.17.1
// fsモジュールを利用して標準入力から読み込み
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);

// --- パラメーター ---
// n: 階段の段数
// a, b, c: 1回で上がれる段数
const [n, a, b, c] = input;

/**
 * n段の階段を上る方法の数を計算
 * @param {number} n - 階段の段数 (1 <= n <= 30)
 * @param {number} a - 1回で上がれる段数その1
 * @param {number} b - 1回で上がれる段数その2
 * @param {number} c - 1回で上がれる段数その3
 * @returns {number} 上る方法の総数
 */
function countWays(n, a, b, c) {
    // メモリ効率のために長さ n+1 の配列のみ使用
    const dp = Array(n + 1).fill(0);
    dp[0] = 1; // 段数0の場合、何もしない1通り
    
    // i 段目までの方法数を計算
    for (let i = 1; i <= n; i++) {
        if (i - a >= 0) dp[i] += dp[i - a];
        if (i - b >= 0) dp[i] += dp[i - b];
        if (i - c >= 0) dp[i] += dp[i - c];
    }
    return dp[n];
}

// 計測開始
const startTime = process.hrtime.bigint();
const startMem = process.memoryUsage().rss;

// 計算
const result = countWays(n, a, b, c);

// 計測終了
const endTime = process.hrtime.bigint();
const endMem = process.memoryUsage().rss;

// 出力（問題仕様に合わせて結果のみ、改行付き）
console.log(result);

// 処理時間とメモリ使用量を出力（参考）
console.error(`処理時間: ${(Number(endTime - startTime) / 1e6).toFixed(3)} ms`);
console.error(`メモリ使用量: ${(endMem - startMem)} bytes`);
// ```

// ---

// ### アルゴリズム概要

// 1. **`dp[i]`** = `i` 段まで上る方法の数
// 2. 初期値: `dp[0] = 1`
// 3. 各 `i` に対し、

//    * `i - a >= 0` なら `dp[i] += dp[i - a]`
//    * `i - b >= 0` なら `dp[i] += dp[i - b]`
//    * `i - c >= 0` なら `dp[i] += dp[i - c]`
// 4. 最終的に `dp[n]` が答え

// ---

// この方法は **O(n)** 時間・**O(n)** メモリで、
// `n` が最大 30 なので非常に高速かつ省メモリです。

// もし希望なら、この処理を**O(1)メモリ**に最適化したバージョンも作れます。
// 作りますか？
