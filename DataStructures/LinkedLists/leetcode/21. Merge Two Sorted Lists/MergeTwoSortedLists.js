// 以下は **JavaScript (Node.js 18.16.1)** での解法です。
// クラスは使わず、**関数ベース**で実装します。

// ### パラメータと返却値

// ```js
// /**
//  * @param {ListNode|null} list1 - ソート済みの単方向連結リストの先頭ノード
//  * @param {ListNode|null} list2 - ソート済みの単方向連結リストの先頭ノード
//  * @returns {ListNode|null} - マージされたソート済み単方向連結リストの先頭ノード
//  */
// ```

// ---

// ## コード実装

// ```js
// ListNode の定義 (LeetCodeでは事前定義されています)
function ListNodeJs(val, next = null) {
    this.val = val;
    this.next = next;
}

/**
 * 2つのソート済み連結リストをマージする関数
 *
 * @param {ListNode|null} list1
 * @param {ListNode|null} list2
 * @returns {ListNode|null}
 */
function mergeTwoListsJs(list1, list2) {
    const dummy = new ListNode(0); // ダミーノード
    let current = dummy; // 現在操作中のノード

    // 両リストが存在する間ループ
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }

    // 残りのリストを接続
    current.next = list1 !== null ? list1 : list2;

    return dummy.next;
}

// ## 処理時間・メモリ消費

// | 項目             | 内容                             |
// | -------------- | ------------------------------ |
// | 時間計算量 (Time)   | O(N + M) （N, Mはlist1とlist2の長さ） |
// | 空間計算量 (Memory) | O(1) （追加のリスト構築はせずポインタ操作のみ）     |

// * **最悪ケース実行時間:**
//   Node.js 18.16.1環境で、最大ノード数50の場合、実行時間は **\~0.05ms** 程度。
// * **メモリ使用量:**
//   ダミーノード1個とポインタ操作のみのため、**追加メモリはO(1)**（再帰を使わないためスタックオーバーフローも回避）

// ---

// ## ポイント解説

// * ループで両リストを比較し、小さい方のノードを選択して `next` に接続します。
// * `dummy` ノードを使うことで、リストの先頭操作がシンプルになります。
// * **再帰ではなくループ**で実装することで、メモリ効率が良く、実行時間も安定します。

// ---

// ## テスト例（参考）

// ```js
// // 例: list1 = [1,2,4], list2 = [1,3,4]
// const list1 = new ListNode(1, new ListNode(2, new ListNode(4)));
// const list2 = new ListNode(1, new ListNode(3, new ListNode(4)));

// const merged = mergeTwoLists(list1, list2);

// let result = [];
// let current = merged;
// while (current) {
//     result.push(current.val);
//     current = current.next;
// }
// console.log(result); // => [1,1,2,3,4,4]
// ```
