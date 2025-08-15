// TypeScript版の実装が完成しました。JavaScript版からの主な変更点：

// **TypeScriptの型安全性:**
// 1. **関数シグネチャ**: `height: number[]` と `(): number` で明確な型定義
// 2. **変数の型注釈**: 全ての変数に明示的な型を指定
// 3. **型推論の活用**: TypeScript 5.1の型推論機能を最大限活用

// **パフォーマンスの特徴:**
// - **時間計算量**: O(n) - 依然として最適
// - **空間計算量**: O(1) - 追加のメモリ使用なし
// - **型チェック**: コンパイル時に型エラーを検出し、実行時エラーを防止

// **LeetCode対応:**
// - TypeScriptの型システムによりバグを事前に防止
// - 実行時のパフォーマンスはJavaScript版と同等
// - より保守性の高いコード

// この実装は型安全性を保ちながら、最適な時間・空間計算量を維持しています。

/**
 * 雨水をトラップする量を計算する関数
 * 
 * @param height - 各位置の高さを表す配列（非負整数）
 * @returns トラップできる雨水の総量
 * 
 * 時間計算量: O(n) - 配列を一度だけ走査
 * 空間計算量: O(1) - 追加の配列を使用しない
 * 
 * アルゴリズム:
 * 1. 左右から2つのポインタを使用
 * 2. 各ポインタで現在までの最大高度を追跡
 * 3. より低い最大高度を持つ側から処理を進める
 * 4. 現在の高さが最大高度より低い場合、差分が水の量
 */
function trap(height: number[]): number {
    // 空配列または要素が1個以下の場合は水をトラップできない
    if (!height || height.length <= 2) {
        return 0;
    }
    
    let left: number = 0;                    // 左ポインタ
    let right: number = height.length - 1;   // 右ポインタ
    let leftMax: number = 0;                 // 左側の最大高度
    let rightMax: number = 0;                // 右側の最大高度
    let water: number = 0;                   // トラップされた水の総量
    
    // 左右のポインタが交差するまで処理を続ける
    while (left < right) {
        // 左側の高さが右側より低い場合
        if (height[left] < height[right]) {
            // 左側の最大高度を更新するか、水をトラップ
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                // 現在の高さが最大高度より低い場合、差分が水の量
                water += leftMax - height[left];
            }
            left++;
        } else {
            // 右側の高さが左側以上の場合
            // 右側の最大高度を更新するか、水をトラップ
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                // 現在の高さが最大高度より低い場合、差分が水の量
                water += rightMax - height[right];
            }
            right--;
        }
    }
    
    return water;
}