// ```typescript
// Runtime
// 1
// ms
// Beats
// 99.36%
// Memory
// 58.65
// MB
// Beats
// 74.32%

/**
 * 9x9 の数独盤面が有効かを判定する関数（ビットマスク版）
 *
 * @param board - 9x9 の数独盤面。各マスは '1'-'9' または '.'（空）を表す。
 * @returns boolean - 数独盤面が有効なら true、無効なら false を返す。
 *
 * 時間計算量: O(81) ≒ O(1)（9x9固定）
 * メモリ使用量: O(27) ≒ O(1)（行・列・ボックスのビットマスクを保持）
 */
function isValidSudokuGpt(board: string[][]): boolean {
    // 各行・列・ボックスを9ビット整数で管理
    const rows: number[] = new Array(9).fill(0);
    const cols: number[] = new Array(9).fill(0);
    const boxes: number[] = new Array(9).fill(0);

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = board[r][c];
            if (val === '.') continue;

            const num: number = parseInt(val, 10);
            const mask: number = 1 << (num - 1); // 対応するビットを立てる

            const boxIndex: number = Math.floor(r / 3) * 3 + Math.floor(c / 3);

            // 既に同じ数字が出現していれば無効
            if (rows[r] & mask || cols[c] & mask || boxes[boxIndex] & mask) {
                return false;
            }

            // ビットを立てる
            rows[r] |= mask;
            cols[c] |= mask;
            boxes[boxIndex] |= mask;
        }
    }

    return true;
}
// ```

// ---

// ### ✅ 実装の特徴

// * **高速・省メモリ**

//   * `Set` を使わず、整数27個だけで管理。
//   * 81マスのチェックで完了 → 時間計算量 O(1)
// * **メモリ使用量**

//   * `rows`・`cols`・`boxes` の合計 27 個の number（約 216byte）

// ---

// この関数は LeetCode にそのまま提出可能です。
// もし希望すれば、**空チェック・ビット生成・重複チェックを1行で行う超短縮版**も作成できますが、可読性は下がります。
