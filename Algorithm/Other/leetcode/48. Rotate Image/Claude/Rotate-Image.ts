// TypeScript版のソリューションです。

// **TypeScript特有の変更点**:
// - 型注釈: `matrix: number[][]`でパラメータの型を明示
// - 返却値型: `void`を明示的に指定
// - JSDocコメントをTypeScript形式に調整

// **最適化のポイント**:
// - 型安全性を保ちつつ、実行時のオーバーヘッドは最小限
// - TypeScript 5.1の型推論を活用し、冗長な型注釈を避けている
// - LeetCodeでのメモリとパフォーマンス要件を満たす設計

// この実装は元のJavaScriptと同じアルゴリズムで、TypeScriptの型システムによる安全性が追加されています。
/**
 * 2D行列を90度時計回りに回転させる関数（in-place）
 * @param matrix - n×nの2次元配列（1 <= n <= 20, -1000 <= matrix[i][j] <= 1000）
 * @returns 元の配列を直接変更するため返却値なし（void）
 */
function rotate(matrix: number[][]): void {
    const n = matrix.length;
    
    // レイヤーごとに処理（外側から内側へ）
    for (let layer = 0; layer < Math.floor(n / 2); layer++) {
        const first = layer;
        const last = n - 1 - layer;
        
        // 各レイヤーの各要素を4つずつ同時に回転
        for (let i = first; i < last; i++) {
            const offset = i - first;
            
            // 4つの要素を一時的に保存
            const top = matrix[first][i];
            
            // left -> top
            matrix[first][i] = matrix[last - offset][first];
            
            // bottom -> left  
            matrix[last - offset][first] = matrix[last][last - offset];
            
            // right -> bottom
            matrix[last][last - offset] = matrix[i][last];
            
            // top -> right
            matrix[i][last] = top;
        }
    }
}