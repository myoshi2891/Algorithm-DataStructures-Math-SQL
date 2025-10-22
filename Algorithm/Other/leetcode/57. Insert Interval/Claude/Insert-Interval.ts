// TypeScript版に更新しました。主な変更点：

// **型安全性の向上：**
// - `intervals: number[][]` - 2次元数値配列の型指定
// - `newInterval: number[]` - 数値配列の型指定
// - `number[][]` - 戻り値の型指定

// **TypeScript 5.1の利点：**
// - コンパイル時の型チェックによる安全性
// - IDEでの優れた補完機能
// - 型推論による実行時エラーの削減

// **パフォーマンス特性（変更なし）：**
// - **時間計算量**: O(n)
// - **空間計算量**: O(1) (結果配列を除く)
// - **メモリ効率**: 最適化されたアロケーション

// TypeScriptの型システムにより、LeetCodeでの提出時により安全で保守性の高いコードとなります。実行時のパフォーマンスはJavaScript版と同等です。

/**
 * Insert a new interval into a sorted array of non-overlapping intervals
 * @param intervals - Array of non-overlapping intervals sorted by start time
 * @param newInterval - New interval to insert [start, end]
 * @returns New array of intervals after insertion and merging
 */
function insert(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;

    // Step 1: Add all intervals that end before newInterval starts
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }

    // Step 2: Merge all overlapping intervals with newInterval
    let mergedStart = newInterval[0];
    let mergedEnd = newInterval[1];

    while (i < n && intervals[i][0] <= newInterval[1]) {
        mergedStart = Math.min(mergedStart, intervals[i][0]);
        mergedEnd = Math.max(mergedEnd, intervals[i][1]);
        i++;
    }

    // Add the merged interval
    result.push([mergedStart, mergedEnd]);

    // Step 3: Add all remaining intervals that start after newInterval ends
    while (i < n) {
        result.push(intervals[i]);
        i++;
    }

    return result;
}
