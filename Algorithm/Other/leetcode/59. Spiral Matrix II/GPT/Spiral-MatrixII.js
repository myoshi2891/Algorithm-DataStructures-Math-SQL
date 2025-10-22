// ```javascript
/**
 * Generate an n x n spiral matrix filled with numbers from 1 to n^2
 *
 * @param {number} n - The size of the matrix (1 <= n <= 20)
 * @returns {number[][]} - The n x n spiral matrix
 *
 * 計算量: O(n^2) （すべてのセルを一度だけ訪問）
 * メモリ消費: O(n^2) （結果の行列を保持するため）
 */
function generateMatrix(n) {
    // n x n の空の配列を作成
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    let num = 1; // 入れる数値
    let left = 0; // 左境界
    let right = n - 1; // 右境界
    let top = 0; // 上境界
    let bottom = n - 1; // 下境界

    // すべてのセルを埋めるまで繰り返す
    while (left <= right && top <= bottom) {
        // 上の行を左→右に埋める
        for (let j = left; j <= right; j++) {
            matrix[top][j] = num++;
        }
        top++;

        // 右の列を上→下に埋める
        for (let i = top; i <= bottom; i++) {
            matrix[i][right] = num++;
        }
        right--;

        // 下の行を右→左に埋める
        if (top <= bottom) {
            for (let j = right; j >= left; j--) {
                matrix[bottom][j] = num++;
            }
            bottom--;
        }

        // 左の列を下→上に埋める
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                matrix[i][left] = num++;
            }
            left++;
        }
    }

    return matrix;
}
// ```

// この実装では

// * **処理時間**: O(n²) → すべての要素を一度だけ処理するため最適。
// * **メモリ消費**: O(n²) → 出力行列のため不可避。追加の補助配列は使っていないので効率的。

// 👉 `generateMatrix(n)` を呼び出すと、例のように螺旋状に数値が埋められた配列が返ります。
