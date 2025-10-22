// この数独検証関数の特徴：
// Runtime
// 5
// ms
// Beats
// 66.19%
// Memory
// 58.98
// MB
// Beats
// 62.44%

// 1. **効率的な一回のスキャン**: ボード全体を一度だけスキャンして、すべての制約を同時にチェックします

// 2. **メモリ効率**: 各行、列、3x3ボックスに対してSetを使用し、重複を効率的に検出します

// 3. **3x3ボックスインデックス計算**: `Math.floor(i / 3) * 3 + Math.floor(j / 3)` を使用して、各セルがどの3x3ボックスに属するかを計算

// 4. **早期終了**: 重複が見つかった瞬間に `false` を返すため、不要な処理を避けます

// **時間計算量**: O(1) - 9x9の固定サイズボードなので定数時間
// **空間計算量**: O(1) - 最大でも各Setに9個の要素が格納されるだけなので定数空間

// この実装はLeetCodeでの性能を重視し、無駄な配列作成や文字列操作を避けて最適化されています。

/**
 * 数独ボードが有効かどうかを判定する関数
 * @param board - 9x9の数独ボード（文字列の2次元配列）
 * @returns boolean - ボードが有効な場合true、無効な場合false
 */
function isValidSudoku(board: string[][]): boolean {
    // 各行、各列、各3x3ボックスで使用されている数字を追跡するSet
    const rows: Set<string>[] = Array.from({ length: 9 }, () => new Set());
    const cols: Set<string>[] = Array.from({ length: 9 }, () => new Set());
    const boxes: Set<string>[] = Array.from({ length: 9 }, () => new Set());

    // ボード全体を一度だけスキャン
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];

            // 空のセルはスキップ
            if (cell === '.') continue;

            // 3x3ボックスのインデックスを計算
            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);

            // 重複チェック
            if (rows[i].has(cell) || cols[j].has(cell) || boxes[boxIndex].has(cell)) {
                return false;
            }

            // 数字を各Setに追加
            rows[i].add(cell);
            cols[j].add(cell);
            boxes[boxIndex].add(cell);
        }
    }

    return true;
}
