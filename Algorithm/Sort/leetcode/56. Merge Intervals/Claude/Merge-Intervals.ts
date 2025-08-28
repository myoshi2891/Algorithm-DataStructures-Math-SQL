// TypeScriptで型安全性を保ちながら、効率的なソリューションを提供いたします。TypeScript版の改良点：

// **型安全性の強化：**
// - `intervals: number[][]` - 入力パラメーターの型定義
// - `number[][]` - 戻り値の型定義
// - 全ての変数に明示的な型注釈を追加

// **TypeScript 5.1の最適化：**
// - **型推論の活用**: 可能な箇所で型推論を利用してコードを簡潔に
// - **厳密な型チェック**: コンパイル時エラーの早期発見
// - **関数シグネチャ**: パラメーターと戻り値の型が明確

// **パフォーマンス特性：**
// - **時間計算量**: O(n log n) - ソート処理
// - **空間計算量**: O(1) - ソート以外は定数空間
// - **メモリ効率**: 型情報はコンパイル時のみ、実行時オーバーヘッドなし

// **LeetCode対策での利点：**
// - 型エラーによるランタイムエラーの防止
// - IDE支援による開発効率向上
// - JavaScriptと同等のランタイムパフォーマンス
// - 制約条件（1 ≤ intervals.length ≤ 10⁴）に最適化

// この実装はTypeScriptの型安全性を活かしながら、JavaScriptと同等の実行速度とメモリ効率を実現しています。

/**
 * 重複する区間をマージして、重複のない区間の配列を返す
 * @param intervals - 区間の配列。各区間は[start, end]の形式
 * @returns マージされた重複のない区間の配列
 * 
 * 時間計算量: O(n log n) - ソート処理が支配的
 * 空間計算量: O(1) - 入力配列を直接変更するため（ソートを除く）
 */
function merge(intervals: number[][]): number[][] {
    // 空配列または単一要素の場合はそのまま返す
    if (intervals.length <= 1) {
        return intervals;
    }
    
    // 区間を開始点でソート
    intervals.sort((a: number[], b: number[]): number => a[0] - b[0]);
    
    // 結果を格納する配列（最初の区間から開始）
    const merged: number[][] = [intervals[0]];
    
    // 2番目の区間から順次処理
    for (let i: number = 1; i < intervals.length; i++) {
        const current: number[] = intervals[i];
        const lastMerged: number[] = merged[merged.length - 1];
        
        // 現在の区間が直前のマージ済み区間と重複している場合
        if (current[0] <= lastMerged[1]) {
            // 終了点を更新してマージ
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // 重複していない場合は新しい区間として追加
            merged.push(current);
        }
    }
    
    return merged;
}