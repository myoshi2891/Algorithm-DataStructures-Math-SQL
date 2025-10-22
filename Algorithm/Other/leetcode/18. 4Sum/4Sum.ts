// 以下は、TypeScript関数で実装した **4Sum (四つ組みの和)** の解法です。
// クラスは使わず、関数形式で解答しています。

// ## 実装ポイント

// * **ソートして重複回避**
// * **二重ループ + 二重ポインター法**
// * Leetcode用形式（`export function`）

// ## 計算量とメモリ

// | 項目    | 内容                   |
// | ----- | -------------------- |
// | 時間計算量 | O(n³)（3重ループ+二分探索風操作） |
// | 空間計算量 | O(n)（出力＋ソートに伴う領域）    |

// ---

// ## TypeScriptコード（TypeScript 5.1 / Node.js 18.16.1）:

// ```typescript
/**
 * 四つ組みの和を求める関数
 *
 * @param nums - 入力配列（長さ 1～200、要素は-10^9～10^9）
 * @param target - 目標となる和（-10^9～10^9）
 * @returns number[][] - 条件を満たす4つ組の配列（重複なし、順不同）
 *
 * 時間計算量：O(n^3)
 * 空間計算量：O(n)
 */
export function fourSum(nums: number[], target: number): number[][] {
    const result: number[][] = [];

    // 配列をソート（重複回避と双方向ポインター用）
    nums.sort((a, b) => a - b);

    const n: number = nums.length;

    for (let i = 0; i < n - 3; i++) {
        // iの重複回避
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        for (let j = i + 1; j < n - 2; j++) {
            // jの重複回避
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            let left: number = j + 1;
            let right: number = n - 1;

            while (left < right) {
                const sum: number = nums[i] + nums[j] + nums[left] + nums[right];

                if (sum === target) {
                    result.push([nums[i], nums[j], nums[left], nums[right]]);

                    // leftとrightの重複回避
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;

                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
    }

    return result;
}
// ```

// ---

// ## **解説（図解イメージ）**

// ```
// ソート後の nums 配列例:
// [-2, -1, 0, 0, 1, 2]

// i  -> -2
//  j -> -1
// left -> 0
// right -> 2

// sum = -2 + (-1) + 0 + 2 = -1 < target(0)  → left++
// ```

// * ループを回しながら `i`, `j` を固定
// * `left`, `right` を動かして探索
// * 4つのインデックスは全て異なる（条件に合致）

// ---

// ## **実行例**

// ### 入力:

// ```typescript
// fourSum([1,0,-1,0,-2,2], 0);
// ```

// ### 出力:

// ```typescript
// [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]
// ```

// ---

// ## **補足**

// | 項目     | 内容                   |
// | ------ | -------------------- |
// | ソート時間  | O(n log n)           |
// | ループ部分  | O(n³)（i, j, 内側ポインター） |
// | メモリ使用量 | O(n)（ソート、結果リスト）      |
