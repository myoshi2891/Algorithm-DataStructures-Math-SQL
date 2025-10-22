// 以下は、与えられたゲームに対する **動的計画法（DP）による勝敗判定のJavaScript実装**です。
// この問題は **DPのGrundy数（勝ち・負け状態）**に基づく典型的な**Stone Game**問題です。

// ---

// ### ✅ アルゴリズム概要

// * `dp[i] = true` の場合、**その状態（石がi個）の時、先手が勝てる状態**
// * 遷移は `dp[i - a[j]] == false`（= 相手が負ける状態に遷移できる）なら、`dp[i] = true`
// * そうでなければ `dp[i] = false`

// ---

// ### ✅ 実装（Node.js + `fs`使用、計測付き）

// ```javascript
const fs = require('fs');

/**
 * 石取りゲームの勝者を判定する関数
 * @param {number} N - 石の総数
 * @param {number[]} a - 一度に取れる石の数の配列（長さ K）
 * @returns {string} - "First" または "Second"
 */
function solveStoneGame(N, a) {
    const dp = new Array(N + 1).fill(false); // dp[i] = その状態が先手必勝なら true

    for (let stones = 1; stones <= N; stones++) {
        for (let move of a) {
            if (stones - move >= 0 && !dp[stones - move]) {
                dp[stones] = true; // 相手が負ける手があるので先手勝ち
                break;
            }
        }
    }

    return dp[N] ? 'First' : 'Second';
}

// 標準入力読み込み＋処理時間、メモリ計測
function main() {
    const startTime = process.hrtime.bigint(); // 開始時間（ナノ秒）
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/).map(Number);

    const N = input[0];
    const K = input[1];
    const a = input.slice(2, 2 + K);

    const result = solveStoneGame(N, a);
    console.log(result);

    const endTime = process.hrtime.bigint(); // 終了時間（ナノ秒）
    const elapsedTimeMs = Number(endTime - startTime) / 1e6;
    const memoryUsageMB = process.memoryUsage().heapUsed / 1024 / 1024;

    console.error(`Time: ${elapsedTimeMs.toFixed(3)} ms`);
    console.error(`Memory: ${memoryUsageMB.toFixed(3)} MB`);
}

main();

// ### ✅ 実行方法（UNIX系環境）

// 以下のようにファイルを作成し、テストできます：

// #### 例: `stone_game.js`

// ```bash
// node stone_game.js < input.txt
// ```

// #### input.txt 内容（例）

// ```
// 8 2
// 2 3
// ```

// ---

// ### ✅ 時間・空間計算量

// * **時間計算量**: `O(N × K)`（最悪で 10^5 × 100 = 10^7）
// * **空間計算量**: `O(N)`（最大10万要素）

// ---

// ### ✅ 備考

// この問題は「ゲーム理論（貪欲でなく、勝敗状態を遡って考える）」の応用例であり、状態遷移の構造を理解すれば、ほとんどのStone Gameに応用可能です。必要に応じて最適化（bitsetなど）も可能です。
