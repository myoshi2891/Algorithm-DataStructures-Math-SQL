// ## 1. 問題の分析

// ### **競技プログラミング視点での分析**

// * **目標**：連結リストを `x` で安定パーティション（`< x` が先、`>= x` が後）に並べ替え。
// * **最速**：全ノードを 1 回だけ走査し、2 本のリスト（less / greaterOrEqual）に順次追加して最後に結合 → **O(n)**。
// * **メモリ**：入力を破壊的に書き換えれば **O(1)** 追加メモリが可能だが、**Pure function（非破壊）**要件では新ノード生成が必要 → **O(n)**。

// ### **業務開発視点での分析**

// * **型安全性**：`ListNode` の構造 `{ val: number; next: ListNode | null }` を固定し、null 安全を徹底。
// * **可読性/保守性**：番兵（ダミー）ノード + テールポインタで境界条件を単純化。
// * **エラーハンドリング**：`x` の型/範囲、ノード数の上限（≤200）、値域（[-100, 100]）を走査中に軽量検証し、逸脱時は `TypeError` / `RangeError`。

// ### **TypeScript特有の考慮点**

// * **型推論**：`ListNode | null` を明示し、`while (cur)` の判定で null 安全。
// * **コンパイル時最適化**：プロパティ形状の安定化（`val`→`next` の順に初期化）。
// * **ジェネリクス**：本問題は数値専用のため汎用ジェネリクスは用いず、コードを単純化して最適化を優先。

// ---

// ## 2. アルゴリズムアプローチ比較

// | アプローチ               | 時間計算量      | 空間計算量    | TS実装コスト | 型安全性 | 可読性 | 備考                        |
// | ------------------- | ---------- | -------- | ------- | ---- | --- | ------------------------- |
// | 方法A（**非破壊**二列構築・採用） | **O(n)**   | **O(n)** | 低       | 高    | 高   | 入力を変更せず新ノードで安定結合（Pure 準拠） |
// | 方法B（破壊的：再配線）        | O(n)       | O(1)     | 低       | 中    | 中   | 入力を再配線するが Pure 要件に抵触      |
// | 方法C（値でのソート）         | O(n log n) | O(n)     | 中       | 中    | 中   | 安定ソート前提、過剰計算              |
// | 方法D（逐次再挿入）          | O(n²)      | O(1)     | 低       | 高    | 中   | 小規模限定、非現実的                |

// ---

// ## 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**：方法A（非破壊の二列構築：less/ge へ新ノード追加 → 連結）
// * **理由**：

//   * **計算量**：単一走査 **O(n)** で最短、分岐は単純。
//   * **型安全**：`ListNode` の新規生成のみで入力不変を保証（Pure）。
//   * **可読性/保守性**：番兵ノードで境界条件（空/全< x/全≥ x）を自然に処理。
// * **TypeScript最適化ポイント**：

//   * `ListNode` コンストラクタでプロパティを固定初期化（hidden class 安定）。
//   * ループは `while`、不要なクロージャ・配列生成なし。
//   * 実行時チェックは一回走査に同梱し、ホットパスの分岐最小化。

// ---

// ## 4. 実装コード（LeetCode 提出フォーマット / ESM方針・外部ライブラリ不使用）

// ```typescript
// ESM 方針（import/export は不要。LeetCode の TypeScript 実行環境に準拠）
// strict モード/外部ライブラリ無し

/**
 * Definition for singly-linked list.
 * function ListNode(val?: number, next?: ListNode | null) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// class ListNode {
//   val: number;
//   next: ListNode | null;
//   constructor(val?: number, next?: ListNode | null) {
//     this.val = val === undefined ? 0 : val;
//     this.next = next === undefined ? null : next;
//   }
// }

/**
 * Partition List（Pure：入力リストを変更しない）
 * 与えられた連結リストを x で 2 分割し、(< x) を先頭、(>= x) を後段に安定結合して返す。
 * 入力ノードは変更せず、新たなノード列を構築して返す。
 *
 * @param {ListNode | null} head - 連結リストの先頭
 * @param {number} x - しきい値（-200 <= x <= 200）
 * @returns {ListNode | null} パーティション後の新しいリスト先頭
 * @throws {TypeError} x が有限数でない／ノード値が数値でない
 * @throws {RangeError} x が [-200,200] 外／ノード数が 200 超／ノード値が [-100,100] 外
 * @complexity Time: O(n), Space: O(n)  // Pure のため新規ノードを生成
 */
function partition(head: ListNode | null, x: number): ListNode | null {
  // --- 入力検証（軽量＆早期） ---
  if (typeof x !== "number" || !Number.isFinite(x)) {
    throw new TypeError("x must be a finite number");
  }
  if (x < -200 || x > 200) {
    throw new RangeError("x is out of allowed range [-200, 200]");
  }
  if (head !== null && typeof head !== "object") {
    throw new TypeError("head must be a ListNode or null");
  }

  // ダミー（番兵）ノードとテール
  const lessDummy = new ListNode(0);
  const geDummy = new ListNode(0);
  let lessTail = lessDummy;
  let geTail = geDummy;

  let count = 0;
  let cur = head;

  // --- 単一走査：検証しつつ新ノードを安定追加 ---
  while (cur !== null) {
    count++;
    if (count > 200) {
      throw new RangeError("List size exceeds limit [0, 200]");
    }

    const v = cur.val;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new TypeError("ListNode.val must be a finite number");
    }
    if (v < -100 || v > 100) {
      throw new RangeError("ListNode.val is out of allowed range [-100, 100]");
    }

    // Pure：元ノードは触らず、新ノードで構築
    if (v < x) {
      lessTail.next = new ListNode(v);
      lessTail = lessTail.next;
    } else {
      geTail.next = new ListNode(v);
      geTail = geTail.next;
    }

    cur = cur.next;
  }

  // (< x) の末尾に (>= x) を連結
  lessTail.next = geDummy.next;
  geTail.next = null;

  return lessDummy.next;
}
// ```

// ---

// ## 5. TypeScript 固有の最適化観点（要点）

// * **型安全性**

//   * `ListNode | null` を明示し、`while (cur !== null)` で null 安全。
//   * 値域/サイズを実行時に検証し、異常は例外送出（`TypeError`/`RangeError`）。
// * **コンパイル時最適化**

//   * クラスのプロパティ初期化順を固定し hidden class を安定化。
//   * 追加のユーティリティ/ジェネリクスを敢えて使わず、型を単純化して JIT 友好。
// * **実行時性能**

//   * 一時配列・クロージャ生成なし、単純な `while` ループのみ。
//   * 新規ノード生成は Pure 要件による最小限の追加メモリ（O(n））に抑制。

// > 備考：Pure 要件が不要であれば、元ノードの `next` を再配線する実装により追加メモリ **O(1)** にできます（ロジック構造は同一：二列構築→結合）。
