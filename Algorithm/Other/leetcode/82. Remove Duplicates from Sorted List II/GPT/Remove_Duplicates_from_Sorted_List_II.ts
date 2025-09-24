// # 1. 問題の分析

// ## 競技プログラミング視点

// * 入力サイズ最大 300 → O(n) で十分高速。
// * 配列化せずに **単一パス + ポインタ操作** で重複削除するのが最適。
// * 追加メモリ不要 → 空間計算量 O(1)。

// ## 業務開発視点

// * **型安全性**: `ListNode` クラスを定義して明示的に型付け。
// * **保守性**: `dummy` ノードを導入して先頭削除を簡潔に。
// * **エラーハンドリング**:

//   * 引数が `ListNode | null` でない場合は `TypeError`。
//   * 範囲外値やノード数超過時は `RangeError`。

// ## TypeScript特有の考慮点

// * **strict mode** でコンパイル → null安全。
// * **型推論**で冗長な注釈を最小化。
// * **readonly修飾子**でイミュータブル性を担保（アルゴリズム本体は破壊的更新）。
// * **ジェネリクス**は不要（問題特有の `ListNode<number>` 固定）。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ         | 時間計算量 | 空間計算量 | TS実装コスト | 型安全性 | 可読性 | 備考                    |
// | ------------- | ----- | ----- | ------- | ---- | --- | --------------------- |
// | 方法A: 1パス削除    | O(n)  | O(1)  | 低       | 高    | 中   | **最適解**、dummyノードで実装容易 |
// | 方法B: 配列化して再構築 | O(n)  | O(n)  | 中       | 中    | 高   | 型定義は容易だがメモリ浪費         |
// | 方法C: 二重ループ    | O(n²) | O(1)  | 低       | 高    | 低   | 小規模のみ妥当、非効率           |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択: 方法A (1パス削除, O(n), O(1))**
// * **理由**:

//   * 制約に対して最速・最省メモリ。
//   * TypeScriptで `ListNode` 型を明示しつつ安全に破壊的更新可能。
//   * 可読性も保てる（`dummy` ノードで処理をシンプルに）。

// **TS特有の最適化ポイント**

// * `ListNode` クラスを strict モードで利用し hidden class 安定化。
// * null安全オプションを活用。
// * 型チェックにより入力不正を早期検知。

// ---

// # 4. 実装コード（solution.ts）

// ```typescript
// ESM形式 (Node.js v18)
export {};

/**
 * Definition for singly-linked list.
 */
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/**
 * Remove all duplicates from sorted linked list.
 * @param head - The head of the sorted linked list
 * @returns The head of the list with only distinct numbers
 * @throws {TypeError} If input is not a ListNode or null
 * @throws {RangeError} If node count > 300 or value outside [-100,100]
 * @complexity Time: O(n), Space: O(1)
 */
export function deleteDuplicates(head: ListNode | null): ListNode | null {
  if (head !== null && !(head instanceof ListNode)) {
    throw new TypeError("Input must be a ListNode or null");
  }

  // 入力検証
  let count = 0;
  for (let p = head; p !== null; p = p.next) {
    count++;
    if (count > 300) {
      throw new RangeError("Node count exceeds 300");
    }
    if (!Number.isInteger(p.val)) {
      throw new TypeError("Node value must be an integer");
    }
    if (p.val < -100 || p.val > 100) {
      throw new RangeError("Node value out of range [-100,100]");
    }
  }

  const dummy = new ListNode(0, head);
  let prev: ListNode = dummy;

  while (head !== null) {
    if (head.next !== null && head.val === head.next.val) {
      while (head.next !== null && head.val === head.next.val) {
        head = head.next;
      }
      prev.next = head.next; // skip duplicates
    } else {
      prev = prev.next as ListNode;
    }
    head = head.next;
  }

  return dummy.next;
}
// ```

// ---

// # 5. TypeScript固有の最適化観点

// * **型安全性**

//   * `ListNode | null` で null安全を担保。
//   * `instanceof` で実行時型検証。
//   * `readonly` を導入すればAPI利用側の誤更新も防止可能。

// * **コンパイル時最適化**

//   * strict mode により null/undefined エラーをコンパイル時に検出。
//   * 型推論により補助的型注釈を削減。

// * **保守性**

//   * JSDocで関数契約を明示。
//   * エラー条件を型定義 + 実行時例外で二重に保証。

// ---

// ✅ これで **LeetCode提出フォーマット（ListNode定義 + deleteDuplicates関数）** かつ **TypeScript ESM, strict mode** の完全解答です。
