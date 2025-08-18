// 了解です。
// 前回の **O(n) メモリ** の DP を、**O(1) メモリ（環状バッファ）** に最適化した JavaScript 実装を提示します。
// `n` 段に到達するためには、最大で `max(a,b,c)` 段前の値しか参照しないため、
// その分だけの配列（最大7要素）を再利用すれば十分です。

// ---

// ```javascript
// Node.js v16.17.1
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const [n, a, b, c] = input;

/**
 * n段の階段を、1回で a 段, b 段, c 段 上れる場合の方法数を O(1) メモリで計算
 * @param {number} n - 階段の段数 (1 <= n <= 30)
 * @param {number} a - 1回で上がれる段数その1
 * @param {number} b - 1回で上がれる段数その2
 * @param {number} c - 1回で上がれる段数その3
 * @returns {number} n段の階段を上る方法の数
 */
function countWaysOptimized(n, a, b, c) {
    const M = Math.max(a, b, c); // 必要なバッファサイズ
    const dp = Array(M).fill(0);
    dp[0] = 1; // dp[0] = 1通り

    for (let i = 1; i <= n; i++) {
        let ways = 0;
        if (i - a >= 0) ways += dp[(i - a) % M];
        if (i - b >= 0) ways += dp[(i - b) % M];
        if (i - c >= 0) ways += dp[(i - c) % M];
        dp[i % M] = ways;
    }
    return dp[n % M];
}

// 計測開始
const startTime = process.hrtime.bigint();
const startMem = process.memoryUsage().rss;

// 計算
const result = countWaysOptimized(n, a, b, c);

// 計測終了
const endTime = process.hrtime.bigint();
const endMem = process.memoryUsage().rss;

// 結果（stdout）
console.log(result);

// 計測情報（stderr）
console.error(`処理時間: ${(Number(endTime - startTime) / 1e6).toFixed(3)} ms`);
console.error(`メモリ使用量: ${endMem - startMem} bytes`);
// ```

// ---

// ## 最適化のポイント

// 1. **配列長 = `max(a,b,c)`** に制限
//    → `i` 段を計算する時に必要なのは、最大でも `max(a,b,c)` 段前の情報だけ。
// 2. **環状バッファ**で古い値を上書き

//    * インデックスは `i % M` で管理。
// 3. **メモリ使用量は定数**

//    * 最大 7 要素しか保持しないので、`O(1)` メモリ。

// ---

// この実装なら、

// * 時間計算量は **O(n)**（前回と同じ）
// * メモリ計算量は **O(1)**（配列長 最大 7）
//   になります。

// もし必要であれば、この **O(1) メモリ版** の動きを
// 図解して解説することもできます。
// やりますか？
