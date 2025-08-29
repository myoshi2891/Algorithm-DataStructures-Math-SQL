// ```typescript
/**
 * Insert a new interval into a sorted list of non-overlapping intervals.
 *
 * @param intervals - 既存の区間（非重複かつ開始位置で昇順ソート済み）
 *                  型: number[][] （各要素は [start, end]）
 * @param newInterval - 挿入する新しい区間 [start, end]
 *                     型: [number, number]
 * @returns 新しい区間を挿入し、必要に応じてマージした結果の区間リスト
 *          型: number[][]
 *
 * 処理時間: O(n) （各区間を1度だけ走査）
 * メモリ使用量: O(n) （結果を新しい配列に格納）
 */
function insert(intervals: number[][], newInterval: [number, number]): number[][] {
    const result: number[][] = [];
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

// この実装は **TypeScript 5.1 (Node.js 18.16.1)** でそのままLeetCodeに提出可能です。

// * 時間計算量は **O(n)**（一度の線形走査）
// * 空間計算量は **O(n)**（結果を格納する配列）
// * クラスは使わず、関数ベースで定義してあります。

// 👉 必要なら、ジェネリック型を使わず `[number, number]` として明示したので、`newInterval` の型安全性も保証されています。
