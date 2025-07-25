// 以下に、**LeetCode環境（Node.js 18.16.1）向け**に「k個ずつノードを反転する」問題の解法を、**関数形式で記述したJavaScriptコード**を提示します。
// **ノードの値は変更せず、ノード自体を操作する必要があります。**

// ---

// ## ✅ 実装の概要

// * `reverseKGroup` 関数を定義。
// * ノードをk個ずつ確認して反転。
// * 反転できない残りのノードはそのまま保持。
// * O(1) 空間（再帰なし・配列使用なし）で対応。

// ---

// ### ✅ JavaScript 実装（関数形式）

// ```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val);
 *     this.next = (next===undefined ? null : next);
 * }
 */

/**
 * @param {ListNode} head - 単方向連結リストの先頭ノード
 * @param {number} k - グループ単位の反転サイズ（1 <= k <= n）
 * @return {ListNode} - k個ごとに反転された新しいリストの先頭ノード
 */
function reverseKGroupJs(head, k) {
    if (k === 1 || head === null) return head;

    // 長さを測定
    let count = 0;
    let node = head;
    while (node !== null) {
        count++;
        node = node.next;
    }

    // ダミーヘッド（操作の単純化）
    let dummy = new ListNode(0);
    dummy.next = head;

    let prevGroupEnd = dummy;

    while (count >= k) {
        let prev = null;
        let curr = prevGroupEnd.next;
        let next = null;
        let groupStart = curr;

        // k個反転
        for (let i = 0; i < k; i++) {
            next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        // 接続処理
        prevGroupEnd.next = prev;
        groupStart.next = curr;
        prevGroupEnd = groupStart;
        count -= k;
    }

    return dummy.next;
}

// ## ✅ 処理の流れ（図解付き）

// ### 例: `head = [1, 2, 3, 4, 5], k = 3`

// 1. `1 → 2 → 3 → 4 → 5`
// 2. `3 → 2 → 1 → 4 → 5`（最初の3つを反転）
// 3. 残り（4,5）は反転されずそのまま

// ---

// ## ✅ 時間・空間計算量

// | 項目     | 値                    |
// | ------ | -------------------- |
// | 時間計算量  | O(n)                 |
// | 空間計算量  | O(1)（再帰なし、定数領域）      |
// | メモリ消費  | ノード再配置のみ             |
// | 実行速度目安 | 約100ms前後（LeetCode基準） |

// ---

// ## ✅ 補足

// * `ListNode` は LeetCode が自動的に用意するので、自分で定義しなくてOK。
// * クラスベースでなく、関数形式にしたため他コードとの結合も簡単です。

// ---

// 必要であれば、テスト用コードや図でのステップ解説も追記可能です。
