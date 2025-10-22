// ```javascript
Runtime;
5;
ms;
Beats;
61.41 % Memory;
55.41;
MB;
Beats;
96.82 %
    /**
     * Determines if a 9x9 Sudoku board is valid.
     *
     * @param {string[][]} board - 9x9 Sudoku board, each element is '1'-'9' or '.' for empty.
     * @returns {boolean} - Returns true if the board is valid, false otherwise.
     *
     * 処理時間: O(81) ≒ O(1) (定数時間)
     * メモリ使用量: O(81) ≒ O(1) (rows, cols, boxes のSet)
     *
     * - 各行、各列、各3x3ブロックにおいて数字が重複しないことを確認
     * - 空マス '.' は無視
     */
    function isValidSudoku(board) {
        // 各行、列、ボックス用の集合
        const rows = Array.from({ length: 9 }, () => new Set());
        const cols = Array.from({ length: 9 }, () => new Set());
        const boxes = Array.from({ length: 9 }, () => new Set());

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = board[r][c];
                if (val === '.') continue; // 空マスはスキップ

                // ボックスのインデックス計算 (0~8)
                const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);

                // 既に存在する場合は無効
                if (rows[r].has(val) || cols[c].has(val) || boxes[boxIndex].has(val)) {
                    return false;
                }

                // 登録
                rows[r].add(val);
                cols[c].add(val);
                boxes[boxIndex].add(val);
            }
        }

        return true;
    };
// ```

// ---

// この実装は以下の点で効率的です:

// * **時間計算量:**
//   盤面は9x9固定のため、最大81回のチェックで完了し O(1) 扱いです。
// * **メモリ消費量:**
//   `Set` を27個使用するのみで、要素数も最大81個のため O(1) 扱いです。

// ---
