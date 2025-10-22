// この問題は **Jump Game (LeetCode 55)** です。
// 効率良い解法として **Greedy (貪欲法)** を使います。

// * 各位置から「どこまで到達できるか」の最大範囲 (`maxReach`) を更新する。
// * 現在のインデックス `i` が `maxReach` を超えたら、そこに到達できないので `false` を返す。
// * 最後のインデックスに到達できれば `true`。

// 計算量は **O(n)**、メモリ使用量は **O(1)** です。

// ```javascript
/**
 * 判定: 配列 nums の最初の位置から最後の位置まで到達できるか
 *
 * @param {number[]} nums - 各位置の最大ジャンプ長を格納した整数配列
 * @return {boolean} - 最後のインデックスに到達可能なら true、できなければ false
 */
function canJump(nums) {
    let maxReach = 0; // 到達可能な最大インデックス

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            // ここに到達できない場合
            return false;
        }
        maxReach = Math.max(maxReach, i + nums[i]); // 最大到達可能位置を更新
        if (maxReach >= nums.length - 1) {
            // 最後に到達できると分かったら即終了
            return true;
        }
    }

    return true;
}
// ```

// ### 🔎 処理時間・メモリ消費

// * **時間計算量**: O(n) （配列を1度走査するだけ）
// * **空間計算量**: O(1) （定数領域のみ利用）

// この実装は **Node.js 18.16.1** でそのまま LeetCode に提出可能です。
