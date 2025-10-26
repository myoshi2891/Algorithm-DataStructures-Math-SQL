// TypeScriptでN-Queens問題を解きます。型安全性を保ちながら効率的な実装にします。TypeScript版のN-Queens解法を作成しました。主な変更点：

// 1. **型注釈の追加**：
//    - 関数のパラメータと戻り値に型を明示
//    - 配列の型を `string[][]` として明確化
//    - 内部関数にも適切な型注釈

// 2. **TypeScript特有の最適化**：
//    - `Array(n).fill(null)` を使用してTypeScriptの型チェッカーを満足
//    - 戻り値の型を明示的に指定

// 3. **パフォーマンス重視**：
//    - 同じバックトラッキングアルゴリズムを維持
//    - メモリ使用量を最小限に抑制
//    - 不要な配列コピーを避ける

// この実装は型安全性を保ちながら、LeetCodeでの実行時間とメモリ使用量を最適化しています。TypeScript 5.1の機能を活用し、コンパイル時の型チェックによってランタイムエラーを防止します。

/**
 * N-Queens問題を解く関数
 * @param n - チェスボードのサイズ (n x n)
 * @returns 全ての解の配列。各解は文字列の配列で、'Q'はクイーン、'.'は空きマスを表す
 */
function solveNQueensClaude(n: number): string[][] {
    const result: string[][] = [];
    const board: string[][] = Array(n)
        .fill(null)
        .map(() => Array(n).fill('.'));

    /**
     * 指定された位置にクイーンを配置できるかチェック
     * @param row - 行のインデックス
     * @param col - 列のインデックス
     * @returns 配置可能かどうか
     */
    function isSafe(row: number, col: number): boolean {
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
     * @param row - 現在の行
     */
    function backtrack(row: number): void {
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
