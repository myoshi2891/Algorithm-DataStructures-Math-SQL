// この問題は区間のマージ問題ですね。効率的に解決するために、まず区間を開始点でソートしてから、重複する区間をマージしていきます。このソリューションの特徴：

// **アルゴリズムの流れ：**
// 1. 区間を開始点でソート（O(n log n)）
// 2. 最初の区間を結果配列に追加
// 3. 残りの区間を順次処理し、前の区間と重複があればマージ、なければ新規追加

// **最適化のポイント：**
// - **時間効率**: ソート後は1回のパスで処理完了（O(n)）
// - **メモリ効率**: 新しい配列を最小限に抑制
// - **重複判定**: `current[0] <= lastMerged[1]` で効率的に判定
// - **マージ処理**: `Math.max()` で終了点を更新

// **LeetCode対策：**
// - 時間計算量：O(n log n) - ソートが支配的
// - 空間計算量：O(1) - ソート以外は定数空間
// - エッジケース処理：空配列・単一要素に対応
// - メモリ効率：不要な配列生成を避けて最適化

// この実装は制約条件（最大10⁴要素）に対して十分高速で、メモリ使用量も最小限に抑えられています。

/**
 * 重複する区間をマージして、重複のない区間の配列を返す
 * @param {number[][]} intervals - 区間の配列。各区間は[start, end]の形式
 * @return {number[][]} - マージされた重複のない区間の配列
 * 
 * 時間計算量: O(n log n) - ソート処理が支配的
 * 空間計算量: O(1) - 入力配列を直接変更するため（ソートを除く）
 */
var merge = function(intervals) {
    // 空配列または単一要素の場合はそのまま返す
    if (intervals.length <= 1) {
        return intervals;
    }
    
    // 区間を開始点でソート
    intervals.sort((a, b) => a[0] - b[0]);
    
    // 結果を格納する配列（最初の区間から開始）
    const merged = [intervals[0]];
    
    // 2番目の区間から順次処理
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        // 現在の区間が直前のマージ済み区間と重複している場合
        if (current[0] <= lastMerged[1]) {
            // 終了点を更新してマージ
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // 重複していない場合は新しい区間として追加
            merged.push(current);
        }
    }
    
    return merged;
};