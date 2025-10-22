// # 1. 問題の分析

// ## 競技プログラミング視点

// * **速度最優先**: 部分集合生成は典型的に `2^n` 通り。n ≤ 10 なので十分現実的。
// * **メモリ**: 出力全体が `2^n` 個を含むため、メモリ削減余地は小さい。
// * **実装戦略**: DFS/backtracking またはビット全探索が定石。

// ## 業務開発視点

// * **保守性**: 再帰 DFS を関数分割して実装する方が読みやすい。
// * **入力検証**: 型チェック、長さチェック（1 ≤ n ≤ 10）、要素一意性を検証。
// * **例外方針**: 不正入力時には `TypeError` / `RangeError` を投げる。

// ## JavaScript特有の考慮

// * **V8最適化**: `for` ループ、単型配列を利用。
// * **GC負荷**: 部分集合生成での一時配列コピーは必要最小限にする。
// * **配列操作**: `push/pop` によるスタック操作は安定して高速。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                 | 時間計算量    | 空間計算量       | JS実装コスト | 可読性 | 備考              |
// | --------------------- | -------- | ----------- | ------- | --- | --------------- |
// | 方法A: DFS/backtracking | O(n·2^n) | O(n) (再帰深さ) | 低       | 高   | 最も標準的で可読性良好     |
// | 方法B: ビット全探索           | O(n·2^n) | O(1) 追加     | 中       | 中   | ループで実装。やや読みにくい  |
// | 方法C: 再帰的合成            | O(n·2^n) | O(2^n)      | 高       | 中   | 部分結果をどんどん複製する実装 |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（DFS/backtracking）

// * **理由**:

//   * 入力制約が小さいため再帰 DFS が直感的で分かりやすい。
//   * 競技プログラミングでも業務開発でも読みやすく、保守性が高い。
//   * JS最適化的にも `push/pop` を利用する DFS は無駄が少ない。

// * **JavaScript特有の最適化ポイント**:

//   * `for (let i=idx; i<n; i++)` のループで hidden class を安定化。
//   * `subset.slice()` を使わず、必要時に shallow copy。
//   * エラーチェックはホットパス外（冒頭）で早期 return。

// ---

// # 4. コード実装（solution.js, ESM形式）

// ```javascript
// 'use strict';

// /**
//  * @param {number[]} nums - 入力配列（整数のみ、ユニーク）
//  * @returns {number[][]} 部分集合の配列
//  * @throws {TypeError} 入力が配列でない、または数値配列でない場合
//  * @throws {RangeError} 配列サイズや値域が制約を超える場合
//  * @complexity 時間計算量: O(n·2^n), 空間計算量: O(n) (再帰スタック)
//  */
// export function subsets(nums) {
//   // --- 入力検証 ---
//   if (!Array.isArray(nums)) throw new TypeError('Input must be an array');
//   const n = nums.length;
//   if (n < 1 || n > 10) throw new RangeError('Array length must be between 1 and 10');
//   const seen = new Set();
//   for (let i = 0; i < n; i++) {
//     const v = nums[i];
//     if (typeof v !== 'number' || !Number.isInteger(v) || v < -10 || v > 10) {
//       throw new RangeError('Array elements must be integers between -10 and 10');
//     }
//     if (seen.has(v)) throw new RangeError('Array elements must be unique');
//     seen.add(v);
//   }

//   // --- 部分集合生成 (DFS) ---
//   const res = [];
//   const subset = [];

//   /**
//    * 再帰DFS
//    * @param {number} idx - 次に処理するインデックス
//    */
//   function dfs(idx) {
//     if (idx === n) {
//       res.push(subset.slice());
//       return;
//     }
//     // 選ばない場合
//     dfs(idx + 1);
//     // 選ぶ場合
//     subset.push(nums[idx]);
//     dfs(idx + 1);
//     subset.pop();
//   }

//   dfs(0);
//   return res;
// }
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * `for` ループ使用、`forEach/map` 不使用 → 不要なクロージャを避ける
// * 配列は数値のみ → hidden class 安定
// * `subset` は再利用し、必要時に `slice()` → GC削減
// * 入力検証はループ1回のみで早期チェック
// * 再帰 DFS 深さは最大 10 → Node.js の再帰制限に問題なし

// ---

// ✅ このまま `node solution.js` （ESMモード, `type: module` 設定）で実行可能です。

// ---

// ## 考えられるエラーと修正方法

// ### ケース1: `SyntaxError: Cannot use import statement outside a module`

// **原因**: Node.js が CommonJS モードで実行されている。
// **解決方法**:

// 1. `package.json` に `"type": "module"` を追加する。

//    ```json
//    {
//      "type": "module"
//    }
//    ```
// 2. その上で `solution.js` を実行する:

//    ```bash
//    node solution.js
//    ```

// ---

// ### ケース2: `ReferenceError: exports is not defined in ES module scope`

// **原因**: `export`/`import` を使っているのに CommonJS として実行されている。
// **解決方法**: 上記と同じく `"type": "module"` を設定するか、またはファイル拡張子を `.mjs` に変更して

// ```bash
// node solution.mjs
// ```

// で実行する。

// ---

// ### ケース3: LeetCode 実行環境でのエラー

// LeetCode は **CommonJS** を前提にしているため、ESM の `export` は受け付けません。
// その場合は以下のように書き換える必要があります。

// ```javascript
'use strict';

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
    const n = nums.length;
    const res = [];
    const subset = [];

    function dfs(idx) {
        if (idx === n) {
            res.push(subset.slice());
            return;
        }
        dfs(idx + 1);
        subset.push(nums[idx]);
        dfs(idx + 1);
        subset.pop();
    }

    dfs(0);
    return res;
};

module.exports = { subsets }; // LeetCode 実行環境用
// ```

// ---

// ## まとめ

// * **ローカルで動かしたい** → `package.json` に `"type": "module"` を追記するか、拡張子を `.mjs` に変更する。
// * **LeetCode に提出したい** → `module.exports` を使う CommonJS 形式に書き換える。
