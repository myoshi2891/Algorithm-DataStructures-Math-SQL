// 以下は **ビットマスクを用いた Sudoku 有効判定** の実装例です。
// `Set` を使わずに、整数のビット操作だけで重複チェックを行います。
Runtime;
1;
ms;
Beats;
99.56 % Memory;
57.75;
MB;
Beats;
46.64 %
    // ---

    // ### ビットマスク方式の考え方

    // * 数字 `1~9` を **ビット 0\~8** に対応させる。
    // * 例えば数字 `5` が出たら `(1 << (5-1))` でビットを立てる。
    // * 既に立っているビットに再び同じ数字が来たら重複。

    // ```
    //   数字 1 → 000000001
    //   数字 2 → 000000010
    //   数字 3 → 000000100
    //   ...
    //   数字 9 → 100000000
    // ```

    // * 各行・列・3x3 ボックスごとに 9 ビット整数で管理

    // ---

    // ### 実装例 (Node.js 18.16.1, LeetCode想定)

    // ```javascript
    /**
     * Determines if a 9x9 Sudoku board is valid using bitmasks.
     *
     * @param {string[][]} board - 9x9 Sudoku board, each element is '1'-'9' or '.' for empty.
     * @returns {boolean} - Returns true if the board is valid, false otherwise.
     *
     * 処理時間: O(81) ≒ O(1)
     * メモリ使用量: O(27) ≒ O(1) (整数配列のみ)
     */
    function isValidSudoku(board) {
        // 各行・列・ボックスをビットマスクで管理 (整数 0 ~ 2^9-1)
        const rows = new Array(9).fill(0);
        const cols = new Array(9).fill(0);
        const boxes = new Array(9).fill(0);

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = board[r][c];
                if (val === '.') continue;

                const num = parseInt(val, 10);
                const mask = 1 << (num - 1); // 対応ビット

                const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);

                // ビットが既に立っていれば重複 → 無効
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
    };
// ```

// ---

// ### ✅ この実装の特徴

// * **時間計算量:** 9×9固定なので O(1)
// * **メモリ使用量:**
//   `rows`・`cols`・`boxes` 各 9 個の整数のみ → 約 27 × 4 byte
// * **高速:**
//   `Set` のハッシュ計算なし、単なる整数演算のみ

// ---

// もしさらに最適化して、**空文字チェックとビット生成を1行で済ませる**書き方も可能です。
// 希望しますか？
