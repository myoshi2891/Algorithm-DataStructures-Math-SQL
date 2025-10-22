// 先ほどの問題（「昇順ソート済み配列から target の開始位置と終了位置を探す」）を **JavaScript (Node.js 18.16.1)** で、
// Runtime
// 0
// ms
// Beats
// 100.00%
// Memory
// 54.60
// MB
// Beats
// 51.52%

// * **クラスを使わず関数のみ**
// * **パラメータと返却値をJSDocで明記**
// * **二分探索で O(log n)**
// * **追加メモリ O(1)**

// で実装した回答を示します。

// ---

// ```javascript
/**
 * 昇順ソート済み配列 nums から target の開始位置と終了位置を探す
 *
 * @param {number[]} nums - 昇順ソート済み整数配列
 * @param {number} target - 探索する整数値
 * @returns {number[]} - target の開始位置と終了位置 [start, end]。存在しなければ [-1, -1]
 *
 * 計算量: O(log n)
 * 追加メモリ: O(1)
 */
function searchRangeJs(nums, target) {
    // target 以上の最初の位置を返す
    const lowerBound = (arr, val) => {
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
    const upperBound = (arr, val) => {
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

// ### 🔹 処理時間・メモリ解析

// * **処理時間**:

//   * `lowerBound` O(log n)
//   * `upperBound` O(log n)
//   * 合計 **O(log n)**

// * **メモリ使用量**:

//   * 定数個の変数のみ使用 → **O(1)**
//   * 配列 `nums` は参照のみ

// ---

// もし希望であれば、この **JavaScript版** の二分探索が実行中に
// どのように `left/right/mid` が動くかを **図解解析** してお見せすることも可能です。

// 図解解析も必要ですか？
