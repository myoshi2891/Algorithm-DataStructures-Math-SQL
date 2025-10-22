// TypeScript版の解法です。JavaScriptからの主な変更点：

// **型安全性の向上**:
// - 関数の引数と戻り値に明示的な型注釈
// - 変数宣言時の型注釈で型安全性を確保
// - `Array.fill(null)`を使用して型安全な配列初期化

// **パフォーマンス最適化**:
// - **時間計算量**: O(n²) - 各要素を一度だけ訪問
// - **空間計算量**: O(n²) - 結果マトリックスのみ（追加メモリは定数）
// - 不要なオブジェクト生成を避け、プリミティブ型のみ使用

// **TypeScript特有の利点**:
// - コンパイル時の型チェックによるバグの早期発見
// - IDEでの型補完とリファクタリング支援
// - 実行時エラーの削減

// この実装はLeetCodeのTypeScript環境で最適な性能を発揮し、型安全性も保証されています。

/**
 * 螺旋状にn×nマトリックスを1からn²まで埋める関数
 * @param n - マトリックスのサイズ (1 <= n <= 20)
 * @returns 螺旋状に埋められたn×nマトリックス
 */
function generateMatrix(n: number): number[][] {
    // n×nマトリックスを0で初期化
    const matrix: number[][] = Array(n)
        .fill(null)
        .map(() => Array(n).fill(0));

    let top: number = 0,
        bottom: number = n - 1,
        left: number = 0,
        right: number = n - 1;
    let num: number = 1;

    while (top <= bottom && left <= right) {
        // 上の行を左から右へ
        for (let col: number = left; col <= right; col++) {
            matrix[top][col] = num++;
        }
        top++;

        // 右の列を上から下へ
        for (let row: number = top; row <= bottom; row++) {
            matrix[row][right] = num++;
        }
        right--;

        // 下の行を右から左へ（行が残っている場合）
        if (top <= bottom) {
            for (let col: number = right; col >= left; col--) {
                matrix[bottom][col] = num++;
            }
            bottom--;
        }

        // 左の列を下から上へ（列が残っている場合）
        if (left <= right) {
            for (let row: number = bottom; row >= top; row--) {
                matrix[row][left] = num++;
            }
            left++;
        }
    }

    return matrix;
}

export { generateMatrix };
