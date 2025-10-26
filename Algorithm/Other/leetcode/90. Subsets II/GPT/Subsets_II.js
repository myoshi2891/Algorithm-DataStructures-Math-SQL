// // 以下は指定テンプレートに沿った “LeetCode 形式” の回答です。

// // ---

// // # 1. 問題の分析

// // ## 競技プログラミング視点

// // * **要点**: 重複を含む `nums` から「重複しない全部分集合」を列挙（パワーセット）。
// // * **定石**: 先に **昇順ソート** → バックトラッキング中に「同一階層で同値はスキップ」。
// // * **計算量目安**: 出力量は高々 `2^n`。各ステップで `O(1)` 操作を心掛けても、全体で **O(n·2^n)** は不可避（出力量の下界）。
// // * **メモリ**: 出力を除けばスタックと作業配列で **O(n)**。

// // ## 業務開発視点

// // * **保守性/可読性**: `subsetsWithDup` を純粋関数に分離。`validateInput` で入力検証を一箇所に集約。命名は問題領域に即した語彙（`curr`, `start` など最小限）。
// // * **エラーハンドリング**:

// //   * 型が配列でない → `TypeError`
// //   * 要素が有限整数でない / 制約違反（長さ 1..10, 値域 -10..10）→ `RangeError`

// // ## JavaScript特有の考慮点

// // * **V8最適化**:

// //   * ループは `for` 基本。
// //   * 配列は **単型（number）** を維持。
// //   * `curr` は push/pop で再利用して **hidden class** を安定化。
// // * **GC負荷低減**:

// //   * `curr` は 1 本を再利用（コピー発生は `res.push(curr.slice())` のみ）。
// //   * クロージャは 1 つの DFS のみに限定。
// // * **ソートコスト**: `O(n log n)`（n ≤ 10 なので無視可能）。重複排除ロジックの単純化のために支払う小コスト。

// // ---

// // # 2. アルゴリズムアプローチ比較

// // | アプローチ                                  | 時間計算量*       |   空間計算量* | JS実装コスト | 可読性 | 備考                                          |
// // | -------------------------------------- | ------------ | -------: | ------: | --: | ------------------------------------------- |
// // | 方法A: **ソート + バックトラッキング（同階層重複スキップ）**    | **O(n·2^n)** | **O(n)** |       低 |   高 | 本命。`i>start && nums[i]==nums[i-1]` をスキップ条件に |
// // | 方法B: ソート + 反復的にサイズ境界で増殖（重複範囲のみ追加）      | O(n·2^n)     |     O(n) |       中 |   中 | 直前に追加した範囲だけに同値を付与                           |
// // | 方法C: **頻度表**で各値を 0..freq 回選択（多重集合 DFS） | O(n·2^n)     |     O(n) |       中 |   中 | Map生成と順序管理がやや冗長                             |

// // * 出力サイズ（解の総数）を除いた追加コストのオーダー。出力は不可避に `Θ(2^n)`。

// // ---

// // # 3. 選択したアルゴリズムと理由

// // * **選択**: 方法A（ソート + バックトラッキングで同階層スキップ）
// // * **理由**:

// //   * 最短・最小の実装で **重複なし** を厳密に担保。
// //   * `n ≤ 10` の制約下では最もシンプルで **高速**。
// //   * `curr` 再利用で **GC 負荷が小さく V8 に優しい**。
// // * **JavaScript最適化ポイント**:

// //   * `for (let i = start; i < n; i++)` の単純ループ。
// //   * `curr` は push → 再帰 → pop の定型で形状安定。
// //   * 早期の **入力検証** をホットパス外に分離。

// // ---

// // # 4. コード実装（solution.js）

// // ```js
// // 'use strict';
// // // Module: CommonJS（既定）
// // // 実行: node solution.js

// // /**
// //  * 入力検証ヘルパー（軽量・早期）
// //  * @param {unknown} arr
// //  * @throws {TypeError|RangeError}
// //  */
// // function validateInput(arr) {
// //   if (!Array.isArray(arr)) {
// //     throw new TypeError('Input must be an array of numbers');
// //   }
// //   const n = arr.length;
// //   if (n < 1 || n > 10) {
// //     throw new RangeError('Array length must be within [1, 10]');
// //   }
// //   for (let i = 0; i < n; i++) {
// //     const v = arr[i];
// //     if (typeof v !== 'number' || !Number.isFinite(v) || (v | 0) !== v) {
// //       throw new TypeError('All elements must be finite integers');
// //     }
// //     if (v < -10 || v > 10) {
// //       throw new RangeError('Each number must be within [-10, 10]');
// //     }
// //   }
// // }

// // /**
// //  * Subsets II: 重複要素を含む配列から、重複しない全部分集合を列挙
// //  *
// //  * @param {number[]} nums - 入力配列（整数）
// //  * @returns {number[][]} 全部分集合（ユニーク）
// //  * @throws {TypeError} 入力が数値配列でない場合
// //  * @throws {RangeError} 制約違反（長さ・値域）
// //  *
// //  * @complexity
// //  * 時間: O(n·2^n)（生成される部分集合の個数に比例）
// //  * 空間: O(n)（再帰スタックと作業配列、出力除く）
// //  */
// // function subsetsWithDup(nums) {
// //   validateInput(nums);

// //   // ---- 前処理: 昇順ソート（同値が隣接）----
// //   // n <= 10 のため sort コストは実質無視可能
// //   const arr = nums.slice().sort((a, b) => a - b);
// //   const n = arr.length;

// //   /** @type {number[][]} */
// //   const res = [];
// //   /** @type {number[]} */
// //   const curr = [];

// //   // ---- DFS/backtracking ----
// //   function dfs(start) {
// //     // 現在の選択をスナップショットとして保存
// //     res.push(curr.slice());

// //     for (let i = start; i < n; i++) {
// //       // 同一階層での重複スキップ:
// //       // 直前と同じ値で、かつ「同じ階層で i がスタートから進んだ位置」のときはスキップ
// //       if (i > start && arr[i] === arr[i - 1]) continue;

// //       curr.push(arr[i]);
// //       dfs(i + 1);
// //       curr.pop();
// //     }
// //   }

// //   dfs(0);
// //   return res;
// // }

// // module.exports = { subsetsWithDup };
// // ```

// // ---

// // # 5. 追加メモ（JS最適化チェックリスト）

// // * ループは `for` 基本（`forEach/map` 回避で割当・クロージャ削減）。
// // * `curr` を 1 本で再利用し、**push/pop** で形状（hidden class）を安定。
// // * 作業配列や一時オブジェクトの生成を最小化（`res.push(curr.slice())` のみ必須）。
// // * 例外は **ホットパス外**（冒頭の検証）で早期に投げる。
// // * 配列は **numbers only** を維持して単型性を確保。

// // ---

// // ## 0. 実行環境（再掲）

// // * Language/Runtime: JavaScript (Node.js v18+)
// // * Module: **CommonJS**
// // * 外部ライブラリ: 禁止（Node標準のみ）
// // * CI前提: `node solution.js` 実行可能（エクスポート済み、テストコードは未同梱）

// // 必要に応じて、LeetCode の関数名に合わせたい場合は `module.exports = subsetsWithDup;` と単体エクスポートに変更しても動作は同一です。

// 了解です。実行時間・メモリをもう少し攻めるために、**再帰を廃して反復（iterative）で“直前に追加した範囲だけを拡張する”方式**に切り替えます。これで関数呼び出し/クロージャのオーバーヘッドと、同階層重複チェックの分岐を削減できます。配列コピーは `slice` を避け、**手書きループでのコピー＋末尾追加**にして割り当てを最小限＆型を安定化させます。

// ---

// # 1. 問題の分析

// ## 競技プログラミング視点

// * **要点**: 重複を含む配列から重複のない全部分集合。
// * **改善方針**: 先にソートし、各要素について

//   * **新規要素**: `res` の**全範囲**を拡張
//   * **重複要素**: **前回追加された範囲のみ**を拡張
//     する反復法で重複を自然排除。再帰/バックトラックを使わない。

// ## 業務開発視点

// * **可読性**: `start`/`prevEnd` の2変数で拡張区間を明示化。
// * **例外方針**: 入力検証は早期・軽量（TypeError/RangeError）。

// ## JavaScript特有の考慮点

// * **V8最適化**:

//   * ループは `for`。
//   * **配列コピーは手書き**（`new Array(len)` → インデックス代入）で hidden class を安定化。
//   * 反復法で**再帰スタック/クロージャ無し**。
// * **GC対策**: 必要最小限の配列生成のみ（出力量分は不可避）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                  | 時間計算量        |     空間計算量 | JS実装コスト | 可読性 | 備考                  |
// | ---------------------- | ------------ | --------: | ------: | --: | ------------------- |
// | 方法A: 再帰BT（同階層スキップ）     | O(n·2^n)     |      O(n) |       低 |   高 | 既存（合格済み）            |
// | **方法B: 反復・拡張区間限定（採用）** | **O(n·2^n)** | **O(1)※** |       低 |   高 | 重複時は直前追加分のみ拡張。※出力除く |
// | 方法C: 頻度表DFS            | O(n·2^n)     |      O(n) |       中 |   中 | 実装やや重め              |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**: 方法B（反復・拡張区間限定）
// * **理由**:

//   1. 再帰コールと分岐を削減 → **低オーバーヘッド**
//   2. ソート＋範囲制御で重複排除が明快 → **高可読性**
//   3. `slice`/`concat` を避け、**手書きコピー**で型を安定化
// * **最適化ポイント**:

//   * `prevEnd` を使い、重複時の開始点 `start` を `prevEnd+1` に確定
//   * 手書きコピー（`for`）で新配列を構築

// ---

// # 4. コード実装（solution.js）

// ```js
// 'use strict';
// // Module: CommonJS
// // 実行: node solution.js

// /**
//  * 入力検証（軽量・早期）
//  * @param {unknown} arr
//  * @throws {TypeError|RangeError}
//  */
// function validateInput(arr) {
//   if (!Array.isArray(arr)) throw new TypeError('Input must be an array of numbers');
//   const n = arr.length;
//   if (n < 1 || n > 10) throw new RangeError('Array length must be within [1, 10]');
//   for (let i = 0; i < n; i++) {
//     const v = arr[i];
//     if (typeof v !== 'number' || !Number.isFinite(v) || (v | 0) !== v) {
//       throw new TypeError('All elements must be finite integers');
//     }
//     if (v < -10 || v > 10) throw new RangeError('Each number must be within [-10, 10]');
//   }
// }

// /**
//  * Subsets II（反復法・拡張区間限定）
//  * - 昇順ソート後、重複要素は「直前の追加範囲のみ」を拡張
//  *
//  * @param {number[]} nums - 入力配列（整数）
//  * @returns {number[][]} 全部分集合（ユニーク）
//  * @throws {TypeError|RangeError} 入力検証に失敗した場合
//  *
//  * @complexity
//  * 時間: O(n·2^n)（出力サイズに支配）
//  * 空間: O(1) 追加（出力を除く）
//  */
// function subsetsWithDup(nums) {
//   validateInput(nums);

//   // ソートで同値を隣接
//   const arr = nums.slice().sort((a, b) => a - b);

//   /** @type {number[][]} */
//   const res = [ [] ]; // 初期状態: 空集合のみ

//   // 直前イテレーションで res に追加された最後のインデックス
//   // 重複値のときは、この直後からのみ拡張する
//   let prevEnd = -1;

//   for (let i = 0, n = arr.length; i < n; i++) {
//     const v = arr[i];

//     // 重複なら直前追加範囲の直後から、非重複なら 0 から
//     const start = (i > 0 && v === arr[i - 1]) ? (prevEnd + 1) : 0;

//     // このイテレーション開始時点での res の末尾を固定
//     const end = res.length - 1;

//     // start..end の既存 subset を v で拡張して末尾に追加
//     for (let j = start; j <= end; j++) {
//       const base = res[j];
//       const m = base.length + 1;
//       const next = new Array(m);
//       // 手書きコピー（slice/concat/spread を避ける）
//       for (let k = 0; k < m - 1; k++) next[k] = base[k];
//       next[m - 1] = v;
//       res.push(next);
//     }

//     // 今回追加された範囲は (end+1 .. res.length-1)
//     prevEnd = res.length - 1;
//   }

//   return res;
// }

// module.exports = { subsetsWithDup };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * 反復で**再帰/スタック無し**、ホットパスの分岐最小化。
// * `next` は `new Array(len)` → **手書きコピー**で hidden class 安定。
// * `for` ループ固定、`forEach/map`/スプレッド/`concat`を避ける。
// * 配列は number 単型を維持。
// * 例外は冒頭で早期（ホットパス外）。

// ---

// この版は、**再帰呼び出しと `slice/concat` のオーバーヘッドを排除**しているため、典型ケースで数 ms 程度の改善が見込めます（入力制約が小さいため劇的ではありませんが、安定して速い実装です）。そのまま差し替えてお試しください。

// 原因わかりました。
// **重複値のときに拡張を開始するインデックスが誤っていました。**
// 前回答では `start = prevEnd + 1` としていましたが、`prevEnd` を「前回イテレーション後の res の末尾」に更新していたため、**“前回追加した範囲” を正しく指せず**、結果として `[2]` への拡張が起きませんでした。

// 正しくは、**「前回イテレーション開始時点の res.length」を記憶**しておき、重複値のときは **その位置（＝前回追加の開始位置）から**拡張を再開します。これで `nums=[1,2,2]` の 3 要素目では、直前に追加された `[2]` と `[1,2]` を正しく拡張できます。

// ---

// # 修正版（反復・拡張区間限定, LeetCode 形式 / CommonJS）

// ```js
'use strict';
// Module: CommonJS
// 実行: node solution.js

/**
 * 入力検証（軽量・早期）
 * @param {unknown} arr
 * @throws {TypeError|RangeError}
 */
function validateInput(arr) {
    if (!Array.isArray(arr)) throw new TypeError('Input must be an array of numbers');
    const n = arr.length;
    if (n < 1 || n > 10) throw new RangeError('Array length must be within [1, 10]');
    for (let i = 0; i < n; i++) {
        const v = arr[i];
        if (typeof v !== 'number' || !Number.isFinite(v) || (v | 0) !== v) {
            throw new TypeError('All elements must be finite integers');
        }
        if (v < -10 || v > 10) throw new RangeError('Each number must be within [-10, 10]');
    }
}

/**
 * Subsets II（反復法・拡張区間限定）
 * - 昇順ソート後、重複要素は「前回イテレーションで新規に追加された範囲のみ」を拡張
 *
 * @param {number[]} nums - 入力配列（整数）
 * @returns {number[][]} 全部分集合（ユニーク）
 * @throws {TypeError|RangeError} 入力検証に失敗した場合
 *
 * @complexity
 * 時間: O(n·2^n)（出力サイズに支配）
 * 空間: O(1) 追加（出力除く）
 */
function subsetsWithDup(nums) {
    validateInput(nums);

    const arr = nums.slice().sort((a, b) => a - b);

    /** @type {number[][]} */
    const res = [[]];

    // prevSize: 「直前イテレーション開始時点」での res.length
    // 重複時はここから末尾までが「直前イテレーションで新規に追加された範囲」
    let prevSize = 0;

    for (let i = 0, n = arr.length; i < n; i++) {
        const v = arr[i];
        const size = res.length; // 今イテレーション開始時点の res.length

        // 非重複なら res 全体を拡張, 重複なら「前回追加範囲のみ」拡張
        const start = i > 0 && v === arr[i - 1] ? prevSize : 0;

        for (let j = start; j < size; j++) {
            const base = res[j];
            const m = base.length + 1;
            const next = new Array(m);
            // 手書きコピー（slice/concat/spread を避けて型安定＆割当抑制）
            for (let k = 0; k < m - 1; k++) next[k] = base[k];
            next[m - 1] = v;
            res.push(next);
        }

        // 次回のために「今回イテレーション開始時点の長さ」を保存
        prevSize = size;
    }

    return res;
}

module.exports = { subsetsWithDup };
// ```

// **ポイント（修正要旨）**

// * “前回追加範囲” の開始位置は **`prevEnd + 1` ではなく `prevSize`**。
// * `prevSize` は **「前回イテレーション開始時点の `res.length`」** を保持する変数。
// * これにより `nums=[1,2,2]` で 3 要素目 `2` のとき、`res[2] = [2]` と `res[3] = [1,2]` を正しく拡張して `[2,2]`, `[1,2,2]` が追加され、期待通りの出力になります。
