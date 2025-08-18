/**
 * パラメーター:
 * @param {number[]} nums - distinct integers を要素にもつ配列 (長さは 1 <= nums.length <= 6)
 *
 * 返却値:
 * @return {number[][]} - nums のすべての順列を配列として返却
 *
 * アルゴリズム:
 * - バックトラッキングを利用して順列を生成
 * - すでに使った要素を管理するために boolean 配列を使用
 * - nums.length が最大 6 なので計算量は最大 6! = 720 通りで十分に高速
 *
 * 計算量:
 * 時間計算量: O(n * n!) （各順列生成に O(n) コピー操作が必要）
 * 空間計算量: O(n) （再帰スタック + 使用中管理配列）
 */
function permute(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    const path = [];

    function backtrack() {
        if (path.length === nums.length) {
            // path のコピーを追加
            result.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrack();
            path.pop();
            used[i] = false;
        }
    }

    backtrack();
    return result;
}
