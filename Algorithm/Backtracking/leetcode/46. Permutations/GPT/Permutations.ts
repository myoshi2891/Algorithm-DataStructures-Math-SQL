/**
 * パラメーター:
 * @param {number[]} nums - distinct integers を要素に持つ配列 (長さ 1 <= nums.length <= 6)
 *
 * 返却値:
 * @return {number[][]} - nums の全ての順列を格納した2次元配列
 *
 * アルゴリズム:
 * - in-place swap を利用して順列を生成
 * - start 位置を固定し、残りの部分を順列化
 * - 配列コピーは最終結果保存時のみ行い、メモリ使用を最小化
 *
 * 計算量:
 * 時間計算量: O(n * n!) （各順列生成で O(n) コピー）
 * 空間計算量: O(n) （再帰スタック深さ）
 */
function permuteGPT(nums: number[]): number[][] {
    const result: number[][] = [];

    const backtrack = (start: number): void => {
        if (start === nums.length) {
            result.push([...nums]); // 現在の順列を保存
            return;
        }
        for (let i = start; i < nums.length; i++) {
            // swap
            [nums[start], nums[i]] = [nums[i], nums[start]];
            backtrack(start + 1);
            // 元に戻す
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    };

    backtrack(0);
    return result;
}
