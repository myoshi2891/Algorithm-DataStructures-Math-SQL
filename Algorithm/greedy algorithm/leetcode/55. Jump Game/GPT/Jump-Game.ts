// では **TypeScript 5.1 (Node.js 18.16.1)** 用に、クラスを使わず関数のみで実装した **Greedy 解法 (O(n) 時間, O(1) 空間)** を示します。

// ```typescript
/**
 * 判定: 配列 nums の最初の位置から最後の位置まで到達できるか
 *
 * @param nums - 各位置の最大ジャンプ長を格納した整数配列
 * @returns 最後のインデックスに到達可能なら true、できなければ false
 */
function canJumpGPT(nums: number[]): boolean {
    let maxReach: number = 0; // 到達可能な最大インデックス

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            // i が現在の到達可能範囲を超える → そこにすら到達できない
            return false;
        }
        maxReach = Math.max(maxReach, i + nums[i]); // 最大到達可能位置を更新
        if (maxReach >= nums.length - 1) {
            // 最後のインデックスに到達可能と判明したら即終了
            return true;
        }
    }

    return true;
}
// ```

// ---

// ### 🔎 処理時間・メモリ消費

// * **時間計算量**: O(n) （配列を1度走査するだけ）
// * **空間計算量**: O(1) （変数 `maxReach` のみ使用）

// このまま **LeetCode (TypeScript, Node.js 18.16.1)** に提出できます。
