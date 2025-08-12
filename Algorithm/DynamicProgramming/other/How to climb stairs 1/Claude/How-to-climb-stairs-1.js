// この問題は典型的なフィボナッチ数列の動的プログラミング（DP）問題ですね。階段を上る方法の数を効率的に計算するコードを作成します。このコードの主な特徴と最適化ポイント：

// ## アルゴリズムの解説
// 1. **漸化式**: `dp[n] = dp[n-1] + dp[n-2]`
//    - n段目に到達するには、(n-1)段目から1段上るか、(n-2)段目から2段上るかの2通り
//    - この2つの方法の数を合計することで求められる

// 2. **初期値**: 
//    - `dp[0] = 1`（何もしない方法が1通り）
//    - `dp[1] = 1`（1段上る方法が1通り）

// ## 最適化のポイント

// ### メモリ効率
// - **最適化版関数**を提供：O(n) → O(1)の空間計算量
// - 過去2つの値のみを保持することで、大幅なメモリ節約

// ### 処理時間
// - 時間計算量はO(n)で線形時間
// - n ≤ 40の制約下では非常に高速に動作

// ### エラーハンドリング
// - エッジケース（n=0, n=1）を適切に処理
// - 入力値の型変換も安全に実装

// ## 実行例
// 入力が`3`の場合：
// - dp[0] = 1
// - dp[1] = 1  
// - dp[2] = dp[1] + dp[0] = 2
// - dp[3] = dp[2] + dp[1] = 3

// つまり3段の階段を上る方法は3通りです：
// 1. 1段→1段→1段
// 2. 1段→2段
// 3. 2段→1段

// このソリューションは制約条件（n ≤ 40）に対して十分に効率的で、処理時間とメモリ使用量の両方を考慮した実装となっています。

const fs = require('fs');

/**
 * n段の階段を上る方法の数を動的プログラミングで計算する関数
 * @param {number} n - 階段の段数
 * @returns {number} n段の階段を上る方法の数
 */
function countWaysToClimbStairs(n) {
    // n = 0の場合は1通り（何もしない）
    if (n === 0) return 1;
    // n = 1の場合は1通り（1段上る）
    if (n === 1) return 1;

    // DPテーブルを初期化
    // メモリ効率を考慮して、必要最小限のサイズで配列を作成
    const dp = new Array(n + 1);

    // 初期値を設定
    dp[0] = 1; // 0段を上る方法は1通り（何もしない）
    dp[1] = 1; // 1段を上る方法は1通り（1段上る）

    // 2段目からn段目まで計算
    for (let i = 2; i <= n; i++) {
        // i段目に到達する方法は以下の2通りの合計
        // 1. (i-1)段目から1段上る
        // 2. (i-2)段目から2段上る
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

/**
 * メモリ最適化版: O(1)の空間計算量で階段を上る方法の数を計算
 * @param {number} n - 階段の段数
 * @returns {number} n段の階段を上る方法の数
 */
function countWaysToClimbStairsOptimized(n) {
    if (n === 0) return 1;
    if (n === 1) return 1;

    // 前の2つの値のみを保持してメモリを節約
    let prev2 = 1; // dp[i-2]
    let prev1 = 1; // dp[i-1]
    let current;

    for (let i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }

    return current;
}

/**
 * メイン処理関数
 */
function main() {
    // 標準入力から値を読み取り
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const n = parseInt(input);

    // 処理時間とメモリ使用量を測定
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage().heapUsed;

    // メモリ最適化版を使用（n ≤ 40の制約下では十分高速）
    const result = countWaysToClimbStairsOptimized(n);

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;

    // パフォーマンス情報をコメントとして記録
    // 実際の出力には含まれない
    const executionTime = Number(endTime - startTime) / 1000000; // ナノ秒からミリ秒に変換
    const memoryUsed = endMemory - startMemory;

    // デバッグ用（実際の提出時は削除）
    // console.error(`実行時間: ${executionTime.toFixed(3)}ms`);
    // console.error(`メモリ使用量: ${memoryUsed}バイト`);

    // 結果を出力
    console.log(result);
}

// メイン処理を実行
main();