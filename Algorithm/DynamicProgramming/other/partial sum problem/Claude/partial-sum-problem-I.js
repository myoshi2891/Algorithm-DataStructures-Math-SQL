// この問題は典型的な「部分和問題」ですね。動的プログラミング（DP）を使って解決します。

// 問題の核心は、各おもりについて「使う」か「使わない」かの選択を行い、目標の重さ `x` を作れるかどうかを判定することです。

// ## アルゴリズムの解説

// 1. `dp[j]` = おもりを選んで重さの和が `j` になるかどうかの真偽値
// 2. 初期状態：`dp[0] = true`（何も選ばなければ重さ0）
// 3. 各おもり `i` について、重さ `a_i` を使って更新
// 4. 更新は逆順（`x` から `a_i` へ）で行う

// **なぜ逆順なのか？**
// - 正順だと同じおもりを複数回使ってしまう可能性がある
// - 例：`n=1, a_1=5, x=10` の場合、正順だと `dp[5]→dp[10]` で同じおもり5を2回使ってしまう

// ```javascript
// 部分和問題の解法（動的プログラミング）

// 標準入力の読み込み
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

// 入力の解析
const [n, x] = input[0].split(' ').map(Number);
const weights = [];
for (let i = 1; i <= n; i++) {
    weights.push(Number(input[i]));
}

/**
 * 部分和問題を動的プログラミングで解く
 * @param {number} n - おもりの個数
 * @param {number} x - 目標の重さ
 * @param {number[]} weights - 各おもりの重さの配列
 * @returns {boolean} - 目標の重さを作れるかどうか
 */
function canMakeSum(n, x, weights) {
    // dp[j] = 重さの和がjになるかどうか
    const dp = new Array(x + 1).fill(false);

    // 初期状態：何も選ばなければ重さ0
    dp[0] = true;

    // 各おもりについて処理
    for (let i = 0; i < n; i++) {
        const weight = weights[i];

        // 逆順でループ（同じおもりの重複使用を防ぐため）
        for (let j = x; j >= weight; j--) {
            if (dp[j - weight]) {
                dp[j] = true;
            }
        }
    }

    return dp[x];
}

// 実行と出力
const result = canMakeSum(n, x, weights);
console.log(result ? 'yes' : 'no');
// ```

// ## 計算量

// - **時間計算量**: O(n × x) - おもりの個数 × 目標重さ
// - **空間計算量**: O(x) - DPテーブルのサイズ

// ## 動作例（入力例1）

// ```
// n=5, x=19, weights=[7,18,5,4,8]

// 初期: dp[0]=true, 他はfalse

// おもり1(重さ7): dp[7]=true
// おもり2(重さ18): dp[18]=true, dp[25]=true(範囲外)
// おもり3(重さ5): dp[5]=true, dp[12]=true, dp[23]=true(範囲外)
// おもり4(重さ4): dp[4]=true, dp[9]=true, dp[11]=true, dp[16]=true, dp[22]=true(範囲外)
// おもり5(重さ8): dp[8]=true, dp[13]=true, dp[15]=true, dp[17]=true, dp[19]=true, dp[20]=true(範囲外), dp[24]=true(範囲外), dp[30]=true(範囲外)

// 結果: dp[19]=true → "yes"
// ```

// この実装は制約条件（n≤100, x≤1,000）に対して十分高速で、メモリ使用量も効率的です。
