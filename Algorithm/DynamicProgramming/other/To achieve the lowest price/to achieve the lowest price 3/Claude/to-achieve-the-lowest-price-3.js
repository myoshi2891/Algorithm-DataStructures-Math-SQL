// この問題を解くために、動的計画法を使用して最適解を求めます。このコードの解法について説明します：

// **アルゴリズムの概要：**
// 1. 動的計画法（DP）を使用して、各りんご個数での最小コストを計算
// 2. `dp[i]` = i個のりんごを手に入れるための最小コスト
// 3. 2つのパック（x個でa円、y個でb円）を使って状態遷移
// 4. n個以上のりんごを手に入れる最小コストを返却

// **メモリ効率の考慮：**
// - 配列サイズを `n + max(x,y) - 1` に制限（それ以上は無駄になるため）
// - 同期的なファイル読み取りでメモリ使用量を最小化
// - 不要な変数を避け、必要最小限のメモリ使用

// **処理時間の最適化：**
// - DPの状態数を必要最小限に抑制
// - シンプルな二重ループ構造で計算量O(n × max(x,y))
// - 早期終了条件を設けて無駄な計算を回避

// **入力例の検証：**
// - n=4, x=2, a=110, y=5, b=200の場合
// - 5個パックを1つ買う（200円）でりんご5個 → 4個以上なので200円が答え

// このソリューションは制約条件（n≤1000, x,y≤1000）下で効率的に動作します。

const fs = require('fs');

/**
 * りんごを最小コストで購入する問題を解く関数
 * @param {number} n - 必要なりんごの個数
 * @param {number} x - 最初のパックのりんご個数
 * @param {number} a - 最初のパックの価格
 * @param {number} y - 2番目のパックのりんご個数
 * @param {number} b - 2番目のパックの価格
 * @return {number} n個以上のりんごを手に入れるための最小コスト
 */
function findMinimumCost(n, x, a, y, b) {
    // 最大でn+max(x,y)-1個まで考慮すれば十分
    // なぜなら、それ以上買っても必ず無駄が生じるため
    const maxApples = n + Math.max(x, y) - 1;

    // dp[i] = i個のりんごを手に入れるための最小コスト
    // 初期値は無限大（達成不可能を表す）
    const dp = new Array(maxApples + 1).fill(Infinity);
    dp[0] = 0; // 0個なら0円

    // 動的計画法でコストを計算
    for (let i = 0; i <= maxApples; i++) {
        if (dp[i] === Infinity) continue;

        // x個パックを購入する場合
        const nextX = Math.min(i + x, maxApples);
        dp[nextX] = Math.min(dp[nextX], dp[i] + a);

        // y個パックを購入する場合
        const nextY = Math.min(i + y, maxApples);
        dp[nextY] = Math.min(dp[nextY], dp[i] + b);
    }

    // n個以上のりんごを手に入れるための最小コストを求める
    let minCost = Infinity;
    for (let i = n; i <= maxApples; i++) {
        minCost = Math.min(minCost, dp[i]);
    }

    return minCost;
}

/**
 * メイン処理関数
 * 標準入力を読み取り、問題を解いて結果を出力
 */
function main() {
    // 標準入力の読み取り（同期処理でメモリ効率を考慮）
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
    const [n, x, a, y, b] = input.split(' ').map(Number);

    // 最小コストを計算
    const result = findMinimumCost(n, x, a, y, b);

    // 結果を出力
    console.log(result);
}

// メイン処理の実行
main();
