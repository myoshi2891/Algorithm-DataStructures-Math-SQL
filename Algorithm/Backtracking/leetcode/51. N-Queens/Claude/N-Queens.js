// N-Queens問題をJavaScriptで効率的に解きます。バックトラッキングアルゴリズムを使用し、各行にクイーンを1つずつ配置していきます。この解法のポイント：

// 1. **バックトラッキング**：各行に1つずつクイーンを配置し、無効な配置の場合は前の状態に戻って別の配置を試します。

// 2. **効率的な衝突チェック**：
//    - 同じ列のチェック（上方向のみ）
//    - 左上対角線のチェック
//    - 右上対角線のチェック
//    - 同じ行は考慮不要（各行に1つずつ配置するため）

// 3. **メモリ効率**：
//    - 1つのボードを再利用してバックトラッキング
//    - 解が見つかった時のみ新しい配列を作成

// 4. **時間計算量**：O(N!) - 各行で可能な配置を試行
// 5. **空間計算量**：O(N²) - ボードサイズ + 再帰スタック

// この実装はLeetCodeの制約（n ≤ 9）に対して十分に効率的で、処理時間とメモリ使用量を最適化しています。

/**
 * N-Queens問題を解く関数
 * @param {number} n - チェスボードのサイズ (n x n)
 * @return {string[][]} - 全ての解の配列。各解は文字列の配列で、'Q'はクイーン、'.'は空きマスを表す
 */
function solveNQueens(n) {
    const result = [];
    const board = Array(n)
        .fill()
        .map(() => Array(n).fill('.'));

    /**
     * 指定された位置にクイーンを配置できるかチェック
     * @param {number} row - 行のインデックス
     * @param {number} col - 列のインデックス
     * @return {boolean} - 配置可能かどうか
     */
    function isSafe(row, col) {
        // 同じ列をチェック（上方向のみ、下はまだ配置していないため）
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }

        // 左上対角線をチェック
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') return false;
        }

        // 右上対角線をチェック
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') return false;
        }

        return true;
    }

    /**
     * バックトラッキングを使用してクイーンを配置
     * @param {number} row - 現在の行
     */
    function backtrack(row) {
        // ベースケース：全ての行にクイーンを配置完了
        if (row === n) {
            // 現在のボード状態を文字列配列として結果に追加
            result.push(board.map((row) => row.join('')));
            return;
        }

        // 現在の行の各列でクイーンの配置を試行
        for (let col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                // クイーンを配置
                board[row][col] = 'Q';
                // 次の行に進む
                backtrack(row + 1);
                // バックトラック（クイーンを取り除く）
                board[row][col] = '.';
            }
        }
    }

    backtrack(0);
    return result;
}
