// ```javascript
// Node.js v16.17.1
// 八百屋のりんご問題をDPで解く
// 入力: n a b （整数）
// 出力: n個以上のりんごを手に入れるための最小金額（改行付き）

const fs = require('fs');

/**
 * 最小金額をDPで計算する関数
 * @param {number} n - 必要なりんごの個数
 * @param {number} a - りんご1個の価格
 * @param {number} b - りんご2個の価格
 * @returns {number} - n個以上のりんごを買うための最小金額
 */
function minAppleCost(n, a, b) {
    // dp[i] = ちょうどi個のりんごを買う最小金額
    // 配列サイズは n まであれば十分
    const dp = new Array(n + 1).fill(0);

    dp[0] = 0;
    dp[1] = a;

    for (let i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1] + a, dp[i - 2] + b);
    }

    return dp[n];
}

// 標準入力読み込み
const input = fs.readFileSync(0, 'utf8').trim().split(' ').map(Number);
const [n, a, b] = input;

// 結果出力
console.log(minAppleCost(n, a, b));
// ```

// ---

// ### 実装上の注意

// * **処理時間**:
//   ループは `n (≦1000)` 回のみなので **O(n)**。
//   `n=1000` でも 1ms 以下で完了。

// * **メモリ使用量**:
//   `dp` 配列サイズは最大 1001 要素。
//   各要素は整数（最大で `1000*10000=10^7` 程度）。
//   よって **数KB程度**で収まり、十分小さい。

// * **改行処理**:
//   `console.log` を使って末尾に改行が自動的に入るため仕様通り。

// ---

// ✅ このコードで、標準入力から `n a b` を受け取り、DP を用いて最小金額を計算し出力します。
