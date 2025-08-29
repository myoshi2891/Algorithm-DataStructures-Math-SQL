// ```javascript
/**
 * Insert a new interval into a sorted list of non-overlapping intervals.
 *
 * @param {number[][]} intervals - 既存の区間（非重複かつ開始位置で昇順ソート済み）
 * @param {number[]} newInterval - 挿入する新しい区間 [start, end]
 * @returns {number[][]} 新しい区間を挿入し、必要に応じてマージした結果の区間リスト
 *
 * 処理時間: O(n) （各区間を1度だけ走査）
 * メモリ使用量: O(n) （結果を新しい配列に格納）
 */
function insert(intervals, newInterval) {
    const result = [];
    let i = 0;
    const n = intervals.length;

    // 1. newInterval の開始より前の区間を追加
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }

    // 2. newInterval と重なる区間をマージ
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push(newInterval);

    // 3. 残りの区間を追加
    while (i < n) {
        result.push(intervals[i]);
        i++;
    }

    return result;
}
// ```

// この実装は

// * **O(n) 時間**で1回の走査のみで処理
// * **O(n) メモリ**で新しい配列に格納
// * `while` ループで重なり部分をまとめてマージするため効率的

// となっており、LeetCode 環境(Node.js 18.16.1)でも処理時間・メモリ消費を抑えられる設計です。
