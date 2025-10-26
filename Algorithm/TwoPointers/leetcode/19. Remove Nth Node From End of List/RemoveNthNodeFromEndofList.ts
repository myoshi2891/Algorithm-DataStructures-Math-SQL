// 以下は、**TypeScript 5.1（Node.js 18.16.1）** での LeetCode形式の「**Remove Nth Node From End of List**」解法です。

// ## アプローチ

// * **二重ポインター法（fast & slow）**
// * **ダミーノード**を使い、削除対象が`head`の場合にも対応

// ---

// ## 実装（TypeScript）

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

class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}
/**
 * 指定されたリンクリストの末尾から n 番目のノードを削除し、リストの先頭を返す
 *
 * @param head - リンクリストの先頭ノード
 * @param n - 末尾から数えて削除するノードの位置（1-based index）
 * @returns リンクリストの先頭ノード（n番目を削除後）
 *
 * 時間計算量: O(sz)
 * メモリ消費量: O(1)（追加のメモリは定数）
 */
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    /**
     * 指定されたリンクリストの末尾から n 番目のノードを削除し、リストの先頭を返します。
     *
     * @param head - リンクリストの先頭ノード。null の場合、何もしないで null を返します。
     * @param n - 末尾から数えて削除するノードの位置（1-based index）。
     * @returns リンクリストの先頭ノード（n番目を削除後）。
     *
     * 時間計算量: O(sz)
     * メモリ消費量: O(1)（追加のメモリは定数）
     */
    function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
        // ダミーノードの作成（head削除にも対応）
        const dummy: ListNode = new ListNode(0, head);

        let fast: ListNode | null = dummy;
        let slow: ListNode | null = dummy;

        // fastをn+1個先に進める
        for (let i = 0; i <= n; i++) {
            if (fast) fast = fast.next;
        }

        // fastとslowを同時に進める
        while (fast !== null) {
            fast = fast.next;
            if (slow) slow = slow.next;
        }

        // slow.nextが削除対象
        if (slow && slow.next) {
            slow.next = slow.next.next;
        }

        return dummy.next;
    }
    // ダミーノードの作成（head削除にも対応）
    const dummy: ListNode = new ListNode(0, head);

    let fast: ListNode | null = dummy;
    let slow: ListNode | null = dummy;

    // fastをn+1個先に進める
    for (let i = 0; i <= n; i++) {
        if (fast) fast = fast.next;
    }

    // fastとslowを同時に進める
    while (fast !== null) {
        fast = fast.next;
        if (slow) slow = slow.next;
    }

    // slow.nextが削除対象
    if (slow && slow.next) {
        slow.next = slow.next.next;
    }

    return dummy.next;
}
// ```

// ---

// ## 解説

// ### 例：`head = [1,2,3,4,5], n = 2`

// ```
// dummy: 0 -> 1 -> 2 -> 3 -> 4 -> 5

// 1. fastをn+1=3回進める -> fastは「3」を指す
// 2. fastとslowを同時に進める

//     fast: 4   slow: 1
//     fast: 5   slow: 2
//     fast: null slow: 3

// 3. slow.next (4) を削除して 3 -> 5 にする

// 結果: 1 -> 2 -> 3 -> 5
// ```

// ---

// ## **計算量**

// * **時間計算量:** O(sz)（リンクリスト1回走査）
// * **空間計算量:** O(1)（定数メモリ）

// ---

// ## **備考**

// * `ListNode` クラスは LeetCode環境で自動定義されます。
// * **クラス実装は使わず、関数型で記述しています。**
// * ダミーノードを使っているので `head` 削除にも安全に対応。

// ---

// **必要であれば、テストコードや図解も提供できますのでお知らせください！**
