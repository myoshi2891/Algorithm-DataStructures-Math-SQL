// では Node.js (v16.17.1) 向けに **JavaScript 実装 (fs使用)** を提示します。
// 方針は前回の **DP アプローチ** をそのまま JavaScript に落とし込みます。

// ---

// ## アルゴリズム (DP を使用)

// * `dp[i]`: 「i 番目で終わる逆背の順区間の長さ」
// * 遷移:

//   * `a[i-1] >= a[i]` の場合 → `dp[i] = dp[i-1] + 1`
//   * それ以外の場合 → `dp[i] = 1`
// * 答えは `dp` の最大値。

// ---

// ## 計算量

// * 時間計算量: **O(n)**
// * 空間計算量: **O(n)** （`dp` を使用するため、最大 200,000 要素 ≒ 数 MB 程度）

// ---

// ## 実装コード (Node.js v16.17.1)

// ```javascript
'use strict';

const fs = require('fs');

/**
 * 最長の「逆背の順」区間の長さを求める
 *
 * @param {number} n - 人数 (1 <= n <= 200000)
 * @param {number[]} a - 各人の身長リスト (100 <= a_i <= 200)
 * @returns {number} - 最長の「逆背の順」区間の長さ
 */
function longestNonIncreasingSegment(n, a) {
    // dp[i]: i番目で終わる逆背の順の長さ
    const dp = new Array(n).fill(1);
    let maxLen = 1;

    for (let i = 1; i < n; i++) {
        if (a[i - 1] >= a[i]) {
            dp[i] = dp[i - 1] + 1;
        } else {
            dp[i] = 1;
        }
        if (dp[i] > maxLen) {
            maxLen = dp[i];
        }
    }

    return maxLen;
}

// ---------------- main ----------------
(function main() {
    const input = fs.readFileSync(0, 'utf8').trim().split('\n');
    const n = Number(input[0]);
    const a = input.slice(1).map(Number);

    const result = longestNonIncreasingSegment(n, a);
    console.log(result);
})();
// ```

// ---

// ## 実行方法

// ```bash
// node solve.js < input.txt
// ```

// ---

// ✅ このコードは **O(n)** 時間で動作し、
// 最大入力サイズ (`n=200000`) に対しても数百 ms 程度・数 MB のメモリ消費に収まります。

// ---

// 👉 ご希望であれば、**DP 配列を使わず O(1) メモリで最適化したバージョン**（線形走査版）も JavaScript で提示できますが、そちらも見ますか？
