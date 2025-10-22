// 以下は、**JavaScript (Node.js 18.16.1)** を使った解法です。
// 標準入力は `fs` モジュールを使って読み込み、\*\*箱をネストできる最大の深さ（最大チェイン長）\*\*を求めます。

// ---

// ## ✅ 解法概要（O(N log N) 解法）

// この問題は **2次元のLongest Increasing Subsequence（LIS）問題**に帰着できます。

// 1. **X昇順**、**Y降順**でソートする（Xが同じならYが逆順）

//    * こうすることで、`X` も `Y` も単調増加となる部分列を求めるときに、`X` が同じで `Y` だけ違う箱が同列に並ばないようにできます。
// 2. `Y` だけを取り出し、LIS（Longest Increasing Subsequence）を求める

// ---

// ## ✅ コード実装

// ```javascript
const fs = require('fs');

/**
 * 与えられた箱の配列に対して最大で何重にネストできるかを求める
 * @param {number[][]} boxes - 各箱の [X, Y] の配列
 * @returns {number} - 最大のネスト数
 */
function maxNestingDepth(boxes) {
    // 1. X昇順、Xが同じならY降順でソート
    boxes.sort((a, b) => {
        if (a[0] === b[0]) return b[1] - a[1]; // Y降順
        return a[0] - b[0]; // X昇順
    });

    // 2. Yのみを取り出して LIS を求める
    const lis = []; // 単調増加部分列（パイル）

    for (const [_, y] of boxes) {
        // 二分探索で挿入位置を探す
        let left = 0,
            right = lis.length;
        while (left < right) {
            const mid = (left + right) >> 1;
            if (lis[mid] < y) left = mid + 1;
            else right = mid;
        }

        if (left === lis.length) {
            lis.push(y);
        } else {
            lis[left] = y;
        }
    }

    return lis.length;
}

// 標準入力の読み取り
function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const N = Number(input[0]);
    const boxes = input.slice(1).map((line) => line.split(' ').map(Number));

    const result = maxNestingDepth(boxes);
    console.log(result);
}

main();
// ```

// ---

// ## ✅ 実行時間・メモリ

// * 時間計算量: **O(N log N)**（ソートとLISに二分探索）
// * 空間計算量: **O(N)**（LIS保存用）

// ---

// ## ✅ テスト例

// 入力例1:

// ```
// 5
// 30 50
// 10 30
// 40 10
// 50 20
// 40 60
// ```

// 出力:

// ```
// 3
// ```
