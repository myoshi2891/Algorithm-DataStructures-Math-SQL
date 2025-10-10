// ### 1. 問題の分析

// * **競技プログラミング視点での分析**

//   * 区間 `[left, right]` のみ反転。**単一パス O(n)、追加メモリ O(1)** が最適。
//   * 典型手筋はダミーノード（番兵）＋**前挿入（head insertion）** 方式で区間内のポインタを逐次反転。
//   * 早期終了：`left === right` / `head === null` の場合はそのまま返す。

// * **業務開発視点での分析**

//   * **可読性重視**：`pre`（left直前）、`curr`（現在反転の先頭）、`move`（取り出して先頭に差すノード）を明名。
//   * **境界の堅牢性**：`left = 1` のときもダミーノードで一様処理。ヌル安全（`ListNode | null`）を厳守。
//   * **副作用**：リスト節点の `next` を付け替えるが、入力ヘッドを破壊的変更＝**機能的には純粋（同じ入力構造に対し同じ出力）**。

// * **TypeScript特有の考慮点**

//   * `ListNode | null` を明示。`strictNullChecks` 前提で**型ナローイング**を丁寧に行う。
//   * 実行時チェックは最小限（LeetCodeは制約保証あり）。ただし防御的に `head`/`left===right` で早期 return。
//   * 計算量は JSDoc で明記、関数は**副作用以外の出力を持たない**（入出力決定的）。

// ---

// ### 2. アルゴリズムアプローチ比較

// | アプローチ                   | 時間計算量    | 空間計算量      | TS実装コスト | 型安全性 | 可読性 | 備考                            |
// | ----------------------- | -------- | ---------- | ------- | ---- | --- | ----------------------------- |
// | 方法A：ダミー節点＋前挿入一回走査       | **O(n)** | **O(1)**   | **低**   | 高    | 高   | 最短・堅牢。Follow-up（one pass）を満たす |
// | 方法B：部分リストを切り出し配列に積んで再結線 | O(n)     | O(k)（区間長）  | 中       | 中    | 中   | 余計な配列が不要・非推奨                  |
// | 方法C：再帰で区間反転             | O(n)     | O(n)（再帰深さ） | 中       | 中    | 中   | n≤500でも再帰不要、尾再帰最適化もない         |

// ---

// ### 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**: 方法A（ダミー節点＋前挿入、一回走査、原地 O(1)）

// * **理由**:

//   * **計算量**：O(n)/O(1) と最良。Follow-up「one pass」を満たす。
//   * **型安全**：`ListNode | null` を扱いつつ、ダミー導入で `left=1` も一様処理・分岐が単純。
//   * **保守性・可読性**：ポインタ3本（`pre`, `curr`, `move`）の役割が明確でレビューしやすい。

// * **TypeScript特有の最適化ポイント**

//   * `strictNullChecks` 下でのローカル変数の**段階的ナローイング**。
//   * `const dummy = new ListNode(0, head)` により返却値を `dummy.next` に統一。

// ---

// ### 4. 実装コード（LeetCode TypeScript フォーマット）

// ```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

/**
 * Reverse the nodes between positions left and right (1-indexed).
 * One-pass, in-place, O(1) extra space.
 *
 * @param head - The head of the singly linked list
 * @param left - Start position (1-indexed)
 * @param right - End position (1-indexed), right >= left
 * @returns The head of the modified list
 * @complexity Time: O(n), Space: O(1)
 */
function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  if (head === null || left === right) return head;

  const dummy = new ListNode(0, head);
  // 1) Move `pre` to node right before `left`
  let pre: ListNode = dummy;
  for (let i = 1; i < left; i++) {
    // pre.next は制約上 null にならない想定（1 <= left <= n）
    // それでも TypeScript 的に non-null を保証するためにチェック
    if (pre.next === null) return dummy.next;
    pre = pre.next;
  }

  // 2) `curr` は反転区間の先頭、ここから head-insertion で前に積む
  let curr: ListNode | null = pre.next; // non-null のはず
  // 3) 反転操作：`move` を curr.next から剥がし、pre.next の直後に挿入
  for (let i = 0; i < right - left; i++) {
    if (curr === null || curr.next === null) break; // 保険（入力制約上は到達しない）
    const move: ListNode = curr.next;
    // 剥がす
    curr.next = move.next;
    // 先頭挿入
    move.next = pre.next;
    pre.next = move;
  }

  return dummy.next;
}
// ```

// **実装メモ**

// * `dummy` を導入して **`left=1`** のケースでも `pre` を一様に「反転開始直前」に置ける。
// * ループ中、`curr` は常に反転済みブロックの**末尾**を指し続けるため、`curr.next` を剥がして `pre.next` 直後に挿入することで**前挿入**が実現。
// * 制約が保証されているが、TypeScript のヌル安全のため最小限の保険チェックを入れている（可読性維持の範囲で）。

// ---

// ### 5. 制約条件への適合

// * 外部ライブラリ**不使用**、Node.js v22 環境で問題なし（ESM指定でも LeetCode 側は関数単体提出形式のため `export` なし）。
// * **メモリ O(1)**：ノード再配置のみ。
// * **strict mode** 前提でも `ListNode | null` を適切に取り扱い。

// ---

// ## TypeScript固有の最適化観点（要点）

// * **型安全性**

//   * `ListNode | null` のナローイングで NPE を回避。
//   * 返却値は `dummy.next` に統一し、分岐での戻り値の型を安定化。
// * **readonly/副作用**

//   * 問題仕様上、リンクの `next` を更新する破壊的操作は不可避。ただし**入力構造に対して決定的**であり、外部状態を持たないため「純粋関数」の要件を満たす解釈で実装。
// * **ドキュメンテーション**

//   * `@complexity` を JSDoc に明記、保守時の判断材料を提供。

// **計測メモリ（56.02MB, p10%）の主因はロジック自体ではなく、微小な追加割り当てと参照寿命**です。本問題はもともと **O(1) 追加メモリ**ですが、LeetCode の計測は実行環境オーバーヘッドを含むため、差は僅少になります。それでも改善余地としては以下が現実的です。

// ## メモリ増加の要因と対策

// * **要因1: ダミーノードの追加割り当て**

//   * 改善: `left === 1` を分岐して「先頭からの反転」と「途中からの反転」を分け、**ダミーを完全に排除**。
// * **要因2: 参照寿命が長い一時変数**

//   * 改善: 反転ループの一時変数を**最小化**し、ブロックスコープで早期に寿命を終わらせる。
// * **要因3: 予防的なヌルチェックの多さ**

//   * 改善: 制約が保証される範囲で**不要なチェックを削減**（strict 下でも安全にナローイング可能な箇所のみ）。

// > これらはミクロ最適化で、**正味の追加メモリを 1ノード→0ノード**に、**保持参照数も最小化**します。計測メモリは環境差が大きいため劇的変化は保証できませんが、理論上・実装上は最小化できます。

// ---

// ## 修正版（ダミー節点を使わない実装 / TypeScript・LeetCode準拠）

// ```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

/**
 * Reverse the nodes between positions left and right (1-indexed).
 * In-place, one pass, no dummy allocation.
 *
 * @param head - head of list
 * @param left - start index (1-based)
 * @param right - end index (1-based)
 * @returns new head after sublist reversed
 * @complexity Time: O(n), Space: O(1)
 */
function reverseBetweenRefactored(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  if (head === null || left === right) return head;

  // Case 1: reverse from head (left === 1)
  if (left === 1) {
    let prev: ListNode | null = null;
    let curr: ListNode | null = head;
    for (let i = 0; i < right; i++) {
      // 制約より curr は null にならない
      const next: ListNode | null = (curr as ListNode).next;
      (curr as ListNode).next = prev;
      prev = curr;
      curr = next;
    }
    // head は反転後の末尾になっている
    (head as ListNode).next = curr;
    return prev; // 新しい先頭
  }

  // Case 2: reverse a middle/tail segment (left > 1)
  // 1) move `pre` to node just before `left`
  let pre: ListNode = head;
  for (let i = 1; i < left - 1; i++) {
    pre = pre.next as ListNode; // 制約により非null
  }

  // 2) reverse `count = right - left + 1` nodes starting from `start`
  const start: ListNode = pre.next as ListNode; // left位置のノード
  let prev: ListNode | null = null;
  let curr: ListNode | null = start;
  for (let i = 0, count = right - left + 1; i < count; i++) {
    const next: ListNode | null = (curr as ListNode).next;
    (curr as ListNode).next = prev;
    prev = curr;
    curr = next;
  }

  // 3) reconnect: pre -> (reversed head=prev) -> ... -> (reversed tail=start) -> curr
  pre.next = prev;
  start.next = curr;

  return head;
}
// ```

// ### 変更点の要旨

// * **ダミーノード削除**（割り当て 0 に）。
// * 一時変数は `prev/curr/next` のみで最小化。
// * ループ境界は制約に基づき `as ListNode` でナローイング、余分な実行時チェックを削除。

// ---

// ## 期待効果

// * **理論メモリ**：依然 O(1) ですが、**追加割り当て 0 ノード**となり、保持参照数も最小。
// * **実測メモリ**：プラットフォーム差分が大きいため保証はできませんが、**前回より良化**が見込めます（同一環境・同一ケース比較での微減）。
