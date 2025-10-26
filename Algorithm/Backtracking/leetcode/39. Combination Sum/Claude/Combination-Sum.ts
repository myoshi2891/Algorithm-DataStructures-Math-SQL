// TypeScriptバージョンに変更しました。主な変更点：
// Runtime
// 3
// ms
// Beats
// 69.99%
// Memory
// 61.50
// MB
// Beats
// 41.71%
// **TypeScript固有の改善点：**
// 1. **型注釈の追加**: 全ての変数、パラメータ、戻り値に適切な型を指定
// 2. **関数宣言の変更**: `var function`から`function`宣言に変更（パフォーマンス向上）
// 3. **型安全性**: TypeScript 5.1の型チェックによりランタイムエラーを防止
// 4. **JSDocスタイル**: TypeScriptの標準的なコメント形式に変更

// **パフォーマンス最適化は同様に維持：**
// - 配列のソートによる早期終了
// - インデックス管理による重複回避
// - メモリ効率的なバックトラッキング
// - O(N^(T/M))の時間計算量とO(T/M)の空間計算量

// この実装はTypeScript 5.1環境でコンパイル・実行され、LeetCodeで最適なパフォーマンスを発揮します。
/**
 * 指定された配列から重複使用可能な要素を選んで目標値に達する全ての組み合わせを返す
 * @param candidates - 重複のない整数配列（各要素は無制限に使用可能）
 * @param target - 目標とする合計値
 * @returns 目標値に達する全ての組み合わせの配列
 */
function combinationSumClaude(candidates: number[], target: number): number[][] {
    const result: number[][] = [];

    // 配列をソートして早期終了を可能にする
    candidates.sort((a, b) => a - b);

    /**
     * バックトラッキングで組み合わせを探索
     * @param startIndex - 探索開始インデックス
     * @param currentCombination - 現在の組み合わせ
     * @param remainingTarget - 残りの目標値
     */
    function backtrack(
        startIndex: number,
        currentCombination: number[],
        remainingTarget: number,
    ): void {
        // 目標値に達した場合、結果に追加
        if (remainingTarget === 0) {
            result.push([...currentCombination]);
            return;
        }

        for (let i: number = startIndex; i < candidates.length; i++) {
            const candidate: number = candidates[i];

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
}
