// ```typescript
// Runtime
// 0
// ms
// Beats
// 100.00%
// Memory
// 55.79
// MB
// Beats
// 37.52%
/**
 * 関数名: searchInsert
 * パラメーター:
 *   nums: number[] - 昇順にソートされた整数配列 (長さ1〜10^4, 要素は-10^4〜10^4)
 *   target: number - 探索する整数 (-10^4〜10^4)
 * 返却値:
 *   number - targetが存在する場合はそのインデックス、存在しない場合は挿入すべきインデックス
 *
 * 計算量: O(log n)  (二分探索)
 * メモリ消費量: O(1)  (追加メモリはほぼ定数)
 */
function searchInsertGPT(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        // 安全に中央インデックスを求める
        const mid = left + ((right - left) >> 1);

        if (nums[mid] === target) {
            return mid; // targetが見つかった場合
        } else if (nums[mid] < target) {
            left = mid + 1; // 右半分を探索
        } else {
            right = mid - 1; // 左半分を探索
        }
    }

    // targetが存在しない場合、挿入位置はleft
    return left;
}
// ```

// ### 実装上のポイント

// * **二分探索**により、配列長 `n` に対して計算量は **O(log n)**
// * **追加メモリ不要**で、メモリ消費は **O(1)**
// * `mid` 計算は `left + ((right - left) >> 1)` にすることで高速かつオーバーフロー防止

// このまま TypeScript (Node.js 18.16.1, LeetCode) に提出可能です。
