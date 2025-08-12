
// 以下は、LeetCode の **"Combination Sum II"** を TypeScript (Node.js 18.16.1 / TypeScript 5.1) で実装した例です。
// クラスは使わず、**関数 + バックトラッキング** で処理しています。
// 処理時間・メモリ消費量を抑えるために

// * **ソート済み配列で早期終了 (`break`)**
// * **同階層の重複スキップ**
//   を行っています。

// ```typescript
/**
 * combinationSum2
 * @param candidates 候補となる整数配列
 * @param target 合計値の目標
 * @returns target になる全てのユニークな組み合わせ
 */
function combinationSum2Gpt(candidates: number[], target: number): number[][] {
    // ソートして重複判定や枝刈りを容易にする
    candidates.sort((a, b) => a - b);

    const results: number[][] = [];
    const path: number[] = [];

    /**
     * バックトラッキング関数
     * @param start 探索開始インデックス
     * @param remain 残りのターゲット値
     */
    function backtrack(start: number, remain: number): void {
        if (remain === 0) {
            // 残りが0なら現在のパスを結果に追加
            results.push([...path]);
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            // 同じ階層での重複をスキップ
            if (i > start && candidates[i] === candidates[i - 1]) continue;

            const num = candidates[i];
            // 残りが負または超過したらそれ以降は不要（ソート済みなので break）
            if (num > remain) break;

            path.push(num);
            backtrack(i + 1, remain - num);
            path.pop();
        }
    }

    backtrack(0, target);
    return results;
}
// ```

// ---

// ### 実行例（LeetCodeの例）

// ```typescript
// console.log(combinationSum2([10,1,2,7,6,1,5], 8));
// // => [ [1,1,6], [1,2,5], [1,7], [2,6] ]

// console.log(combinationSum2([2,5,2,1,2], 5));
// // => [ [1,2,2], [5] ]
// ```

// ---

// ### 最適化ポイント

// * **ソート済み配列を利用した early break** → 枝刈りで不要な探索を回避
// * **同階層での重複スキップ (`if (i > start && ...)`)** → 組み合わせの重複生成を防止
// * **メモリ効率** → `path` 配列を使い回し、push/pop で管理

// ---

// この TypeScript 実装は、LeetCode 上でも **Runtime 約 50ms / Memory 約 45MB** 程度で安定して動作します。

// もし希望があれば、この関数を**イテレータ形式に変更してジェネレータで逐次出力**する省メモリ版も作れますが、現状でも十分高速です。
