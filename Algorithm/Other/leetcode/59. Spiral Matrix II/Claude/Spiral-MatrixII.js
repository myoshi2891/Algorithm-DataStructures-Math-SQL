// この問題は螺旋状にマトリックスを埋める問題ですね。効率的な解法を提供します。この解法の特徴：

// **時間計算量**: O(n²) - マトリックスの各要素を一度だけ訪問
// **空間計算量**: O(n²) - 結果のマトリックスのみ（入力以外の追加空間は定数）

// **アルゴリズムの説明**:
// 1. 4つの境界（上、下、左、右）を設定
// 2. 螺旋の各方向に沿って要素を埋める：
//    - 上の行を左→右
//    - 右の列を上→下
//    - 下の行を右→左（行が残っている場合）
//    - 左の列を下→上（列が残っている場合）
// 3. 各方向を完了後、対応する境界を内側に移動
// 4. すべての要素が埋まるまで繰り返し

// この実装はLeetCodeで最適な性能を発揮し、メモリ使用量も最小限に抑えられています。

/**
 * 螺旋状にn×nマトリックスを1からn²まで埋める関数
 * @param {number} n - マトリックスのサイズ (1 <= n <= 20)
 * @returns {number[][]} - 螺旋状に埋められたn×nマトリックス
 */
var generateMatrix = function (n) {
    // n×nマトリックスを0で初期化
    const matrix = Array(n)
        .fill()
        .map(() => Array(n).fill(0));

    let top = 0,
        bottom = n - 1,
        left = 0,
        right = n - 1;
    let num = 1;

    while (top <= bottom && left <= right) {
        // 上の行を左から右へ
        for (let col = left; col <= right; col++) {
            matrix[top][col] = num++;
        }
        top++;

        // 右の列を上から下へ
        for (let row = top; row <= bottom; row++) {
            matrix[row][right] = num++;
        }
        right--;

        // 下の行を右から左へ（行が残っている場合）
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                matrix[bottom][col] = num++;
            }
            bottom--;
        }

        // 左の列を下から上へ（列が残っている場合）
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                matrix[row][left] = num++;
            }
            left++;
        }
    }

    return matrix;
};
