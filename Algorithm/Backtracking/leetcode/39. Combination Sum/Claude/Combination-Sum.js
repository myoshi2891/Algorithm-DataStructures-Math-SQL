// この問題は「Combination Sum」と呼ばれる典型的なバックトラッキング問題です。効率的な解法を実装します。この実装の特徴と最適化ポイント：
// Runtime
// 4
// ms
// Beats
// 49.19%
// Memory
// 60.48
// MB
// Beats
// 32.17%
// **最適化のポイント：**
// 1. **ソート**: 配列を昇順にソートすることで、候補値が残り目標値を超えた時点で探索を終了できます
// 2. **早期終了**: `candidate > remainingTarget`の条件で無駄な探索を回避
// 3. **インデックス管理**: 同じ要素を重複使用する際に`startIndex`を固定し、順序を保つことで重複組み合わせを防止
// 4. **メモリ効率**: 組み合わせを動的に構築・削除することでメモリ使用量を最小化

// **時間計算量**: O(N^(T/M))
// - N: candidates配列の長さ
// - T: target値
// - M: candidatesの最小値

// **空間計算量**: O(T/M) - 再帰の深度

// この解法はLeetCodeで効率的に動作し、制約条件（組み合わせ数 < 150）下で最適なパフォーマンスを発揮します。
/**
 * 指定された配列から重複使用可能な要素を選んで目標値に達する全ての組み合わせを返す
 * @param {number[]} candidates - 重複のない整数配列（各要素は無制限に使用可能）
 * @param {number} target - 目標とする合計値
 * @return {number[][]} - 目標値に達する全ての組み合わせの配列
 */
var combinationSum = function (candidates, target) {
    const result = [];

    // 配列をソートして早期終了を可能にする
    candidates.sort((a, b) => a - b);

    /**
     * バックトラッキングで組み合わせを探索
     * @param {number} startIndex - 探索開始インデックス
     * @param {number[]} currentCombination - 現在の組み合わせ
     * @param {number} remainingTarget - 残りの目標値
     */
    function backtrack(startIndex, currentCombination, remainingTarget) {
        // 目標値に達した場合、結果に追加
        if (remainingTarget === 0) {
            result.push([...currentCombination]);
            return;
        }

        for (let i = startIndex; i < candidates.length; i++) {
            const candidate = candidates[i];

            // 候補値が残り目標値より大きい場合、以降の候補も大きいので終了
            if (candidate > remainingTarget) {
                break;
            }

            // 現在の候補を組み合わせに追加
            currentCombination.push(candidate);

            // 同じ候補を再度使用可能なので、startIndexは変更しない
            backtrack(i, currentCombination, remainingTarget - candidate);

            // バックトラック：候補を削除
            currentCombination.pop();
        }
    }

    backtrack(0, [], target);
    return result;
};
