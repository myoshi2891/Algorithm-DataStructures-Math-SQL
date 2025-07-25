// 以下は、**TypeScript (5.1) + Node.js 18.16.1** 環境（LeetCode 対応）での「k個ずつノードを反転する」問題の解法です。
// **クラスではなく関数形式**で実装し、型を明示し、**定数メモリ (O(1))** を維持した構成です。

// ---

// ## ✅ TypeScript 実装（関数形式・LeetCode向け）

// ```ts

//  Definition for singly-linked list.
 class ListNode {
     val: number
     next: ListNode | null
     constructor(val?: number, next?: ListNode | null) {
         this.val = (val===undefined ? 0 : val)
         this.next = (next===undefined ? null : next)
     }
 }
 

/**
 * k個ずつノードを反転する関数
 * @param head - 連結リストの先頭ノード（ListNode型）
 * @param k - 反転するノード数（1 <= k <= n）
 * @returns 反転後の連結リストの先頭ノード（ListNode型）
 */
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    if (k <= 1 || head === null) return head;

    // リストの長さをカウント
    let count: number = 0;
    let node: ListNode | null = head;
    while (node !== null) {
        count++;
        node = node.next;
    }

    // ダミーノードを使用（リストの前に仮のノードを置く）
    const dummy: ListNode = new ListNode(0, head);
    let prevGroupEnd: ListNode = dummy;

    while (count >= k) {
        let prev: ListNode | null = null;
        let curr: ListNode | null = prevGroupEnd.next;
        let next: ListNode | null = null;
        const groupStart: ListNode = curr!;

        // k個分のノードを反転
        for (let i = 0; i < k; i++) {
            next = curr!.next;
            curr!.next = prev;
            prev = curr;
            curr = next;
        }

        // 接続を調整
        prevGroupEnd.next = prev;
        groupStart.next = curr;
        prevGroupEnd = groupStart;
        count -= k;
    }

    return dummy.next;
}
// ```

// ---

// ## ✅ 処理の流れ（簡易図）

// 例: `head = [1, 2, 3, 4, 5], k = 2`

// ```
// 1 → 2 → 3 → 4 → 5
// ↓反転
// 2 → 1 → 4 → 3 → 5
// ```

// ---

// ## ✅ 時間・空間計算量（計算量と実行性能）

// | 評価指標           | 内容                  |
// | -------------- | ------------------- |
// | 時間計算量          | O(n)                |
// | 空間計算量          | O(1)（定数メモリ、配列や再帰なし） |
// | LeetCode実行時間目安 | 80〜120ms（環境依存）      |
// | メモリ使用目安        | 約50〜60MB（入力に依存）     |

// ---

// ## ✅ 特徴・注意点

// * `ListNode` クラスの定義は LeetCode 側が提供。
// * ノードの**値は変更せず**、**リンク構造だけ操作**しています。
// * `dummy` ノードで先頭の接続も自然に処理できます。

// ---

// さらに、**単体テスト例やステップ図示**も必要であればお知らせください。
