// ```typescript
/**
 * Merge overlapping intervals
 *
 * @param intervals - 2D array where each element is [start, end]
 * @returns Array of merged non-overlapping intervals
 *
 * Node.js v18.16.1 / TypeScript 5.1
 * Time Complexity: O(n log n) （ソート処理による）
 * Space Complexity: O(n) （結果配列に依存）
 */
function merge(intervals: number[][]): number[][] {
    // 入力が空の場合はそのまま返す
    if (intervals.length === 0) return [];

    // 開始時間でソート（O(n log n)）
    intervals.sort((a, b) => a[0] - b[0]);

    const merged: number[][] = [];
    let current: number[] = intervals[0];

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

// このTypeScript実装では:

// * **クラスを使わず関数のみ** で処理
// * **O(n log n)** の計算量（ソートに依存）
// * **O(n)** の追加メモリ消費（出力配列に依存）

// となり、LeetCodeのTypeScript環境（Node.js 18系）でも効率的に動作します。

