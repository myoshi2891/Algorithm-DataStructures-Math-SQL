// では **JavaScript (Node.js v16.17.1)** での解法を示します。
// 要求仕様に従い、`fs` モジュールを用いて標準入力を処理し、**最長増加部分列 (LIS)** を DP で **O(n²)** で解きます。

// ---

// ### 実装コード (JavaScript / Node.js v16.17.1)

// ```javascript
/**
 * 最長増加部分列 (LIS) を求める関数
 * 
 * @param {number} n - 木の本数
 * @param {number[]} heights - 各木の高さの配列
 * @returns {number} - 残せる木の本数の最大値 (LISの長さ)
 * 
 * 計算量: O(n^2)
 *   - 外側ループ n 回、内側ループ最大 n 回
 *   - n ≤ 5000 のため、最大 25,000,000 回程度の演算で十分実行可能
 * メモリ量: O(n)
 *   - dp配列 (長さ n) と heights配列 (長さ n)
 */
function longestIncreasingSubsequence(n, heights) {
    const dp = new Array(n).fill(1); // 各木単独の場合は長さ1

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (heights[j] < heights[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return Math.max(...dp);
}

// ===== メイン処理 =====
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);

const n = input[0];
const heights = input.slice(1);

const result = longestIncreasingSubsequence(n, heights);
console.log(result);
// ```

// ---

// ### 🔎 処理の流れ

// 1. `fs.readFileSync(0, "utf8")` で標準入力を全て読み込み

//    * 先頭が `n`、続く `n` 行が木の高さ
// 2. `longestIncreasingSubsequence` 関数で DP 計算

//    * `dp[i] = i番目の木を末尾に持つ LIS の最大長`
//    * 内側ループで `a[j] < a[i]` のとき `dp[i] = max(dp[i], dp[j] + 1)`
// 3. `Math.max(...dp)` で LIS の長さを取得
// 4. 結果を出力

// ---

// ### ⏱ 計算量・メモリ量

// * **時間計算量:** O(n²) → n = 5000 なら 25M 演算程度で実行可能
// * **メモリ使用量:** O(n) → 配列 `heights`, `dp` のみ (数万要素, 数百 KB 程度)

// ---

// ✅ 入力例

// ```
// 5
// 100
// 102
// 101
// 91
// 199
// ```

// ✅ 出力

// ```
// 3
// ```

// ---

// 👉 この問題設定 (n ≤ 5000) では O(n²) DP 解法で十分ですが、もし n が 10^5 以上などに拡張される場合は、二分探索を用いた **O(n log n)** LIS アルゴリズムに書き換える必要があります。

// ---

// ご希望でしたら、この **O(n log n) 最適化版 (二分探索による LIS)** も JavaScript で提示できますが、出しますか？
