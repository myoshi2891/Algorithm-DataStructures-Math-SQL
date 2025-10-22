// ```javascript
/**
 * Function: rotate
 * ----------------
 * Rotates an n x n matrix in-place by 90 degrees clockwise.
 *
 * @param {number[][]} matrix - The input square matrix (n x n).
 * @return {void} - Modifies the input matrix directly, no return value.
 *
 * Time Complexity: O(n^2)
 *   - We traverse all elements once (transpose + reverse rows).
 * Memory Usage: O(1)
 *   - In-place modification without extra matrix allocation.
 */
function rotate(matrix) {
    const n = matrix.length;

    // Step 1: Transpose the matrix (swap elements across the diagonal)
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // Step 2: Reverse each row to complete the 90-degree rotation
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
}

// ### 処理内容の解説

// 1. **転置処理 (Transpose)**

//    * 対角線を軸に `matrix[i][j]` と `matrix[j][i]` を交換。
//    * これで行と列が入れ替わる。

// 2. **行の反転 (Row Reverse)**

//    * 各行を左右反転することで90度回転が完了。

// ---

// ✅ **実行時間**: O(n²) (最大 n=20 なので高速)
// ✅ **メモリ消費**: O(1) (入力行列を直接操作、追加の配列を使用しない)

// この実装は **LeetCode** の制約 (in-place 操作 & クラス不要) に適合しています。
