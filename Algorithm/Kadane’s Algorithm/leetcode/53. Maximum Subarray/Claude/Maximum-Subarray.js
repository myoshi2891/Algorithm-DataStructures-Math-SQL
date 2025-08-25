// この問題は「Maximum Subarray Problem」で、Kadane's Algorithmを使って効率的に解くことができます。O(n)時間計算量とO(1)空間計算量で実装します。さらに、分割統治法（Divide and Conquer）でのアプローチも実装します：**解説：**

// 1. **Kadane's Algorithm（推奨）**：
//    - 各位置で「現在の要素から新しく開始する」か「既存の部分配列に追加する」かを選択
//    - より効率的でLeetCodeでの実行時間とメモリ使用量が最適
//    - 時間計算量：O(n)、空間計算量：O(1)

// 2. **分割統治法**：
//    - 配列を左半分、右半分、中点をまたぐ部分に分けて考える
//    - より理論的なアプローチだが、実行時間とメモリ使用量は劣る
//    - 時間計算量：O(n log n)、空間計算量：O(log n)

// **LeetCode提出用には最初の`maxSubArray`関数を使用することを推奨します。**

// 実装のポイント：
// - 単一ループで効率的に処理
// - 不要な変数や配列を使わずメモリ使用量を最小化
// - `Math.max`を使って可読性を保ちながら最適化

/**
 * 最大部分配列の和を求める関数（Kadane's Algorithm）
 * @param {number[]} nums - 整数配列
 * @return {number} - 最大部分配列の和
 * 
 * 時間計算量: O(n)
 * 空間計算量: O(1)
 */
var maxSubArray = function(nums) {
    // 現在の部分配列の和を追跡
    let currentSum = nums[0];
    // これまでに見つけた最大の部分配列の和
    let maxSum = nums[0];
    
    // 配列の2番目の要素から開始
    for (let i = 1; i < nums.length; i++) {
        // 現在の要素から新しく開始するか、既存の部分配列に追加するかを選択
        // より大きい値を選ぶ
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        
        // 最大和を更新
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
};

/**
 * 最大部分配列の和を求める関数（分割統治法）
 * @param {number[]} nums - 整数配列
 * @return {number} - 最大部分配列の和
 * 
 * 時間計算量: O(n log n)
 * 空間計算量: O(log n) - 再帰呼び出しのスタック
 */
var maxSubArrayDivideConquer = function(nums) {
    /**
     * 分割統治法のヘルパー関数
     * @param {number[]} nums - 配列
     * @param {number} left - 左端のインデックス
     * @param {number} right - 右端のインデックス
     * @return {number} - 指定範囲での最大部分配列の和
     */
    function divideConquer(nums, left, right) {
        // ベースケース: 要素が1つの場合
        if (left === right) {
            return nums[left];
        }
        
        // 中点を計算
        const mid = Math.floor((left + right) / 2);
        
        // 左半分の最大部分配列の和
        const leftMax = divideConquer(nums, left, mid);
        
        // 右半分の最大部分配列の和
        const rightMax = divideConquer(nums, mid + 1, right);
        
        // 中点をまたぐ最大部分配列の和を計算
        let leftSum = Number.NEGATIVE_INFINITY;
        let sum = 0;
        for (let i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }
        
        let rightSum = Number.NEGATIVE_INFINITY;
        sum = 0;
        for (let i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }
        
        const crossSum = leftSum + rightSum;
        
        // 3つの候補の中から最大値を返す
        return Math.max(leftMax, rightMax, crossSum);
    }
    
    return divideConquer(nums, 0, nums.length - 1);
};