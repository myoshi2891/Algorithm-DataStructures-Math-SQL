// //  TypeScriptでの解法を提供します。型注釈を追加して、より型安全なコードにしました。TypeScriptでの改善点：

// **型安全性の向上**:
// 1. **関数シグネチャ**: `(nums: number[]): number[][]` で入力と出力の型を明確に定義
// 2. **変数の型注釈**: `result: number[][]`, `currentPermutation: number[]`, `used: boolean[]` で型を明示
// 3. **ヘルパー関数の型注釈**: パラメータと返り値（`void`）の型を明確に定義

// **パフォーマンス特性** (JavaScriptと同じ):
// - **時間計算量**: O(n! × n) - n個の要素の順列はn!個あり、各順列の構築にO(n)
// - **空間計算量**: O(n) - 再帰スタック深度とused配列がO(n)

// **TypeScriptの利点**:
// 1. **コンパイル時エラー検出**: 型不一致による実行時エラーを防止
// 2. **IDEサポート**: より良いオートコンプリートと型情報表示
// 3. **リファクタリング安全性**: 型情報により安全なコード変更が可能

// この実装はTypeScript 5.1とNode.js 18.16.1の環境で最適化されており、LeetCodeでの提出時に良好なパフォーマンスを発揮します。

/**
 * 配列の全ての順列を生成する関数
 * @param nums - 異なる整数の配列
 * @returns 全ての可能な順列の配列
 */
function permuteClaude(nums: number[]): number[][] {
    const result: number[][] = [];
    const currentPermutation: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);
    
    /**
     * バックトラッキングを用いて順列を生成するヘルパー関数
     * @param nums - 元の配列
     * @param currentPermutation - 現在構築中の順列
     * @param used - 各要素が使用されているかを示すフラグ配列
     * @param result - 結果を格納する配列
     */
    function backtrack(
        nums: number[], 
        currentPermutation: number[], 
        used: boolean[], 
        result: number[][]
    ): void {
        // ベースケース: 現在の順列の長さが元の配列と同じになったら完成
        if (currentPermutation.length === nums.length) {
            result.push([...currentPermutation]); // スプレッド演算子でコピーを作成
            return;
        }
        
        // 各要素を試行
        for (let i = 0; i < nums.length; i++) {
            // 既に使用されている要素はスキップ
            if (used[i]) continue;
            
            // 要素を追加してマークする
            currentPermutation.push(nums[i]);
            used[i] = true;
            
            // 再帰的に次の位置を埋める
            backtrack(nums, currentPermutation, used, result);
            
            // バックトラック: 追加した要素を削除してマークを外す
            currentPermutation.pop();
            used[i] = false;
        }
    }
    
    backtrack(nums, currentPermutation, used, result);
    return result;
}