// ```javascript
/**
 * 最小ジャンプ回数を求める関数
 * @param {number[]} nums - 各インデックスでジャンプできる最大距離を表す配列
 * @returns {number} - 最後のインデックスに到達するための最小ジャンプ回数
 *
 * 計算量: O(n) （各要素を一度ずつ走査する）
 * メモリ使用量: O(1) （追加の配列や大きなデータ構造を使わない）
 */
function jump(nums) {
    const n = nums.length;
    if (n <= 1) return 0;

    let jumps = 0; // 最小ジャンプ回数
    let currentEnd = 0; // 現在のジャンプで到達できる範囲の終端
    let farthest = 0; // 現時点で到達可能な最も遠い位置

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

// この実装は **Greedy（貪欲法）** を用いており、

// * 1回のループで最小ジャンプ数を求められます（`O(n)`）。
// * 配列以外に余分なメモリを使わないため、`O(1)` のメモリ使用量です。
