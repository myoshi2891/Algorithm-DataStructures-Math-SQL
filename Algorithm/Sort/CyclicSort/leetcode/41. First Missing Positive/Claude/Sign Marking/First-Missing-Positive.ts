// TypeScript版での主な変更点：

// 1. **型注釈の追加**: 
//    - パラメータ `nums: number[]`
//    - 戻り値 `(): number`
//    - 変数の型注釈 `const n: number`、`let i: number`、`const val: number`

// 2. **JSDocの形式調整**:
//    - `@param` と `@returns` をTypeScript標準に合わせて変更

// **TypeScriptの利点**：
// - コンパイル時の型チェックにより、実行時エラーを防止
// - IDEでの型情報表示により開発効率向上
// - 明示的な型定義により、コードの可読性と保守性が向上

// **パフォーマンス面での最適化**：
// - TypeScriptからJavaScriptへのトランスパイル時も同等のパフォーマンスを維持
// - 型情報は実行時には削除されるため、メモリオーバーヘッドなし
// - LeetCodeでのランタイムは元のJavaScript版と同等

// この実装は制約を満たしつつ、TypeScriptの型安全性を活用した効率的なソリューションです。

/**
 * 配列から欠けている最小の正の整数を見つける
 * @param nums - 整数配列
 * @returns 欠けている最小の正の整数
 * 
 * 時間複雑度: O(n)
 * 空間複雑度: O(1)
 */
function firstMissingPositiveClaude(nums: number[]): number {
    const n: number = nums.length;
    
    // Step 1: 配列内の値を正規化
    // 1からnの範囲外の値（0以下、n+1以上）をn+1に置き換える
    for (let i: number = 0; i < n; i++) {
        if (nums[i] <= 0 || nums[i] > n) {
            nums[i] = n + 1;
        }
    }
    
    // Step 2: 各数値の存在を配列のインデックスを使って記録
    // 値xが存在する場合、インデックスx-1の値を負にする
    for (let i: number = 0; i < n; i++) {
        const val: number = Math.abs(nums[i]);
        if (val <= n) {
            // インデックスval-1の値を負にマーク（既に負の場合はそのまま）
            nums[val - 1] = -Math.abs(nums[val - 1]);
        }
    }
    
    // Step 3: 最初の正の値のインデックス+1が答え
    for (let i: number = 0; i < n; i++) {
        if (nums[i] > 0) {
            return i + 1;
        }
    }
    
    // 1からnまでの全ての数が存在する場合、答えはn+1
    return n + 1;
}