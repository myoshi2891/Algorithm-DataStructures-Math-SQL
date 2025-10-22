// ```javascript
// Runtime
// 0
// ms
// Beats
// 100.00%
// Memory
// 54.03
// MB
// Beats
// 34.80%
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
function searchInsertJs(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        // オーバーフロー防止のため (left + right) >> 1 を使用
        const mid = left + ((right - left) >> 1);

        if (nums[mid] === target) {
            return mid; // targetが見つかった場合
        } else if (nums[mid] < target) {
            left = mid + 1; // 右側を探索
        } else {
            right = mid - 1; // 左側を探索
        }
    }

    // targetが存在しない場合、挿入位置はleft
    return left;
}
// ```

// この実装では以下の最適化を行っています:

// * **二分探索**を使用し、計算量は O(log n)
// * **追加メモリなし**で処理できるため、メモリ消費は O(1)
// * `mid` の計算は `left + ((right - left) >> 1)` を用いて安全かつ高速に計算

// この関数を LeetCode に提出すれば、テストケース不要でそのまま動作します。
