// この問題は **DP（動的計画法）** を使って解くのが定石です。
// ただし、今回は「n 個ちょうどでなく、n 個以上でも良い」という点に注意が必要です。

// ---

// ## アルゴリズム概要

// 1. **dp\[i]** = ちょうど i 個のりんごを買う最小コスト
//    （不可能なら `Infinity` とする）
// 2. 最後に `dp[n], dp[n+1], dp[n+2], dp[n+3], dp[n+4]` の中で最小値を取れば答えになる。

//    * これは「2 個と 5 個」の組み合わせの余りを吸収するため。
// 3. 計算量は **O(n)** で、n ≤ 1000 なので十分高速。

// ---

// ## Node.js (v16.17.1) 実装

// ```javascript
const fs = require('fs');

/**
 * @param {number} n - 必要なりんごの個数
 * @param {number} a - りんご2個の価格
 * @param {number} b - りんご5個の価格
 * @returns {number} - n個以上のりんごを手に入れるための最小金額
 */
function minAppleCost(n, a, b) {
    const INF = Number.MAX_SAFE_INTEGER;
    const maxN = n + 5; // n個以上買うために少し余分に確保
    const dp = Array(maxN + 1).fill(INF);
    dp[0] = 0; // 初期状態: 0個買うのに0円

    for (let i = 0; i <= maxN; i++) {
        if (dp[i] === INF) continue;
        if (i + 2 <= maxN) dp[i + 2] = Math.min(dp[i + 2], dp[i] + a);
        if (i + 5 <= maxN) dp[i + 5] = Math.min(dp[i + 5], dp[i] + b);
    }

    // n個以上の中で最小値を探す
    let ans = INF;
    for (let i = n; i <= n + 5; i++) {
        ans = Math.min(ans, dp[i]);
    }
    return ans;
}

// ---- 標準入力処理 ----
const input = fs.readFileSync(0, 'utf8').trim().split(' ').map(Number);
const [n, a, b] = input;
const result = minAppleCost(n, a, b);
console.log(result);
// ```

// ---

// ## 処理時間とメモリ

// * **時間計算量**: O(n) （最大 n=1000 → ループ1000回程度で高速）
// * **空間計算量**: O(n) （dp配列は最大1005要素）

// ---

// ### 入力例

// ```
// 4 110 200
// ```

// ### 出力例

// ```
// 200
// ```

// ---

// 👉 このコードは **Node.js v16.17.1** でそのまま動き、`fs` を用いた標準入力対応になっています。

// 要望に沿って「関数化」「処理時間・メモリ効率」も考慮済みです。

// ---

// 質問ですが、この問題は AtCoder 風の入力処理（1行で n a b が与えられる）を想定していますか？ それとも複数行入力の可能性も考慮すべきですか？
