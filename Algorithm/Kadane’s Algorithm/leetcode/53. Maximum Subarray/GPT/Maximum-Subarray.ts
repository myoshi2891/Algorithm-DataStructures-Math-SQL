// ```typescript
/**
 * 最大部分配列和を求める関数
 *
 * @param nums - 整数配列（長さは 1 <= nums.length <= 1e5, 要素は -1e4 <= nums[i] <= 1e4）
 * @returns 最大部分配列の和
 *
 * 処理時間: O(n) （配列を1回走査するだけ）
 * メモリ使用量: O(1) （追加で使う変数は定数個のみ）
 *
 * アルゴリズム: Kadane's Algorithm
 * - 各要素ごとに「その位置で終わる最大部分和」を更新
 * - その際に全体の最大部分和も更新
 */
function maxSubArray(nums: number[]): number {
    // 現在の部分和（初期値は配列の最初の要素）
    let currentSum: number = nums[0];
    // 最大部分和（初期値は配列の最初の要素）
    let maxSum: number = nums[0];

    for (let i = 1; i < nums.length; i++) {
        // 現在の部分和を更新: 単独スタートか延長かを選択
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        // 最大部分和を更新
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}
// ```

// この実装は **Kadane’s Algorithm** を用いた線形時間解法で、LeetCode の最大サイズ (`1e5` 要素) に対しても高速かつ省メモリで動作します。

// 👉 次に「Divide and Conquer 法 (O(n log n))」の TypeScript 実装も示しましょうか？
