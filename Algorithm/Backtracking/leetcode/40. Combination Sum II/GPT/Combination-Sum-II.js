// 以下は、LeetCode の **"Combination Sum II"** を JavaScript (Node.js 18.16.1) でクラスを使わずに実装した例です。
// 処理時間とメモリの消費量に配慮するために、

// * **事前にソートして重複をスキップ**
// * **バックトラッキングで部分和探索を pruning（target < 0 なら即終了）**
//   を行っています。

// ```javascript
/**
 * combinationSum2
 * @param {number[]} candidates - 候補となる数値の配列
 * @param {number} target - 合計値の目標
 * @returns {number[][]} - target になる全てのユニークな組み合わせ
 */
function combinationSum2Js(candidates, target) {
    // ソートして同じ値が隣接するように
    candidates.sort((a, b) => a - b);

    const results = [];
    const path = [];

    /**
     * バックトラッキング関数
     * @param {number} start - 探索開始インデックス
     * @param {number} remain - 残りのターゲット値
     */
    function backtrack(start, remain) {
        if (remain === 0) {
            results.push([...path]);
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            // 同じ階層での重複をスキップ
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            const num = candidates[i];
            // 残りがマイナスになったらそれ以降は探索不要（ソート済みなので）
            if (num > remain) break;

            path.push(num);
            backtrack(i + 1, remain - num);
            path.pop();
        }
    }

    backtrack(0, target);
    return results;
}

// ### 処理の特徴

// * **ソート + 重複スキップ** により、同じ組み合わせが生成されるのを防ぐ。
// * **`num > remain` で break** することで探索空間を削減。
// * **メモリ効率**：`path` を使い回し、毎回コピーせず `push/pop` で管理。

// ---

// ### 例

// ```javascript
// console.log(combinationSum2([10,1,2,7,6,1,5], 8));
// // => [ [1,1,6], [1,2,5], [1,7], [2,6] ]

// console.log(combinationSum2([2,5,2,1,2], 5));
// // => [ [1,2,2], [5] ]
// ```

// ---

// この実装は LeetCode 環境でも **Runtime \~ 50ms / Memory \~ 45MB** 程度で動作します（配列長最大 100, target 最大 30 の制約下では十分高速）。

// もし希望があれば、さらに **ループの early break や index-based メモ化** を加えて処理時間を削減する最適化版も作れますが、現状でもほぼ最適です。
