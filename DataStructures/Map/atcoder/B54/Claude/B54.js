// この問題を解くために、効率的なJavaScriptソリューションを作成します。このソリューションの詳細な説明：

// ## アルゴリズムの解説

// 1. **問題の理解**: `1 ≤ j < i ≤ N` かつ `Aj = Ai` を満たすペア `(i, j)` の数を求める問題です。

// 2. **効率的なアプローチ**:
//    - 各値の出現回数をカウント
//    - 同じ値が `k` 個ある場合、選べるペア数は組み合わせ `C(k,2) = k * (k-1) / 2`

// 3. **計算量の最適化**:
//    - 時間計算量: O(N) - 配列を1回スキャンするだけ
//    - 空間計算量: O(N) - 最悪の場合、すべて異なる値でMapサイズがN

// ## 入力例での動作確認

// 入力例: `[30, 10, 30, 20, 10, 30]`

// - 値30: 3回出現 → ペア数 = 3 * 2 / 2 = 3
// - 値10: 2回出現 → ペア数 = 2 * 1 / 2 = 1
// - 値20: 1回出現 → ペア数 = 0

// 合計: 3 + 1 = 4 ペア

// 具体的なペア:
// - (3,1): A3=A1=30
// - (6,1): A6=A1=30
// - (6,3): A6=A3=30
// - (5,2): A5=A2=10

// ## パフォーマンス特性

// - **メモリ効率**: Mapを使用して値の出現回数のみ記録
// - **処理時間**: O(N)の線形時間で解決
// - **制約対応**: N≤100,000、Ai≤10^9の制約に十分対応

// このアプローチにより、大きな入力サイズでも効率的に処理できます。

const fs = require('fs');

/**
 * 標準入力を同期的に読み込む
 * @returns {string} 入力データ
 */
function readInput() {
    return fs.readFileSync('/dev/stdin', 'utf8').trim();
}

/**
 * 入力データを解析して配列に変換
 * @param {string} input - 入力データ
 * @returns {{n: number, arr: number[]}} - 配列のサイズと要素
 */
function parseInput(input) {
    const lines = input.split('\n');
    const n = parseInt(lines[0]);
    const arr = [];

    for (let i = 1; i <= n; i++) {
        arr.push(parseInt(lines[i]));
    }

    return { n, arr };
}

/**
 * 条件を満たすペア(i, j)の数を計算
 * 1 <= j < i <= N かつ Aj = Ai を満たすペアの数を返す
 *
 * アプローチ: 各値の出現回数をカウントし、組み合わせ数を計算
 * 同じ値がk個ある場合、ペア数は k * (k-1) / 2
 *
 * @param {number[]} arr - 入力配列
 * @returns {number} 条件を満たすペアの総数
 */
function countPairs(arr) {
    // 各値の出現回数をカウント
    const countMap = new Map();

    for (const num of arr) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
    }

    let totalPairs = 0;

    // 各値について、ペア数を計算
    for (const count of countMap.values()) {
        if (count >= 2) {
            // k個の要素から2個を選ぶ組み合わせ数 = k * (k-1) / 2
            totalPairs += Math.floor((count * (count - 1)) / 2);
        }
    }

    return totalPairs;
}

/**
 * メイン処理
 */
function main() {
    const input = readInput();
    const { n, arr } = parseInput(input);
    const result = countPairs(arr);
    console.log(result);
}

// 実行
main();
