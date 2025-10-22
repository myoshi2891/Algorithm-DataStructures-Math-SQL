// エラーの原因は以下です：

// ```
// Cannot find name 'threeSumClosest'
// ```

// ### 理由：

// `threeSumClosest`は `Solution` クラスの**インスタンスメソッド**として定義していますが、
// 呼び出し側で `threeSumClosest()` を直接呼んでいると発生するエラーです。

// TypeScriptでは**インスタンス生成後に `this.method()` として呼ぶ必要があります。**

// ---

// ## **正しい呼び出し方**

// ```typescript
// const solver = new Solution();
// console.log(solver.threeSumClosest([-1, 2, 1, -4], 1));  // 出力: 2
// console.log(solver.threeSumClosest([0, 0, 0], 1));       // 出力: 0
// ```

// ---

// ## **LeetCode向け解答（クラスを使わない形式）**

// LeetCode用の提出では、`class Solution` が既に与えられているか、関数単体での提出が求められます。

// 以下は、**関数だけの形式**：

// ```typescript
/**
 * 3Sum Closest 問題の解法
 * @param nums - 入力配列（整数）
 * @param target - 目標値（整数）
 * @returns 最もtargetに近い3つの数の合計（整数）
 *
 * 時間計算量: O(n^2)
 * メモリ使用量: O(1)（ソート時のスタックを除く）
 */
function threeSumClosest(nums: number[], target: number): number {
    const n: number = nums.length;
    nums.sort((a, b) => a - b);

    let closestSum: number = nums[0] + nums[1] + nums[2];
    let minDiff: number = Math.abs(closestSum - target);

    for (let i = 0; i < n - 2; i++) {
        let left: number = i + 1;
        let right: number = n - 1;

        while (left < right) {
            const currentSum: number = nums[i] + nums[left] + nums[right];
            const currentDiff: number = Math.abs(currentSum - target);

            if (currentDiff < minDiff) {
                minDiff = currentDiff;
                closestSum = currentSum;
            }

            if (currentSum === target) {
                return currentSum;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }

    return closestSum;
}
// ```

// ---

// ## **テストコード**

// ```typescript
// console.log(threeSumClosest([-1, 2, 1, -4], 1));  // 出力: 2
// console.log(threeSumClosest([0, 0, 0], 1));       // 出力: 0
// ```

// ---

// ## **まとめ**

// | 利用環境         | 使い方                                           |
// | ------------ | --------------------------------------------- |
// | **LeetCode** | 関数だけ提出（上記形式）                                  |
// | **ローカル実行**   | クラス形式でもOK（`new Solution().threeSumClosest()`） |

// どちらの形式でも対応可能ですが、LeetCode用なら**関数形式の方が安全**です。

// もし、**クラス形式での提出例**も必要でしたらお伝えください！
