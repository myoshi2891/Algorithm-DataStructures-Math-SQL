// 以下は、**TypeScript 5.1 (Node.js 18.16.1)** で動作する **関数ベースのLeetCode解答** です。

// * **処理時間**: O(n)
// * **メモリ消費量**: O(1)（in-place処理）
// * **クラス非使用**、関数と明示的な型注釈付き

// ---

// ```typescript
/**
 * 次の辞書順順列を計算し、numsを直接変更する
 * @param nums 整数配列 (1 <= nums.length <= 100)
 * @returns void 配列を直接変更するため返却値なし
 *
 * アルゴリズム概要:
 * 1. 後ろから探索して、nums[i] < nums[i+1] となる最初の位置 i を探す
 * 2. さらに後ろから nums[i] より大きい最小の要素 nums[j] を探す
 * 3. nums[i] と nums[j] をスワップ
 * 4. i+1 以降を反転して昇順にする
 *
 * 時間計算量: O(n) （最大100要素）
 * 空間計算量: O(1) （定数メモリでin-place処理）
 */
function nextPermutation(nums: number[]): void {
    // 1. 後ろから転換点を探す
    let i: number = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    if (i >= 0) {
        // 2. 後ろから nums[i] より大きい要素を探す
        let j: number = nums.length - 1;
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        // 3. スワップ
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    // 4. i+1 以降を反転
    let left: number = i + 1;
    let right: number = nums.length - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
}
// ```

// ---

// ### **使用例（ローカルテスト用）**

// ```typescript
// const nums1: number[] = [1, 2, 3];
// nextPermutation(nums1);
// console.log(nums1); // [1, 3, 2]

// const nums2: number[] = [3, 2, 1];
// nextPermutation(nums2);
// console.log(nums2); // [1, 2, 3]

// const nums3: number[] = [1, 1, 5];
// nextPermutation(nums3);
// console.log(nums3); // [1, 5, 1]
// ```

// ---

// この実装は **LeetCode 31. Next Permutation** に直接提出可能です。

// * **O(n)** で最大 100 要素まで高速に処理
// * **O(1)** 追加メモリで in-place 処理
