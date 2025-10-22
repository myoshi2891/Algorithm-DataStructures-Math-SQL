// ```typescript
// Runtime
// 104
// ms
// Beats
// 91.95%
// Memory
// 60.23
// MB
// Beats
// 55.17%

/**
 * solveSudoku
 * @param board - 9x9の数独盤面、'.'は空マスを表す
 * @returns void - boardをin-placeで解答に更新
 *
 * 処理時間: O(9^(空マス数)) 最悪だが、ビットマスクによる高速化で現実的
 * メモリ使用量: O(1) 追加配列は固定サイズのみ
 */
function solveSudokuGPT(board: string[][]): void {
    const N: number = 9;

    // 行・列・3x3ブロックごとの使用数字をビットマスクで管理
    const rowMask: number[] = new Array(N).fill(0);
    const colMask: number[] = new Array(N).fill(0);
    const boxMask: number[] = new Array(N).fill(0);

    const emptyCells: [number, number][] = []; // 空マスの位置を記録

    // 初期状態のマスク作成
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const cell = board[i][j];
            if (cell === '.') {
                emptyCells.push([i, j]);
            } else {
                const num: number = parseInt(cell, 10);
                const bit: number = 1 << num;
                rowMask[i] |= bit;
                colMask[j] |= bit;
                boxMask[getBoxIndex(i, j)] |= bit;
            }
        }
    }

    // 3x3ブロック番号(0~8)計算
    function getBoxIndex(i: number, j: number): number {
        return Math.floor(i / 3) * 3 + Math.floor(j / 3);
    }

    // 再帰DFSでバックトラッキング
    function dfs(idx: number): boolean {
        if (idx === emptyCells.length) return true; // 全マス確定

        const [i, j] = emptyCells[idx];
        const bIdx: number = getBoxIndex(i, j);

        // 1~9まで試す
        for (let num = 1; num <= 9; num++) {
            const bit: number = 1 << num;
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

//    * 各行・列・ブロックにおける数字の使用状況を整数のビットで管理
//    * 1\~9に対応するビットを `1 << num` で表現
// 2. **バックトラッキング**

//    * 空マスを順番に埋めていき、合わなければ戻る
// 3. **メモリ消費**

//    * `rowMask`, `colMask`, `boxMask` は長さ9の固定配列のみ
//    * 盤面は in-place 更新なので追加メモリを抑制

// ---

// このまま **LeetCode TypeScript** に提出できます。

// ---

// もしさらに実行速度を高めるために、
// **空マスを候補数の少ない順に選ぶ最適化版** にした実装も示すことができますが、必要ですか？
