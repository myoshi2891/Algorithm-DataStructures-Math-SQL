// ```javascript
/**
 * solveSudoku
 * @param {string[][]} board - 9x9の数独盤面、'.'は空マスを表す
 * @returns {void} - 盤面boardを解に変換（in-placeで更新）
 *
 * 処理時間: O(9^(空マス数)) 最悪だが、バックトラッキングとビットマスクで高速化
 * メモリ使用量: O(1) 追加配列は固定サイズ(9x9、ビットマスク3つ)
 */
function solveSudokuJs(board) {
    const N = 9;

    // 行・列・3x3ブロックごとの使用数字をビットマスクで管理
    const rowMask = new Array(N).fill(0);
    const colMask = new Array(N).fill(0);
    const boxMask = new Array(N).fill(0);

    const emptyCells = []; // 空マスの位置を記録

    // 初期状態のマスク作成
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = board[i][j];
            if (cell === '.') {
                emptyCells.push([i, j]);
            } else {
                const num = parseInt(cell, 10);
                const bit = 1 << num;
                rowMask[i] |= bit;
                colMask[j] |= bit;
                boxMask[getBoxIndex(i, j)] |= bit;
            }
        }
    }

    // 3x3ブロック番号(0~8)計算
    function getBoxIndex(i, j) {
        return Math.floor(i / 3) * 3 + Math.floor(j / 3);
    }

    // 再帰DFSでバックトラッキング
    function dfs(idx) {
        if (idx === emptyCells.length) return true; // 全マス確定

        const [i, j] = emptyCells[idx];
        const bIdx = getBoxIndex(i, j);

        // 1~9まで試す
        for (let num = 1; num <= 9; num++) {
            const bit = 1 << num;
            if (rowMask[i] & bit || colMask[j] & bit || boxMask[bIdx] & bit) {
                continue; // 使用済みはスキップ
            }

            // 候補を置く
            board[i][j] = num.toString();
            rowMask[i] |= bit;
            colMask[j] |= bit;
            boxMask[bIdx] |= bit;

            if (dfs(idx + 1)) return true; // 次へ進む

            // 戻す
            board[i][j] = '.';
            rowMask[i] ^= bit;
            colMask[j] ^= bit;
            boxMask[bIdx] ^= bit;
        }
        return false; // 置ける数字がない
    }

    dfs(0);
}
// ```

// ---

// ### 実装の特徴

// 1. **ビットマスク使用で高速化**

//    * `rowMask[i]` は行iに使われている数字のビット集合
//    * `colMask[j]` は列jに使われている数字のビット集合
//    * `boxMask[b]` は3x3ブロックbに使われている数字のビット集合
//    * 1\~9に対応するビットを `1 << num` で管理

// 2. **バックトラッキング**

//    * 空マスを先に列挙して順番に埋める
//    * 適合する数字がなければ戻る

// 3. **メモリ消費**

//    * `rowMask`, `colMask`, `boxMask` は長さ9の固定配列のみ
//    * 盤面はin-place更新なので余計なコピーは行わない

// ---

// この関数はLeetCodeの **`solveSudoku`** にそのまま提出可能です。

// ---

// 必要であれば、このアルゴリズムを**空マスの候補数が少ない順に選ぶ最適化版**にして、さらに実行時間を短縮できます。
// 希望されますか？
