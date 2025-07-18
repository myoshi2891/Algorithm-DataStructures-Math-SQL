// 以下は、**Node.js (v18.16.1)** + **fsモジュール** を使い、
// 「部分和問題（最小個数）」を解く実装です。

// ## 解法概要

// * **動的計画法 (DP)** を使用
// * `dp[i] = Kを作るために使う数の最小個数`
//   初期値：`dp[0]=0`、それ以外は`Infinity`
// * 最後に`dp[K]`が`Infinity`なら`-1`を出力
//   そうでなければ`dp[K]`を出力

// ## 時間計算量：

// * `O(N × K)` （N=1000, K=2000 → 最大約200万回）

// ## メモリ消費：

// * `O(K)`
//   （dp配列サイズ：2001個 → 約16KB程度）

// ---

// ### Node.js 解答コード（`fs`で時間計測・メモリ計測）

// ```javascript
const fs = require('fs');

/**
 * 部分和問題（最小個数）の解を求める関数
 * @param {number} N - 数列の長さ
 * @param {number} K - 目標和
 * @param {number[]} A - 数列 a_1, a_2, ..., a_N
 * @returns {number} - Kを作れる場合は最小個数、作れない場合は-1
 */
function minSubsetSumCount(N, K, A) {
    const dp = new Array(K + 1).fill(Infinity);
    dp[0] = 0; // 0を作るのに使う個数は0

    for (let i = 0; i < N; i++) {
        for (let j = K; j >= A[i]; j--) {
            if (dp[j - A[i]] !== Infinity) {
                dp[j] = Math.min(dp[j], dp[j - A[i]] + 1);
            }
        }
    }

    return dp[K] === Infinity ? -1 : dp[K];
}

// 時間・メモリ計測開始
const startTime = process.hrtime.bigint(); // ナノ秒
const startMem = process.memoryUsage().heapUsed; // バイト

// 入力読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, K] = input[0].split(' ').map(Number);
const A = input[1].split(' ').map(Number);

// 処理実行
const result = minSubsetSumCount(N, K, A);
console.log(result);

// 時間・メモリ計測終了
const endTime = process.hrtime.bigint();
const endMem = process.memoryUsage().heapUsed;

const elapsedTimeMs = Number(endTime - startTime) / 1e6; // ミリ秒
const memoryUsageMB = (endMem - startMem) / (1024 * 1024); // メガバイト

// デバッグ用（標準出力には出さない）
// fs.writeFileSync('performance_log.txt', `Time: ${elapsedTimeMs.toFixed(3)} ms\nMemory: ${memoryUsageMB.toFixed(3)} MB\n`);

// ## 出力について

// * `result` のみ標準出力します（問題仕様通り）
// * 処理時間・メモリはファイル出力で確認可能（デバッグ時に利用）

// ---

// ## 実行例：

// ### 入力：

// ```
// 3 6
// 1 2 3
// ```

// ### 出力：

// ```
// 3
// ```

// ---

// ## ポイント：

// * **部分和の最小個数問題** → `0-1 Knapsack` のバリエーション
// * 逆ループ（`j=K→A[i]`）により「同じ要素を複数回使わない」仕様を実現

// ---

// ### ご注意：

// もし**複数回使ってよい場合**は、ループ順を`j=0→K`に変える必要があります。
// 今回の問題は「選ぶ数列からいくつか選ぶ」なので**同じ要素は1回のみ使用可能**です。
