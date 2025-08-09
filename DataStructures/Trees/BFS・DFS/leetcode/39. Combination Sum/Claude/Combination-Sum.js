// このLeetCode問題（Combination Sum）をDFS + バックトラッキングで解決します。この解法の特徴：
// Runtime
// 2
// ms
// Beats
// 84.35%
// Memory
// 59.63
// MB
// Beats
// 65.89%

// **アルゴリズムの仕組み:**
// - DFS（深さ優先探索）で全ての可能な組み合わせを探索
// - バックトラッキングで無効なパスから戻って次の選択肢を試行
// - 同じ数字を無制限に使用可能（再帰時にstartIndexを変更しない）

// **最適化のポイント:**
// 1. **配列のソート**: 小さい数から試すことで早期終了を促進
// 2. **早期終了**: 候補値が残り目標値より大きい場合にループを打ち切り
// 3. **インデックス管理**: startIndexにより重複組み合わせを防止
// 4. **配列コピー**: `[...currentCombination]`でスプレッド演算子を使用（効率的）

// **時間計算量**: O(N^(T/M))
// - N: 候補数、T: target、M: 候補の最小値

// **空間計算量**: O(T/M)
// - 再帰の深さ（最大でtarget/最小候補値）

// この実装はLeetCodeでの実行時間とメモリ使用量を最適化しており、制約条件（組み合わせ数 < 150）内で効率的に動作します。

/**
 * @param {number[]} candidates - 重複のない正の整数の配列
 * @param {number} target - 目標となる合計値
 * @return {number[][]} - targetに合計が等しくなる全ての組み合わせの配列
 */
var combinationSum = function(candidates, target) {
    const result = [];
    const currentCombination = [];
    
    // パフォーマンス向上のため配列をソート（小さい数から試すことで早期終了を促進）
    candidates.sort((a, b) => a - b);
    
    /**
     * DFS + バックトラッキングによる再帰探索
     * @param {number} startIndex - 探索開始インデックス（重複回避のため）
     * @param {number} remainingTarget - 残りの目標値
     */
    function dfs(startIndex, remainingTarget) {
        // ベースケース：目標値に到達
        if (remainingTarget === 0) {
            result.push([...currentCombination]); // 配列のコピーを作成
            return;
        }
        
        // 残りの目標値が負の場合は無効なパス
        if (remainingTarget < 0) {
            return;
        }
        
        // 現在のインデックスから配列の末尾まで探索
        for (let i = startIndex; i < candidates.length; i++) {
            const candidate = candidates[i];
            
            // 早期終了：ソート済み配列なので、現在の候補が残り目標値より大きい場合
            // それ以降の候補も全て大きいため探索を打ち切る
            if (candidate > remainingTarget) {
                break;
            }
            
            // 現在の候補を組み合わせに追加
            currentCombination.push(candidate);
            
            // 再帰呼び出し：同じ数字を何度でも使えるためstartIndexはiのまま
            dfs(i, remainingTarget - candidate);
            
            // バックトラッキング：追加した候補を削除して次の候補を試す
            currentCombination.pop();
        }
    }
    
    // DFS探索を開始
    dfs(0, target);
    
    return result;
};