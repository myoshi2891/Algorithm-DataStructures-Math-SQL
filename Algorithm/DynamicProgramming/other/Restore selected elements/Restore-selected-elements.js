// ご質問ありがとうございます。
// 「**同じ位置の数字は複数回使えない場合**」は、\*\*部分和問題の典型的な制約付き版（0-1ナップサック問題）\*\*になります。

// ---

// ## 問題の違い：

// | 条件     | 使える数字                      |
// | ------ | -------------------------- |
// | **前回** | 同じ数字は何度でも使える（無限個）          |
// | **今回** | 同じ\*\*位置の数字は1回だけ使える（0-1制約） |

// ---

// ## 解法：

// * 動的計画法（0-1ナップサック）
// * `dp[i][k]` ：最初の i 個の数字から選んで和が k になるときの最小個数
// * **復元用に`prev`配列を持つ**

// ---

// ## コード（Node.js）

// ```javascript
const fs = require('fs');

/**
 * 0-1制約付きの最小部分和問題
 * @param {number} N - 数列の長さ
 * @param {number} K - 目標の和
 * @param {number[]} A - 数列A
 * @returns {string} - 出力形式の文字列
 */
function minSubsetSum_01(N, K, A) {
    const INF = 1e9;
    const dp = Array.from({ length: N + 1 }, () => new Array(K + 1).fill(INF));
    const prev = Array.from({ length: N + 1 }, () => new Array(K + 1).fill(-1)); // 復元用

    dp[0][0] = 0;

    for (let i = 0; i < N; i++) {
        for (let k = 0; k <= K; k++) {
            // i番目の要素を使わない場合
            if (dp[i][k] < dp[i + 1][k]) {
                dp[i + 1][k] = dp[i][k];
                prev[i + 1][k] = k;
            }
            // i番目の要素を使う場合
            if (k + A[i] <= K) {
                if (dp[i][k] + 1 < dp[i + 1][k + A[i]]) {
                    dp[i + 1][k + A[i]] = dp[i][k] + 1;
                    prev[i + 1][k + A[i]] = k; // A[i]を使ってkからk+A[i]に遷移
                }
            }
        }
    }

    if (dp[N][K] === INF) {
        return '-1\n';
    }

    // 復元
    const res = [];
    let k = K;
    for (let i = N; i >= 1; i--) {
        if (prev[i][k] !== k) { // i番目の要素を使った場合
            res.push(A[i - 1]);
            k = prev[i][k];
        }
    }

    return `${dp[N][K]}\n${res.join(' ')}\n`;
}

// 入力 & 計測
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, K] = input[0].split(' ').map(Number);
const A = input[1].split(' ').map(Number);

const startTime = process.hrtime.bigint();
const result = minSubsetSum_01(N, K, A);
const endTime = process.hrtime.bigint();

process.stdout.write(result);

// パフォーマンス出力
const used = process.memoryUsage();
console.error(`Time: ${Number(endTime - startTime) / 1e6} ms`);
console.error(`Memory: ${Math.round(used.heapUsed / 1024)} KB`);
// ```

// ---

// ## 入力例と出力

// ### 入力

// ```
// 5 4
// 1 3 2 2 1
// ```

// ### 出力例

// ```
// 2
// 1 3
// ```

// ※順序は任意（`3 1`でもOK）

// ---

// ## 制約まとめ：

// * 各数字は**高々1回しか使えない**（同じ数字が複数あっても、同じ位置は1回だけ）
// * 解法は **0-1ナップサックDP**

// ---

// ## 計算量：

// * 時間計算量：O(N × K)
// * 空間計算量：O(N × K)

// ---

// ## メモリと実行時間：

// * `process.hrtime.bigint()`でナノ秒計測
// * `process.memoryUsage()`でヒープ使用量出力

