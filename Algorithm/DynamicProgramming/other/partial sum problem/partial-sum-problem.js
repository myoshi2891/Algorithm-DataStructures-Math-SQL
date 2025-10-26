// はい、\*\*DP（動的計画法）\*\*を用いた部分和問題の解法について説明し、**Node.js (JavaScript) + `fs`入力対応版**でコードを提供します。

// ---

// ## 🧠 基本方針（DP）

// ### 問題

// 与えられた整数列 `a = [a1, a2, ..., aN]` の中からいくつかの要素を選んで、その合計を `K` にできるか判定する。

// ---

// ## 🧮 DPの定義

// 以下のような2次元配列 `dp[i][j]` を定義します：

// > `dp[i][j] = true` とは、
// > 「先頭から `i` 個目までの要素の中から選んで合計が `j` にできる」ことを意味します。

// ---

// ## 🧩 遷移

// 1. 初期状態：

//    ```js
//    dp[0][0] = true
//    ```

// 2. 遷移式（各a\[i]を使うか使わないか）：

//    ```js
//    dp[i+1][j]     |= dp[i][j]        // a[i] を使わない場合
//    dp[i+1][j+a[i]] |= dp[i][j]       // a[i] を使う場合（j+a[i] <= K のときのみ）
//    ```

// ---

// ## 💻 JavaScript実装（Node.js + fs入力）

// ```javascript
const fs = require('fs');

// 入力の読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, K] = input[0].split(' ').map(Number);
const A = input[1].split(' ').map(Number);

/**
 * DPを用いて部分和がKになるかを判定する関数
 * @param {number[]} a - 入力の整数列
 * @param {number} k - 目標とする合計値
 * @returns {string} - "Yes" または "No"
 */
function isSubsetSumDP(a, k) {
    const n = a.length;

    // dp[i][j] = i番目まで見てjを作れるか
    const dp = Array.from({ length: n + 1 }, () => Array(k + 1).fill(false));
    dp[0][0] = true; // 何も選ばなければ和は0

    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= k; j++) {
            if (dp[i][j]) {
                dp[i + 1][j] = true; // a[i]を使わない
                if (j + a[i] <= k) {
                    dp[i + 1][j + a[i]] = true; // a[i]を使う
                }
            }
        }
    }

    return dp[n][k] ? 'Yes' : 'No';
}

// 実行と出力
console.log(isSubsetSumDP(A, K));
// ```

// ---

// ## 🧠 時間・空間計算量

// * **時間計算量**：`O(N × K)`
//   最大で `20 × 2000 = 40000` → 非常に高速
// * **空間計算量**：`O(N × K)` → 2次元配列を用いたため `~160,000` 個のboolean

// ※ `dp[i][j]` の「`i`が不要（直前しか見ない）」なので、`1次元配列`で `O(K)` に圧縮可能です。

// ---

// ## ✅ 入力例と出力例

// 入力：

// ```
// 3 6
// 1 2 3
// ```

// 出力：

// ```
// Yes
// ```

// ---

// ## ✅ 圧縮版（1次元配列で高速化）

// 1次元配列にしてさらにメモリを削減したい場合：

// ```js
function isSubsetSumDP1D(a, k) {
    let dp = Array(k + 1).fill(false);
    dp[0] = true;

    for (const val of a) {
        const next = [...dp]; // 今回の遷移後の配列をコピー
        for (let j = 0; j <= k - val; j++) {
            if (dp[j]) next[j + val] = true;
        }
        dp = next;
    }

    return dp[k] ? 'Yes' : 'No';
}
