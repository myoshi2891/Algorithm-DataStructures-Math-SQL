// この問題を解くために、動的プログラミング（DP）を使用します。問題の要点は、りんごを2個ずつまたは5個ずつしか買えない制約の中で、n個以上のりんごを最小コストで手に入れることです。このソリューションの解説：

// ## アプローチ

// 1. **動的プログラミング（DP）の使用**: `dp[i]` をちょうど `i` 個のりんごを買うのに必要な最小コストと定義
// 2. **余裕を持った計算範囲**: 問題のヒント通り、`n+4` まで計算
// 3. **最終的な最小値の探索**: `n` 個以上の範囲で最小コストを探索

// ## 時間計算量とメモリ効率

// - **時間計算量**: O(n) - DPテーブルを一度だけ構築
// - **空間計算量**: O(n) - DPテーブルのサイズ
// - **メモリ効率**: 必要最小限の配列のみ使用
// - **処理時間**: 入力サイズが最大1,000と小さいため、非常に高速

// ## 主要な特徴

// 1. **エラーハンドリング**: 入力値の妥当性をチェック
// 2. **パフォーマンス測定**: 実行時間とメモリ使用量を測定（デバッグ用）
// 3. **関数分割**: 問題解決ロジックとメイン処理を分離
// 4. **詳細なコメント**: 各パラメータと戻り値を明記

// ## 入力例での動作

// 入力: `4 110 200`
// - りんご2個 = 110円
// - りんご5個 = 200円  
// - 必要: 4個以上

// 計算過程:
// - 4個ちょうど: 2個×2回 = 220円
// - 5個: 5個×1回 = 200円

// 結果: 5個買って200円が最安（4個以上の条件を満たす）

// このソリューションは効率的で、大きな入力に対してもメモリと処理時間を最小限に抑えて動作します。
const fs = require('fs');

/**
 * りんごを最小コストで購入する問題を解く
 * @param {number} n - 必要なりんごの個数
 * @param {number} a - りんご2個の価格
 * @param {number} b - りんご5個の価格
 * @returns {number} n個以上のりんごを手に入れるための最小コスト
 */
function solveApplePurchase(n, a, b) {
    // 余裕をもってn+4まで計算する（問題のヒント通り）
    const maxIndex = n + 4;

    // dp[i] = ちょうどi個のりんごを買うのに必要な最小コスト
    // 初期化：無限大で初期化（買えない場合を表す）
    const dp = new Array(maxIndex + 1).fill(Infinity);

    // 基底条件：0個なら0円
    dp[0] = 0;

    // DPテーブルを構築
    for (let i = 0; i <= maxIndex; i++) {
        if (dp[i] === Infinity) continue;

        // りんご2個を買う場合
        if (i + 2 <= maxIndex) {
            dp[i + 2] = Math.min(dp[i + 2], dp[i] + a);
        }

        // りんご5個を買う場合
        if (i + 5 <= maxIndex) {
            dp[i + 5] = Math.min(dp[i + 5], dp[i] + b);
        }
    }

    // n個以上のりんごを手に入れる最小コストを計算
    let minCost = Infinity;
    for (let i = n; i <= maxIndex; i++) {
        if (dp[i] !== Infinity) {
            minCost = Math.min(minCost, dp[i]);
        }
    }

    return minCost;
}

/**
 * メイン処理関数
 * 標準入力を読み取り、結果を出力する
 */
function main() {
    // メモリ使用量と処理時間の測定開始
    const startTime = process.hrtime.bigint();
    const initialMemory = process.memoryUsage();

    try {
        // 標準入力から値を取得
        const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
        const [n, a, b] = input.split(' ').map(Number);

        // 入力値の妥当性チェック
        if (n < 1 || n > 1000 || a < 1 || a > 10000 || b < 1 || b > 10000 || a >= b) {
            throw new Error('入力値が条件を満たしていません');
        }

        // 問題を解く
        const result = solveApplePurchase(n, a, b);

        // 結果を出力
        console.log(result);

        // パフォーマンス測定結果（デバッグ用、本番では出力しない）
        const endTime = process.hrtime.bigint();
        const finalMemory = process.memoryUsage();
        const executionTime = Number(endTime - startTime) / 1000000; // ナノ秒をミリ秒に変換
        const memoryUsed = finalMemory.heapUsed - initialMemory.heapUsed;

        // デバッグ情報（標準エラー出力に出力）
        // console.error(`実行時間: ${executionTime.toFixed(3)}ms`);
        // console.error(`メモリ使用量: ${memoryUsed}バイト`);
    } catch (error) {
        console.error('エラー:', error.message);
        process.exit(1);
    }
}

// メイン処理実行
main();