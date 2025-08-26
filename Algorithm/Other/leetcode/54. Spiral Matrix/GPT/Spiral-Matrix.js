// ```javascript
/**
 * 与えられた m x n の行列を螺旋順に走査してすべての要素を返す
 *
 * @param {number[][]} matrix - 入力となる m x n 行列
 * @returns {number[]} - 行列を螺旋順に並べた一次元配列
 *
 * 時間計算量: O(m * n) → 行列の全要素を1度だけ訪問
 * 空間計算量: O(1) → 出力配列を除いて追加の空間は定数
 */
function spiralOrder(matrix) {
    const result = [];
    if (!matrix || matrix.length === 0) return result;

    // 行列の境界を初期化
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;

    // すべての要素が追加されるまでループ
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

// この実装は **クラスを使わず関数ベース** にしています。

// * **時間計算量 O(mn)**: 行列の要素をすべて一度だけ処理。
// * **空間計算量 O(1)**: 出力配列以外は定数領域のみ使用。

// メモリ消費を抑えつつ、LeetCodeでも効率的に動作します。
