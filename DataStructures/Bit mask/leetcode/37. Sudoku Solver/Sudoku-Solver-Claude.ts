// Runtime
// 445
// ms
// Beats
// 60.35%
// Memory
// 56.69
// MB
// Beats
// 84.48%

// 数独パズルを解くTypeScript実装を提供しました。この解法の特徴：

// **アルゴリズム：バックトラッキング**
// - 空のセル（'.'）を順番に見つけて、1-9の数字を試行
// - 各数字が配置可能かルールをチェック
// - 配置できない場合は前の選択に戻る（バックトラック）

// **最適化のポイント：**
// 1. **メモリ効率**: 元のboardを直接変更し、新しい配列を作成しない
// 2. **処理速度**: 最初に見つけた空のセルから処理することで、不要な探索を避ける
// 3. **早期終了**: 無効な配置が見つかった時点で即座にfalseを返す

// **時間複雑度**: O(9^(空のセル数)) - 最悪の場合
// **空間複雑度**: O(1) - 追加のメモリを使用しない（再帰スタックを除く）

// この実装は、制約条件（各行・列・3x3ボックスに1-9が一度ずつ）を効率的にチェックし、LeetCodeの時間・メモリ制限内で動作するよう設計されています。

/**
 * 数独パズルを解く関数
 * @param board - 9x9の数独ボード（'.'は空のセル、'1'-'9'は既に配置された数字）
 * @returns void（boardを直接変更する）
 */
function solveSudoku(board: string[][]): void {
    solve(board);
}

/**
 * バックトラッキングを使用して数独を解く再帰関数
 * @param board - 9x9の数独ボード
 * @returns boolean - 解けた場合はtrue、解けない場合はfalse
 */
function solve(board: string[][]): boolean {
    // 空のセルを探す
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === '.') {
                // 1-9の数字を試す
                for (let num = 1; num <= 9; num++) {
                    const char = num.toString();
                    
                    // その数字が配置可能かチェック
                    if (isValid(board, row, col, char)) {
                        board[row][col] = char;
                        
                        // 再帰的に次のセルを試す
                        if (solve(board)) {
                            return true;
                        }
                        
                        // バックトラック：配置を取り消す
                        board[row][col] = '.';
                    }
                }
                return false; // どの数字も配置できない場合
            }
        }
    }
    return true; // すべてのセルが埋まった場合
}

/**
 * 指定された位置に数字を配置できるかチェックする関数
 * @param board - 9x9の数独ボード
 * @param row - 行のインデックス（0-8）
 * @param col - 列のインデックス（0-8）
 * @param num - チェックする数字（文字列）
 * @returns boolean - 配置可能な場合はtrue、不可能な場合はfalse
 */
function isValid(board: string[][], row: number, col: number, num: string): boolean {
    // 行のチェック
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
    }
    
    // 列のチェック
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) {
            return false;
        }
    }
    
    // 3x3サブボックスのチェック
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    
    return true;
}