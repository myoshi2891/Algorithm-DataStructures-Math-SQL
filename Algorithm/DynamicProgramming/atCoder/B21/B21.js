// 以下に、**最長部分回文部分列（Longest Palindromic Subsequence）** を求める JavaScript (Node.js) のコードを、`fs` モジュールを使って記述します。

// ---

// ### ✅ アルゴリズム概要：

// * 動的計画法（DP）を用いて、部分文字列 `S[i..j]` の中で作れる最長回文部分列の長さを `dp[i][j]` に記録していきます。
// * `dp[i][j]` の計算式：

//   * `S[i] === S[j]` のとき: `dp[i][j] = dp[i+1][j-1] + 2`
//   * それ以外: `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`

// ---

// ### ✅ 実装（Node.js, `fs` 使用）

// ```javascript
const fs = require('fs');

/**
 * 最長回文部分列の長さを返す関数
 * @param {string} S - 対象の文字列（英小文字）
 * @returns {number} - 最長の回文部分列の長さ
 */
function longestPalindromicSubsequence(S) {
    const N = S.length;
    const dp = Array.from({ length: N }, () => Array(N).fill(0));

    // 1文字は必ず回文
    for (let i = 0; i < N; i++) {
        dp[i][i] = 1;
    }

    // 長さ2以上の部分列に対するDP
    for (let len = 2; len <= N; len++) {
        for (let i = 0; i <= N - len; i++) {
            const j = i + len - 1;
            if (S[i] === S[j]) {
                dp[i][j] = len === 2 ? 2 : dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[0][N - 1];
}

// 入力読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N = Number(input[0]);
const S = input[1];

// 出力
console.log(longestPalindromicSubsequence(S));

// ### ✅ 入力例での動作確認

// #### 入力:

// ```
// 11
// programming
// ```

// #### 出力:

// ```
// 4
// ```

// #### 入力:

// ```
// 7
// abcdcba
// ```

// #### 出力:

// ```
// 7
// ```

// ---

// ### ✅ 時間・メモリ計算

// * **時間計算量**：O(N^2) （N ≦ 1000なので最大で約 1,000,000 ループ）
// * **空間計算量**：O(N^2) （1000×1000 の 2次元配列 → 約 8MB）
