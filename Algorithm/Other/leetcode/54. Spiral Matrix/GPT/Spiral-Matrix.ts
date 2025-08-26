// ```typescript
/**
 * 与えられた m x n の行列を螺旋順に走査してすべての要素を返す
 *
 * @param matrix - 入力となる m x n の2次元配列
 * @returns number[] - 行列を螺旋順に並べた一次元配列
 *
 * 時間計算量: O(m * n) → 行列の全要素を1度だけ訪問
 * 空間計算量: O(1) → 出力配列を除いて追加の空間は定数
 */
function spiralOrder(matrix: number[][]): number[] {
    const result: number[] = [];
    if (matrix.length === 0) return result;

    let top: number = 0;
    let bottom: number = matrix.length - 1;
    let left: number = 0;
    let right: number = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        // 上端を左から右へ
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;

        // 右端を上から下へ
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;

        // 下端を右から左へ（行が残っていれば）
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }

        // 左端を下から上へ（列が残っていれば）
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }

    return result;
}
// ```

// ✅ **特徴**

// * **関数ベース**（クラス不使用）
// * **TypeScript の型指定あり**
// * **O(mn) 時間・O(1) 空間（出力配列を除く）**
// * LeetCodeの TypeScript 解答欄にそのまま貼り付け可能

// このまま提出すれば効率的に動作します。
