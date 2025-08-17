// ```typescript
/**
 * 最小ジャンプ回数を求める関数
 * @param {number[]} nums - 各インデックスでジャンプできる最大距離を表す配列
 * @returns {number} - 最後のインデックスに到達するための最小ジャンプ回数
 *
 * 計算量: O(n) （各要素を一度だけ処理する）
 * メモリ使用量: O(1) （追加の大きなデータ構造を使用しない）
 */
function jump(nums: number[]): number {
    const n: number = nums.length;
    if (n <= 1) return 0;

    let jumps: number = 0; // 最小ジャンプ回数
    let currentEnd: number = 0; // 現在のジャンプで到達できる範囲の終端
    let farthest: number = 0; // 現時点で到達可能な最も遠い位置

    for (let i = 0; i < n - 1; i++) {
        // i から到達可能な最も遠い位置を更新
        farthest = Math.max(farthest, i + nums[i]);

        // 現在のジャンプ範囲の終端に到達したらジャンプ回数を増やす
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;

            // 最後のインデックスに届くなら終了
            if (currentEnd >= n - 1) break;
        }
    }

    return jumps;
}
// ```

// この TypeScript 実装は **Greedy（貪欲法）** を用いています。

// * **処理時間:** O(n) （配列を一度スキャンするだけ）
// * **メモリ消費:** O(1) （変数だけを使用、追加配列なし）
