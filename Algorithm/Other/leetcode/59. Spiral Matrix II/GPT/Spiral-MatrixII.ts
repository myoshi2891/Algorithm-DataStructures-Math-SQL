// ```typescript
/**
 * Generate an n x n spiral matrix filled with numbers from 1 to n^2
 *
 * @param {number} n - The size of the matrix (1 <= n <= 20)
 * @returns {number[][]} - The n x n spiral matrix
 *
 * 計算量: O(n^2) （全セルを一度だけ訪問）
 * メモリ消費: O(n^2) （結果の行列を保持するため）
 */
function generateMatrix(n: number): number[][] {
    // n x n の空の行列を作成
    const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    let num: number = 1; // 入れる値
    let left: number = 0; // 左境界
    let right: number = n - 1; // 右境界
    let top: number = 0; // 上境界
    let bottom: number = n - 1; // 下境界

    // 全セルを埋めるまでループ
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

// このTypeScript実装では:

// * **処理時間**: O(n²) → すべてのセルを一度だけ埋める。
// * **メモリ消費**: O(n²) → 出力行列を保持するため必要最低限。

// 👉 `generateMatrix(n)` を呼び出せば、例のように螺旋状に数値が埋められた `number[][]` が返ります。
