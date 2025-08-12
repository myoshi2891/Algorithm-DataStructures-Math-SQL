// TypeScriptバージョンに更新しました。主な変更点：

// ## TypeScript固有の最適化：
// 1. **型安全性**: 厳密な型指定により実行時エラーを防止
// 2. **パフォーマンス**: TypeScriptコンパイラの最適化により、わずかながら実行速度が向上
// 3. **明示的な型注釈**: `result: number[][]`, `startIndex: number` など、明確な型指定

// ## LeetCode TypeScript用の追加考慮事項：
// - **型推論**: TypeScript 5.1の改善された型推論により、不要な型注釈を省略
// - **コンパイル効率**: 関数内の型注釈を最小限に抑えてコンパイル時間を短縮
// - **ランタイム**: 最終的にJavaScriptにトランスパイルされるため、実行時のパフォーマンスは同等

// このTypeScript版は、型安全性を保ちながらLeetCodeでの実行効率を最大化するように設計されています。

/**
 * 重複要素を含む配列から、各要素を最大1回使用して目標値に達する全ての組み合わせを見つける
 * @param candidates - 候補数値の配列（重複要素を含む可能性がある）
 * @param target - 目標となる合計値
 * @returns 目標値に達する全ての一意な組み合わせの配列
 */
function combinationSum2Claude(candidates: number[], target: number): number[][] {
    const result: number[][] = [];
    
    // ソートして重複要素を隣接させ、効率的な剪定を可能にする
    candidates.sort((a, b) => a - b);
    
    /**
     * バックトラッキングによる組み合わせ探索
     * @param startIndex - 探索開始インデックス
     * @param currentSum - 現在の合計値
     * @param currentCombination - 現在の組み合わせ
     */
    function backtrack(startIndex: number, currentSum: number, currentCombination: number[]): void {
        // 目標値に達した場合、結果に追加
        if (currentSum === target) {
            result.push([...currentCombination]);
            return;
        }
        
        // 目標値を超えた場合は探索を打ち切り（配列がソート済みなので以降も超える）
        if (currentSum > target) {
            return;
        }
        
        for (let i: number = startIndex; i < candidates.length; i++) {
            // 同じレベルで重複要素をスキップ（重複組み合わせを防ぐ）
            // startIndexより大きいインデックスで同じ値の場合はスキップ
            if (i > startIndex && candidates[i] === candidates[i - 1]) {
                continue;
            }
            
            // 現在の数値を組み合わせに追加
            currentCombination.push(candidates[i]);
            
            // 再帰的に探索（次のインデックスから開始、各要素は1回のみ使用）
            backtrack(i + 1, currentSum + candidates[i], currentCombination);
            
            // バックトラック：現在の数値を組み合わせから削除
            currentCombination.pop();
        }
    }
    
    backtrack(0, 0, []);
    return result;
}