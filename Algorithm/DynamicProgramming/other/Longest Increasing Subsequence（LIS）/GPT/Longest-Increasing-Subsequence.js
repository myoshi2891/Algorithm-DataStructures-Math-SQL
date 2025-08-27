// ご要望に沿って、**Node.js (v16.17.1)** + **fs** を使い、処理時間・メモリ効率に注意した実装を提示します。

// この問題は **動的計画法 (DP)** を用いて解きます。

// * `dp[i]` = 人 i を右端とする「背の順区間」の最長長さ。
// * 遷移:

//   * `a[i-1] <= a[i]` のとき `dp[i] = dp[i-1] + 1`
//   * そうでないとき `dp[i] = 1`
// * 最終的に `max(dp)` を出力します。

// ただし、メモリ効率を考慮して `dp` 配列は保持せず、**直前の値だけ保持**します（O(1) メモリ）。

// ---

// ### 実装 (JavaScript, Node.js v16.17.1)

// ```javascript
const fs = require("fs");

/**
 * n人の身長配列から「背の順である区間の最長長さ」を求める
 * @param {number[]} heights - 各人の身長の配列
 * @returns {number} - 最長の背の順区間の長さ
 */
function longestNonDecreasingSubarray(heights) {
    const n = heights.length;
    if (n === 0) return 0;

    let maxLen = 1;    // 最長区間長
    let currentLen = 1; // 現在の区間長

    for (let i = 1; i < n; i++) {
        if (heights[i - 1] <= heights[i]) {
            currentLen += 1;
        } else {
            currentLen = 1;
        }
        if (currentLen > maxLen) {
            maxLen = currentLen;
        }
    }

    return maxLen;
}

// 標準入力処理
const input = fs.readFileSync(0, "utf8").trim().split("\n").map(Number);
const n = input[0];
const heights = input.slice(1, n + 1);

const result = longestNonDecreasingSubarray(heights);
console.log(result);
// ```

// ---

// ### 計算量解析

// * **時間計算量**: O(n)

//   * 各身長を 1 回ずつ走査するだけ。
// * **空間計算量**: O(1)

//   * 配列 `heights` を除き、追加のメモリは定数。

// ---

// ✅ **効率的で、大規模入力 (n=200,000) でも高速に処理可能です。**

