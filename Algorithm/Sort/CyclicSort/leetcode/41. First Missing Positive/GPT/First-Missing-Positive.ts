// 以下は **TypeScript 5.1 / Node.js 18.16.1** 対応、**O(n) 時間・O(1) 追加メモリ** の解法です。
// 配列をインプレースで並べ替える **Cyclic Sort（配置スワップ法）** を利用しています。

// ```typescript
/**
 * 配列 nums に存在しない最小の正の整数を返す
 * @param nums - 整数配列（順不同、負数や0を含む可能性あり）
 * @returns 配列に存在しない最小の正の整数
 *
 * 時間計算量: O(n)
 * 空間計算量: O(1) 追加メモリ
 * 対応環境: TypeScript 5.1 / Node.js 18.16.1 / LeetCode
 */
function firstMissingPositiveGPT(nums: number[]): number {
    const n: number = nums.length;

    // 正しい位置に [1, n] の範囲の値を移動
    for (let i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            const correctIndex: number = nums[i] - 1;
            [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        }
    }

    // 値とインデックス+1が一致しない最初の位置が答え
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }

    // 全て揃っていれば n+1
    return n + 1;
}

// ### アルゴリズム概要

// 1. **配置スワップ法**

//    * 値 `x` が `1 <= x <= n` であれば、インデックス `x-1` に置く。
//    * スワップ後も同じ条件に該当すれば再度スワップ（`while`ループ）。
// 2. **O(n) 時間**

//    * 各要素は最大1回しか正しい位置に移動しない。
// 3. **O(1) 追加メモリ**

//    * 配列を直接並べ替えるため、追加の配列は不要。
// 4. **範囲外や重複は無視**

//    * `[1, n]` の範囲外は位置合わせ対象外。
