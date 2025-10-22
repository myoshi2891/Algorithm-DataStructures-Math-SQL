// # 1. 問題の分析

// ## 競技プログラミング視点

// * 入力は昇順ソート済みの単方向リスト。
// * 「重複をすべて削除し、ユニーク要素だけ残す」問題。
// * 制約: ノード数最大 300 → O(n) アルゴリズムで十分。
// * 破壊的更新で追加メモリを極小化できる。

// ## 業務開発視点

// * メンテナンス性のため、`ListNode` クラス定義を JSDoc 付きで明示。
// * `deleteDuplicates` は純粋関数で副作用を避ける。
// * 入力検証を行い、型不整合時は `TypeError`、制約違反時は `RangeError` を投げる。

// ## JavaScript特有の考慮点

// * V8 最適化: 単純な `while`/`for` ループ、クロージャを避ける。
// * Hidden Class の安定化: `ListNode` は constructor 内でフィールドを固定。
// * 配列操作は不要。ノード参照操作のみで GC コストを削減。

// ---

// # 2. アルゴリズムアプローチ比較

// | アプローチ               | 時間計算量 | 空間計算量 | JS実装コスト | 可読性 | 備考              |
// | ------------------- | ----- | ----- | ------- | --- | --------------- |
// | 方法A: 1パスで重複除去       | O(n)  | O(1)  | 低       | 中   | **最適**、破壊的更新    |
// | 方法B: 配列化→Mapで数え→再構築 | O(n)  | O(n)  | 中       | 高   | 実装は簡単だが余計なメモリ使用 |
// | 方法C: 二重ループ          | O(n²) | O(1)  | 低       | 高   | 小規模なら動くが非効率     |

// ---

// # 3. 選択したアルゴリズムと理由

// * **選択: 方法A (O(n), O(1))**
// * 理由: 制約下で最速、追加メモリ不要、V8 フレンドリー。
// * JS特有の最適化:

//   * `while` ループでリスト走査。
//   * 新規配列/Mapを作らずに既存ノードを直接接続。
//   * `dummy` ノードを導入して先頭削除も簡潔に。

// ---

// # 4. コード実装（solution.js）

// ```javascript
'use strict';

/**
 * Definition for singly-linked list.
 * @constructor
 * @param {number} val
 * @param {ListNode|null} next
 */
function ListNode(val, next = null) {
    /** @type {number} */
    this.val = val;
    /** @type {ListNode|null} */
    this.next = next;
}

/**
 * Remove all duplicates from sorted linked list.
 * @param {ListNode|null} head - The head of the sorted linked list
 * @returns {ListNode|null} - The head of the list with only distinct numbers
 * @throws {TypeError} If input is not a ListNode or null
 * @throws {RangeError} If node count > 300 or value outside [-100,100]
 * @complexity Time O(n), Space O(1)
 */
function deleteDuplicates(head) {
    if (head !== null && !(head instanceof ListNode)) {
        throw new TypeError('Input must be a ListNode or null');
    }

    // Count nodes & validate values
    let count = 0;
    for (let p = head; p !== null; p = p.next) {
        count++;
        if (count > 300) throw new RangeError('Node count exceeds 300');
        if (typeof p.val !== 'number' || !Number.isInteger(p.val)) {
            throw new TypeError('Node value must be an integer');
        }
        if (p.val < -100 || p.val > 100) {
            throw new RangeError('Node value out of range [-100,100]');
        }
    }

    const dummy = new ListNode(0, head);
    let prev = dummy;

    while (head !== null) {
        if (head.next !== null && head.val === head.next.val) {
            // Skip all nodes with the same value
            while (head.next !== null && head.val === head.next.val) {
                head = head.next;
            }
            prev.next = head.next; // cut out duplicates
        } else {
            prev = prev.next;
        }
        head = head.next;
    }

    return dummy.next;
}

module.exports = { ListNode, deleteDuplicates };
// ```

// ---

// # 5. 追加メモ（JS最適化チェックリスト）

// * ✅ `for`/`while` ループ利用、クロージャ排除。
// * ✅ `ListNode` 形状固定で Hidden Class 最適化。
// * ✅ 新規配列/Mapを避け GC 負荷削減。
// * ✅ Pure function (入力検証込み)。

// ---
