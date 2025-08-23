/**
 * solveNQueens
 * n-queens 問題を解く関数
 *
 * @param {number} n - チェス盤のサイズ (1 <= n <= 9)
 * @returns {string[][]} - 全ての有効なクイーン配置を返す。各配置は文字列の配列。
 *
 * 処理時間: O(n!) に近い計算量。バックトラッキングで全探索するため。
 * メモリ消費量: O(n^2 * 解の個数)。盤面を保存するため。
 */
function solveNQueensGPT(n: number): string[][] {
    const results: string[][] = [];

    // 現在の盤面を '.' で初期化
    const board: string[][] = Array.from({ length: n }, () => Array(n).fill('.'));

    // 使用済みの列・斜めを記録する集合
    const cols: Set<number> = new Set(); // 同じ列
    const diag1: Set<number> = new Set(); // 左上 -> 右下 (row - col)
    const diag2: Set<number> = new Set(); // 右上 -> 左下 (row + col)

    /**
     * バックトラッキング探索
     * @param {number} row - 現在の行
     */
    function backtrack(row: number): void {
        if (row === n) {
            // 完成した盤面をコピーして結果に追加
            const solution: string[] = board.map((r) => r.join(''));
            results.push(solution);
            return;
        }

        for (let col = 0; col < n; col++) {
            // 攻撃範囲にある場合はスキップ
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                continue;
            }

            // クイーンを置く
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);

            backtrack(row + 1);

            // クイーンを外す (バックトラック)
            board[row][col] = '.';
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }

    backtrack(0);
    return results;
}
