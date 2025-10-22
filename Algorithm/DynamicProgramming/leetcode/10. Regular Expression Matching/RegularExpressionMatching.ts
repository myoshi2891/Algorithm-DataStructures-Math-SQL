// 以下は、LeetCodeの正規表現マッチング問題に対する **JavaScript（Node.js）での解答例** です。`fs` モジュールを用いて標準入力から `s` と `p` を受け取り、動的計画法（DP）で `.` や `*` を考慮した完全一致の判定を行います。

// ---

// ### ✅ 解法方針（動的計画法・2次元DP）

// * `dp[i][j]`：`s[0..i-1]` と `p[0..j-1]` がマッチするかを表す。
// * 状態遷移：

//   * `p[j - 1] === '*'` の場合：

//     * 無視：`dp[i][j] = dp[i][j - 2]`
//     * 一致していて繰り返し使用：`dp[i][j] |= dp[i - 1][j]`
//   * `p[j - 1] === s[i - 1] || p[j - 1] === '.'` の場合：

//     * `dp[i][j] = dp[i - 1][j - 1]`

// ---

// ### 📦 JavaScript（Node.js）実装（`fs` 使用）

// ```javascript
const fs = require('fs');

// 入力読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const s = input[0]; // 入力文字列 s
const p = input[1]; // パターン文字列 p

function isMatch(s, p) {
    const m = s.length;
    const n = p.length;

    // 初期化：false埋め、dp[0][0] = true（空文字同士は一致）
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
    dp[0][0] = true;

    // 空文字列 s に対するパターン p の初期化（例: a*, a*b*, a*b*c*）
    for (let j = 2; j <= n; j++) {
        if (p[j - 1] === '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    // DPテーブル更新
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else if (p[j - 1] === '*') {
                dp[i][j] = dp[i][j - 2]; // * を0回使用
                if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j]; // * を1回以上使用
                }
            }
        }
    }

    return dp[m][n];
}

// 出力
console.log(isMatch(s, p));

// ### 🧪 入力方法（例）

// 以下のような入力ファイルまたは標準入力で動作します：

// ```
// aa
// a*
// ```

// 出力：

// ```
// true
// ```

// ---

// ### ⏱ 性能（最悪計算量）

// * 時間計算量：O(m × n)
// * 空間計算量：O(m × n)
// * 制約が小さい（s, p ≤ 20）ので高速かつメモリ効率良好です。

// ---

// 必要であれば、標準入力ファイルを指定してテスト可能です。Node.js環境で実行する場合：

// ```bash
// echo -e "ab\n.*" | node solution.js
// ```
