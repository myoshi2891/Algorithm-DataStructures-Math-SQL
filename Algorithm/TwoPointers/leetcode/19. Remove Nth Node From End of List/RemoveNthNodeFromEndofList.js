// 以下は、**JavaScript(Node.js 18.16.1)** を使った LeetCode形式の「**Remove Nth Node From End of List**」問題の解法です。

// ### アプローチ：

// * **二重ポインター法（fast & slow）**
//   1回のリスト走査で削除可能
//   **時間計算量:** O(sz)
//   **空間計算量:** O(1)

// ---

// ## 実装

// ```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * 指定されたリンクリストの末尾から n 番目のノードを削除し、リストの先頭を返す
 *
 * @param {ListNode} head - リンクリストの先頭ノード
 * @param {number} n - 末尾から数えた削除対象ノードの位置
 * @returns {ListNode} - 削除後のリンクリストの先頭
 *
 * 時間計算量: O(sz)
 * メモリ消費量: O(1)（追加のメモリは定数）
 */
function removeNthFromEndJs(head, n) {
    // ダミーノードを作成（head削除時も対応可能にする）
    const dummy = new ListNode(0, head);

    let fast = dummy;
    let slow = dummy;

    // fastポインターをn+1個先に進める
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // fastとslowを同時に進める
    while (fast !== null) {
        fast = fast.next;
        slow = slow.next;
    }

    // slow.nextが削除対象
    slow.next = slow.next.next;

    return dummy.next;
}

// ## 解説

// ### 具体例（図解）

// 例： `head = [1,2,3,4,5], n = 2`

// ```
// ダミーノード: 0 -> 1 -> 2 -> 3 -> 4 -> 5

// 1. fastをn+1=3回進める（fastは「3」を指す）
// 2. fastとslowを同時に進める

//     fast: 4   slow: 1
//     fast: 5   slow: 2
//     fast: null slow: 3

// 3. slow.next (4) を削除：
//    3 -> 5 にする

// 最終結果: 1 -> 2 -> 3 -> 5
// ```

// ---

// ## **時間・メモリの評価**

// * **時間計算量：** O(sz)（リンクリスト1回走査）
// * **空間計算量：** O(1)（ポインターのみ使用）

// ---

// ## **備考**

// * `ListNode` クラスは LeetCode 環境で自動的に定義されています。
// * この実装は、`head` が削除対象の場合も安全に動作します（ダミーノード利用）。
