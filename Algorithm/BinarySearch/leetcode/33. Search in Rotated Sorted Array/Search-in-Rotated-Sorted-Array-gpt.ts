// 以下は **TypeScript 5.1 (Node.js 18.16.1)** 用の回答です。
// クラスは使わず関数で実装し、LeetCode での **O(log n)** 実行時間、**O(1)** メモリを意識しています。

// ```typescript
/**
 * 配列 nums から target のインデックスを返す（存在しなければ -1）
 * @param nums 昇順ソートだが回転されている可能性のある整数配列
 * @param target 探索する整数
 * @returns target のインデックス、存在しなければ -1
 *
 * 時間計算量: O(log n)
 * 空間計算量: O(1)
 */
function searchGPT(nums: number[], target: number): number {
    let left: number = 0;
    let right: number = nums.length - 1;

    while (left <= right) {
        const mid: number = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            return mid;
        }

        // 左半分がソートされている場合
        if (nums[left] <= nums[mid]) {
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

    return -1;
}

// // 使用例
// console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 出力: 4
// console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // 出力: -1
// console.log(search([1], 0));                   // 出力: -1
// ```

// ---

// ### 実装のポイント

// 1. **回転ソート配列に対する二分探索**

//    * 中央 `mid` を基準に、左半分か右半分のどちらかが常に昇順であることを利用。
// 2. **O(1) メモリ**

//    * 追加配列は使用せず、ポインタ操作のみ。
// 3. **O(log n) 実行時間**

//    * 毎回探索範囲を半分に絞る二分探索。

// ---

// この実装は LeetCode の `Search in Rotated Sorted Array` にそのまま提出可能です。

// ---

// もし希望であれば、この実装を **回転点を先に特定してから通常の二分探索を行う別解** にもできますが、
// どちらの方法がより理解しやすいかを図解付きでまとめることも可能です。

// 図解付きのアルゴリズム解説も必要ですか？
