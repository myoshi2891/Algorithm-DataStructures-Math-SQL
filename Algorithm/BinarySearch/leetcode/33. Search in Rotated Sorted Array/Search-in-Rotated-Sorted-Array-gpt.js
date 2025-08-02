// 以下は、要求に沿った **JavaScript(Node.js 18.16.1)** の実装例です。
// 処理は O(log n) の二分探索で行い、メモリ消費も O(1) です。

// ```javascript
/**
 * 配列 nums から target のインデックスを返す（存在しなければ -1）
 * @param {number[]} nums - 昇順でソートされているが回転されている可能性のある整数配列
 * @param {number} target - 探索対象の整数
 * @returns {number} target のインデックス、存在しなければ -1
 *
 * 計算量: O(log n)
 * メモリ使用量: O(1)
 */
function searchJs(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // target を見つけた場合
        if (nums[mid] === target) {
            return mid;
        }

        // 左半分がソートされている場合
        if (nums[left] <= nums[mid]) {
            // target が左半分に存在する場合
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // 右半分がソートされている場合
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1; // 見つからなかった場合
}

// // 使用例
// console.log(search([4,5,6,7,0,1,2], 0)); // 出力: 4
// console.log(search([4,5,6,7,0,1,2], 3)); // 出力: -1
// console.log(search([1], 0));             // 出力: -1
// ```

// ---

// ### 実装のポイント

// 1. **回転ソート配列の二分探索**

//    * 中央 `mid` を取り、左側または右側のどちらかは必ず昇順であることを利用。
// 2. **探索範囲の絞り込み**

//    * 左が昇順なら、`target` が `[left, mid)` に含まれるかを確認して範囲を狭める。
//    * 右が昇順なら、`target` が `(mid, right]` に含まれるかを確認して範囲を狭める。
// 3. **O(1) メモリ**

//    * 追加配列を作らずに二分探索だけで処理。

// ---

// もし希望であれば、次にこの処理を **回転点を先に特定してから通常の二分探索に分けるパターン** でも実装できます。
// どちらのパターンが良いか希望ありますか？
