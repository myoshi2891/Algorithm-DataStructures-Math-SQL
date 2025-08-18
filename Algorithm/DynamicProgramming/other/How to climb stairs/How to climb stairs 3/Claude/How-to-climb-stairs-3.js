// この問題は動的プログラミング（DP）を使って解くことができます。n段の階段を上る方法の数を求める問題で、1歩でa段、b段、またはc段上ることができます。この解答のポイント：

// 1. **動的プログラミングのアプローチ**：
//    - `dp[i]` = i段目に到達する方法の数として定義
//    - 初期条件：`dp[0] = 1`（スタート地点）

// 2. **状態遷移**：
//    - i段目に到達するには、(i-a)段、(i-b)段、(i-c)段から来ることができる
//    - `dp[i] = dp[i-a] + dp[i-b] + dp[i-c]`

// 3. **メモリ効率**：
//    - 配列サイズは`n+1`で最小限
//    - 時間計算量：O(n)、空間計算量：O(n)

// 4. **処理時間の配慮**：
//    - 単純なループで効率的に計算
//    - 条件分岐で配列の範囲外アクセスを防止

// 入力例1（10 2 3 4）の場合：
// - 10段の階段を2段、3段、4段ずつ上って到達する方法
// - DPテーブルを順番に計算して最終的に17通りという結果を得る

// この解法は制約条件（n ≤ 30）に対して十分高速で、メモリ使用量も最小限に抑えています。

const fs = require('fs');

/**
 * 階段を上る方法の数を動的プログラミングで計算する関数
 * @param {number} n - 階段の段数
 * @param {number} a - 1歩で上れる段数1
 * @param {number} b - 1歩で上れる段数2
 * @param {number} c - 1歩で上れる段数3
 * @returns {number} n段の階段を上る方法の数
 */
function countWaysToClimbStairs(n, a, b, c) {
    // DPテーブルを初期化（0で埋める）
    // dp[i] = i段目に到達する方法の数
    const dp = new Array(n + 1).fill(0);

    // 初期条件：0段目（スタート地点）に到達する方法は1通り
    dp[0] = 1;

    // 各段について計算
    for (let i = 1; i <= n; i++) {
        // a段前から来る場合
        if (i >= a) {
            dp[i] += dp[i - a];
        }
        // b段前から来る場合
        if (i >= b) {
            dp[i] += dp[i - b];
        }
        // c段前から来る場合
        if (i >= c) {
            dp[i] += dp[i - c];
        }
    }

    return dp[n];
}

/**
 * 標準入力から値を読み取り、問題を解く関数
 */
function solve() {
    // 標準入力から値を読み取り
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const [n, a, b, c] = input.split(' ').map(Number);

    // 階段を上る方法の数を計算
    const result = countWaysToClimbStairs(n, a, b, c);

    // 結果を出力
    console.log(result);
}

// メイン処理実行
solve();