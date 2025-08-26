// TypeScript版に更新しました。主な変更点：

// **TypeScript特有の変更:**
// 1. **関数宣言:** `var` から `function` へ変更
// 2. **型注釈:** パラメータと戻り値に明示的な型を追加
// 3. **配列初期化:** `result` 配列に型注釈を追加
// 4. **JSDoc形式:** TypeScript標準のコメント形式に更新

// **パフォーマンス特性:**
// - **時間計算量:** O(m × n) - 各要素を一度だけ訪問
// - **空間計算量:** O(1) - 結果配列以外の追加メモリは定数量
// - **メモリ効率:** TypeScriptコンパイル後もJavaScriptと同等の効率

// この実装はTypeScript 5.1とNode.js 18.16.1の環境で最適化され、LeetCodeでの実行時間とメモリ使用量を最小化するよう設計されています。

/**
 * 行列を螺旋状の順序で読み取り、要素を配列として返す
 * @param matrix - m x n の整数行列
 * @returns 螺旋状に読み取った要素の配列
 */
function spiralOrder(matrix: number[][]): number[] {
    // 空の行列チェック
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }
    
    const m = matrix.length;
    const n = matrix[0].length;
    const result: number[] = [];
    
    // 境界を定義
    let top = 0;
    let bottom = m - 1;
    let left = 0;
    let right = n - 1;
    
    while (top <= bottom && left <= right) {
        // 上の行を左から右へ
        for (let j = left; j <= right; j++) {
            result.push(matrix[top][j]);
        }
        top++;
        
        // 右の列を上から下へ
        for (let i = top; i <= bottom; i++) {
            result.push(matrix[i][right]);
        }
        right--;
        
        // 下の行を右から左へ（残りの行がある場合）
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                result.push(matrix[bottom][j]);
            }
            bottom--;
        }
        
        // 左の列を下から上へ（残りの列がある場合）
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(matrix[i][left]);
            }
            left++;
        }
    }
    
    return result;
}