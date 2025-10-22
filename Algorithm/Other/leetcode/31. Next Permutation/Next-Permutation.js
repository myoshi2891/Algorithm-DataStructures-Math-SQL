// 以下は、Node.js 18.16.1 / LeetCode 実行環境で動作する **関数ベース** の JavaScript 実装例です。

// * **処理時間**: O(n)
// * **追加メモリ**: O(1)（定数）
// * **in-place** で次の順列を求めます。

// ```javascript
/**
 * 次の辞書順順列を計算し、numsを直接変更する
 * @param {number[]} nums - 整数配列（1 <= nums.length <= 100）
 * @returns {void} - 配列を直接変更するため返却値はなし
 *
 * アルゴリズム:
 * 1. 後ろから探索して、最初に nums[i] < nums[i+1] となる位置を探す (i が "転換点")
 * 2. さらに後ろから nums[i] より大きい最小の要素 nums[j] を探す
 * 3. nums[i] と nums[j] をスワップ
 * 4. i+1 以降を昇順に反転（reverse）する
 *
 * 時間計算量: O(n) （最大100要素）
 * 空間計算量: O(1) （定数メモリでin-place処理）
 */
function nextPermutationJs(nums) {
    // 1. 後ろから転換点を探す
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    if (i >= 0) {
        // 2. 後ろから nums[i] より大きい最小の要素を探す
        let j = nums.length - 1;
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        // 3. スワップ
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    // 4. i+1 以降を反転
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;
    }
}
// ```

// ---

// ### **動作例**

// ```javascript
// let nums1 = [1,2,3];
// nextPermutation(nums1);
// console.log(nums1); // [1,3,2]

// let nums2 = [3,2,1];
// nextPermutation(nums2);
// console.log(nums2); // [1,2,3]

// let nums3 = [1,1,5];
// nextPermutation(nums3);
// console.log(nums3); // [1,5,1]
// ```

// ---

// この方法は **LeetCodeの`Next Permutation`問題（31番）** にそのまま提出可能です。
// 処理は **最大100要素** なので O(n) で十分高速、かつ追加配列を作らず **定数メモリ** で完結します。
