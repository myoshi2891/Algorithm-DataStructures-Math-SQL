// この問題を効率的に解決するJavaScript関数を作成します。この解法について説明します：

// **アルゴリズムの流れ：**
// 1. **前処理**: 新しい区間が始まる前に終了する区間をすべて結果に追加
// 2. **マージ処理**: 新しい区間と重複する区間をすべてマージ
// 3. **後処理**: 新しい区間が終了した後に始まる区間をすべて結果に追加

// **効率性の特徴：**
// - **時間計算量**: O(n) - 配列を一度だけ走査
// - **空間計算量**: O(1) - 結果配列以外の追加領域は不要
// - **メモリ効率**: 元の配列を変更せず、必要最小限の新しい配列を作成

// **最適化のポイント：**
// 1. `Math.min/max`を使用して条件分岐を最小化
// 2. 3つのフェーズに分けることで複雑な条件判定を回避
// 3. 一度の走査ですべての処理を完了

// この実装はLeetCodeでの高速実行とメモリ効率を考慮して設計されており、制約条件（最大10^4の区間数）に対して十分な性能を発揮します。

/**
 * Insert a new interval into a sorted array of non-overlapping intervals
 * @param {number[][]} intervals - Array of non-overlapping intervals sorted by start time
 * @param {number[]} newInterval - New interval to insert [start, end]
 * @return {number[][]} - New array of intervals after insertion and merging
 */
function insert(intervals, newInterval) {
    const result = [];
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