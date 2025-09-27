// # 1. 問題の分析

// ## 競技プログラミング視点での分析

// * 目的：単方向連結リストを値 `x` で 2 つの安定パーティション（`< x` / `>= x`）に分け、相対順序を維持して結合。
// * 最短計算量：全走査 1 回で十分 → **O(n)**。
// * 安定性：スタブル分割（相対順序維持）が必須。2 本のテール付きリストに順次追加で満たせる。

// ## 業務開発視点での分析

// * 可読性：ダミーノード（番兵）2 個＋テールポインタを使うとロジックが明瞭。
// * 例外方針：入力型（`head` が `null` または `ListNode`）、`x` が有限数、ノード値・ノード数が制約内を軽量に検証。異常時は `TypeError` / `RangeError`。

// ## JavaScript特有の考慮点

// * **V8 最適化**：プロパティ形状（`{val, next}`）を固定、分岐は最小限、関数は単目的でインラインフレンドリー。
// * **GC 対策**：一時オブジェクト生成を抑制。ただし **Pure 関数要件**のため新ノード生成は不可避（入力不変性の担保）。
// * ループは `while` で単純化（イテレータやクロージャを避ける）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ                  | 時間計算量      | 空間計算量    | JS実装コスト | 可読性   | 備考                                 |
// | ---------------------- | ---------- | -------- | ------- | ----- | ---------------------------------- |
// | 方法A（インプレース分割）          | O(n)       | O(1)     | 低       | 中     | 元リストの `next` を付け替える。**Pure ではない**  |
// | 方法B（安定ソート相当）           | O(n log n) | O(n)     | 中       | 高     | 値でのソート。相対順序維持のため安定ソートが必要           |
// | 方法C（再挿入 O(n²)）         | O(n²)      | O(1)     | 低       | 高     | 小規模なら可。順序維持しつつ逐次探索で挿入              |
// | **方法A'（本採用：コピー＋二列構築）** | **O(n)**   | **O(n)** | **低**   | **高** | 2 本のダミー連結リストに**新ノード**で追加。Pure を満たす |

// > 注：本設問は「Pure function」要件があるため、**方法A'**（新ノード生成で入力を不変に保つ）を採用します。

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択したアプローチ**：方法A'（二本リスト＋番兵、ノードをコピーして安定連結）
// * **理由**：

//   * 時間 **O(n)**、一回走査で安定パーティション可。
//   * 入力 `head` を変更しないため **Pure** を厳密に満たす。
//   * 実装が短く、境界条件（空・単一・全 `< x` / 全 `>= x`）の扱いが容易。
// * **JavaScript特有の最適化ポイント**：

//   * `ListNode` の形状（`val`, `next`）を固定し、hidden class を安定化。
//   * ループは単純な `while`、関数内でクロージャ生成なし。
//   * 例外チェックは一回走査内に折り込み、ホットパス外の分岐を最小化。

// ---

// # 4. コード実装（solution.js）

// ```javascript
"use strict";
// Module system: CommonJS（ローカル実行: `node solution.js`）
// LeetCode フォーマット準拠：ListNode と partition(head, x) をエクスポート相当で定義
// 外部ライブラリ禁止（Node.js v18+ 標準のみ使用）

/**
 * 単方向連結リストのノード定義（LeetCode 互換）
 * @constructor
 * @param {number} val
 * @param {ListNode|null} [next]
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * Partition List（Pure：入力リストを破壊しない）
 *
 * 与えられた連結リストを x で 2 分割し、(< x) が先、(>= x) が後ろになるように安定結合して返す。
 * 入力は変更しないため、各ノードは新規に生成して返す。
 *
 * @param {ListNode|null} head - 連結リストの先頭
 * @param {number} x - しきい値（-200 <= x <= 200）
 * @returns {ListNode|null} 新たに構築されたパーティション済みリストの先頭
 * @throws {TypeError} head の型が不正／x が数値でない
 * @throws {RangeError} x が許容範囲外／ノード値やノード数が制約外
 *
 * 時間計算量: O(n)（n はノード数）
 * 空間計算量: O(n)（Pure を満たすため新ノードを生成）
 */
function partition(head, x) {
  // ---- 入力検証（軽量＆早期）----
  if (head !== null && (typeof head !== "object" || head === undefined)) {
    throw new TypeError("head must be a ListNode or null");
  }
  if (typeof x !== "number" || !Number.isFinite(x)) {
    throw new TypeError("x must be a finite number");
  }
  if (x < -200 || x > 200) {
    throw new RangeError("x is out of allowed range [-200, 200]");
  }

  // 制約: ノード数 [0, 200], 値域 [-100, 100]
  // 1 回走査内で件数と値域を検査しつつ分割用リストを構築（Pure のためコピー）
  let lessDummy = new ListNode(0),
    lessTail = lessDummy;
  let geDummy = new ListNode(0),
    geTail = geDummy;

  let count = 0;
  let curr = head;

  while (curr !== null) {
    count++;
    if (count > 200) {
      throw new RangeError("List size exceeds limit [0, 200]");
    }

    const v = curr.val;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new TypeError("ListNode.val must be a finite number");
    }
    if (v < -100 || v > 100) {
      throw new RangeError("ListNode.val is out of allowed range [-100, 100]");
    }

    // Pure のため新ノードを生成して追加（元ノードは変更しない）
    if (v < x) {
      lessTail.next = new ListNode(v);
      lessTail = lessTail.next;
    } else {
      geTail.next = new ListNode(v);
      geTail = geTail.next;
    }

    curr = curr.next;
  }

  // 連結：(< x) リストの末尾に (>= x) リストをつなぐ
  lessTail.next = geDummy.next;
  geTail.next = null;

  return lessDummy.next;
}

// ---- LeetCode 提出時は関数定義のみで可。ローカル実行や他環境向けに CommonJS export も用意 ----
module.exports = { ListNode, partition };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ループは `while` を使用（`map`/`forEach` を避け、不要なクロージャ割当なし）。
// * `ListNode` の形状は固定（`val` → `next` の順）で hidden class を安定化。
// * 例外は最初の走査で早期検知し、ホットパスの分岐は最小限。
// * Pure 要件により新ノード生成は不可避（O(n) 追加メモリ）。もし副作用許容なら、元ノードを再配線する **O(1) 追加メモリ** 実装に切替可能（ロジックは同一・ダミー2本＋テール結合）。
