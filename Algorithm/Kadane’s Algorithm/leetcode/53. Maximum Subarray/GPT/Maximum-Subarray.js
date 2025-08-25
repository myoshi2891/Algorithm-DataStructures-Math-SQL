// ```javascript
/**
 * 最大部分配列和を求める関数
 * 
 * @param {number[]} nums - 整数配列（長さは 1 <= nums.length <= 1e5, 要素は -1e4 <= nums[i] <= 1e4）
 * @returns {number} - 最大部分配列の和
 * 
 * 処理時間: O(n)  （1回の走査のみ）
 * メモリ使用量: O(1) （追加で使用する変数は定数個のみ）
 * 
 * アルゴリズム: Kadane's Algorithm
 * - 各要素を見ながら「その位置で終わる最大部分和」を更新
 * - 全体の最大部分和を追跡
 */
function maxSubArray(nums) {
    // 現在の部分和を追跡（開始は配列の最初の要素）
    let currentSum = nums[0];
    // 最大部分和を追跡
    let maxSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
        // 現在の部分和を更新: その要素を単独で使うか、前の部分和を延長するか
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        // 最大部分和を更新
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}
// ```

// この実装は **Kadane’s Algorithm** を用いた O(n) 解法です。

// * 各要素について「その位置で終わる最大部分配列和」を更新することで、余計な配列を持たず O(1) メモリで済みます。
// * LeetCode の制約（配列長最大 `1e5`）でも十分高速に動作します。

// もしご希望なら、次に **Divide and Conquer** アプローチ (O(n log n)) の解法も実装可能ですが、まずは O(n) 解法を示しました。

