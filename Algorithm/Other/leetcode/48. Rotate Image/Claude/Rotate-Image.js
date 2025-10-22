// この問題は画像を90度時計回りに回転させる問題です。in-placeで実行する必要があるため、効率的なアプローチを使用します。このソリューションの説明：

// **アプローチ**: レイヤーベースの4要素同時回転
// - 行列を同心円状のレイヤーに分割し、外側から内側へ処理
// - 各レイヤーで4つの要素を同時に回転させることで効率的に処理

// **時間計算量**: O(n²)
// - 全ての要素を1回ずつ処理するため最適

// **空間計算量**: O(1)
// - 一時変数のみ使用し、追加の配列を作成しない

// **処理の流れ**:
// 1. `layer`（レイヤー）を外側から内側へ順次処理
// 2. 各レイヤーで4つの対応する位置の要素を同時に回転
// 3. 一時変数`top`で最初の値を保存し、連鎖的に値を移動

// この実装はLeetCodeでの制約を満たし、メモリ効率とパフォーマンスの両方を最適化しています。

/**
 * 2D行列を90度時計回りに回転させる関数（in-place）
 * @param {number[][]} matrix - n×nの2次元配列（1 <= n <= 20, -1000 <= matrix[i][j] <= 1000）
 * @return {void} 元の配列を直接変更するため返却値なし
 */
function rotate(matrix) {
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
