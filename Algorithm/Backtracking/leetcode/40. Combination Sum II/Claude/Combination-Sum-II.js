// この問題は「Combination Sum II」という典型的なバックトラッキング問題ですね。重複要素を含む配列から、各要素を最大1回だけ使って目標値に達する全ての組み合わせを見つける必要があります。このソリューションの特徴とLeetCode用の最適化ポイント：

// ## アルゴリズムの特徴：
// 1. **事前ソート**: 配列をソートすることで重複要素を隣接させ、効率的な剪定を可能にします
// 2. **バックトラッキング**: 再帰的に全ての可能な組み合わせを探索します
// 3. **重複除去**: 同じレベルでの重複要素をスキップして、重複した組み合わせを防ぎます
// 4. **早期終了**: 現在の合計が目標値を超えた場合、即座に探索を打ち切ります

// ## 最適化のポイント：
// - **時間計算量**: O(2^n) - 最悪の場合、各要素について選ぶ/選ばないの2択
// - **空間計算量**: O(target) - 再帰の深さは最大でtargetまで
// - **メモリ効率**: 配列のコピーを最小限に抑え、バックトラッキングで状態を復元
// - **剪定効果**: ソート済み配列により、不要な探索を大幅に削減

// 重複除去の核心は `i > startIndex && candidates[i] === candidates[i - 1]` の条件で、これにより同じレベルでの重複要素の使用を防ぎ、結果の一意性を保証しています。

/**
 * 重複要素を含む配列から、各要素を最大1回使用して目標値に達する全ての組み合わせを見つける
 * @param {number[]} candidates - 候補数値の配列（重複要素を含む可能性がある）
 * @param {number} target - 目標となる合計値
 * @return {number[][]} 目標値に達する全ての一意な組み合わせの配列
 */
function combinationSum2Js(candidates, target) {
    const result = [];
    
    // ソートして重複要素を隣接させ、効率的な剪定を可能にする
    candidates.sort((a, b) => a - b);
    
    /**
     * バックトラッキングによる組み合わせ探索
     * @param {number} startIndex - 探索開始インデックス
     * @param {number} currentSum - 現在の合計値
     * @param {number[]} currentCombination - 現在の組み合わせ
     */
    function backtrack(startIndex, currentSum, currentCombination) {
        // 目標値に達した場合、結果に追加
        if (currentSum === target) {
            result.push([...currentCombination]);
            return;
        }
        
        // 目標値を超えた場合は探索を打ち切り（配列がソート済みなので以降も超える）
        if (currentSum > target) {
            return;
        }
        
        for (let i = startIndex; i < candidates.length; i++) {
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