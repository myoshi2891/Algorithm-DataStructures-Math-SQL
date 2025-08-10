// この問題を効率的に解くために、ソートされた配列を使って二分探索を行うアプローチを実装します。このソリューションの特徴と効率性について説明します：

// ## アルゴリズムの概要
// 1. **データ構造**: ソートされた配列を使用してカードを管理
// 2. **挿入**: 二分探索を使って適切な位置に挿入（O(log n)の探索 + O(n)の挿入）
// 3. **検索**: 二分探索で最も近い値を効率的に見つける（O(log n)）

// ## 時間計算量
// - **クエリ1（カード追加）**: O(n) - 配列への挿入が主なコスト
// - **クエリ2（最小差検索）**: O(log n) - 二分探索のみ
// - **全体**: O(Q × n) - 最悪ケースでQが100,000、nも最大100,000

// ## メモリ使用量
// - カードの配列: O(n) - 最大100,000個の整数
// - その他の変数: O(1)
// - **合計**: O(n) ≈ 400KB程度（制限1024MiBに対して十分小さい）

// ## 最適化のポイント
// 1. **二分探索**: `lowerBound`関数でO(log n)の効率的な検索
// 2. **最小差計算**: 二分探索で見つけた位置とその前後の値のみをチェック
// 3. **メモリ効率**: 必要最小限のデータ構造のみ使用

// このアプローチにより、制約内で安定して動作し、実行時間とメモリ使用量の両方を最適化できています。

const fs = require('fs');

/**
 * 二分探索で配列内の値以上の最初の位置を見つける
 * @param {number[]} arr - ソート済み配列
 * @param {number} target - 検索対象の値
 * @returns {number} 挿入位置のインデックス
 */
function lowerBound(arr, target) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

/**
 * ソートされた配列に値を挿入する
 * @param {number[]} arr - ソート済み配列
 * @param {number} value - 挿入する値
 */
function insertSorted(arr, value) {
    const pos = lowerBound(arr, value);
    arr.splice(pos, 0, value);
}

/**
 * 整数xと机にあるカードとの差の絶対値の最小値を求める
 * @param {number[]} cards - ソート済みのカード配列
 * @param {number} x - 比較対象の整数
 * @returns {number} 差の絶対値の最小値、カードがない場合は-1
 */
function findMinDifference(cards, x) {
    if (cards.length === 0) {
        return -1;
    }

    // 二分探索でx以上の最初の値の位置を見つける
    const pos = lowerBound(cards, x);

    let minDiff = Infinity;

    // pos位置の値との差を確認
    if (pos < cards.length) {
        minDiff = Math.min(minDiff, Math.abs(cards[pos] - x));
    }

    // pos-1位置の値との差を確認
    if (pos > 0) {
        minDiff = Math.min(minDiff, Math.abs(cards[pos - 1] - x));
    }

    return minDiff;
}

/**
 * メインの処理関数
 * @param {string} input - 入力文字列
 * @returns {string} 出力結果
 */
function solve(input) {
    const lines = input.trim().split('\n');
    const Q = parseInt(lines[0]);

    const cards = []; // ソートされた状態を維持する配列
    const results = [];

    for (let i = 1; i <= Q; i++) {
        const [query, x] = lines[i].split(' ').map(Number);

        if (query === 1) {
            // クエリ1: カードを追加
            insertSorted(cards, x);
        } else {
            // クエリ2: 最小差を求める
            const result = findMinDifference(cards, x);
            results.push(result);
        }
    }

    return results.join('\n');
}

// ファイルからの入力処理
function main() {
    try {
        const input = fs.readFileSync('/dev/stdin', 'utf8');
        const result = solve(input);
        console.log(result);
    } catch (error) {
        // 標準入力が使えない場合のテスト用
        const testInput = `5
2 30
1 10
2 30
1 40
2 30`;
        const result = solve(testInput);
        console.log(result);
    }
}

main();