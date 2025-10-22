// この問題をDynamic Programming（動的プログラミング）を使って解決するJavaScriptコードを作成します。このコードは以下の特徴を持っています：

// ## 処理の詳細

// 1. **時間計算量**: O(n) - nまでの各値について定数時間の計算を行います
// 2. **空間計算量**: O(n) - DPテーブルとしてn+1サイズの配列を使用します

// ## 関数の説明

// ### `calculateMinCost(n, a, b)`
// - **パラメーター**:
//   - `n`: 購入したいりんごの個数
//   - `a`: りんご1個の価格
//   - `b`: りんご2個の価格
// - **返却値**: りんごn個を購入するのに必要な最小金額

// ### DPの漸化式
// ```
// dp[i] = min(dp[i-1] + a, dp[i-2] + b)
// ```

// この式は以下の2つの選択肢の最小値を取ります：
// - `dp[i-1] + a`: i-1個まで最安で買って、最後に1個をa円で追加
// - `dp[i-2] + b`: i-2個まで最安で買って、最後に2個をb円で追加

// ## メモリとパフォーマンスの考慮

// - 配列サイズを最小限（n+1）に抑制
// - 不要な変数の使用を避け、メモリ効率を重視
// - Math.minを使用して処理を簡潔化

// 制約条件（n ≤ 1,000, a < b）の下で、このアプローチは十分に効率的です。
const fs = require('fs');

/**
 * りんごn個を購入するのに必要な最小金額を動的プログラミングで計算する関数
 * @param {number} n - 購入するりんごの個数
 * @param {number} a - りんご1個の価格
 * @param {number} b - りんご2個の価格
 * @returns {number} 最小金額
 */
function calculateMinCost(n, a, b) {
    // DPテーブルを初期化（メモリ効率を考慮してn+1の配列を使用）
    const dp = new Array(n + 1);

    // ベースケース
    dp[0] = 0; // 0個なら0円
    dp[1] = a; // 1個ならa円

    // DPテーブルを埋める
    for (let i = 2; i <= n; i++) {
        // dp[i] = min(dp[i-1] + a, dp[i-2] + b)
        // i-1個買ってから1個追加 vs i-2個買ってから2個追加
        dp[i] = Math.min(dp[i - 1] + a, dp[i - 2] + b);
    }

    return dp[n];
}

/**
 * メイン処理関数
 * 標準入力から値を読み取り、結果を出力する
 */
function main() {
    // 標準入力から読み取り
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const [n, a, b] = input.split(' ').map(Number);

    // 最小コストを計算
    const result = calculateMinCost(n, a, b);

    // 結果を出力
    console.log(result);
}

// メイン処理を実行
main();
