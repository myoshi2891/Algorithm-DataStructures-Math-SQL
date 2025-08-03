// 以下は、指定条件に従った **TypeScript 5.1 (Node.js 18.16.1)** 実装です。
// Runtime
// 0
// ms
// Beats
// 100.00%
// Memory
// 54.90
// MB
// Beats
// 92.11%

// * **クラスを使わず関数のみ**
// * **パラメーターと返却値をJSDocで明記**
// * **二分探索で O(log n)**
// * **追加メモリ O(1)**

// ---

// ```typescript
/**
 * 昇順ソート済み配列 nums から target の開始位置と終了位置を探す
 *
 * @param nums - 昇順ソート済み整数配列
 * @param target - 探索する整数値
 * @returns target の開始位置と終了位置 [start, end]。存在しなければ [-1, -1]
 *
 * 計算量: O(log n)
 * 追加メモリ: O(1)
 */
function searchRange(nums: number[], target: number): number[] {
    // target 以上の最初の位置を返す
    const lowerBound = (arr: number[], val: number): number => {
        let left = 0;
        let right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] < val) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };

    // target より大きい最初の位置を返す
    const upperBound = (arr: number[], val: number): number => {
        let left = 0;
        let right = arr.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] <= val) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    };

    const start = lowerBound(nums, target);
    const end = upperBound(nums, target) - 1;

    if (start <= end && start < nums.length && nums[start] === target) {
        return [start, end];
    }
    return [-1, -1];
}

// 実行例
console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3,4]
console.log(searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1,-1]
console.log(searchRange([], 0)); // [-1,-1]
// ```

// ---

// ### 🔹 処理時間・メモリ

// * **処理時間**:

//   * `lowerBound` O(log n)
//   * `upperBound` O(log n)
//   * 合計 **O(log n)**

// * **メモリ使用量**:

//   * 定数個の変数のみ使用 → **O(1)**
//   * 配列 `nums` は参照のみ

// ---

// 次に、**このTypeScript版の二分探索の動き**を
// Python版と同様に **図解で解析** することも可能です。

// 希望しますか？
