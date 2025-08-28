// ```javascript
/**
 * Merge overlapping intervals
 *
 * @param {number[][]} intervals - 2D array where each element is [start, end]
 * @returns {number[][]} - Array of merged non-overlapping intervals
 *
 * Node.js v18.16.1
 * Time Complexity: O(n log n) （ソートに依存）
 * Space Complexity: O(n) （結果配列に依存）
 */
function merge(intervals) {
    // 入力が空の場合はそのまま返す
    if (intervals.length === 0) return [];

    // 開始時間でソート（O(n log n)）
    intervals.sort((a, b) => a[0] - b[0]);

    const merged = [];
    let current = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i];

        // currentの終了と次の開始を比較してオーバーラップ判定
        if (start <= current[1]) {
            // マージ：終了時間を最大値に更新
            current[1] = Math.max(current[1], end);
        } else {
            // オーバーラップが無ければ結果に追加し、新しい区間に更新
            merged.push(current);
            current = intervals[i];
        }
    }

    // 最後の区間を追加
    merged.push(current);

    return merged;
}
// ```

// この実装は **クラスを使わず関数のみ** で処理しており、

// * ソート処理により **O(n log n)** の計算量
// * 出力配列に依存して **O(n)** の追加メモリ消費

// に抑えています。LeetCode環境（Node.js 18系）でも効率的に動作します。
