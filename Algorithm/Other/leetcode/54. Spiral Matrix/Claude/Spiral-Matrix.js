// この問題は行列を螺旋状に読み取る問題ですね。効率的な解法を作成します。この解法の特徴：

// **時間計算量:** O(m × n) - 各要素を一度だけ訪問
// **空間計算量:** O(1) - 結果配列以外の追加スペースは境界変数のみ

// **アルゴリズムの説明:**
// 1. 4つの境界（top, bottom, left, right）を設定
// 2. 螺旋状に以下の順序で要素を読み取り：
//    - 上の行：左から右
//    - 右の列：上から下
//    - 下の行：右から左（行が残っている場合のみ）
//    - 左の列：下から上（列が残っている場合のみ）
// 3. 各方向の処理後に対応する境界を更新
// 4. すべての要素を処理するまで繰り返し

// **最適化のポイント:**
// - 不要な条件チェックを最小化
// - 境界条件で無駄な処理を回避
// - 単一のwhile ループで効率的に処理

// この実装はLeetCodeでの時間・メモリ効率を考慮した最適解です。

/**
 * 行列を螺旋状の順序で読み取り、要素を配列として返す
 * @param {number[][]} matrix - m x n の整数行列
 * @return {number[]} - 螺旋状に読み取った要素の配列
 */
var spiralOrder = function (matrix) {
    // 空の行列チェック
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const m = matrix.length;
    const n = matrix[0].length;
    const result = [];

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
};
