// # 1. 問題の分析

// **要約**
// `1..n` の連続整数を各ノード値として持つ、**構造的に一意な BST** をすべて列挙する。戻り値は **BST の根ノード配列**（LeetCode #95 “Unique Binary Search Trees II” 形式）。

// ## 競技プログラミング視点

// * 典型解は **区間分割の分割統治**：`i` を根にしたとき、左部分木は `[l, i-1]`、右部分木は `[i+1, r]` の全組合せ。
// * 同じ区間を何度も計算するため **メモ化**（`[l,r]`）が効く。
// * 生成される木の総数は **カタラン数 Cₙ**。下界として出力サイズが巨大（n=8 でも 143 本）→ 計算量は出力サイズに比例。

// ## 業務開発視点

// * **責務分割**：入力検証 → メモ化付き構築関数 → 公開関数。
// * **命名/可読性**：`build(l, r)`、`TreeNode`、`generateTrees` を明確化。
// * **例外方針**：型/範囲の不正は `TypeError` / `RangeError` を**早期**に送出。
// * **テスト容易性**：純関数（グローバル副作用なし）。`TreeNode` を同梱してローカル実行可能。

// ## JavaScript特有の考慮

// * **V8 最適化**

//   * ホットパスは **素朴な `for` ループ**、`Array.prototype.forEach` などのコールバックは避ける。
//   * **Hidden Class 安定化**：`TreeNode` のプロパティはコンストラクタで固定順に定義。
// * **GC 対策**

//   * メモ化で再生成を抑制（ただし木ノード生成は不可避）。
//   * ループ内クロージャの生成を避ける。
// * **配列操作**

//   * `push` のみ使用（末尾集中）。
//   * キーは `l,r` の文字列化で Map を単純化。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                  | 時間計算量              |                     空間計算量 | JS実装コスト | 可読性 | 備考             |
// | ---------------------- | ------------------ | ------------------------: | ------: | --: | -------------- |
// | 方法A: 分割統治 + 区間メモ化（採用）  | だいたい **O(Cₙ · n)** | **O(Cₙ · n)**（キャッシュ + 出力） |       低 |   高 | 最定番。重複計算を削減    |
// | 方法B: 長さ DP（区間長で底上げ）    | だいたい **O(Cₙ · n)** |             **O(Cₙ · n)** |       中 |   中 | 実装が煩雑、利得は小     |
// | 方法C: 素朴バックトラッキング（非メモ化） | **指数**             |                    **指数** |       低 |   中 | n が小でも無駄が多く非推奨 |

// > ※ 生成物が Cₙ 本あるため、理論下限として **出力サイズ線形**は不可避。

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択**：方法A（分割統治 + 区間メモ化）
// * **理由**：最小実装コストで、重複計算を避けつつ Cₙ 規模に近い実行時間を実現。JS/V8 とも相性が良い単純ループ中心。
// * **JS最適化ポイント**

//   * ループは `for`。配列は `push` のみ。
//   * `TreeNode` のプロパティ順固定（`val` → `left` → `right`）。
//   * `Map` を用いキーを `${l},${r}` に統一して Hidden Class を安定。

// ---

// # 4. コード実装（solution.js）

// ```js
"use strict";
// Module: CommonJS（指定がない場合の既定に従う）
// Node.js v18+, 外部ライブラリ不使用

/**
 * 二分木ノード（LeetCode 互換）
 * Hidden Class 安定化のため、コンストラクタでプロパティを固定順に定義。
 */
class TreeNode {
  /**
   * @param {number} val
   * @param {TreeNode|null} [left=null]
   * @param {TreeNode|null} [right=null]
   */
  constructor(val, left = null, right = null) {
    this.val = val; // 1st
    this.left = left; // 2nd
    this.right = right; // 3rd
  }
}

/**
 * Unique BSTs II
 * 1..n の値で構造的に一意な BST を全列挙して返す。
 *
 * @param {number} n - ノード数（1 <= n <= 8）
 * @returns {TreeNode[]} 根ノード配列（各要素が1本のBSTの根）
 * @throws {TypeError} 引数が number でない、または整数でない
 * @throws {RangeError} 範囲外（n < 0 または n > 8）
 * @complexity 時間: おおよそ O(C_n * n), 空間: O(C_n * n)（出力＋メモ化）
 *
 * @example
 * // ローカル確認用（LeetCodeでは不要）
 * // node solution.js のときに軽く実行するなら、
 * // console.log(generateTrees(3).length); // 5
 */
function generateTrees(n) {
  // ---- 入力検証（早期・軽量）----
  if (typeof n !== "number" || Number.isNaN(n)) {
    throw new TypeError("n must be a number");
  }
  if (!Number.isInteger(n)) {
    throw new TypeError("n must be an integer");
  }
  if (n < 0 || n > 8) {
    throw new RangeError("n must satisfy 0 <= n <= 8");
  }

  // 仕様上 1 <= n だが、防御的に n===0 は空配列を返す
  if (n === 0) return [];

  // ---- メモ化: key は "l,r" ----
  /** @type {Map<string, TreeNode[]>} */
  const memo = new Map();

  /**
   * 区間 [l, r] の全BST根を列挙
   * @param {number} l
   * @param {number} r
   * @returns {TreeNode[]} roots
   */
  function build(l, r) {
    if (l > r) {
      // 空部分木は「null 一通り」
      return [null];
    }
    const key = l + "," + r;
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    /** @type {TreeNode[]} */
    const res = [];
    // ループは素朴な for（V8 に優しい）
    for (let rootVal = l; rootVal <= r; rootVal++) {
      const leftTrees = build(l, rootVal - 1);
      const rightTrees = build(rootVal + 1, r);

      // 直積で全組合せ
      for (let i = 0; i < leftTrees.length; i++) {
        const left = leftTrees[i];
        for (let j = 0; j < rightTrees.length; j++) {
          const right = rightTrees[j];
          // 新規ノードを生成（参照共有はしない）
          res.push(new TreeNode(rootVal, left, right));
        }
      }
    }
    memo.set(key, res);
    return res;
  }

  return build(1, n);
}

module.exports = { generateTrees, TreeNode };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `for` 基本。`map/forEach` は不要な関数オブジェクト生成・型不安定化を招くため未使用。
// * `TreeNode` は **プロパティ順固定**で Hidden Class を安定化。
// * メモ化（`Map`）により部分問題の再計算を防止。GC 発生を抑える副次効果あり。
// * 出力は **Cₙ 本の木**で不可避にメモリを使うため、アルゴリズム的な追加配列は最小限。
// * 例外はホットパス前に**早期送出**（型/範囲チェック）。

// ---

// ## 2. 解析（短縮版）

// ### 2.1 競技プログラミング視点

// * 速度：メモ化で実質的に最短（出力下限に近い）。
// * メモリ：出力が支配的。部分解の配列も必要最小限。
// * 1 パス/ストリーム化：木列挙のため実質不可。

// ### 2.2 業務開発視点

// * 関数は `generateTrees` に集約し、`build` は内包でスコープを限定。
// * 例外：`TypeError`/`RangeError` を明確化し、利用側のバグ検出を容易に。

// ### 2.3 JavaScript特有

// * V8 の最適化フレンドリーな単純 for・固定プロパティ。
// * 生成回数は必要最小限（ただし木の数は問題仕様上不可避）。

// ---

// 必要に応じて、ローカルでは `node -e "console.log(require('./solution.js').generateTrees(3).length)"` のように件数だけ確認できます（テストコードの提出は不要とのことなので省略）。
