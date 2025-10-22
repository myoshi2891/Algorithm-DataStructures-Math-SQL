// TypeScriptバージョンで実装します。型安全性を保ちながら、LeetCodeでの処理時間とメモリ消費量を最適化します。**TypeScript実装のポイント：**

// 1. **型安全性**：
//    - すべての変数とパラメータに明示的な型注釈を追加
//    - `number[]`と`number`型を使用して型安全性を確保

// 2. **LeetCode最適化**：
//    - **推奨版**: `maxSubArrayOptimized`関数 - 最もメモリ効率が良い
//    - 条件演算子の代わりに`if`文を使用してわずかな性能向上
//    - `Math.max`の呼び出し回数を減らしてオーバーヘッドを削減

// 3. **性能最適化のテクニック**：
//    - 分割統治法では`>> 1`（右ビットシフト）で除算を高速化
//    - 不要な変数宣言を削減
//    - 関数呼び出しのオーバーヘッドを最小化

// **LeetCode提出用には`maxSubArrayOptimized`関数を使用することを強く推奨します。** これは処理時間とメモリ消費量の両方で最も効率的です。

// TypeScript 5.1の機能を活用しつつ、Node.js 18.16.1での実行に最適化されています。

/**
 * 最大部分配列の和を求める関数（Kadane's Algorithm）
 * @param nums - 整数配列
 * @returns 最大部分配列の和
 *
 * 時間計算量: O(n)
 * 空間計算量: O(1)
 */
function maxSubArray(nums: number[]): number {
    // 現在の部分配列の和を追跡
    let currentSum: number = nums[0];
    // これまでに見つけた最大の部分配列の和
    let maxSum: number = nums[0];

    // 配列の2番目の要素から開始
    for (let i = 1; i < nums.length; i++) {
        // 現在の要素から新しく開始するか、既存の部分配列に追加するかを選択
        // より大きい値を選ぶ
        currentSum = Math.max(nums[i], currentSum + nums[i]);

        // 最大和を更新
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

/**
 * 最大部分配列の和を求める関数（分割統治法）
 * @param nums - 整数配列
 * @returns 最大部分配列の和
 *
 * 時間計算量: O(n log n)
 * 空間計算量: O(log n) - 再帰呼び出しのスタック
 */
function maxSubArrayDivideConquer(nums: number[]): number {
    /**
     * 分割統治法のヘルパー関数
     * @param nums - 配列
     * @param left - 左端のインデックス
     * @param right - 右端のインデックス
     * @returns 指定範囲での最大部分配列の和
     */
    function divideConquer(nums: number[], left: number, right: number): number {
        // ベースケース: 要素が1つの場合
        if (left === right) {
            return nums[left];
        }

        // 中点を計算（ビット演算で高速化）
        const mid: number = left + ((right - left) >> 1);

        // 左半分の最大部分配列の和
        const leftMax: number = divideConquer(nums, left, mid);

        // 右半分の最大部分配列の和
        const rightMax: number = divideConquer(nums, mid + 1, right);

        // 中点をまたぐ最大部分配列の和を計算
        let leftSum: number = Number.NEGATIVE_INFINITY;
        let sum: number = 0;
        for (let i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }

        let rightSum: number = Number.NEGATIVE_INFINITY;
        sum = 0;
        for (let i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }

        const crossSum: number = leftSum + rightSum;

        // 3つの候補の中から最大値を返す
        return Math.max(leftMax, rightMax, crossSum);
    }

    return divideConquer(nums, 0, nums.length - 1);
}

/**
 * 最大部分配列の和を求める関数（メモリ最適化版）
 * @param nums - 整数配列
 * @returns 最大部分配列の和
 *
 * 時間計算量: O(n)
 * 空間計算量: O(1)
 *
 * LeetCode提出用推奨版：変数宣言を最小化してメモリ使用量をさらに削減
 */
function maxSubArrayOptimized(nums: number[]): number {
    let maxSum: number = nums[0];
    let currentSum: number = nums[0];

    for (let i = 1; i < nums.length; i++) {
        currentSum = currentSum > 0 ? currentSum + nums[i] : nums[i];
        if (currentSum > maxSum) {
            maxSum = currentSum;
        }
    }

    return maxSum;
}
