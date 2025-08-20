// ```typescript
/**
 * Function: rotate
 * ----------------
 * Rotates an n x n matrix in-place by 90 degrees clockwise.
 *
 * @param {number[][]} matrix - The input square matrix (n x n).
 * @returns {void} - Modifies the input matrix directly, no return value.
 *
 * Time Complexity: O(n^2)
 *   - We traverse all elements once (transpose + reverse rows).
 * Memory Usage: O(1)
 *   - In-place modification without extra matrix allocation.
 */
function rotate(matrix: number[][]): void {
    const n: number = matrix.length;

    // Step 1: Transpose the matrix (swap across diagonal)
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const temp: number = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}
// ```

// ---

// ### 処理内容の解説

// 1. **転置 (Transpose)**

//    * 対角線を軸に要素を交換 (`matrix[i][j]` ↔ `matrix[j][i]`)
//    * 行と列を入れ替える。

// 2. **行の反転 (Row Reverse)**

//    * 各行を反転することで、90度回転が完成。

// ---

// ✅ **時間計算量**: O(n²)（n=20以内なので十分高速）
// ✅ **メモリ使用量**: O(1)（入力行列を直接操作、追加の配列を使わない）

// この実装は **LeetCode** の仕様に準拠しており、TypeScript 5.1 + Node.js 18.16.1 環境でもそのまま利用できます。
